# Go live — Netlify (frontend) + Render (API)

**Current target frontend:** `https://yurekaone.netlify.app` (Netlify site `yurekaone`)  
**API:** `https://yureka-api.onrender.com`  
Netlify proxies `/api/*` → Render ([`netlify.toml`](../netlify.toml)).

Custom domain `yureka.one` can be wired later; smoke-test the Netlify URL first.

## Blockers

1. If Render shows **Service Suspended**, every API call fails (gift cards, Hubble webhooks, admin). Resume it first.
2. Supabase URL in `.env` / Netlify `VITE_SUPABASE_*` must resolve (DNS). A deleted project breaks client auth even if Render is up.

## 1. Resume Render

**Option A — dashboard**

1. Open [Render Dashboard](https://dashboard.render.com) → **yureka-api**
2. **Resume** / unsuspend (or Manual Deploy → Deploy latest commit)
3. Confirm build uses [`render.yaml`](../render.yaml) (pnpm install + `pnpm start`)
4. Wait for healthy: `curl -s https://yureka-api.onrender.com/api/health`  
   Expect: `{"status":"ok",...}`

**Option B — API script (from this repo)**

1. Create a Render API key: [Account Settings → API Keys](https://dashboard.render.com/u/settings?add-api-key)
2. From the repo root:

```bash
export RENDER_API_KEY=rnd_...
node scripts/go-live-render.mjs
```

This resumes `yureka-api`, copies required secrets from local `.env`, and triggers a deploy.

If you create a **new** service URL, update the proxy in `netlify.toml` and redeploy Netlify.

## 2. Render environment variables

**Environment → Add** (copy from local `.env`, never commit):

| Key | Notes |
|---|---|
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server only) |
| `HUBBLE_CLIENT_ID` | Partner client id |
| `HUBBLE_CLIENT_SECRET` | Partner secret |
| `HUBBLE_API_BASE` | e.g. `https://api.dev.myhubble.money` or prod base |
| `HUBBLE_WEBHOOK_SECRET` | Same as Hubble dashboard “Webhook Signature” |
| `ADMIN_PASSWORD` | `/admin` |
| `ADMIN_EMAILS` | Comma-separated |
| `ADMIN_SESSION_SECRET` | Long random string |
| `CUELINKS_*` / `GMAIL_*` / `GOOGLE_CLIENT_*` | Optional |

Redeploy after saving env vars.

## 3. Supabase migration (Hubble orders)

In Supabase → **SQL Editor**, run:

[`backend/supabase/migrations/003_hubble_orders.sql`](../backend/supabase/migrations/003_hubble_orders.sql)

Creates `hubble_orders`, `hubble_vouchers`, `hubble_webhook_events`.  
Without this, orders use ephemeral disk on Render and are lost on restart.

## 4. Netlify (`yurekaone`)

1. Site: [app.netlify.com](https://app.netlify.com) → **yurekaone** → linked to `main`
2. Env (build-time public only):
   - `VITE_API_BASE_URL` **empty** in production (same-origin `/api` → Render proxy)
   - `VITE_ADMIN_PORTAL_URL=https://yurekaone.netlify.app`
   - `SECRETS_SCAN_ENABLED=false`
   - Keep server secrets on **Render**, not Netlify
3. Confirm [`netlify.toml`](../netlify.toml) proxy → `https://yureka-api.onrender.com/api/:splat`
4. After env changes, trigger a production redeploy so Vite rebuilds without localhost API

## 5. Hubble webhooks

See [`HUBBLE_WEBHOOKS.md`](./HUBBLE_WEBHOOKS.md). Point all four URLs at **Render**, set signature = `HUBBLE_WEBHOOK_SECRET`.

## 6. Smoke tests (Netlify URL)

```bash
curl -sS https://yureka-api.onrender.com/api/health
curl -sS https://yurekaone.netlify.app/api/health
curl -sS https://yurekaone.netlify.app/api/giftcards/health
```

Browser:

- [ ] `https://yurekaone.netlify.app/` loads
- [ ] `/api/health` returns JSON (not HTML / not Suspended)
- [ ] `/dashboard/giftcards` loads catalog when Hubble env is set on Render
- [ ] Place a test order; vouchers appear (or PROCESSING then webhook)

## Why both hosts

| Host | Role |
|---|---|
| Netlify | Static SPA (`yurekaone.netlify.app`) |
| Render | Express, secrets, Hubble webhooks, Supabase service role |
