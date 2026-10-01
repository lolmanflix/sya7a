/**
 * Subscription & Billing Service
 * Manages tiers, billing cycles, and invoice history per company.
 */
import { Subscription } from '@wasalt/types';

const SUBS_STORAGE_KEY = 'wasalt_subscriptions_data';

export async function fetchSubscription(companyId: string): Promise<Subscription> {
  await new Promise((res) => setTimeout(res, 200));

  const sub: Subscription = {
    id: `sub_${companyId}`,
    companyId,
    planId: 'pro',
    status: 'active',
    billingCycle: 'monthly',
    currentPeriodStart: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    currentPeriodEnd: new Date(Date.now() + 16 * 24 * 3600 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
    paymentMethodLast4: '4242',
    invoices: [
      {
        id: 'inv_101',
        date: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
        amount: 79,
        status: 'paid',
        downloadUrl: '#',
      },
      {
        id: 'inv_100',
        date: new Date(Date.now() - 44 * 24 * 3600 * 1000).toISOString(),
        amount: 79,
        status: 'paid',
        downloadUrl: '#',
      },
    ],
  };

  return sub;
}

export async function updatePlan(companyId: string, newPlanId: string): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 400));
  console.log(`[Wasalt Billing] Company ${companyId} upgraded to plan: ${newPlanId}`);
  return true;
}
