/**
 * Production HTTP handler for the Kashier checkout API.
 *
 * Expressed as a plain (req, res) function with Express-like semantics so it runs
 * identically behind:
 *   • firebase-functions v2 onRequest (index.mjs)  → production, via Hosting rewrite /api/**
 *   • the local dev adapter (apps/web/server)      → local testing
 *
 * Routes:
 *   POST /api/checkout           create a Kashier payment session → { sessionUrl }
 *   GET  /api/verify?<redirect>  validate the signed redirect Kashier sends the browser back with
 *   POST /api/webhook/kashier    verify x-kashier-signature per spec → 200 / 401
 *   GET  /api/health             liveness + mode
 */
import crypto from 'node:crypto';
import {
  PLANS,
  resolveAmount,
  createKashierSession,
  lookupOrderStatus,
  verifyRedirectSignature,
  verifyWebhookSignature,
  config,
} from './kashier-core.mjs';

function sendJson(res, status, payload) {
  res.status(status).set('Cache-Control', 'no-store').json(payload);
}

export async function handleCheckoutApi(req, res) {
  const path = (req.path || req.url?.split('?')[0] || '').replace(/\/+$/, '') || '/';

  try {
    if (req.method === 'GET' && path === '/api/health') {
      const cfg = config();
      return sendJson(res, 200, { ok: true, mode: cfg.mode, apiBase: cfg.apiBase, merchantId: cfg.merchantId });
    }

    if (req.method === 'POST' && path === '/api/checkout') {
      const { planId, billingCycle, amountEgp, companyId, companyName, email } = req.body || {};

      const plan = PLANS[planId];
      if (!plan) return sendJson(res, 400, { error: `Unknown plan: ${String(planId)}` });
      const cycle = billingCycle === 'annual' ? 'annual' : 'monthly';
      const amount = resolveAmount(planId, cycle, amountEgp);
      if (!amount || amount <= 0) return sendJson(res, 400, { error: 'Invalid amount' });

      const order = `WAS-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      const description = `Wasalt ${plan.name} plan (${cycle})${companyName ? ` — ${companyName}` : ''}`;

      const result = await createKashierSession({
        order,
        amount,
        description,
        customerEmail: email,
        customerRef: companyId || order,
      });
      if (!result.ok) {
        return sendJson(res, 502, {
          error: 'Kashier session creation failed',
          details: result.error,
          kashierStatus: result.status,
        });
      }

      console.log(`[kashier] session created order=${order} amount=${amount} EGP (${cycle} ${planId})`);
      return sendJson(res, 200, {
        order,
        sessionUrl: result.sessionUrl,
        amount,
        currency: 'EGP',
        planId,
        billingCycle: cycle,
      });
    }

    if (req.method === 'GET' && path === '/api/verify') {
      const query = req.query || {};
      if (!query.paymentStatus) return sendJson(res, 400, { error: 'paymentStatus missing' });

      const signatureValid = verifyRedirectSignature(query);
      const order = query.orderReference || query.merchantOrderId || null;

      // The redirect signature covers paymentStatus, so a valid signature makes the
      // status trustworthy; the order lookup is defence-in-depth and fills in gaps.
      let status = String(query.paymentStatus || '').toUpperCase();
      const lookedUp = order ? await lookupOrderStatus(order) : null;
      if (lookedUp) status = lookedUp;

      return sendJson(res, 200, {
        signatureValid,
        status:
          status === 'SUCCESS' || status === 'FAILURE' || status === 'PENDING' ? status : 'UNKNOWN',
        order,
        transactionId: query.transactionId || null,
        amount: query.amount || null,
        currency: query.currency || null,
        lookedUp,
      });
    }

    if (req.method === 'POST' && path === '/api/webhook/kashier') {
      const body = req.body || {};
      const data = body.data;
      const event = body.event || null;
      const signatureHeader =
        req.headers?.['x-kashier-signature'] || req.headers?.['X-Kashier-Signature'] || null;

      if (!data || !verifyWebhookSignature(data, signatureHeader)) {
        console.warn('[kashier] webhook rejected: bad signature');
        return sendJson(res, 401, { error: 'invalid signature' });
      }

      const status = String(data.status || '').toUpperCase();
      const order = data.orderReference || data.merchantOrderId || null;
      console.log(`[kashier] webhook event=${event} status=${status} order=${order}`);
      // Acknowledge with 200 so Kashier stops retrying (Cloud Function has no
      // persistent ledger; the redirect /api/verify path reconciles state).
      res.status(200);
      return res.send('');
    }

    return sendJson(res, 404, { error: 'not found' });
  } catch (err) {
    console.error('[kashier] unhandled:', err?.message || err);
    return sendJson(res, 500, { error: 'internal error' });
  }
}
