import type { Express, Request, Response, NextFunction } from 'express'
import {
  adminPasswordOk,
  createAdminToken,
  verifyAdminToken,
  type AdminRole,
} from './auth.js'
import {
  adminBackendMode,
  bulkUpdateWaitlistStatus,
  createWaitlistEntry,
  deleteAdmin,
  findAdminByEmail,
  listAdmins,
  listWaitlist,
  updateWaitlistStatus,
  upsertAdmin,
} from './store.js'
import {
  deleteOffer,
  goldbackBackendMode,
  listAllAccounts,
  listAllLedger,
  listAllOffers,
  upsertOffer,
} from '../goldback/store.js'

function ok<T>(res: Response, data: T, status = 200) {
  res.status(status).json({ data, status, timestamp: new Date().toISOString() })
}

function fail(res: Response, status: number, error: string) {
  res.status(status).json({ data: null, status, error, timestamp: new Date().toISOString() })
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.header('x-admin-session') || req.header('X-Admin-Session')
  const session = verifyAdminToken(token)
  if (!session) return fail(res, 401, 'Unauthorized')
  ;(req as any).admin = session
  next()
}

function requireRole(...roles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = (req as any).admin
    if (!session || !roles.includes(session.role)) {
      return fail(res, 403, 'Forbidden')
    }
    next()
  }
}

export function registerAdminRoutes(app: Express) {
  app.get('/api/admin/health', (_req, res) => {
    ok(res, {
      adminStore: adminBackendMode(),
      goldbackStore: goldbackBackendMode(),
    })
  })

  app.post('/api/admin/login', async (req, res) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase()
      const password = String(req.body?.password || '')
      if (!email || !password) return fail(res, 400, 'email and password required')
      if (!adminPasswordOk(password)) return fail(res, 401, 'Invalid credentials')
      const admin = await findAdminByEmail(email)
      if (!admin) return fail(res, 401, 'This account is not authorized for admin access')
      const token = createAdminToken(admin.email, admin.role)
      ok(res, { token, role: admin.role, email: admin.email, fullName: admin.fullName })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Login failed')
    }
  })

  app.get('/api/admin/me', requireAdmin, (req, res) => {
    ok(res, (req as any).admin)
  })

  // ─── Waitlist ───
  app.get('/api/admin/waitlist', requireAdmin, async (req, res) => {
    try {
      const status = typeof req.query.status === 'string' ? req.query.status : 'all'
      const search = typeof req.query.search === 'string' ? req.query.search : ''
      const rows = await listWaitlist({ status, search })
      ok(res, rows)
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to load waitlist')
    }
  })

  app.post('/api/admin/waitlist', requireAdmin, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
      const email = String(req.body?.email || '').trim()
      if (!email) return fail(res, 400, 'email required')
      const row = await createWaitlistEntry({
        email,
        fullName: req.body?.fullName,
        status: req.body?.status,
      })
      ok(res, row, 201)
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to create waitlist entry')
    }
  })

  app.patch('/api/admin/waitlist/:id/status', requireAdmin, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
      const status = String(req.body?.status || '') as any
      if (!['pending', 'accepted', 'rejected', 'on_hold'].includes(status)) {
        return fail(res, 400, 'Invalid status')
      }
      const row = await updateWaitlistStatus(req.params.id, status)
      if (!row) return fail(res, 404, 'Not found')
      ok(res, row)
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to update status')
    }
  })

  app.post('/api/admin/waitlist/bulk-status', requireAdmin, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
      const ids: string[] = Array.isArray(req.body?.ids) ? req.body.ids : []
      const status = String(req.body?.status || '') as any
      if (!ids.length) return fail(res, 400, 'ids required')
      if (!['pending', 'accepted', 'rejected', 'on_hold'].includes(status)) {
        return fail(res, 400, 'Invalid status')
      }
      await bulkUpdateWaitlistStatus(ids, status)
      ok(res, { updated: ids.length })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Bulk update failed')
    }
  })

  // ─── Admins ───
  app.get('/api/admin/team', requireAdmin, requireRole('superadmin'), async (_req, res) => {
    try {
      ok(res, await listAdmins())
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to load admins')
    }
  })

  app.post('/api/admin/team', requireAdmin, requireRole('superadmin'), async (req, res) => {
    try {
      const email = String(req.body?.email || '').trim()
      const role = (req.body?.role || 'admin') as AdminRole
      if (!email) return fail(res, 400, 'email required')
      if (!['viewer', 'admin', 'superadmin'].includes(role)) return fail(res, 400, 'Invalid role')
      const row = await upsertAdmin({ email, role, fullName: req.body?.fullName })
      ok(res, row, 201)
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to add admin')
    }
  })

  app.patch('/api/admin/team/:id/role', requireAdmin, requireRole('superadmin'), async (req, res) => {
    try {
      const role = req.body?.role as AdminRole
      const admins = await listAdmins()
      const target = admins.find((a) => a.id === req.params.id)
      if (!target) return fail(res, 404, 'Not found')
      const row = await upsertAdmin({ email: target.email, role, fullName: target.fullName || undefined })
      ok(res, row)
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to update role')
    }
  })

  app.delete('/api/admin/team/:id', requireAdmin, requireRole('superadmin'), async (req, res) => {
    try {
      const okDel = await deleteAdmin(req.params.id)
      if (!okDel) return fail(res, 404, 'Not found')
      ok(res, { deleted: true })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to delete admin')
    }
  })

  // ─── Goldback / Offers ───
  app.get('/api/admin/offers', requireAdmin, async (_req, res) => {
    try {
      ok(res, await listAllOffers())
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to load offers')
    }
  })

  app.post('/api/admin/offers', requireAdmin, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
      const title = String(req.body?.title || '').trim()
      const merchant = String(req.body?.merchant || '').trim()
      const url = String(req.body?.url || '').trim()
      if (!title || !merchant || !url) return fail(res, 400, 'title, merchant, url required')
      const offer = await upsertOffer({
        id: req.body?.id,
        title,
        merchant,
        url,
        category: req.body?.category,
        description: req.body?.description,
        rewardPaise: Number(req.body?.rewardPaise ?? 0),
        rewardLabel: req.body?.rewardLabel,
        active: req.body?.active !== false,
      })
      ok(res, offer, req.body?.id ? 200 : 201)
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to save offer')
    }
  })

  app.delete('/api/admin/offers/:id', requireAdmin, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
      const deleted = await deleteOffer(req.params.id)
      if (!deleted) return fail(res, 404, 'Not found')
      ok(res, { deleted: true })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to delete offer')
    }
  })

  app.get('/api/admin/goldback/ledger', requireAdmin, async (_req, res) => {
    try {
      ok(res, await listAllLedger())
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to load ledger')
    }
  })

  app.get('/api/admin/goldback/accounts', requireAdmin, async (_req, res) => {
    try {
      ok(res, await listAllAccounts())
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to load accounts')
    }
  })
}
