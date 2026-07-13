# Yureka One — API Response Structure

Every endpoint returns the same `YurekaResponse<T>` envelope.
This document is the single source of truth for how the frontend should parse, type, and handle all API responses.

---

## Envelope Fields

| Field | Type | Always present | Description |
|---|---|---|---|
| `data` | `T \| null` | On success | The response payload |
| `count` | `number \| null` | On list success | Total item count (for pagination / empty states) |
| `status` | `number` | ✅ Always | HTTP status code echoed in body |
| `timestamp` | `string` | ✅ Always | ISO-8601 server time |
| `error` | `string \| null` | On error | Human-readable error message |
| `path` | `string \| null` | On error | Request path that caused the error |
| `details` | `Record<string, string[]> \| null` | On 400 validation | Field-level error messages |

> `data` is `null` on errors. `error` is `null` on success. `@JsonInclude(NON_NULL)` means absent fields are never serialised — treat missing as `null`.

---

## Response Shapes

### 1. Single item — 200

```json
{
  "data": { "id": "uuid", "name": "HDFC Regalia", ... },
  "status": 200,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. List — 200

```json
{
  "data": [ { ... }, { ... } ],
  "count": 38,
  "status": 200,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

`count` is always the total length of `data`. Use it for empty-state checks instead of `data.length`.

### 3. Created — 201

```json
{
  "data": { "id": "new-uuid", ... },
  "status": 201,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 4. No payload — 200

Returned by delete and side-effect-only endpoints.

```json
{
  "data": null,
  "status": 200,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 5. Client error — 4xx

```json
{
  "error": "Card not found: hdfc-regalia",
  "status": 404,
  "path": "/api/v1/cms/cards/hdfc-regalia",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 6. Validation error — 400

```json
{
  "error": "Validation failed",
  "status": 400,
  "path": "/api/v1/waitlist/join",
  "details": {
    "email": ["must not be blank"],
    "credit_cards_count": ["must be a positive number"]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

`details` is a `Record<fieldName, string[]>`. A single field can have multiple messages.

### 7. Server error — 500

```json
{
  "error": "An unexpected error occurred",
  "status": 500,
  "path": "/api/v1/ledger/scan",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

The real error is logged server-side. The client always receives a generic message.

---

## TypeScript Types

Copy these into your FE project (e.g. `lib/api/types.ts`):

```typescript
export interface YurekaResponse<T> {
  data: T | null
  count?: number
  status: number
  timestamp: string
  error?: string
  path?: string
  details?: Record<string, string[]>
}

// Helpers
export type ApiSuccess<T>    = YurekaResponse<T> & { data: T }
export type ApiListSuccess<T> = YurekaResponse<T[]> & { data: T[]; count: number }
export type ApiError          = YurekaResponse<null> & { error: string }

// Type guards
export const isApiError = (res: YurekaResponse<unknown>): res is ApiError =>
  res.status >= 400

export const isValidationError = (res: YurekaResponse<unknown>): res is ApiError & { details: Record<string, string[]> } =>
  res.status === 400 && !!res.details
```

---

## Standard Fetch Wrapper

```typescript
// lib/api/client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<YurekaResponse<T>> {
  const { token, ...init } = options ?? {}

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  // Response envelope is always JSON regardless of status code
  return res.json() as Promise<YurekaResponse<T>>
}

export const api = {
  get:    <T>(path: string, token?: string) =>
    apiFetch<T>(path, { method: 'GET', token }),

  post:   <T>(path: string, body: unknown, token?: string) =>
    apiFetch<T>(path, { method: 'POST',   body: JSON.stringify(body), token }),

  put:    <T>(path: string, body: unknown, token?: string) =>
    apiFetch<T>(path, { method: 'PUT',    body: JSON.stringify(body), token }),

  patch:  <T>(path: string, body: unknown, token?: string) =>
    apiFetch<T>(path, { method: 'PATCH',  body: JSON.stringify(body), token }),

  delete: <T>(path: string, token?: string) =>
    apiFetch<T>(path, { method: 'DELETE', token }),
}
```

---

## Handling Responses — Patterns

### Check success vs error

```typescript
const res = await api.get<Card[]>('/api/v1/cms/cards')

if (isApiError(res)) {
  console.error(res.error)         // "An unexpected error occurred"
  toast.error(res.error)
  return
}

const cards = res.data             // Card[] — TypeScript knows data is non-null here
const total = res.count ?? 0       // use for empty-state copy
```

### Handle validation errors

```typescript
const res = await api.post<Waitlist>('/api/v1/waitlist/join', formData)

if (isValidationError(res)) {
  // Map field errors to form
  Object.entries(res.details).forEach(([field, messages]) => {
    form.setError(field, { message: messages[0] })
  })
  return
}

if (isApiError(res)) {
  toast.error(res.error)
  return
}

// Success
toast.success('You\'re on the list!')
router.push(`/dashboard?rank=${res.data.rank}`)
```

### Empty list vs error

```typescript
const res = await api.get<Notification[]>('/api/v1/notifications')

if (isApiError(res)) return null

// count: 0 is valid (no active notifications) — don't treat as error
if (res.count === 0) return []

return res.data
```

### Status-specific handling

```typescript
if (res.status === 401) {
  // Token expired — force re-login
  await supabase.auth.signOut()
  router.push('/login')
}

if (res.status === 403) {
  // Insufficient role — redirect away from admin
  router.push('/dashboard')
}

if (res.status === 409) {
  // Duplicate — e.g. email already on waitlist
  toast.info('You\'re already on the list!')
}
```

---

## Special Cases

### Waitlist join — `alreadyExists` flag

The join endpoint wraps `data` one level deeper:

```typescript
const res = await api.post<{ data: Waitlist; alreadyExists: boolean }>(
  '/api/v1/waitlist/join', payload
)

if (!isApiError(res) && res.data) {
  const { data: entry, alreadyExists } = res.data
  alreadyExists
    ? toast.info(`Welcome back! Your rank is #${entry.rank}`)
    : toast.success(`You're #${entry.rank} on the list! Your code: ${entry.personalReferralCode}`)
}
```

### Auth check — immediately after login

```typescript
// Call both in parallel after supabase.auth.signInWithPassword()
const [roleRes, adminRes] = await Promise.all([
  api.get<{ role: string }>(`/api/v1/auth/role?email=${email}`),
  api.get<{ isAdmin: boolean }>(`/api/v1/auth/admin-check?email=${email}`),
])

const role    = roleRes.data?.role ?? 'user'
const isAdmin = adminRes.data?.isAdmin ?? false

router.push(isAdmin ? '/admin' : '/dashboard')
```

### Ledger scan — long request

```typescript
// Set a long timeout — this can take 10–30 seconds
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 60_000)

try {
  const res = await api.post<LedgerResponse>(
    '/api/v1/ledger/scan',
    { accessToken, email, fallbackData },
    token
  )
  clearTimeout(timeout)

  if (isApiError(res)) {
    toast.error('Scan failed. Try again.')
    return
  }

  setTransactions(res.data.transactions)
  setProfile(res.data.profile)
} catch (e) {
  if ((e as Error).name === 'AbortError') {
    toast.error('Scan timed out. Your Gmail may have too many emails.')
  }
}
```

---

## Status Code Quick Reference

| Status | Meaning | FE action |
|---|---|---|
| `200` | OK | Render data |
| `201` | Created | Show success, navigate or update local state |
| `400` | Bad request / validation | Show `details` on form fields or generic `error` in toast |
| `401` | Unauthenticated | Sign out, redirect to `/login` |
| `403` | Forbidden (wrong role) | Redirect away, show "Access denied" |
| `404` | Not found | Show 404 page or fallback UI |
| `405` | Wrong HTTP method | Bug in FE — check the API doc |
| `409` | Conflict (duplicate) | Show "already exists" message |
| `500` | Server error | Show generic error toast, do not expose `path` to end users |
