import type { YurekaResponse } from './types'
export { isApiError, isValidationError } from './types'

// Empty string → relative URLs, which Netlify/Express proxy to the backend.
// Set VITE_API_BASE_URL=http://localhost:8080 in .env for local Java dev.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function errorResponse<T>(status: number, error: string): YurekaResponse<T> {
  return { data: null, status, error, timestamp: new Date().toISOString() }
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string; skipAuth?: boolean; timeoutMs?: number }
): Promise<YurekaResponse<T>> {
  const { token: explicitToken, skipAuth, timeoutMs = 5000, ...init } = options ?? {}

  const token = skipAuth ? undefined : explicitToken

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers ?? {}),
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...init, headers, signal: controller.signal })
  } catch {
    // ECONNREFUSED / timeout / no network — must be >= 400 so isApiError() triggers fallback
    return errorResponse<T>(503, 'Network error — backend unreachable')
  } finally {
    clearTimeout(timer)
  }

  let text: string
  try {
    text = await res.text()
  } catch {
    return errorResponse<T>(502, 'Invalid response from server')
  }

  try {
    return JSON.parse(text) as YurekaResponse<T>
  } catch {
    // Backend returned non-JSON (e.g. HTML "Service Suspended").
    // Force 502 so isApiError() triggers fallback — never use res.status (could be 200).
    return errorResponse<T>(502, 'Invalid response from server')
  }
}

type ApiOptions = { token?: string; skipAuth?: boolean; timeoutMs?: number }

export const api = {
  get: <T>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { method: 'GET', ...options }),

  post: <T>(path: string, body: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body), ...options }),

  put: <T>(path: string, body: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body), ...options }),

  patch: <T>(path: string, body: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...options }),

  delete: <T>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { method: 'DELETE', ...options }),
}
