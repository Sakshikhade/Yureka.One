import type { Express, Request, Response } from 'express'
import {
  creditEarn,
  getBalance,
  goldbackBackendMode,
  listLedger,
  listOffers,
  recordClick,
} from './store.js'

function userIdFrom(req: Request): string {
  const header = (req.header('x-user-id') || '').trim()
  if (header) return header
  const q = typeof req.query.userId === 'string' ? req.query.userId.trim() : ''
  if (q) return q
  const bodyId = typeof (req.body as any)?.userId === 'string' ? (req.body as any).userId.trim() : ''
  if (bodyId) return bodyId
  return 'demo-user'
}

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

export function registerGoldbackRoutes(app: Express) {
  app.get('/api/goldback/health', (_req, res) => {
    ok(res, { mode: goldbackBackendMode() })
  })

  app.get('/api/goldback/offers', async (_req, res) => {
    try {
      const offers = await listOffers()
      ok(res, offers)
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to list offers')
    }
  })

  app.get('/api/goldback/balance', async (req, res) => {
    try {
      const userId = userIdFrom(req)
      const balance = await getBalance(userId)
      ok(res, balance)
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to get balance')
    }
  })

  app.get('/api/goldback/ledger', async (req, res) => {
    try {
      const userId = userIdFrom(req)
      const ledger = await listLedger(userId)
      ok(res, ledger)
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to get ledger')
    }
  })

  app.post('/api/goldback/click', async (req, res) => {
    try {
      const userId = userIdFrom(req)
      const offerId = String(req.body?.offerId || '')
      if (!offerId) return fail(res, 400, 'offerId is required')
      await recordClick(userId, offerId)
      ok(res, { recorded: true })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to record click')
    }
  })

  app.post('/api/goldback/earn', async (req, res) => {
    try {
      const userId = userIdFrom(req)
      const offerId = String(req.body?.offerId || '')
      const idempotencyKey = String(req.body?.idempotencyKey || `earn:${userId}:${offerId}:${Date.now()}`)
      if (!offerId) return fail(res, 400, 'offerId is required')
      const result = await creditEarn(userId, offerId, idempotencyKey)
      ok(res, result)
    } catch (e: any) {
      fail(res, 400, e?.message || 'Failed to credit earn')
    }
  })
}
