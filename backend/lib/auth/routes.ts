import type { Express, Request, Response } from 'express'
import { findAdminByEmail } from '../admin/store.js'

function ok<T>(res: Response, data: T, status = 200) {
  res.status(status).json({ data, status, timestamp: new Date().toISOString() })
}

function fail(res: Response, status: number, error: string) {
  res.status(status).json({ data: null, status, error, timestamp: new Date().toISOString() })
}

export function registerAuthRoutes(app: Express) {
  app.get('/api/v1/auth/role', async (req: Request, res: Response) => {
    try {
      const email = String(req.query.email || '').trim().toLowerCase()
      if (!email) return fail(res, 400, 'email is required')

      const bootstrap = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)

      const admin = await findAdminByEmail(email)
      if (admin) {
        const role =
          admin.role === 'superadmin' || admin.role === 'admin'
            ? 'admin'
            : admin.role === 'viewer'
              ? 'viewer'
              : 'admin'
        return ok(res, { role, email })
      }
      if (bootstrap.includes(email)) {
        return ok(res, { role: 'admin', email })
      }
      return ok(res, { role: 'user', email })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to resolve role')
    }
  })

  app.get('/api/v1/auth/admin-check', async (req: Request, res: Response) => {
    try {
      const email = String(req.query.email || '').trim().toLowerCase()
      if (!email) return fail(res, 400, 'email is required')
      const admin = await findAdminByEmail(email)
      const bootstrap = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
      ok(res, { isAdmin: Boolean(admin) || bootstrap.includes(email) })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to check admin')
    }
  })
}
