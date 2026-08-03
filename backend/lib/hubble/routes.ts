import type { Express, Response } from 'express'
import {
  clearHubbleCaches,
  fetchAllGiftCards,
  getGiftCard,
  hubbleConfigured,
  listGiftCards,
} from './client.js'

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

export function registerGiftcardRoutes(app: Express) {
  app.get('/api/giftcards/health', (_req, res) => {
    ok(res, {
      configured: hubbleConfigured(),
      base: process.env.HUBBLE_API_BASE || 'https://api.dev.myhubble.money',
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

  app.get('/api/giftcards/:id', async (req, res) => {
    if (!hubbleConfigured()) {
      return fail(res, 503, 'Hubble credentials not configured')
    }
    try {
      const card = await getGiftCard(req.params.id)
      if (!card) return fail(res, 404, 'Gift card not found')
      ok(res, card)
    } catch (e: any) {
      console.error('[giftcards] get failed:', e?.message || e)
      fail(res, 502, e?.message || 'Failed to load gift card')
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
}
