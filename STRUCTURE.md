# Yureka.One layout

| Folder | Role | Package |
|---|---|---|
| `landing/` | Marketing site UI (`/`, `/blogs`, `/brands`, legal, etc.) | `@yureka/landing` |
| `app/` | Product UI (`/dashboard`, `/login`, `/admin`, waitlist) | `@yureka/app` |
| `backend/` | Express API (`server.ts`), `lib/`, SQL migrations, scripts | `@yureka/backend` |
| `shared/` | Cross-cutting React (auth provider, SEO, footer, errors) | `@yureka/shared` |

Root still owns the Vite entry (`index.tsx`, `App.tsx`, `index.html`) that composes landing + app routes and proxies API via `backend/server.ts`. Each folder has its own `package.json` listing required dependencies; install from the repo root.

```bash
pnpm install
pnpm dev    # tsx backend/server.ts → http://localhost:3000
```
