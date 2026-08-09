#!/usr/bin/env node
/**
 * Resume Render yureka-api and sync production env vars from local .env.
 *
 * Usage:
 *   export RENDER_API_KEY=rnd_...
 *   node scripts/go-live-render.mjs
 *
 * Optional:
 *   RENDER_SERVICE_ID=srv-...   (skip lookup)
 *   DRY_RUN=1                   (print actions only)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const apiKey = process.env.RENDER_API_KEY;
const dryRun = process.env.DRY_RUN === '1';

if (!apiKey) {
  console.error('Missing RENDER_API_KEY.');
  console.error('Create one: https://dashboard.render.com/u/settings?add-api-key');
  console.error('Then: export RENDER_API_KEY=rnd_... && node scripts/go-live-render.mjs');
  process.exit(1);
}

function loadDotEnv(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

const env = loadDotEnv(path.join(root, '.env'));

const REQUIRED = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'HUBBLE_CLIENT_ID',
  'HUBBLE_CLIENT_SECRET',
  'HUBBLE_API_BASE',
  'HUBBLE_WEBHOOK_SECRET',
  'ADMIN_PASSWORD',
  'ADMIN_EMAILS',
  'ADMIN_SESSION_SECRET',
];

const OPTIONAL = [
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'CUELINKS_API_TOKEN',
  'CUELINKS_API_BASE',
  'CUELINKS_OFFERS_PATH',
  'CUELINKS_INDIA_ONLY',
];

async function render(pathname, { method = 'GET', body } = {}) {
  const res = await fetch(`https://api.render.com/v1${pathname}`, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const err = new Error(`Render ${method} ${pathname} → ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function missingKeys(keys) {
  return keys.filter((k) => !env[k]);
}

async function findService() {
  if (process.env.RENDER_SERVICE_ID) {
    return { id: process.env.RENDER_SERVICE_ID, name: '(from RENDER_SERVICE_ID)' };
  }
  const list = await render('/services?limit=50&name=yureka-api');
  const rows = Array.isArray(list) ? list : [];
  const match = rows.find((row) => {
    const s = row.service || row;
    return s.name === 'yureka-api' || (s.serviceDetails?.url || '').includes('yureka-api');
  });
  if (!match) {
    // broader search
    const all = await render('/services?limit=100');
    const found = (Array.isArray(all) ? all : []).find((row) => {
      const s = row.service || row;
      return String(s.name || '').toLowerCase().includes('yureka');
    });
    if (!found) {
      throw new Error('No yureka-api service found. Set RENDER_SERVICE_ID=srv-...');
    }
    const s = found.service || found;
    return { id: s.id, name: s.name, suspended: s.suspended, url: s.serviceDetails?.url };
  }
  const s = match.service || match;
  return { id: s.id, name: s.name, suspended: s.suspended, url: s.serviceDetails?.url };
}

async function upsertEnvVars(serviceId, pairs) {
  const existing = await render(`/services/${serviceId}/env-vars`);
  const byKey = new Map();
  for (const row of Array.isArray(existing) ? existing : []) {
    const ev = row.envVar || row;
    if (ev?.key) byKey.set(ev.key, ev);
  }

  for (const [key, value] of pairs) {
    if (dryRun) {
      console.log(`[dry-run] set ${key}=***`);
      continue;
    }
    if (byKey.has(key)) {
      await render(`/services/${serviceId}/env-vars/${encodeURIComponent(key)}`, {
        method: 'PUT',
        body: { value },
      });
      console.log(`updated ${key}`);
    } else {
      await render(`/services/${serviceId}/env-vars`, {
        method: 'POST',
        body: { key, value },
      });
      console.log(`created ${key}`);
    }
  }
}

async function main() {
  const miss = missingKeys(REQUIRED);
  if (miss.length) {
    console.error('Missing required keys in .env:', miss.join(', '));
    process.exit(1);
  }

  const service = await findService();
  console.log(`Found service: ${service.name} (${service.id})`);
  if (service.url) console.log(`URL: ${service.url}`);

  if (dryRun) {
    console.log('[dry-run] would resume + sync env');
  } else {
    try {
      await render(`/services/${service.id}/resume`, { method: 'POST' });
      console.log('Resume requested (202).');
    } catch (e) {
      if (e.status === 400 || e.status === 409) {
        console.log(`Resume skipped (${e.status}) — may already be active.`);
      } else {
        throw e;
      }
    }
  }

  const pairs = [
    ['NODE_ENV', 'production'],
    ...REQUIRED.map((k) => [k, env[k]]),
    ...OPTIONAL.filter((k) => env[k]).map((k) => [k, env[k]]),
  ];

  await upsertEnvVars(service.id, pairs);

  if (!dryRun) {
    try {
      await render(`/services/${service.id}/deploys`, {
        method: 'POST',
        body: { clearCache: 'do_not_clear' },
      });
      console.log('Deploy triggered.');
    } catch (e) {
      console.warn('Could not trigger deploy:', e.status || e.message);
      console.warn('Trigger a Manual Deploy from the Render dashboard if needed.');
    }
  }

  console.log('\nNext: wait for deploy, then:');
  console.log('  curl -sS https://yureka-api.onrender.com/api/health');
  console.log('\nHubble webhook signature must equal HUBBLE_WEBHOOK_SECRET.');
  console.log('See docs/HUBBLE_WEBHOOKS.md');
}

main().catch((e) => {
  console.error(e.message);
  if (e.data) console.error(JSON.stringify(e.data, null, 2));
  process.exit(1);
});
