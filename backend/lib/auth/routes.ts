import type { Express, Request, Response } from 'express'
import { findAdminByEmail, findWaitlistByEmail } from '../admin/store.js'
import { parseWaitlistMeta, toPublicWaitlistEntry } from '../waitlist/public.js'

function ok<T>(res: Response, data: T, status = 200) {
  res.status(status).json({ data, status, timestamp: new Date().toISOString() })
}

function fail(res: Response, status: number, error: string) {
  res.status(status).json({ data: null, status, error, timestamp: new Date().toISOString() })
}

function bootstrapEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

async function resolveRole(email: string): Promise<'admin' | 'viewer' | 'user'> {
  const admin = await findAdminByEmail(email)
  if (admin) {
    if (admin.role === 'viewer') return 'viewer'
    return 'admin'
  }
  if (bootstrapEmails().includes(email)) return 'admin'
  return 'user'
}

export function registerAuthRoutes(app: Express) {
  app.get('/api/v1/auth/role', async (req: Request, res: Response) => {
    try {
      const email = String(req.query.email || '').trim().toLowerCase()
      if (!email) return fail(res, 400, 'email is required')
      const role = await resolveRole(email)
      return ok(res, { role, email })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to resolve role')
    }
  })

  app.get('/api/v1/auth/admin-check', async (req: Request, res: Response) => {
    try {
      const email = String(req.query.email || '').trim().toLowerCase()
      if (!email) return fail(res, 400, 'email is required')
      const role = await resolveRole(email)
      ok(res, { isAdmin: role === 'admin' || role === 'viewer', role, email })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to check admin')
    }
  })

  /**
   * Single gating endpoint for the SPA:
   * { role, status, entry }
   * status: admin | accepted | pending | on-hold | rejected | none
   */
  app.get('/api/v1/auth/status', async (req: Request, res: Response) => {
    try {
      const email = String(req.query.email || '').trim().toLowerCase()
      if (!email) return fail(res, 400, 'email is required')

      const [role, row] = await Promise.all([resolveRole(email), findWaitlistByEmail(email)])
      const entry = row ? toPublicWaitlistEntry(row, parseWaitlistMeta(row)) : null

      let status: 'admin' | 'accepted' | 'pending' | 'on-hold' | 'rejected' | 'none' = 'none'
      if (role === 'admin') {
        status = 'admin'
      } else if (entry?.status === 'accepted') {
        status = 'accepted'
      } else if (entry?.status === 'rejected') {
        status = 'rejected'
      } else if (entry?.status === 'on-hold' || entry?.status === 'on_hold') {
        status = 'on-hold'
      } else if (entry) {
        status = 'pending'
      }

      ok(res, {
        email,
        role,
        status,
        entry,
        canAccessDashboard: status === 'admin' || status === 'accepted',
      })
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to resolve auth status')
    }
  })
}
