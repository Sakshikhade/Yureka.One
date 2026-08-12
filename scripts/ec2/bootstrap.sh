#!/usr/bin/env bash
# First-time EC2 setup for Yureka.One (Ubuntu 22.04/24.04).
# Run on the instance as ubuntu (or ec2-user on Amazon Linux — adjust paths).
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/yureka-one}"
REPO="${REPO:-https://github.com/Sakshikhade/Yureka.One.git}"
BRANCH="${BRANCH:-main}"
DOMAIN="${DOMAIN:-}"   # e.g. yureka.one — leave empty to use IP-only HTTP

echo "[bootstrap] Yureka.One EC2 bootstrap → $APP_DIR"

if [[ $EUID -ne 0 ]]; then
  SUDO=sudo
else
  SUDO=
fi

export DEBIAN_FRONTEND=noninteractive
$SUDO apt-get update -qq
$SUDO apt-get install -y -qq git curl ca-certificates nginx python3 python3-venv python3-pip build-essential

# Node 20 via NodeSource
if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO -E bash -
  $SUDO apt-get install -y -qq nodejs
fi

# pnpm
if ! command -v pnpm >/dev/null; then
  corepack enable || true
  corepack prepare pnpm@9.15.0 --activate || npm install -g pnpm@9.15.0
fi

$SUDO mkdir -p "$APP_DIR"
$SUDO chown -R "${SUDO_USER:-ubuntu}:$(id -gn)" "$APP_DIR" 2>/dev/null || true

if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone --branch "$BRANCH" --depth 1 "$REPO" "$APP_DIR"
fi

cd "$APP_DIR"

if [[ ! -f .env ]]; then
  echo "[bootstrap] Copy .env.example → .env and fill secrets before starting."
  cp .env.example .env
  echo "[bootstrap] REQUIRED: edit $APP_DIR/.env (Supabase, Hubble, ADMIN_*, APP_ORIGIN)"
fi

# shellcheck disable=SC1091
set -a
source .env 2>/dev/null || true
set +a

pnpm install --frozen-lockfile
pnpm run build
bash scripts/ensure-python-deps.sh

# systemd
$SUDO cp scripts/ec2/yureka.service /etc/systemd/system/yureka.service
$SUDO sed -i "s|/opt/yureka-one|$APP_DIR|g" /etc/systemd/system/yureka.service
$SUDO systemctl daemon-reload
$SUDO systemctl enable yureka
$SUDO systemctl restart yureka

# nginx
$SUDO cp scripts/ec2/nginx-yureka.conf /etc/nginx/sites-available/yureka
if [[ -n "$DOMAIN" ]]; then
  $SUDO sed -i "s/server_name _;/server_name $DOMAIN www.$DOMAIN;/" /etc/nginx/sites-available/yureka
fi
$SUDO ln -sf /etc/nginx/sites-available/yureka /etc/nginx/sites-enabled/yureka
$SUDO rm -f /etc/nginx/sites-enabled/default
$SUDO nginx -t
$SUDO systemctl enable nginx
$SUDO systemctl restart nginx

echo "[bootstrap] Done. Check:"
echo "  curl -s http://127.0.0.1:3000/api/health"
echo "  curl -s http://127.0.0.1/api/health"
if [[ -n "$DOMAIN" ]]; then
  echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi
