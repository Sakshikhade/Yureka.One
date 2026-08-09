import nodemailer from 'nodemailer'

function appOrigin(): string {
  return (
    (process.env.APP_ORIGIN || process.env.FRONTEND_URL || process.env.PUBLIC_APP_URL || '').trim() ||
    'https://yurekaone.netlify.app'
  )
}

export async function sendApprovalEmail(opts: {
  to: string
  fullName?: string | null
}): Promise<{ sent: boolean; skipped?: string; error?: string }> {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return { sent: false, skipped: 'GMAIL_USER/GMAIL_APP_PASSWORD not configured' }
  }

  const loginUrl = `${appOrigin().replace(/\/$/, '')}/login?next=${encodeURIComponent('/dashboard')}`
  const name = (opts.fullName || '').trim() || 'there'

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    })

    await transporter.sendMail({
      from: `"Yureka One" <${GMAIL_USER}>`,
      to: opts.to,
      subject: "You're in — Yureka.One access approved",
      text: `Hi ${name},

You're approved for Yureka.One.

Sign in with your Gmail to open your dashboard:
${loginUrl}

— Team Yureka`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111">
          <h1 style="font-size:22px;margin-bottom:8px">You're in</h1>
          <p style="color:#444;line-height:1.5">Hi ${name}, your waitlist application was accepted.</p>
          <p style="margin:28px 0">
            <a href="${loginUrl}" style="background:#00933b;color:#fff;padding:14px 22px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block">
              Sign in with Gmail
            </a>
          </p>
          <p style="color:#888;font-size:13px">Or open: ${loginUrl}</p>
        </div>
      `,
    })
    return { sent: true }
  } catch (e: any) {
    console.error('[mail] approval email failed:', e?.message || e)
    return { sent: false, error: e?.message || 'Failed to send approval email' }
  }
}
