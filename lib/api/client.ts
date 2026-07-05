import { supabase } from '../../supabase'
import type { YurekaResponse } from './types'
export { isApiError, isValidationError } from './types'

// Empty string → relative URLs, which Netlify/Express proxy to the backend.
// Set VITE_API_BASE_URL=http://localhost:8080 in .env for local Java dev.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// Auto-fetch the active Supabase session token
async function getToken(): Promise<string | undefined> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? undefined
}

function errorResponse<T>(status: number, error: string): YurekaResponse<T> {
  return { data: null, status, error, timestamp: new Date().toISOString() }
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

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...init, headers })
  } catch {
    return errorResponse<T>(0, 'Network error — backend unreachable')
  }

  const text = await res.text()
  try {
    return JSON.parse(text) as YurekaResponse<T>
  } catch {
    return errorResponse<T>(res.status || 502, 'Invalid response from server')
  }
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
