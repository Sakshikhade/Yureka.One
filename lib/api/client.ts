import { supabase } from '../../supabase'
import type { YurekaResponse } from './types'
export { isApiError, isValidationError } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

// Auto-fetch the active Supabase session token
async function getToken(): Promise<string | undefined> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? undefined
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string; skipAuth?: boolean }
): Promise<YurekaResponse<T>> {
  const { token: explicitToken, skipAuth, ...init } = options ?? {}

  const token = skipAuth ? undefined : (explicitToken ?? await getToken())

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers ?? {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  return res.json() as Promise<YurekaResponse<T>>
}

export const api = {
  get: <T>(path: string, options?: { token?: string; skipAuth?: boolean }) =>
    apiFetch<T>(path, { method: 'GET', ...options }),

  post: <T>(path: string, body: unknown, options?: { token?: string; skipAuth?: boolean }) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body), ...options }),

  put: <T>(path: string, body: unknown, options?: { token?: string; skipAuth?: boolean }) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body), ...options }),

  patch: <T>(path: string, body: unknown, options?: { token?: string; skipAuth?: boolean }) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...options }),

  delete: <T>(path: string, options?: { token?: string; skipAuth?: boolean }) =>
    apiFetch<T>(path, { method: 'DELETE', ...options }),
}
