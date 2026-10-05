/**
 * Pricing Service — RTDB-backed live plan pricing.
 * Prices live at /pricing/{planId} and override the hardcoded defaults,
 * so the master admin can change website prices from this dashboard.
 */
import { ref, get, update } from 'firebase/database';
import { database } from '../config/firebase';

export interface PlanPriceInput {
  priceMonthly: number;
  priceAnnual: number;
}

export interface PlanPriceRecord extends PlanPriceInput {
  updatedAt?: string;
  updatedBy?: string;
}

/** Fallback defaults — mirror of packages/config PRICING_PLANS. */
export const DEFAULT_PLAN_PRICES: Record<
  string,
  { name: string; priceMonthly: number; priceAnnual: number }
> = {
  starter: { name: 'Starter', priceMonthly: 1450, priceAnnual: 1150 },
  pro: { name: 'Professional', priceMonthly: 3850, priceAnnual: 3100 },
  enterprise: { name: 'Enterprise', priceMonthly: 8900, priceAnnual: 7200 },
};

/**
 * Reads the live pricing overrides from /pricing.
 * Missing entries fall back to DEFAULT_PLAN_PRICES.
 */
export async function fetchPricingOverrides(): Promise<
  Record<string, Partial<PlanPriceRecord>>
> {
  try {
    const snap = await get(ref(database, 'pricing'));
    if (!snap.exists()) return {};
    const val = snap.val();
    return typeof val === 'object' && val !== null ? val : {};
  } catch (err) {
    console.error('[PricingService] fetch error:', err);
    return {};
  }
}

/**
 * Persists prices for all plans to /pricing (merge update).
 * Only the SUPER_ADMIN page should call this.
 */
export async function savePricing(
  prices: Record<string, PlanPriceInput>,
  updatedBy: string
): Promise<void> {
  const now = new Date().toISOString();
  const payload: Record<string, PlanPriceRecord> = {};
  for (const [planId, input] of Object.entries(prices)) {
    payload[planId] = {
      priceMonthly: Math.max(0, Math.round(input.priceMonthly)),
      priceAnnual: Math.max(0, Math.round(input.priceAnnual)),
      updatedAt: now,
      updatedBy,
    };
  }
  await update(ref(database, 'pricing'), payload);
}
