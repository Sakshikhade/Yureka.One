import crypto from 'crypto'

export type AdminRole = 'viewer' | 'admin' | 'superadmin'

export interface AdminSession {
  email: string
  role: AdminRole
  exp: number
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.GOOGLE_CLIENT_SECRET || 'yureka-local-admin-secret'
}

export function createAdminToken(email: string, role: AdminRole, ttlHours = 24): string {
  const payload: AdminSession = {
    email: email.toLowerCase(),
    role,
    exp: Date.now() + ttlHours * 3600_000,
  }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', secret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifyAdminToken(token: string | undefined | null): AdminSession | null {
  if (!token) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = crypto.createHmac('sha256', secret()).update(body).digest('base64url')
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  } catch {
    return null
  }
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as AdminSession
    if (!payload?.email || !payload?.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function adminPasswordOk(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || 'yureka-admin'
  return password === expected
}
