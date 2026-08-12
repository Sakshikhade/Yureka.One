# EC2 all-in-one deploy (frontend + API)

**Instance:** `i-0fc71adcbbce91e3e`  
**Public IP:** `13.57.223.228` (use an **Elastic IP** so it doesn’t change on stop/start)

Express serves the Vite build (`dist/`) and `/api/*` on one process — no Netlify required.

---

## 1. Fix SSH (if `Permission denied (publickey)`)

Port 22 is reachable; the key must match the instance **Key pair name** in EC2.

1. EC2 → Instances → `i-0fc71adcbbce91e3e` → **Details** → note **Key pair name**.
2. That name must be the pair for `yureka.pem`. If you lost the key, you cannot SSH with a new `.pem` unless you:
   - Use **EC2 Instance Connect** (browser) → connect as `ubuntu`, then paste your **public** key into `~/.ssh/authorized_keys`, or
   - Stop instance → **Actions → Instance settings → Edit user data** / replace root volume (last resort).

Local test:

```bash
chmod 400 yureka.pem
ssh -i yureka.pem ubuntu@13.57.223.228
```

Amazon Linux AMI uses `ec2-user` instead of `ubuntu`:

```bash
EC2_USER=ec2-user ssh -i yureka.pem ec2-user@13.57.223.228
```

**Never commit** `yureka.pem` (already in `.gitignore`).

---

## 2. Security group (inbound)

| Port | Source | Purpose |
|------|--------|---------|
| 22 | Your IP | SSH |
| 80 | 0.0.0.0/0 | HTTP |
| 443 | 0.0.0.0/0 | HTTPS (after certbot) |

Without 80/443 open, the site will **timeout** from the browser.

---

## 3. Bootstrap (first time on the server)

**Option A — SSH**

```bash
git clone https://github.com/Sakshikhade/Yureka.One.git /opt/yureka-one
cd /opt/yureka-one
cp .env.example .env   # fill from local .env — never commit
nano .env
bash scripts/ec2/bootstrap.sh
```

**Option B — EC2 Instance Connect** (no local SSH): paste the same commands in the browser terminal.

Set in `.env` before `pnpm build`:

- `NODE_ENV=production`
- `PORT=3000`
- `APP_ORIGIN=http://13.57.223.228` (or `https://yureka.one` later)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` / publishable key
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `HUBBLE_*`, `GMAIL_*`, `ADMIN_*`, `GOOGLE_*`

---

## 4. Deploy updates from laptop

```bash
cd Yureka.One
# copy .env to server once:
scp -i yureka.pem .env ubuntu@13.57.223.228:/opt/yureka-one/.env

EC2_HOST=13.57.223.228 EC2_KEY=./yureka.pem ./scripts/ec2/deploy-from-local.sh
```

---

## 5. HTTPS + domain

1. Point DNS **A record** → Elastic IP (recommended) or `13.57.223.228`.
2. On the server:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yureka.one -d www.yureka.one
```

3. Update `APP_ORIGIN`, Google OAuth redirects, Supabase Auth URLs, Hubble webhooks to `https://yureka.one`.

---

## 6. Smoke tests

```bash
curl -s http://13.57.223.228/api/health
curl -s "http://13.57.223.228/api/v1/auth/status?email=you@gmail.com"
```

Browser: `/`, `/login`, `/join-waitlist`, `/dashboard` (approved user).

---

## 7. Retire Netlify / Render

After EC2 is stable:

- Point production DNS to EC2 only.
- Update GitHub Actions (remove Netlify job; optional SSH deploy).
- Hubble webhooks → `https://your-domain/api/...` on this host.
