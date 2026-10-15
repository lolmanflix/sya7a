/**
 * kashierService — thin client for the checkout backend (server/index.mjs).
 * The Kashier secret keys never reach the browser; only the backend talks to Kashier.
 *
 * Redirect flow: POST /api/checkout → { sessionUrl } → browser is sent to Kashier's
 * hosted page → Kashier redirects back to the site with signed query params →
 * GET /api/verify re-checks the signature server-side before we activate anything.
 */

export type BillingCycle = 'monthly' | 'annual';
export type PaymentContext = 'onboarding' | 'billing';

export interface CheckoutRequest {
  planId: string;
  billingCycle: BillingCycle;
  companyId: string;
  companyName?: string;
  amountEgp?: number;
  email?: string;
}

export interface CheckoutSession {
  order: string;
  sessionUrl: string;
  amount: number;
  currency: string;
}

export interface VerifyResult {
  signatureValid: boolean;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING' | 'UNKNOWN';
  order: string | null;
  transactionId: string | null;
  amount: string | null;
  currency: string | null;
}

/** What we need to resume after the browser comes back from Kashier. */
export interface PendingCheckout {
  context: PaymentContext;
  order: string;
  planId: string;
  billingCycle: BillingCycle;
  companyId: string;
  companyName?: string;
}

const PENDING_KEY = 'wasalt.pendingCheckout';

async function parseJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text || `HTTP ${res.status}` };
  }
}

export async function createCheckout(req: CheckoutRequest): Promise<CheckoutSession> {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const json = await parseJson(res);
  if (!res.ok || !json.sessionUrl) {
    throw new Error(json?.details?.error || json?.error || 'Failed to start checkout');
  }
  return json as CheckoutSession;
}

/** Validate the signed redirect params Kashier sent back with. */
export async function verifyPayment(params: Record<string, string>): Promise<VerifyResult> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/verify?${qs}`);
  const json = await parseJson(res);
  if (!res.ok) throw new Error(json?.error || 'Verification failed');
  return json as VerifyResult;
}

export function savePendingCheckout(pending: PendingCheckout): void {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    /* storage unavailable — activation will fall back to the webhook path */
  }
}

export function readPendingCheckout(): PendingCheckout | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingCheckout) : null;
  } catch {
    return null;
  }
}

export function clearPendingCheckout(): void {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* noop */
  }
}

/** True when the current page URL carries a Kashier redirect payload. */
export function readRedirectParams(): Record<string, string> | null {
  const sp = new URLSearchParams(window.location.search);
  if (!sp.get('paymentStatus')) return null;
  return Object.fromEntries(sp.entries());
}

/** Strips the payment query params from the URL without a navigation. */
export function cleanRedirectParamsFromUrl(): void {
  window.history.replaceState(null, '', window.location.pathname + window.location.hash);
}
