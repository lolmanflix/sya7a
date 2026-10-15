/**
 * Wasalt checkout backend — local dev server (zero-dependency Node).
 *
 * All Kashier logic lives in ../../functions/kashier-core.mjs + handler.mjs —
 * the SAME files the production Cloud Function uses — so local behaviour matches
 * https://tracking-72393.web.app exactly. This file only adds:
 *   • .env loading from the app root
 *   • a tiny Node http adapter around handleCheckoutApi (Express-like req/res)
 *   • a file-backed payment ledger + webhook idempotency (local audit only)
 *
 * Run: npm run api   (from wasalt/apps/web)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleCheckoutApi } from '../../../functions/handler.mjs';
import { config, verifyWebhookSignature } from '../../../functions/kashier-core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, '..');

// ── .env loader (no dotenv dependency) ───────────────────────────────────────
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    let value = m[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
}
loadEnvFile(path.join(APP_ROOT, '.env'));

const cfg = config();
if (!cfg.merchantId || !cfg.paymentKey || !cfg.secretKey) {
  console.error(
    '[kashier] Missing credentials — KASHIER_MERCHANT_ID / KASHIER_PAYMENT_API_KEY / KASHIER_SECRET_KEY in .env'
  );
  process.exit(1);
}

const PORT = Number(process.env.KASHIER_SERVER_PORT || 8787);
const LEDGER_FILE = path.join(__dirname, 'payments-ledger.json');

// ── Local payment ledger (audit trail; the Cloud Function keeps none) ────────
function readLedger() {
  try {
    return JSON.parse(fs.readFileSync(LEDGER_FILE, 'utf8'));
  } catch {
    return { payments: {} };
  }
}
function writeLedger(ledger) {
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2));
}

/** Minimal Express-like response writer over node:http. */
function makeResponse(res) {
  const api = {
    status(code) {
      res.statusCode = code;
      return api;
    },
    set(key, value) {
      res.setHeader(key, value);
      return api;
    },
    json(payload) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(payload));
      return api;
    },
    send(body) {
      res.end(body ?? '');
      return api;
    },
  };
  return api;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > 64 * 1024) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      if (chunks.length === 0) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new Error('invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-kashier-signature');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let body = {};
  try {
    body = await readBody(req);
  } catch {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'invalid JSON body' }));
  }

  const reqPath = url.pathname;
  const reqLike = {
    method: req.method,
    path: reqPath,
    query: Object.fromEntries(url.searchParams.entries()),
    body,
    headers: req.headers,
  };
  const resLike = makeResponse(res);

  // ── Local ledger side-effects (not available on Cloud Functions) ───────────
  if (req.method === 'POST' && reqPath === '/api/webhook/kashier') {
    const data = body?.data;
    if (data && verifyWebhookSignature(data, req.headers['x-kashier-signature'])) {
      const order = data.orderReference || data.merchantOrderId || null;
      const status = String(data.status || '').toUpperCase();
      const ledger = readLedger();
      const known = order ? ledger.payments[order] : null;
      if (known && known.webhookStatus === status && status !== 'PENDING') {
        res.statusCode = 409; // already processed — acknowledged per Kashier spec
        return res.end();
      }
      if (order) {
        ledger.payments[order] = {
          ...(known || { order, amount: data.amount, currency: data.currency }),
          event: body.event || null,
          status,
          webhookStatus: status,
          transactionId: data.transactionId || null,
          updatedAt: new Date().toISOString(),
        };
        writeLedger(ledger);
      }
    }
  }

  // Record successful checkouts in the audit ledger.
  if (req.method === 'POST' && reqPath === '/api/checkout') {
    const baseJson = resLike.json.bind(resLike);
    resLike.json = (payload) => {
      try {
        if (payload?.order && payload?.sessionUrl) {
          const ledger = readLedger();
          ledger.payments[payload.order] = {
            ...(ledger.payments[payload.order] || {}),
            order: payload.order,
            planId: payload.planId,
            billingCycle: payload.billingCycle,
            amount: payload.amount,
            currency: payload.currency,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          writeLedger(ledger);
        }
      } catch (err) {
        console.warn('[kashier] ledger write failed:', err?.message || err);
      }
      return baseJson(payload);
    };
  }

  return handleCheckoutApi(reqLike, resLike);
});

server.listen(PORT, () => {
  console.log(`[kashier] checkout backend listening on :${PORT} (${cfg.mode} mode → ${cfg.apiBase})`);
  console.log(
    `[kashier] merchant=${cfg.merchantId} redirect-base=${cfg.appUrl} webhook=${cfg.webhookUrl || '(disabled)'}`
  );
  const redirectHost = new URL(cfg.appUrl).hostname;
  if (redirectHost === 'localhost' || redirectHost === '127.0.0.1' || redirectHost.endsWith('.localhost')) {
    console.warn(
      `[kashier] WARNING: KASHIER_APP_URL (${cfg.appUrl}) points at localhost, which Kashier's API ` +
        'rejects as a merchantRedirect. Session creation will fail.\n' +
        '  Local dev: expose the site publicly and set KASHIER_APP_URL, e.g.\n' +
        '    ngrok http 5174        (or: cloudflared tunnel --url http://localhost:5174)\n' +
        '  then set KASHIER_APP_URL to the https://… tunnel URL. Production: your real domain.'
    );
  }
});
