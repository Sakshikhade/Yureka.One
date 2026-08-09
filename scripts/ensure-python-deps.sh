#!/usr/bin/env bash
# Ensure Render (or any host) has a venv with scanner deps.
# Safe to run on every start — no-ops when packages already import.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
VENV_PY="$ROOT/venv/bin/python3"
REQ="$ROOT/backend/python-requirements.txt"

need_install=0
if [[ ! -x "$VENV_PY" ]]; then
  need_install=1
elif ! "$VENV_PY" -c "import googleapiclient, google.oauth2.credentials, bs4, pypdf" >/dev/null 2>&1; then
  need_install=1
fi

if [[ "$need_install" -eq 1 ]]; then
  echo "[python] installing scanner deps into ./venv ..."
  python3 -m venv "$ROOT/venv"
  "$ROOT/venv/bin/pip" install --upgrade pip
  "$ROOT/venv/bin/pip" install -r "$REQ"
fi

"$VENV_PY" -c "import googleapiclient; print('[python] ok', '$VENV_PY')"
