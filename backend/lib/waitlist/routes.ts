import type { Express, Request, Response } from 'express'
import { randomInt } from 'crypto'
import {
  countWaitlist,
  findWaitlistByEmail,
  upsertWaitlistJoin,
  type WaitlistJoinInput,
} from '../admin/store.js'

function ok<T>(res: Response, data: T, status = 200) {
  res.status(status).json({ data, status, timestamp: new Date().toISOString() })
}

function fail(res: Response, status: number, error: string) {
  res.status(status).json({ data: null, status, error, timestamp: new Date().toISOString() })
}

function makeReferralCode() {
  return `YRKMNY${String(randomInt(1000, 9999))}`
}

function toPublicEntry(row: Awaited<ReturnType<typeof upsertWaitlistJoin>>['row'], meta: Record<string, any>) {
  return {
    id: row.id,
    name: row.fullName || '',
    email: row.email,
    mobileNumber: row.mobileNumber || undefined,
    dateOfBirth: meta.dateOfBirth || undefined,
    gender: meta.gender || undefined,
    role: 'user' as const,
    mostUsedFor: row.topCategory || meta.mostUsedFor || undefined,
    monthlySpend: row.monthlySpend || undefined,
    referralCode: meta.referredBy || undefined,
    personalReferralCode: meta.personalReferralCode || undefined,
    sourceChannel: meta.sourceChannel || undefined,
    rank: typeof meta.rank === 'number' ? meta.rank : undefined,
    status: row.status,
    yurekaScore: row.yurekaScore ?? undefined,
    joinedAt: row.createdAt,
    createdAt: row.createdAt,
  }
}

export function registerWaitlistRoutes(app: Express) {
  app.post('/api/v1/waitlist/join', async (req: Request, res: Response) => {
    try {
      const body = req.body || {}
      const email = String(body.email || '').trim().toLowerCase()
      if (!email || !email.includes('@')) {
        return fail(res, 400, 'Valid email is required')
      }

      const name = String(body.name || [body.first_name, body.last_name].filter(Boolean).join(' ') || '').trim()
      const mobile = String(body.mobile_number || body.phone || '').trim() || null
      const existing = await findWaitlistByEmail(email)

      let personalReferralCode = ''
      let rank = 1000
      let alreadyExists = false

      if (existing) {
        alreadyExists = true
        let meta: Record<string, any> = {}
        try {
          meta = existing.notes ? JSON.parse(existing.notes) : {}
        } catch {
          meta = {}
        }
        personalReferralCode = meta.personalReferralCode || makeReferralCode()
        rank = typeof meta.rank === 'number' ? meta.rank : 1000
      } else {
        const total = await countWaitlist()
        rank = 1000 + total + 1
        personalReferralCode = makeReferralCode()
      }

      const input: WaitlistJoinInput = {
        email,
        fullName: name || null,
        mobileNumber: mobile,
        status: existing?.status === 'accepted' ? 'accepted' : 'pending',
        yurekaScore:
          body.yureka_score != null && Number.isFinite(Number(body.yureka_score))
            ? Number(body.yureka_score)
            : existing?.yurekaScore ?? null,
        monthlySpend: body.monthly_spend != null ? String(body.monthly_spend) : existing?.monthlySpend ?? null,
        topCategory: body.most_used_for != null ? String(body.most_used_for) : existing?.topCategory ?? null,
        meta: {
          personalReferralCode,
          rank,
          referredBy: body.referral_code ? String(body.referral_code) : undefined,
          sourceChannel: body.source_channel ? String(body.source_channel) : undefined,
          dateOfBirth: body.date_of_birth ? String(body.date_of_birth) : undefined,
          gender: body.gender ? String(body.gender) : undefined,
          mostUsedFor: body.most_used_for ? String(body.most_used_for) : undefined,
        },
      }

      const { row, meta } = await upsertWaitlistJoin(input)
      ok(res, {
        data: toPublicEntry(row, meta),
        alreadyExists,
      })
    } catch (e: any) {
      console.error('[waitlist] join failed:', e?.message || e)
      fail(res, 500, e?.message || 'Failed to join waitlist')
    }
  })

  app.get('/api/v1/waitlist/entry', async (req: Request, res: Response) => {
    try {
      const email = String(req.query.email || '').trim().toLowerCase()
      if (!email) return fail(res, 400, 'email is required')
      const row = await findWaitlistByEmail(email)
      if (!row) return fail(res, 404, 'Waitlist entry not found')
      let meta: Record<string, any> = {}
      try {
        meta = row.notes ? JSON.parse(row.notes) : {}
      } catch {
        meta = {}
      }
      ok(res, toPublicEntry(row, meta))
    } catch (e: any) {
      fail(res, 500, e?.message || 'Failed to load waitlist entry')
    }
  })
}
