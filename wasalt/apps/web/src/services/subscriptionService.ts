/**
 * Subscription & Billing Service — Real RTDB
 * Stores subscription state in /subscriptions/{companyId}/ in Firebase RTDB.
 * Also updates /companies/{companyId}/subscriptionPlanId for admin dashboard visibility.
 *
 * Payment flow for Egyptian market:
 *   1. User selects plan → status written as 'pending_payment'
 *   2. User sees bank transfer / Vodafone Cash instructions on DownloadPage
 *   3. Master admin manually sets status → 'active' via admin dashboard
 */
import { ref, set, get, update } from 'firebase/database';
import { rtdb } from './firebaseClient';
import { Subscription } from '@wasalt/types';

/**
 * Fetches the current subscription for a company from RTDB.
 */
export async function fetchSubscription(companyId: string): Promise<Subscription | null> {
  try {
    const snap = await get(ref(rtdb, `subscriptions/${companyId}`));
    if (!snap.exists()) return null;
    return snap.val() as Subscription;
  } catch (err) {
    console.error('[SubscriptionService] fetchSubscription error:', err);
    return null;
  }
}

/**
 * Records a plan selection from the onboarding wizard.
 * Sets status to 'pending_payment' — master admin activates after payment confirmation.
 */
export async function recordPlanSelection(
  companyId: string,
  planId: string,
  billingCycle: 'monthly' | 'annual' = 'monthly'
): Promise<Subscription> {
  const now = new Date().toISOString();
  const periodEnd = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(); // 14-day trial

  const subscription: Subscription = {
    id: `sub_${companyId}`,
    companyId,
    planId,
    status: 'trialing', // 14-day free trial, then pending payment
    billingCycle,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: false,
    invoices: [],
  };

  // Write subscription record
  await set(ref(rtdb, `subscriptions/${companyId}`), {
    ...subscription,
    selectedAt: now,
    paymentStatus: 'pending', // Awaiting manual confirmation for Egyptian market
  });

  // Update company's plan fields so admin dashboard sees it immediately
  await update(ref(rtdb, `companies/${companyId}`), {
    subscriptionPlanId: planId,
    subscriptionStatus: 'trialing',
    updatedAt: now,
  });

  return subscription;
}

/**
 * Updates the plan for an existing company subscription.
 * Used from the billing settings in the dashboard.
 */
export async function updatePlan(
  companyId: string,
  newPlanId: string,
  billingCycle?: 'monthly' | 'annual'
): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    await update(ref(rtdb, `subscriptions/${companyId}`), {
      planId: newPlanId,
      ...(billingCycle ? { billingCycle } : {}),
      updatedAt: now,
      paymentStatus: 'pending',
    });
    await update(ref(rtdb, `companies/${companyId}`), {
      subscriptionPlanId: newPlanId,
      updatedAt: now,
    });
    return true;
  } catch (err) {
    console.error('[SubscriptionService] updatePlan error:', err);
    return false;
  }
}

/**
 * Called by master admin to activate a subscription after payment is confirmed.
 */
export async function activateSubscription(companyId: string): Promise<void> {
  const now = new Date().toISOString();
  const periodEnd = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
  await update(ref(rtdb, `subscriptions/${companyId}`), {
    status: 'active',
    paymentStatus: 'confirmed',
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    confirmedAt: now,
  });
  await update(ref(rtdb, `companies/${companyId}`), {
    subscriptionStatus: 'active',
    updatedAt: now,
  });
}
