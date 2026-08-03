import fs from 'fs'
import path from 'path'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import type {
  GoldbackBalance,
  GoldbackLedgerEntry,
  GoldbackOffer,
  GoldbackStoreSnapshot,
} from './types.js'

const SEED_OFFERS: Omit<GoldbackOffer, 'id'>[] = [
  {
    title: 'Nykaa Beauty Haul',
    merchant: 'Nykaa',
    category: 'beauty',
    description: 'Shop beauty essentials via Yureka and earn Goldback on eligible orders.',
    url: 'https://www.nykaa.com',
    rewardPaise: 2500,
    rewardLabel: '₹25 Goldback',
    active: true,
  },
  {
    title: 'Amazon Fashion',
    merchant: 'Amazon',
    category: 'shopping',
    description: 'Track your Amazon fashion spend and earn face-value Goldback.',
    url: 'https://www.amazon.in',
    rewardPaise: 5000,
    rewardLabel: '₹50 Goldback',
    active: true,
  },
  {
    title: 'Swiggy Weekend',
    merchant: 'Swiggy',
    category: 'food',
    description: 'Order food this weekend through the tracked link to earn Goldback.',
    url: 'https://www.swiggy.com',
    rewardPaise: 1500,
    rewardLabel: '₹15 Goldback',
    active: true,
  },
  {
    title: 'Myntra Style Drop',
    merchant: 'Myntra',
    category: 'fashion',
    description: 'Fashion drops with Goldback credited after confirmed conversion.',
    url: 'https://www.myntra.com',
    rewardPaise: 4000,
    rewardLabel: '₹40 Goldback',
    active: true,
  },
  {
    title: 'Flipkart Electronics',
    merchant: 'Flipkart',
    category: 'electronics',
    description: 'Electronics deals that pay Goldback you can redeem at face value later.',
    url: 'https://www.flipkart.com',
    rewardPaise: 7500,
    rewardLabel: '₹75 Goldback',
    active: true,
  },
]

function filePath() {
  return path.join(process.cwd(), 'data', 'goldback_store.json')
}

function emptySnapshot(): GoldbackStoreSnapshot {
  return {
    accounts: {},
    offers: SEED_OFFERS.map((o) => ({ ...o, id: randomUUID() })),
    ledger: [],
    clicks: [],
  }
}

function readFileStore(): GoldbackStoreSnapshot {
  const p = filePath()
  try {
    if (!fs.existsSync(p)) {
      const snap = emptySnapshot()
      fs.mkdirSync(path.dirname(p), { recursive: true })
      fs.writeFileSync(p, JSON.stringify(snap, null, 2))
      return snap
    }
    const raw = JSON.parse(fs.readFileSync(p, 'utf-8')) as GoldbackStoreSnapshot
    if (!raw.offers?.length) {
      raw.offers = emptySnapshot().offers
      writeFileStore(raw)
    }
    return raw
  } catch {
    const snap = emptySnapshot()
    writeFileStore(snap)
    return snap
  }
}

function writeFileStore(snap: GoldbackStoreSnapshot) {
  fs.mkdirSync(path.dirname(filePath()), { recursive: true })
  fs.writeFileSync(filePath(), JSON.stringify(snap, null, 2))
}

function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

function mapOffer(row: any): GoldbackOffer {
  return {
    id: row.id,
    title: row.title,
    merchant: row.merchant,
    category: row.category,
    description: row.description ?? '',
    url: row.url,
    rewardPaise: row.reward_paise ?? row.rewardPaise ?? 0,
    rewardLabel: row.reward_label ?? row.rewardLabel ?? '',
    active: row.active !== false,
  }
}

function mapLedger(row: any): GoldbackLedgerEntry {
  return {
    id: row.id,
    userId: row.user_id ?? row.userId,
    type: row.type,
    amountPaise: row.amount_paise ?? row.amountPaise,
    offerId: row.offer_id ?? row.offerId ?? null,
    status: row.status,
    idempotencyKey: row.idempotency_key ?? row.idempotencyKey,
    meta: row.meta ?? {},
    createdAt: row.created_at ?? row.createdAt,
  }
}

export async function listOffers(): Promise<GoldbackOffer[]> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('offers').select('*').eq('active', true).order('created_at', { ascending: false })
    if (!error && data) {
      if (data.length === 0) {
        // Tables exist but empty — fall back to file seed for UX
        return readFileStore().offers.filter((o) => o.active)
      }
      return data.map(mapOffer)
    }
    console.warn('[goldback] offers query failed, using file store:', error?.message)
  }
  return readFileStore().offers.filter((o) => o.active)
}

export async function getBalance(userId: string): Promise<GoldbackBalance> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('goldback_accounts').select('*').eq('user_id', userId).maybeSingle()
    if (!error) {
      if (data) {
        return {
          userId: data.user_id,
          balancePaise: data.balance_paise,
          updatedAt: data.updated_at,
        }
      }
      return { userId, balancePaise: 0, updatedAt: new Date().toISOString() }
    }
    console.warn('[goldback] balance query failed, using file store:', error.message)
  }
  const snap = readFileStore()
  return snap.accounts[userId] ?? { userId, balancePaise: 0, updatedAt: new Date().toISOString() }
}

export async function listLedger(userId: string, limit = 50): Promise<GoldbackLedgerEntry[]> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('goldback_ledger')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (!error && data) return data.map(mapLedger)
    console.warn('[goldback] ledger query failed, using file store:', error?.message)
  }
  return readFileStore()
    .ledger.filter((e) => e.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
}

export async function recordClick(userId: string, offerId: string) {
  const sb = getSupabase()
  if (sb) {
    const { error } = await sb.from('offer_clicks').insert({ user_id: userId, offer_id: offerId })
    if (!error) return { ok: true as const }
    console.warn('[goldback] click insert failed, using file store:', error.message)
  }
  const snap = readFileStore()
  snap.clicks.push({ id: randomUUID(), userId, offerId, createdAt: new Date().toISOString() })
  writeFileStore(snap)
  return { ok: true as const }
}

export async function creditEarn(
  userId: string,
  offerId: string,
  idempotencyKey: string
): Promise<{ entry: GoldbackLedgerEntry; balance: GoldbackBalance; created: boolean }> {
  const offers = await listOffers()
  const offer = offers.find((o) => o.id === offerId)
  if (!offer) throw new Error('Offer not found')

  const sb = getSupabase()
  if (sb) {
    const { data: existing } = await sb
      .from('goldback_ledger')
      .select('*')
      .eq('user_id', userId)
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle()

    if (existing) {
      const balance = await getBalance(userId)
      return { entry: mapLedger(existing), balance, created: false }
    }

    const entryRow = {
      user_id: userId,
      type: 'earn',
      amount_paise: offer.rewardPaise,
      offer_id: offerId,
      status: 'earned',
      idempotency_key: idempotencyKey,
      meta: { merchant: offer.merchant, title: offer.title },
    }

    const { data: inserted, error: insertErr } = await sb.from('goldback_ledger').insert(entryRow).select('*').single()
    if (!insertErr && inserted) {
      const current = await getBalance(userId)
      const nextBalance = current.balancePaise + offer.rewardPaise
      const { error: upsertErr } = await sb.from('goldback_accounts').upsert({
        user_id: userId,
        balance_paise: nextBalance,
        updated_at: new Date().toISOString(),
      })
      if (upsertErr) console.warn('[goldback] account upsert failed:', upsertErr.message)
      return {
        entry: mapLedger(inserted),
        balance: { userId, balancePaise: nextBalance, updatedAt: new Date().toISOString() },
        created: true,
      }
    }
    console.warn('[goldback] earn insert failed, using file store:', insertErr?.message)
  }

  const snap = readFileStore()
  const existing = snap.ledger.find((e) => e.userId === userId && e.idempotencyKey === idempotencyKey)
  if (existing) {
    const balance = snap.accounts[userId] ?? { userId, balancePaise: 0, updatedAt: new Date().toISOString() }
    return { entry: existing, balance, created: false }
  }

  const entry: GoldbackLedgerEntry = {
    id: randomUUID(),
    userId,
    type: 'earn',
    amountPaise: offer.rewardPaise,
    offerId,
    status: 'earned',
    idempotencyKey,
    meta: { merchant: offer.merchant, title: offer.title },
    createdAt: new Date().toISOString(),
  }
  const prev = snap.accounts[userId]?.balancePaise ?? 0
  const balance: GoldbackBalance = {
    userId,
    balancePaise: prev + offer.rewardPaise,
    updatedAt: new Date().toISOString(),
  }
  snap.ledger.unshift(entry)
  snap.accounts[userId] = balance
  writeFileStore(snap)
  return { entry, balance, created: true }
}

export function goldbackBackendMode(): 'supabase' | 'file' {
  return getSupabase() ? 'supabase' : 'file'
}

/** Admin: list all offers including inactive */
export async function listAllOffers(): Promise<GoldbackOffer[]> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('offers').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      if (data.length === 0) return readFileStore().offers
      return data.map(mapOffer)
    }
  }
  return readFileStore().offers
}

export async function upsertOffer(
  input: Partial<GoldbackOffer> & Pick<GoldbackOffer, 'title' | 'merchant' | 'url'>
): Promise<GoldbackOffer> {
  const sb = getSupabase()
  const row = {
    title: input.title,
    merchant: input.merchant,
    category: input.category || 'general',
    description: input.description || '',
    url: input.url,
    reward_paise: input.rewardPaise ?? 0,
    reward_label: input.rewardLabel || '',
    active: input.active !== false,
  }

  if (sb) {
    if (input.id) {
      const { data, error } = await sb.from('offers').update(row).eq('id', input.id).select('*').single()
      if (!error && data) return mapOffer(data)
      console.warn('[goldback] offer update failed:', error?.message)
    } else {
      const { data, error } = await sb.from('offers').insert(row).select('*').single()
      if (!error && data) return mapOffer(data)
      console.warn('[goldback] offer insert failed:', error?.message)
    }
  }

  const snap = readFileStore()
  if (input.id) {
    const idx = snap.offers.findIndex((o) => o.id === input.id)
    if (idx >= 0) {
      snap.offers[idx] = { ...snap.offers[idx], ...input, id: input.id } as GoldbackOffer
      writeFileStore(snap)
      return snap.offers[idx]
    }
  }
  const created: GoldbackOffer = {
    id: randomUUID(),
    title: input.title,
    merchant: input.merchant,
    category: input.category || 'general',
    description: input.description || '',
    url: input.url,
    rewardPaise: input.rewardPaise ?? 0,
    rewardLabel: input.rewardLabel || '',
    active: input.active !== false,
  }
  snap.offers.unshift(created)
  writeFileStore(snap)
  return created
}

export async function deleteOffer(id: string): Promise<boolean> {
  const sb = getSupabase()
  if (sb) {
    const { error } = await sb.from('offers').delete().eq('id', id)
    if (!error) return true
    console.warn('[goldback] offer delete failed:', error.message)
  }
  const snap = readFileStore()
  const before = snap.offers.length
  snap.offers = snap.offers.filter((o) => o.id !== id)
  writeFileStore(snap)
  return snap.offers.length < before
}

export async function listAllLedger(limit = 200): Promise<GoldbackLedgerEntry[]> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('goldback_ledger')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (!error && data) return data.map(mapLedger)
  }
  return readFileStore()
    .ledger.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
}

export async function listAllAccounts(): Promise<GoldbackBalance[]> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('goldback_accounts').select('*').order('updated_at', { ascending: false })
    if (!error && data) {
      return data.map((d) => ({
        userId: d.user_id,
        balancePaise: d.balance_paise,
        updatedAt: d.updated_at,
      }))
    }
  }
  return Object.values(readFileStore().accounts)
}
