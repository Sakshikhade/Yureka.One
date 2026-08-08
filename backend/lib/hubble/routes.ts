import type { Express, Request, Response } from 'express'
import { randomBytes } from 'crypto'
import {
  clearHubbleCaches,
  fetchAllGiftCards,
  getGiftCard,
  getHubbleOrder,
  getHubbleOrderByReference,
  hubbleConfigured,
  listGiftCards,
  placeHubbleOrder,
} from './client.js'
import {
  applyHubbleOrderResult,
  createLocalOrder,
  getOrderById,
  hubbleOrdersBackendMode,
  listOrdersForUser,
} from './store.js'
import {
  handleBrandDiscountWebhook,
  handleBrandUpdatedWebhook,
  handleOrderTerminalWebhook,
  handleWalletLowWebhook,
  hubbleWebhookSecret,
  requireHubbleWebhookSignature,
} from './webhooks.js'

function ok<T>(res: Response, data: T, status = 200) {
  res.status(status).json({
    data,
    status,
    timestamp: new Date().toISOString(),
  })
}

function fail(res: Response, status: number, error: string) {
  res.status(status).json({
    data: null,
    status,
    error,
    timestamp: new Date().toISOString(),
  })
}

function userIdFrom(req: Request): string {
  const header = (req.header('x-user-id') || '').trim()
  if (header) return header
  const q = typeof req.query.userId === 'string' ? req.query.userId.trim() : ''
  if (q) return q
  const bodyId = typeof (req.body as any)?.userId === 'string' ? (req.body as any).userId.trim() : ''
  if (bodyId) return bodyId
  return 'demo-user'
}

function makeReferenceId(): string {
  // Max 40 chars, globally unique per Hubble rules.
  return `yrk_${Date.now().toString(36)}_${randomBytes(4).toString('hex')}`
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 80) || 'Yureka User'
}

function sanitizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length >= 10) return digits.slice(-10)
  return '9999999999'
}

export function registerGiftcardRoutes(app: Express) {
  app.get('/api/giftcards/health', (_req, res) => {
    ok(res, {
      configured: hubbleConfigured(),
      base: process.env.HUBBLE_API_BASE || null,
      ordersStore: hubbleOrdersBackendMode(),
      webhookSecretConfigured: Boolean(hubbleWebhookSecret()),
    })
  })

  app.get('/api/giftcards', async (req, res) => {
    if (!hubbleConfigured()) {
      return fail(res, 503, 'Hubble credentials not configured')
    }
    try {
      const status = typeof req.query.status === 'string' ? req.query.status : 'ACTIVE'
      const category = typeof req.query.category === 'string' ? req.query.category : ''
      const q = typeof req.query.q === 'string' ? req.query.q : ''
      const result = await listGiftCards({ status, category, q })
      ok(res, result)
    } catch (e: any) {
      console.error('[giftcards] list failed:', e?.message || e)
      fail(res, 502, e?.message || 'Failed to load gift cards from Hubble')
    }
  })

  app.post('/api/giftcards/refresh', async (_req, res) => {
    if (!hubbleConfigured()) {
      return fail(res, 503, 'Hubble credentials not configured')
    }
    try {
      clearHubbleCaches()
      const all = await fetchAllGiftCards({ force: true })
      ok(res, {
        total: all.length,
        active: all.filter((c) => c.status === 'ACTIVE').length,
      })
    } catch (e: any) {
      fail(res, 502, e?.message || 'Refresh failed')
    }
  })

  // --- Orders (must be registered before /:id) ---

  app.get('/api/giftcards/orders', async (req, res) => {
    try {
      const userId = userIdFrom(req)
      const orders = await listOrdersForUser(userId)
      ok(res, { items: orders })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to list orders')
    }
  })

  app.get('/api/giftcards/orders/:id', async (req, res) => {
    try {
      const userId = userIdFrom(req)
      const id = String(req.params.id)
      const order = await getOrderById(id, userId)
      if (!order) return fail(res, 404, 'Order not found')

      // Refresh from Hubble if still processing and we have a Hubble id.
      if (order.status === 'PROCESSING' && order.hubbleOrderId && hubbleConfigured()) {
        try {
          const remote = await getHubbleOrder(order.hubbleOrderId)
          const updated = await applyHubbleOrderResult(order.id, remote)
          return ok(res, updated || order)
        } catch (e: any) {
          console.warn('[giftcards] poll order failed:', e?.message || e)
        }
      }
      ok(res, order)
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to load order')
    }
  })

  app.post('/api/giftcards/orders', async (req, res) => {
    if (!hubbleConfigured()) {
      return fail(res, 503, 'Hubble credentials not configured')
    }
    try {
      const userId = userIdFrom(req)
      const productId = String(req.body?.productId || '').trim()
      const denomination = Number(req.body?.denomination)
      const quantity = Math.max(1, Number(req.body?.quantity) || 1)
      if (!productId) return fail(res, 400, 'productId is required')
      if (!Number.isFinite(denomination) || denomination <= 0) {
        return fail(res, 400, 'denomination must be a positive number')
      }

      const card = await getGiftCard(productId)
      if (!card || card.status !== 'ACTIVE') {
        return fail(res, 404, 'Gift card not available')
      }
      if (card.denominations.length && !card.denominations.includes(denomination)) {
        return fail(res, 400, 'Denomination not allowed for this brand')
      }
      if (card.minAmount != null && denomination < card.minAmount) {
        return fail(res, 400, `Minimum amount is ${card.minAmount}`)
      }
      if (card.maxAmount != null && denomination > card.maxAmount) {
        return fail(res, 400, `Maximum amount is ${card.maxAmount}`)
      }

      const amount = denomination * quantity
      const referenceId = makeReferenceId()
      const customerName = sanitizeName(
        String(req.body?.customerName || req.body?.name || 'Yureka User'),
      )
      const customerEmail = String(req.body?.customerEmail || req.body?.email || 'noreply@yureka.one')
        .trim()
        .slice(0, 120)
      const customerPhone = sanitizePhone(
        String(req.body?.customerPhone || req.body?.phone || ''),
      )

      const local = await createLocalOrder({
        userId,
        referenceId,
        productId,
        productTitle: card.title,
        amountInr: amount,
        denomination,
        quantity,
        customerName,
        customerEmail,
        customerPhone,
      })

      let remote
      try {
        remote = await placeHubbleOrder({
          productId,
          referenceId,
          amount,
          denominationDetails: [{ denomination, quantity }],
          customerDetails: {
            name: customerName,
            phoneNumber: customerPhone,
            email: customerEmail,
          },
        })
      } catch (e: any) {
        // Timeout / uncertain — try by-reference lookup once.
        try {
          remote = await getHubbleOrderByReference(referenceId)
        } catch {
          await applyHubbleOrderResult(local.id, {
            id: '',
            referenceId,
            status: 'FAILED',
            vouchers: [],
            failureReason: e?.message || 'Order placement failed',
          })
          return fail(res, 502, e?.message || 'Failed to place order with Hubble')
        }
      }

      const updated = await applyHubbleOrderResult(local.id, remote)
      const order = updated || (await getOrderById(local.id))
      ok(
        res,
        {
          order,
          // Local status page (Hubble Partner API has no hosted checkout URL —
          // payment settles against the partner wallet on Hubble).
          statusUrl: `/dashboard/giftcards/orders/${local.id}`,
        },
        201,
      )
    } catch (e: any) {
      console.error('[giftcards] place order failed:', e?.message || e)
      fail(res, 502, e?.message || 'Failed to place order')
    }
  })

  app.get('/api/giftcards/:id', async (req, res) => {
    if (!hubbleConfigured()) {
      return fail(res, 503, 'Hubble credentials not configured')
    }
    try {
      const card = await getGiftCard(String(req.params.id))
      if (!card) return fail(res, 404, 'Gift card not found')
      ok(res, card)
    } catch (e: any) {
      console.error('[giftcards] get failed:', e?.message || e)
      fail(res, 502, e?.message || 'Failed to load gift card')
    }
  })

  // --- Webhooks (signature via X-Verify) ---

  const webhookAuth = [requireHubbleWebhookSignature]

  app.post('/api/hubble/webhooks/order-terminal', ...webhookAuth, async (req, res) => {
    try {
      const result = await handleOrderTerminalWebhook(req.body)
      res.status(200).json({ ok: true, ...result })
    } catch (e: any) {
      console.error('[hubble webhook] order-terminal:', e?.message || e)
      res.status(500).json({ ok: false, error: e?.message || 'handler failed' })
    }
  })

  app.post('/api/hubble/webhooks/brand-updated', ...webhookAuth, async (req, res) => {
    try {
      const result = await handleBrandUpdatedWebhook(req.body)
      res.status(200).json({ ok: true, ...result })
    } catch (e: any) {
      console.error('[hubble webhook] brand-updated:', e?.message || e)
      res.status(500).json({ ok: false, error: e?.message || 'handler failed' })
    }
  })

  app.post('/api/hubble/webhooks/brand-discount', ...webhookAuth, async (req, res) => {
    try {
      const result = await handleBrandDiscountWebhook(req.body)
      res.status(200).json({ ok: true, ...result })
    } catch (e: any) {
      console.error('[hubble webhook] brand-discount:', e?.message || e)
      res.status(500).json({ ok: false, error: e?.message || 'handler failed' })
    }
  })

  app.post('/api/hubble/webhooks/wallet-low', ...webhookAuth, async (req, res) => {
    try {
      const result = await handleWalletLowWebhook(req.body)
      res.status(200).json({ ok: true, ...result })
    } catch (e: any) {
      console.error('[hubble webhook] wallet-low:', e?.message || e)
      res.status(500).json({ ok: false, error: e?.message || 'handler failed' })
    }
  })
}
