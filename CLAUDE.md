# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (Express + Vite middleware on port 3000)
pnpm build      # Generate sitemap + Vite production build
pnpm lint       # TypeScript type-check only (tsc --noEmit) — no ESLint configured
pnpm preview    # Preview production build locally
```

There are no tests. `pnpm lint` is the only automated quality check.

For the Python email scanner:
```bash
# Create and activate venv, then install deps
python3 -m venv venv && source venv/bin/activate
pip install -r backend/requirements.txt
```

## Architecture

### Dual-Mode Server (`server.ts`)

The app runs as a single Express server:
- **Dev**: Express serves API routes; Vite runs as middleware (`middlewareMode: true`)
- **Prod**: Express serves the pre-built `dist/` folder as static files + SPA fallback

In production (Netlify), `netlify.toml` proxies all `/api/*` calls to `https://yureka-api.onrender.com` — the Render deployment runs `server.ts` directly with `tsx`.

### Supabase as the Entire Backend

There is no separate database or ORM layer. All persistence goes through two Supabase clients defined in `supabase.ts`:
- `supabase` — anon key, respects Row Level Security (RLS), used for all public-facing reads
- `supabaseAdmin` — service role key, bypasses RLS, used exclusively in `AdminDashboard` and admin service functions

All data-access logic lives in `services/supabaseService.ts`, which wraps every Supabase call in `withRetry()` (3 retries with exponential backoff). Use `fetchXxxPublic()` functions for user-facing reads and `fetchXxxAdmin()` functions for admin writes.

### Global State via `SupabaseProvider`

`components/SupabaseProvider.tsx` is the single React context that holds:
- Auth state: `user`, `session`, `currentUserStatus` (`none | pending | accepted | admin | loading | rejected | on-hold`)
- CMS data: `cards`, `blogs`, `reviews`, `waitlist`, `team`, `cardContributions`
- Financial ledger: `ledgerTransactions`, `ledgerLoading`, `syncLedger()`

`currentUserStatus` drives routing in `App.tsx` via `ProtectedRoute`. The `/dashboard/*` routes are gated — `pending`/`on-hold`/`rejected` users get redirected to `/waiting`, unauthenticated users to `/login`.

### Route Architecture (`App.tsx`)

All pages are lazy-loaded with `lazyWithRetry()` — a wrapper that auto-refreshes the page once on chunk-load failure (handles hash mismatches after new deploys).

Layout rules in `AppContent`:
- Admin (`/admin`) and Dashboard (`/dashboard/*`) routes: no Navbar, no Footer, no TopBanner
- Home (`/`) route: no Footer
- All other routes: full layout with Navbar + Footer

### Admin Dashboard (`components/AdminDashboard.tsx`)

The admin panel is accessible at `/admin` (no auth guard — it relies on hardcoded email checks in the component and `/api/auth/admin-check`). It is decomposed into sub-components under `components/admin/`:
- `AdminBlogsTab`, `AdminCardsTab`, `AdminReviewsTab` — CMS content management with full CRUD and draft/scheduled publish support
- `AdminWaitlistTab` — user approval workflow (pending → accepted/rejected/on-hold), triggers onboarding email via `/api/notify-team-member`
- `AdminNotificationsTab` — push notifications to users
- `AdminTrashTab` — soft-delete recovery ("Trash Engine")
- `AdminUpdatesTab` — platform updates/changelog

### Financial Ledger / Email Scanner

`/api/scan-email` spawns `scripts/scanner.py` as a child process. The Python script uses the Gmail API + Google People API to extract transactions from emails, then:
1. Persists profile to `waitlist` table and transactions to `financial_ledger` table in Supabase
2. Caches results to `data/financial_cache.json` as a local fallback

The server schedules a daily sync at 12:00 PM local time via `setInterval`.

In the frontend, `syncLedger()` in `SupabaseProvider` first checks `localStorage` cache (`yureka_financial_ledger_<email>`), then hits `/api/financial-ledger`, using `https://yureka-api.onrender.com` as the API base in production.

### Supabase Tables

| Table | Purpose |
|---|---|
| `cards` | Credit card catalogue (published/draft) |
| `blogs` | Journal posts with scheduled publish support |
| `reviews` | Card user reviews |
| `waitlist` | User onboarding queue with status workflow |
| `users` | Admin/team members with roles |
| `newsletters` | Email subscribers |
| `financial_ledger` | Parsed Gmail transactions per user |
| `platform_notifications` | Admin-pushed notifications |
| `audit_logs` | Admin action history |

### Theming

Tailwind is configured with a dark-mode-first design system (despite the class names suggesting otherwise):
- `cream` = `#0a0a0a` (near-black background)
- `clay` = `#34d399` (emerald green — primary accent/CTA color)
- `surface` = `#111111`, `surface-hi` = `#1a1a1a`
- `ink` = `rgba(255, 255, 255, 0.9)` (body text)

### Path Alias

`@/` maps to the repo root (configured in both `vite.config.ts` and `tsconfig.json`).

### Static Card Data

`data.ts` contains `featuredCards: Card[]` — a hardcoded fallback set used when Supabase is unavailable or for initial render before fetch completes.

### Sitemap Generation

`scripts/generate-sitemap.ts` runs at build time (`npm run build`) to generate `public/sitemap.xml`. It fetches live card and blog slugs from Supabase to build dynamic routes.

## Environment Variables

Required in `.env` (Vite prefix for client-side access):

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_SERVICE_ROLE_KEY   # Admin-only operations; optional (falls back to anon)
VITE_GOOGLE_CLIENT_ID            # Gmail OAuth
VITE_GEMINI_API_KEY              # YurekaAI page
GOOGLE_CLIENT_ID                 # Server-side OAuth
GOOGLE_CLIENT_SECRET
GMAIL_USER                       # Nodemailer sender
GMAIL_APP_PASSWORD
```
