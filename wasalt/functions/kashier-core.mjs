/**
 * Kashier gateway core — shared by:
 *   • wasalt/apps/web/server/index.mjs   (local dev server, zero-dependency Node)
 *   • wasalt/functions/handler.mjs       (production Cloud Function behind Firebase Hosting)
 *
 * Pure logic + fetch calls to Kashier's REST API. No filesystem, no HTTP framework.
 * All credentials come from environment variables (read lazily at call time so the
 * Firebase Functions .env loader and the local .env loader both work):
 *   KASHIER_MODE, KASHIER_MERCHANT_ID, KASHIER_PAYMENT_API_KEY,
 *   KASHIER_SECRET_KEY, KASHIER_APP_URL, KASHIER_WEBHOOK_URL
 *
 * Docs: https://developers.kashier.io/docs/accept-payments/payment-sessions
 *       https://developers.kashier.io/docs/direct-api/hashing
 *       https://developers.kashier.io/docs/webhooks
 */
import crypto from 'node:crypto';

const hex = (buf) => buf.toString('hex');

export function config() {
  const mode = (process.env.KASHIER_MODE || 'test').toLowerCase();
  return {
    mode,
    apiBase: mode === 'live' ? 'https://api.kashier.io' : 'https://test-api.kashier.io',
    merchantId: process.env.KASHIER_MERCHANT_ID || '',
    paymentKey: process.env.KASHIER_PAYMENT_API_KEY || '',
    secretKey: process.env.KASHIER_SECRET_KEY || '',
    appUrl: (process.env.KASHIER_APP_URL || 'http://localhost:5174').replace(/\/+$/, ''),
    webhookUrl: (process.env.KASHIER_WEBHOOK_URL || '').trim(),
  };
}

export function assertConfig() {
  const cfg = config();
  if (!cfg.merchantId || !cfg.paymentKey || !cfg.secretKey) {
    throw new Error(
      'Missing Kashier credentials (KASHIER_MERCHANT_ID / KASHIER_PAYMENT_API_KEY / KASHIER_SECRET_KEY)'
    );
  }
  return cfg;
}

// ── Pricing mirror (keep in sync with packages/config/src/pricingConfig.ts) ──
// Annual is billed as priceAnnual × 12 (matches BillingView copy).
export const PLANS = {
  starter: { name: 'Starter', monthly: 1450, annualMonthly: 1150 },
  pro: { name: 'Professional', monthly: 3850, annualMonthly: 3100 },
  enterprise: { name: 'Enterprise', monthly: 8900, annualMonthly: 7200 },
};

/** Authoritative charge for a plan/cycle. A client-displayed amount (admin price
 *  override from /pricing) is accepted only within [75%, 300%] of the base price. */
export function resolveAmount(planId, billingCycle, clientAmount) {
  const plan = PLANS[planId];
  if (!plan) return null;
  const base = billingCycle === 'annual' ? plan.annualMonthly * 12 : plan.monthly;
  const client = Number(clientAmount);
  if (Number.isFinite(client) && client >= base * 0.75 && client <= base * 3) {
    return Math.round(client * 100) / 100;
  }
  return base;
}

// ── Signature verification ───────────────────────────────────────────────────
function safeEqualHex(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (!/^[a-f0-9]+$/i.test(a) || !/^[a-f0-9]+$/i.test(b)) return false;
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
}

/** Redirect signature: fixed field order, missing → literal "null", keyed with Payment API Key. */
export const REDIRECT_FIELDS = [
  'paymentStatus',
  'cardDataToken',
  'maskedCard',
  'merchantOrderId',
  'orderId',
  'cardBrand',
  'orderReference',
  'transactionId',
  'amount',
  'currency',
];

export function verifyRedirectSignature(query, paymentKey = config().paymentKey) {
  const payload = REDIRECT_FIELDS.map((f) => `${f}=${query?.[f] ?? 'null'}`).join('&');
  const expected = hex(crypto.createHmac('sha256', paymentKey).update(payload).digest());
  return safeEqualHex(expected, String(query?.signature || ''));
}

/** Webhook signature: sort signatureKeys, URL-encode each value only, HMAC with Payment API Key. */
export function verifyWebhookSignature(data, headerSignature, paymentKey = config().paymentKey) {
  if (!data || !Array.isArray(data.signatureKeys) || data.signatureKeys.length === 0) return false;
  const payload = [...data.signatureKeys]
    .sort()
    .map((key) => `${key}=${encodeURIComponent(String(data[key] ?? ''))}`)
    .join('&');
  const expected = hex(crypto.createHmac('sha256', paymentKey).update(payload).digest());
  return safeEqualHex(expected, String(headerSignature || ''));
}

// ── Kashier REST API ─────────────────────────────────────────────────────────
export async function createKashierSession({ order, amount, description, customerEmail, customerRef }) {
  const cfg = assertConfig();
  const body = {
    merchantId: cfg.merchantId,
    order,
    amount: amount.toFixed(2),
    currency: 'EGP',
    merchantRedirect: `${cfg.appUrl}/`,
    failureRedirect: false,
    display: 'en',
    type: 'one-time',
    paymentType: 'credit',
    allowedMethods: 'card,wallet',
    defaultMethod: 'card',
    description,
    expireAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    maxFailureAttempts: 3,
    enable3DS: true,
    // Kashier requires customer.email + customer.reference on every session.
    customer: {
      email: customerEmail || 'billing@wasalt.app',
      reference: customerRef || order,
    },
    ...(cfg.webhookUrl ? { serverWebhook: cfg.webhookUrl } : {}),
  };

  const res = await fetch(`${cfg.apiBase}/v3/payment/sessions`, {
    method: 'POST',
    headers: {
      Authorization: cfg.secretKey,
      'api-key': cfg.paymentKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  if (!res.ok) {
    console.error('[kashier] session create failed', res.status, text.slice(0, 500));
    return { ok: false, status: res.status, error: json || text };
  }

  const sessionUrl = json?.sessionUrl || json?.data?.sessionUrl || json?.url || json?.data?.url;
  if (!sessionUrl) {
    console.error('[kashier] no sessionUrl in response', text.slice(0, 500));
    return { ok: false, status: 502, error: 'No sessionUrl in Kashier response' };
  }
  return { ok: true, sessionUrl, sessionId: json?.sessionId || json?.id || json?.data?.id };
}

/** Best-effort authoritative status lookup for an order reference. */
export async function lookupOrderStatus(orderReference) {
  const cfg = config();
  try {
    const res = await fetch(
      `${cfg.apiBase}/v3/payment/orders?search=${encodeURIComponent(orderReference)}`,
      { headers: { Authorization: cfg.secretKey } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data ?? json?.body ?? json;
    const entry = Array.isArray(data) ? data[0] : Array.isArray(json?.body) ? json.body[0] : data;
    const status = entry?.status ?? entry?.paymentStatus ?? entry?.orderStatus;
    return typeof status === 'string' ? status.toUpperCase() : null;
  } catch (err) {
    console.warn('[kashier] order lookup failed:', err?.message || err);
    return null;
  }
}
