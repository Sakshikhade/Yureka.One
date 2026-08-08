import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { HubbleOrderRaw, HubbleOrderStatus, StoredOrder, StoredVoucher } from './types.js'

type FileStore = {
  orders: Array<Omit<StoredOrder, 'vouchers'> & { vouchers: StoredVoucher[] }>
  webhookKeys: string[]
}

function filePath() {
  return path.join(process.cwd(), 'data', 'hubble_orders_store.json')
}

function emptyStore(): FileStore {
  return { orders: [], webhookKeys: [] }
}

function readFileStore(): FileStore {
  const p = filePath()
  try {
    if (!fs.existsSync(p)) {
      const snap = emptyStore()
      fs.mkdirSync(path.dirname(p), { recursive: true })
      fs.writeFileSync(p, JSON.stringify(snap, null, 2))
      return snap
    }
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as FileStore
  } catch {
    const snap = emptyStore()
    writeFileStore(snap)
    return snap
  }
}

function writeFileStore(snap: FileStore) {
  fs.mkdirSync(path.dirname(filePath()), { recursive: true })
  fs.writeFileSync(filePath(), JSON.stringify(snap, null, 2))
}

function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export function hubbleOrdersBackendMode(): 'supabase' | 'file' {
  return getSupabase() ? 'supabase' : 'file'
}

function mapVouchersFromRaw(orderId: string, raw: HubbleOrderRaw): StoredVoucher[] {
  return (raw.vouchers || []).map((v) => ({
    id: randomUUID(),
    hubbleVoucherId: v.id || null,
    cardType: v.cardType || null,
    cardNumber: v.cardNumber || null,
    cardPin: v.cardPin || null,
    amount: v.amount != null ? Number(v.amount) : null,
    validTill: v.validTill || null,
  }))
}

export type CreateLocalOrderInput = {
  userId: string
  referenceId: string
  productId: string
  productTitle: string
  amountInr: number
  denomination: number
  quantity: number
  customerName?: string | null
  customerEmail?: string | null
  customerPhone?: string | null
}

export async function createLocalOrder(input: CreateLocalOrderInput): Promise<StoredOrder> {
  const now = new Date().toISOString()
  const order: StoredOrder = {
    id: randomUUID(),
    userId: input.userId,
    referenceId: input.referenceId,
    hubbleOrderId: null,
    productId: input.productId,
    productTitle: input.productTitle,
    amountInr: input.amountInr,
    denomination: input.denomination,
    quantity: input.quantity,
    status: 'PENDING',
    failureReason: null,
    customerName: input.customerName || null,
    customerEmail: input.customerEmail || null,
    customerPhone: input.customerPhone || null,
    vouchers: [],
    createdAt: now,
    updatedAt: now,
  }

  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('hubble_orders')
      .insert({
        id: order.id,
        user_id: order.userId,
        reference_id: order.referenceId,
        product_id: order.productId,
        product_title: order.productTitle,
        amount_inr: order.amountInr,
        denomination: order.denomination,
        quantity: order.quantity,
        status: order.status,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
      })
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return {
      ...order,
      id: data.id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  const snap = readFileStore()
  snap.orders.unshift(order)
  writeFileStore(snap)
  return order
}

export async function applyHubbleOrderResult(
  localId: string,
  raw: HubbleOrderRaw,
): Promise<StoredOrder | null> {
  const status = String(raw.status || 'FAILED').toUpperCase() as HubbleOrderStatus
  const vouchers = status === 'SUCCESS' ? mapVouchersFromRaw(localId, raw) : []
  const now = new Date().toISOString()

  const sb = getSupabase()
  if (sb) {
    const { data: existing, error: findErr } = await sb
      .from('hubble_orders')
      .select('*')
      .eq('id', localId)
      .maybeSingle()
    if (findErr) throw new Error(findErr.message)
    if (!existing) return null

    const { error: updErr } = await sb
      .from('hubble_orders')
      .update({
        hubble_order_id: raw.id,
        status,
        failure_reason: raw.failureReason || null,
        raw_response: raw,
        updated_at: now,
      })
      .eq('id', localId)
    if (updErr) throw new Error(updErr.message)

    if (vouchers.length) {
      await sb.from('hubble_vouchers').delete().eq('order_id', localId)
      const { error: vErr } = await sb.from('hubble_vouchers').insert(
        vouchers.map((v) => ({
          id: v.id,
          order_id: localId,
          hubble_voucher_id: v.hubbleVoucherId,
          card_type: v.cardType,
          card_number: v.cardNumber,
          card_pin: v.cardPin,
          amount: v.amount,
          valid_till: v.validTill,
        })),
      )
      if (vErr) throw new Error(vErr.message)
    }

    return getOrderById(localId, existing.user_id)
  }

  const snap = readFileStore()
  const idx = snap.orders.findIndex((o) => o.id === localId)
  if (idx < 0) return null
  const prev = snap.orders[idx]
  snap.orders[idx] = {
    ...prev,
    hubbleOrderId: raw.id,
    status,
    failureReason: raw.failureReason || null,
    vouchers: vouchers.length ? vouchers : status === 'SUCCESS' ? prev.vouchers : [],
    updatedAt: now,
  }
  writeFileStore(snap)
  return snap.orders[idx]
}

export async function applyHubbleOrderByHubbleId(
  hubbleOrderId: string,
  raw: HubbleOrderRaw,
): Promise<StoredOrder | null> {
  const local = await getOrderByHubbleId(hubbleOrderId)
  if (!local) return null
  return applyHubbleOrderResult(local.id, raw)
}

function rowToOrder(row: any, vouchers: StoredVoucher[]): StoredOrder {
  return {
    id: row.id,
    userId: row.user_id,
    referenceId: row.reference_id,
    hubbleOrderId: row.hubble_order_id,
    productId: row.product_id,
    productTitle: row.product_title || '',
    amountInr: Number(row.amount_inr),
    denomination: Number(row.denomination),
    quantity: Number(row.quantity),
    status: row.status,
    failureReason: row.failure_reason,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    vouchers,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getOrderById(id: string, userId?: string): Promise<StoredOrder | null> {
  const sb = getSupabase()
  if (sb) {
    let q = sb.from('hubble_orders').select('*').eq('id', id)
    if (userId) q = q.eq('user_id', userId)
    const { data, error } = await q.maybeSingle()
    if (error) throw new Error(error.message)
    if (!data) return null
    const { data: vouchers } = await sb.from('hubble_vouchers').select('*').eq('order_id', id)
    return rowToOrder(
      data,
      (vouchers || []).map((v: any) => ({
        id: v.id,
        hubbleVoucherId: v.hubble_voucher_id,
        cardType: v.card_type,
        cardNumber: v.card_number,
        cardPin: v.card_pin,
        amount: v.amount != null ? Number(v.amount) : null,
        validTill: v.valid_till,
      })),
    )
  }

  const snap = readFileStore()
  const order = snap.orders.find((o) => o.id === id && (!userId || o.userId === userId))
  return order || null
}

export async function getOrderByHubbleId(hubbleOrderId: string): Promise<StoredOrder | null> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('hubble_orders')
      .select('*')
      .eq('hubble_order_id', hubbleOrderId)
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (!data) return null
    return getOrderById(data.id)
  }
  const snap = readFileStore()
  return snap.orders.find((o) => o.hubbleOrderId === hubbleOrderId) || null
}

export async function listOrdersForUser(userId: string, limit = 50): Promise<StoredOrder[]> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('hubble_orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw new Error(error.message)
    const out: StoredOrder[] = []
    for (const row of data || []) {
      const order = await getOrderById(row.id)
      if (order) out.push(order)
    }
    return out
  }
  return readFileStore()
    .orders.filter((o) => o.userId === userId)
    .slice(0, limit)
}

/** Returns true if this event key is new (first time seen). */
export async function claimWebhookEvent(eventKey: string, kind: string, payload: unknown): Promise<boolean> {
  const sb = getSupabase()
  if (sb) {
    const { error } = await sb.from('hubble_webhook_events').insert({
      event_key: eventKey,
      kind,
      payload: payload as object,
    })
    if (error) {
      if (error.code === '23505') return false
      throw new Error(error.message)
    }
    return true
  }

  const snap = readFileStore()
  if (snap.webhookKeys.includes(eventKey)) return false
  snap.webhookKeys.push(eventKey)
  if (snap.webhookKeys.length > 5000) snap.webhookKeys = snap.webhookKeys.slice(-2500)
  writeFileStore(snap)
  return true
}
