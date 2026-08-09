# GitHub Actions deploy (Netlify + Render)

Push/`workflow_dispatch` on **`main`** runs [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):

1. **CI** — `pnpm lint`
2. **Deploy Netlify** — production build of `yurekaone`
3. **Deploy Render** — redeploy `yureka-one` API
4. **Smoke** — poll `https://yureka-one.onrender.com/api/health`

## One-time secrets (GitHub → Settings → Secrets and variables → Actions)

### Option A — deploy hooks (simplest)

| Secret | Where to create |
|---|---|
| `NETLIFY_BUILD_HOOK` | Netlify → Site → Site configuration → Build & deploy → Build hooks → Add hook (`main`) |
| `RENDER_DEPLOY_HOOK` | Render → **yureka-one** → Settings → Deploy Hook → Create |

### Option B — API tokens

| Secret | Value |
|---|---|
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → Personal access tokens |
| `NETLIFY_SITE_ID` | `75256443-0214-4cf1-adc6-9ff686f75db0` (site `yurekaone`) |
| `RENDER_API_KEY` | [Render → Account → API Keys](https://dashboard.render.com/u/settings?add-api-key) (`rnd_…`) |
| `RENDER_SERVICE_ID` | `srv-d9s97r7avr4c73aojbkg` |

You only need **Option A or Option B** for each host (hooks preferred).

### Optional variables (Settings → Variables)

| Variable | Default |
|---|---|
| `NETLIFY_URL` | `https://yurekaone.netlify.app` |
| `RENDER_URL` | `https://yureka-one.onrender.com` |

## After secrets are set

1. Actions → **CI and Deploy** → **Run workflow**, or push to `main`
2. Confirm Netlify deploy is **Published** and Render is **Live**
3. `curl -sS https://yurekaone.netlify.app/api/health`

App env vars (Supabase, Hubble, `VITE_*`, etc.) stay in **Netlify / Render dashboards** — do not put them in GitHub unless you intentionally build the frontend inside Actions.
