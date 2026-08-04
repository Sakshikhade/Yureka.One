import { randomUUID } from 'crypto'
import type { GiftCard, HubbleProductRaw } from './types.js'

const CACHE_TTL_MS = 10 * 60 * 1000
const TOKEN_SKEW_MS = 60_000

type TokenCache = { token: string; expiresAt: number }
type ProductCache = { products: GiftCard[]; fetchedAt: number }

let tokenCache: TokenCache | null = null
let productCache: ProductCache | null = null

function config() {
  const baseUrl = (process.env.HUBBLE_API_BASE || '').replace(/\/$/, '')
  const clientId = process.env.HUBBLE_CLIENT_ID || ''
  const clientSecret = process.env.HUBBLE_CLIENT_SECRET || ''
  return { baseUrl, clientId, clientSecret }
}

export function hubbleConfigured(): boolean {
  const { baseUrl, clientId, clientSecret } = config()
  return Boolean(baseUrl && clientId && clientSecret)
}

function normalizeCategories(raw: HubbleProductRaw['category']): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.filter(Boolean).map(String)
  return [String(raw)]
}

export function mapProduct(raw: HubbleProductRaw): GiftCard {
  const categories = normalizeCategories(raw.category)
  const amounts = raw.amountRestrictions || {}
  const howTo =
    raw.howToUseInstructions?.flatMap((h) => h.instructions || []) ||
    Object.values(raw.usageInstructions || {}).flat() ||
    []

  return {
    id: raw.id,
    title: raw.title,
    brand: raw.parentBrand?.name || raw.title,
    description: raw.brandDescription || '',
    status: raw.status,
    categories,
    tags: raw.tags || [],
    redemptionType: raw.redemptionType || 'ONLINE',
    denominationType: raw.denominationType || 'FIXED',
    denominations: amounts.denominations || [],
    minAmount: amounts.minAmount ?? amounts.minVoucherAmount ?? null,
    maxAmount: amounts.maxAmount ?? amounts.maxVoucherAmount ?? null,
    discountPercentage: raw.discountPercentage ?? null,
    imageUrl: raw.thumbnailUrl || raw.iconImageUrl || raw.logoUrl || null,
    logoUrl: raw.logoUrl || raw.iconImageUrl || null,
    tncUrl: raw.tncUrl || null,
    termsAndConditions: raw.termsAndConditions || [],
    howToUse: howTo,
    voucherExpiryInMonths: raw.voucherExpiryInMonths ?? null,
  }
}

async function getAccessToken(): Promise<string> {
  const { baseUrl, clientId, clientSecret } = config()
  if (!clientId || !clientSecret) {
    throw new Error('Hubble credentials missing (HUBBLE_CLIENT_ID / HUBBLE_CLIENT_SECRET)')
  }

  if (tokenCache && Date.now() < tokenCache.expiresAt - TOKEN_SKEW_MS) {
    return tokenCache.token
  }

  const res = await fetch(`${baseUrl}/v1/partners/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-REQUEST-ID': randomUUID(),
    },
    body: JSON.stringify({ clientId, clientSecret }),
  })

  const body = (await res.json().catch(() => ({}))) as {
    token?: string
    expiresInSecs?: number
    message?: string
  }

  if (!res.ok || !body.token) {
    throw new Error(body.message || `Hubble auth failed (${res.status})`)
  }

  tokenCache = {
    token: body.token,
    expiresAt: Date.now() + (body.expiresInSecs || 3600) * 1000,
  }
  return body.token
}

async function hubbleGet<T>(path: string, query?: Record<string, string>): Promise<T> {
  const { baseUrl } = config()
  const token = await getAccessToken()
  const url = new URL(`${baseUrl}${path}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v) url.searchParams.set(k, v)
    }
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-REQUEST-ID': randomUUID(),
      'Content-Type': 'application/json',
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg =
      (body as any)?.message || (body as any)?.error || `Hubble request failed (${res.status})`
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
  return body as T
}

/** Fetch full catalog from Hubble (paginated). Cached in-memory. */
export async function fetchAllGiftCards(opts?: { force?: boolean }): Promise<GiftCard[]> {
  if (!opts?.force && productCache && Date.now() - productCache.fetchedAt < CACHE_TTL_MS) {
    return productCache.products
  }

  const all: GiftCard[] = []
  let cursor: string | null = null
  let pages = 0

  do {
    pages += 1
    const query: Record<string, string> = { limit: '100' }
    if (cursor) query.cursor = cursor

    const page = await hubbleGet<{ data?: HubbleProductRaw[]; nextCursor?: string | null }>(
      '/v1/partners/products',
      query
    )

    const batch = (page.data || []).map(mapProduct)
    all.push(...batch)
    cursor = page.nextCursor || null
  } while (cursor && pages < 50)

  productCache = { products: all, fetchedAt: Date.now() }
  return all
}

export async function listGiftCards(filters?: {
  status?: string
  category?: string
  q?: string
}): Promise<{ items: GiftCard[]; total: number; categories: string[]; fetchedAt: string }> {
  const all = await fetchAllGiftCards()
  const status = (filters?.status || 'ACTIVE').toUpperCase()
  const category = (filters?.category || '').trim().toUpperCase()
  const q = (filters?.q || '').trim().toLowerCase()

  let items = all
  if (status && status !== 'ALL') {
    items = items.filter((p) => p.status.toUpperCase() === status)
  }
  if (category && category !== 'ALL') {
    items = items.filter((p) => p.categories.some((c) => c.toUpperCase() === category))
  }
  if (q) {
    items = items.filter((p) => {
      const hay = `${p.title} ${p.brand} ${p.description} ${p.tags.join(' ')} ${p.categories.join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }

  const catSet = new Set<string>()
  for (const p of all.filter((x) => status === 'ALL' || x.status.toUpperCase() === status)) {
    for (const c of p.categories) catSet.add(c)
  }

  const categories = Array.from(catSet).sort((a, b) => a.localeCompare(b))

  return {
    items,
    total: items.length,
    categories,
    fetchedAt: new Date(productCache?.fetchedAt || Date.now()).toISOString(),
  }
}

export async function getGiftCard(id: string): Promise<GiftCard | null> {
  const all = await fetchAllGiftCards()
  return all.find((p) => p.id === id) || null
}

export function clearHubbleCaches() {
  tokenCache = null
  productCache = null
}
