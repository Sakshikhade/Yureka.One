import { createClient, type SupabaseClient, type Session, type User } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

export const supabaseConfigured = Boolean(url && anon)

let client: SupabaseClient | null = null

export function getSupabaseBrowser(): SupabaseClient | null {
  if (!supabaseConfigured) return null
  if (!client) {
    client = createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}

let tokenGetter: (() => string | null | undefined) | null = null

export function setAuthTokenGetter(fn: (() => string | null | undefined) | null) {
  tokenGetter = fn
}

export function getAuthAccessToken(): string | null {
  const t = tokenGetter?.()
  return t ? String(t) : null
}

export type AppUserStatus = 'none' | 'pending' | 'accepted' | 'admin' | 'loading' | 'rejected' | 'on-hold'

export function normalizeWaitlistStatus(
  status: string | undefined | null
): Exclude<AppUserStatus, 'loading' | 'none' | 'admin'> | null {
  if (!status) return null
  if (status === 'on_hold' || status === 'on-hold') return 'on-hold'
  if (status === 'pending' || status === 'accepted' || status === 'rejected') return status
  return null
}

export async function signInWithGmail(redirectTo?: string): Promise<{ error?: string }> {
  const sb = getSupabaseBrowser()
  if (!sb) return { error: 'Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).' }
  const redirect =
    redirectTo ||
    `${window.location.origin}/login`
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirect,
      queryParams: {
        prompt: 'select_account',
        access_type: 'online',
      },
      scopes: 'openid email profile',
    },
  })
  if (error) return { error: error.message }
  return {}
}

export async function signOutGmail(): Promise<void> {
  const sb = getSupabaseBrowser()
  await sb?.auth.signOut()
}

export type { Session, User }
