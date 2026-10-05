import { ref, get, update } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Subscription record stored in /subscriptions/{companyId}/ by the website
 * onboarding flow (shared RTDB node).
 */
export interface SubscriptionRecord {
  id: string;
  companyId: string;
  planId: string;
  status: string;
  billingCycle?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  paymentStatus?: string;
  selectedAt?: string;
  confirmedAt?: string;
}

/**
 * Reads a company's subscription from /subscriptions/{companyId}/.
 */
export async function fetchSubscription(companyId: string): Promise<SubscriptionRecord | null> {
  try {
    const snap = await get(ref(database, `subscriptions/${companyId}`));
    if (!snap.exists()) return null;
    return snap.val() as SubscriptionRecord;
  } catch (err) {
    console.error('[subscriptionsService] fetchSubscription error:', err);
    return null;
  }
}

/**
 * Manually activates a subscription after payment is confirmed by the
 * master admin (Egyptian market: bank transfer / Vodafone Cash).
 * Updates both /subscriptions/{companyId}/ and /companies/{companyId}/
 * so the website and Electron app reflect the change immediately.
 */
export async function activateSubscription(companyId: string): Promise<void> {
  const now = new Date().toISOString();
  const periodEnd = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();

  await update(ref(database, `subscriptions/${companyId}`), {
    status: 'active',
    paymentStatus: 'confirmed',
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    confirmedAt: now,
  });

  await update(ref(database, `companies/${companyId}`), {
    subscriptionStatus: 'active',
    updatedAt: now,
  });
}
