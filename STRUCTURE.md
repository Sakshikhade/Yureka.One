# Yureka.One layout

| Folder | Role |
|---|---|
| `landing/` | Marketing site UI (`/`, `/blogs`, `/brands`, legal, etc.) |
| `app/` | Product UI (`/dashboard`, `/login`, `/admin`, waitlist) |
| `backend/` | Express API (`server.ts`), `lib/`, SQL migrations, scripts |
| `shared/` | Cross-cutting React (auth provider, SEO, footer, errors) |

Root still owns the Vite entry (`index.tsx`, `App.tsx`, `index.html`) that composes landing + app routes and proxies API via `backend/server.ts`.

```bash
pnpm dev    # tsx backend/server.ts → http://localhost:3000
```
