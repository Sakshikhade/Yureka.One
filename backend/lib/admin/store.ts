import fs from 'fs'
import path from 'path'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import type { AdminRole } from './auth.js'

export interface WaitlistRow {
  id: string
  email: string
  fullName: string | null
  mobileNumber: string | null
  status: 'pending' | 'accepted' | 'rejected' | 'on_hold'
  yurekaScore: number | null
  monthlySpend: string | null
  topCategory: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminUserRow {
  id: string
  email: string
  fullName: string | null
  role: AdminRole
  createdAt: string
}

interface AdminFileStore {
  waitlist: WaitlistRow[]
  admins: AdminUserRow[]
}

function filePath() {
  return path.join(process.cwd(), 'data', 'admin_store.json')
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

function seedStore(): AdminFileStore {
  const now = new Date().toISOString()
  const bootstrapEmail =
    (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .find(Boolean) || 'admin@localhost'
  return {
    admins: [
      {
        id: randomUUID(),
        email: bootstrapEmail,
        fullName: 'Yureka Admin',
        role: 'superadmin',
        createdAt: now,
      },
    ],
    waitlist: [
      {
        id: randomUUID(),
        email: 'priya.sharma@example.com',
        fullName: 'Priya Sharma',
        mobileNumber: '+91 98xxx',
        status: 'pending',
        yurekaScore: 72,
        monthlySpend: '₹40k–60k',
        topCategory: 'shopping',
        notes: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        email: 'arjun.mehta@example.com',
        fullName: 'Arjun Mehta',
        mobileNumber: null,
        status: 'accepted',
        yurekaScore: 88,
        monthlySpend: '₹80k+',
        topCategory: 'travel',
        notes: null,
        createdAt: now,
        updatedAt: now,
      },
    ],
  }
}

function readFile(): AdminFileStore {
  const p = filePath()
  try {
    if (!fs.existsSync(p)) {
      const s = seedStore()
      fs.mkdirSync(path.dirname(p), { recursive: true })
      fs.writeFileSync(p, JSON.stringify(s, null, 2))
      return s
    }
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as AdminFileStore
  } catch {
    const s = seedStore()
    fs.mkdirSync(path.dirname(p), { recursive: true })
    fs.writeFileSync(p, JSON.stringify(s, null, 2))
    return s
  }
}

function writeFile(s: AdminFileStore) {
  fs.mkdirSync(path.dirname(filePath()), { recursive: true })
  fs.writeFileSync(filePath(), JSON.stringify(s, null, 2))
}

function mapWaitlist(row: any): WaitlistRow {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name ?? row.fullName ?? null,
    mobileNumber: row.mobile_number ?? row.mobileNumber ?? null,
    status: row.status,
    yurekaScore: row.yureka_score ?? row.yurekaScore ?? null,
    monthlySpend: row.monthly_spend ?? row.monthlySpend ?? null,
    topCategory: row.top_category ?? row.topCategory ?? null,
    notes: row.notes ?? null,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  }
}

function mapAdmin(row: any): AdminUserRow {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name ?? row.fullName ?? null,
    role: row.role,
    createdAt: row.created_at ?? row.createdAt,
  }
}

export function adminBackendMode(): 'supabase' | 'file' {
  return getSupabase() ? 'supabase' : 'file'
}

export async function findAdminByEmail(email: string): Promise<AdminUserRow | null> {
  const normalized = email.toLowerCase().trim()
  const bootstrap = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('admin_users').select('*').eq('email', normalized).maybeSingle()
    if (!error && data) return mapAdmin(data)
    if (!error && !data && bootstrap.includes(normalized)) {
      return {
        id: 'bootstrap',
        email: normalized,
        fullName: 'Bootstrap Admin',
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      }
    }
  }

  const store = readFile()
  const found = store.admins.find((a) => a.email === normalized)
  if (found) return found
  if (bootstrap.includes(normalized)) {
    return {
      id: 'bootstrap',
      email: normalized,
      fullName: 'Bootstrap Admin',
      role: 'superadmin',
      createdAt: new Date().toISOString(),
    }
  }
  return null
}

export async function listWaitlist(filters: {
  status?: string
  search?: string
}): Promise<WaitlistRow[]> {
  const sb = getSupabase()
  if (sb) {
    let q = sb.from('waitlist').select('*').order('created_at', { ascending: false })
    if (filters.status && filters.status !== 'all') q = q.eq('status', filters.status)
    const { data, error } = await q
    if (!error && data) {
      let rows = data.map(mapWaitlist)
      if (filters.search) {
        const s = filters.search.toLowerCase()
        rows = rows.filter(
          (r) =>
            r.email.toLowerCase().includes(s) ||
            (r.fullName || '').toLowerCase().includes(s)
        )
      }
      if (rows.length || data.length) return rows
    }
  }

  let rows = readFile().waitlist
  if (filters.status && filters.status !== 'all') {
    rows = rows.filter((r) => r.status === filters.status)
  }
  if (filters.search) {
    const s = filters.search.toLowerCase()
    rows = rows.filter(
      (r) => r.email.toLowerCase().includes(s) || (r.fullName || '').toLowerCase().includes(s)
    )
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function updateWaitlistStatus(id: string, status: WaitlistRow['status']): Promise<WaitlistRow | null> {
  const sb = getSupabase()
  const now = new Date().toISOString()
  if (sb) {
    const { data, error } = await sb
      .from('waitlist')
      .update({ status, updated_at: now })
      .eq('id', id)
      .select('*')
      .single()
    if (!error && data) return mapWaitlist(data)
  }
  const store = readFile()
  const idx = store.waitlist.findIndex((w) => w.id === id)
  if (idx < 0) return null
  store.waitlist[idx] = { ...store.waitlist[idx], status, updatedAt: now }
  writeFile(store)
  return store.waitlist[idx]
}

export async function bulkUpdateWaitlistStatus(ids: string[], status: WaitlistRow['status']) {
  for (const id of ids) await updateWaitlistStatus(id, status)
}

export async function listAdmins(): Promise<AdminUserRow[]> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('admin_users').select('*').order('created_at', { ascending: false })
    if (!error && data?.length) return data.map(mapAdmin)
  }
  return readFile().admins
}

export async function upsertAdmin(input: {
  email: string
  role: AdminRole
  fullName?: string
}): Promise<AdminUserRow> {
  const email = input.email.toLowerCase().trim()
  const sb = getSupabase()
  if (sb) {
    const { data: existing } = await sb.from('admin_users').select('*').eq('email', email).maybeSingle()
    if (existing) {
      const { data, error } = await sb
        .from('admin_users')
        .update({ role: input.role, full_name: input.fullName ?? existing.full_name })
        .eq('id', existing.id)
        .select('*')
        .single()
      if (!error && data) return mapAdmin(data)
    } else {
      const { data, error } = await sb
        .from('admin_users')
        .insert({ email, role: input.role, full_name: input.fullName || null })
        .select('*')
        .single()
      if (!error && data) return mapAdmin(data)
    }
  }

  const store = readFile()
  const idx = store.admins.findIndex((a) => a.email === email)
  if (idx >= 0) {
    store.admins[idx] = {
      ...store.admins[idx],
      role: input.role,
      fullName: input.fullName ?? store.admins[idx].fullName,
    }
    writeFile(store)
    return store.admins[idx]
  }
  const created: AdminUserRow = {
    id: randomUUID(),
    email,
    fullName: input.fullName || null,
    role: input.role,
    createdAt: new Date().toISOString(),
  }
  store.admins.push(created)
  writeFile(store)
  return created
}

export async function deleteAdmin(id: string): Promise<boolean> {
  const sb = getSupabase()
  if (sb) {
    const { error } = await sb.from('admin_users').delete().eq('id', id)
    if (!error) return true
  }
  const store = readFile()
  const before = store.admins.length
  store.admins = store.admins.filter((a) => a.id !== id)
  writeFile(store)
  return store.admins.length < before
}

export async function createWaitlistEntry(input: {
  email: string
  fullName?: string
  status?: WaitlistRow['status']
}): Promise<WaitlistRow> {
  const now = new Date().toISOString()
  const row: WaitlistRow = {
    id: randomUUID(),
    email: input.email.toLowerCase().trim(),
    fullName: input.fullName || null,
    mobileNumber: null,
    status: input.status || 'pending',
    yurekaScore: null,
    monthlySpend: null,
    topCategory: null,
    notes: null,
    createdAt: now,
    updatedAt: now,
  }
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('waitlist')
      .insert({
        email: row.email,
        full_name: row.fullName,
        status: row.status,
      })
      .select('*')
      .single()
    if (!error && data) return mapWaitlist(data)
  }
  const store = readFile()
  store.waitlist.unshift(row)
  writeFile(store)
  return row
}
