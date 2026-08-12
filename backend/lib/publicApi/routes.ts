import type { Express, Request, Response } from 'express'

function ok<T>(res: Response, data: T, status = 200) {
  res.status(status).json({ data, status, timestamp: new Date().toISOString() })
}

/**
 * Lightweight public CMS + dashboard companion routes so the SPA does not
 * hard-fail when the full Java/CMS backend is not present. Cards fall through
 * to the frontend static set when this returns [].
 */
export function registerPublicApiRoutes(app: Express) {
  app.get('/api/v1/health', (_req, res) => {
    ok(res, { status: 'ok', env: process.env.NODE_ENV || 'development' })
  })

  app.get('/api/v1/cms/cards', (_req, res) => {
    ok(res, [])
  })

  app.get('/api/v1/cms/blogs', (_req, res) => {
    ok(res, [])
  })

  app.get('/api/v1/cms/blogs/:slug', (_req, res) => {
    res.status(404).json({
      data: null,
      status: 404,
      error: 'Blog not found',
      timestamp: new Date().toISOString(),
    })
  })

  app.get('/api/v1/cms/reviews', (_req, res) => {
    ok(res, [])
  })

  app.get('/api/v1/notifications', (_req, res) => {
    ok(res, [])
  })

  app.get('/api/v1/notifications/interactions', (_req, res) => {
    ok(res, [])
  })

  app.post('/api/v1/notifications/:id/interact', (req, res) => {
    ok(res, { id: String(req.params.id), recorded: true })
  })

  app.get('/api/v1/ledger', (_req, res) => {
    ok(res, { profile: {}, transactions: [] })
  })

  app.post('/api/v1/ledger/scan', (_req, res) => {
    ok(res, { profile: {}, transactions: [] })
  })

  app.get('/api/v1/users/cards', (_req, res) => {
    ok(res, [])
  })

  app.post('/api/v1/users/cards', (req, res) => {
    const body = req.body || {}
    ok(
      res,
      {
        id: `local_${Date.now()}`,
        bankName: body.bankName || body.bank_name || 'Unknown',
        cardName: body.cardName || body.card_name || 'Card',
        ...body,
      },
      201
    )
  })

  app.delete('/api/v1/users/cards/:id', (req, res) => {
    ok(res, { deleted: true, id: String(req.params.id) })
  })

  app.patch('/api/v1/users/cards/:id/priority', (req, res) => {
    ok(res, { id: String(req.params.id), ...(req.body || {}) })
  })

  // Admin CMS mirrors used by SupabaseProvider on /admin — empty until full CMS lands.
  app.get('/api/v1/admin/cards', (_req, res) => ok(res, []))
  app.get('/api/v1/admin/blogs', (_req, res) => ok(res, []))
  app.get('/api/v1/admin/reviews', (_req, res) => ok(res, []))
  app.get('/api/v1/admin/waitlist', async (_req, res) => {
    try {
      const { listWaitlist } = await import('../admin/store.js')
      const rows = await listWaitlist({ status: 'all' })
      ok(
        res,
        rows.map((r) => ({
          id: r.id,
          name: r.fullName || '',
          email: r.email,
          status: r.status === 'on_hold' ? 'on-hold' : r.status,
          mobileNumber: r.mobileNumber,
          monthlySpend: r.monthlySpend,
          mostUsedFor: r.topCategory,
          yurekaScore: r.yurekaScore,
          joinedAt: r.createdAt,
          createdAt: r.createdAt,
          role: 'user',
        }))
      )
    } catch (e: any) {
      res.status(500).json({
        data: null,
        status: 500,
        error: e?.message || 'Failed to list waitlist',
        timestamp: new Date().toISOString(),
      })
    }
  })
  app.get('/api/v1/admin/team', (_req, res) => ok(res, []))
  app.get('/api/v1/admin/audit-logs', (_req, res) => ok(res, []))
}
