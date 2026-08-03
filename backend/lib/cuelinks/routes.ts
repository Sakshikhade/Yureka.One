import type { Express, Response } from 'express'
import {
  clearCueLinksCache,
  cuelinksConfigured,
  fetchCueLinksOffers,
  listCueLinksOffers,
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

export function registerCuelinksRoutes(app: Express) {
  app.get('/api/cuelinks/health', (_req, res) => {
    ok(res, {
      configured: cuelinksConfigured(),
      base: process.env.CUELINKS_API_BASE || 'https://www.cuelinks.com/api/v2',
      indiaOnly: (process.env.CUELINKS_INDIA_ONLY || 'true').toLowerCase() !== 'false',
    })
  })

  app.get('/api/cuelinks/offers', async (req, res) => {
    if (!cuelinksConfigured()) {
      return fail(res, 503, 'CueLinks credentials not configured')
    }
    try {
      const q = typeof req.query.q === 'string' ? req.query.q : ''
      const category = typeof req.query.category === 'string' ? req.query.category : ''
      const type = typeof req.query.type === 'string' ? req.query.type : ''
      const result = await listCueLinksOffers({ q, category, type })
      ok(res, result)
    } catch (e: any) {
      console.error('[cuelinks] list failed:', e?.message || e)
      fail(res, 502, e?.message || 'Failed to load CueLinks offers')
    }
  })

  app.post('/api/cuelinks/refresh', async (_req, res) => {
    if (!cuelinksConfigured()) {
      return fail(res, 503, 'CueLinks credentials not configured')
    }
    try {
      clearCueLinksCache()
      const snap = await fetchCueLinksOffers({ force: true })
      ok(res, { loaded: snap.offers.length, catalogTotal: snap.totalCount })
    } catch (e: any) {
      fail(res, 502, e?.message || 'Refresh failed')
    }
  })
}
