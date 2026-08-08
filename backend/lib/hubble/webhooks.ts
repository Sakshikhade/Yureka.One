import { createHmac, timingSafeEqual } from 'crypto'
import type { Request, Response, NextFunction } from 'express'
import { clearHubbleProductCache, getHubbleOrder } from './client.js'
import { applyHubbleOrderByHubbleId, claimWebhookEvent } from './store.js'

export function hubbleWebhookSecret(): string {
  return (process.env.HUBBLE_WEBHOOK_SECRET || '').trim()
}

/** HMAC-SHA256(rawBody) → Base64, compared to X-Verify. */
export function verifyHubbleSignature(rawBody: string, signatureHeader: string | undefined): boolean {
  const secret = hubbleWebhookSecret()
  if (!secret) {
    // Allow unsigned only outside production so local/dev can test handlers.
    if (process.env.NODE_ENV === 'production') return false
    return true
  }
  if (!signatureHeader) return false
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')
  try {
    const a = Buffer.from(expected)
    const b = Buffer.from(signatureHeader)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function requireHubbleWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const raw =
    typeof (req as any).rawBody === 'string'
      ? (req as any).rawBody
      : JSON.stringify(req.body ?? {})
  const sig = (req.header('x-verify') || req.header('X-Verify') || '').trim()
  if (!verifyHubbleSignature(raw, sig)) {
    return res.status(401).send('Invalid signature')
  }
  next()
}

export async function handleOrderTerminalWebhook(payload: any) {
  const hubbleOrderId = String(payload?.orderId || payload?.id || '').trim()
  const status = String(payload?.status || '').toUpperCase()
  if (!hubbleOrderId) throw new Error('Missing orderId')

  const eventKey = `order-terminal:${hubbleOrderId}:${status}`
  const claimed = await claimWebhookEvent(eventKey, 'order-terminal', payload)
  if (!claimed) return { duplicate: true, orderId: hubbleOrderId }

  const full = await getHubbleOrder(hubbleOrderId)
  const updated = await applyHubbleOrderByHubbleId(hubbleOrderId, full)
  return { duplicate: false, orderId: hubbleOrderId, localId: updated?.id || null, status: full.status }
}

export async function handleBrandUpdatedWebhook(payload: any) {
  const id = String(payload?.id || 'unknown')
  const eventKey = `brand-updated:${id}:${JSON.stringify(payload).slice(0, 120)}`
  const claimed = await claimWebhookEvent(eventKey, 'brand-updated', payload)
  if (!claimed) return { duplicate: true }
  clearHubbleProductCache()
  return { duplicate: false, cleared: true }
}

export async function handleBrandDiscountWebhook(payload: any) {
  const brandId = String(payload?.brandId || 'unknown')
  const eventKey = `brand-discount:${brandId}:${payload?.validFrom || ''}:${payload?.subventionPercentage ?? ''}`
  const claimed = await claimWebhookEvent(eventKey, 'brand-discount', payload)
  if (!claimed) return { duplicate: true }
  clearHubbleProductCache()
  return { duplicate: false, cleared: true }
}

export async function handleWalletLowWebhook(payload: any) {
  const balance = payload?.balance
  const threshold = payload?.threshold
  const eventKey = `wallet-low:${balance}:${threshold}:${Date.now()}`
  // Always log; key includes timestamp so alerts aren't dropped as duplicates within same second buckets.
  await claimWebhookEvent(eventKey, 'wallet-low', payload)
  console.warn('[hubble] wallet balance low', { balance, threshold })
  return { ok: true, balance, threshold }
}
