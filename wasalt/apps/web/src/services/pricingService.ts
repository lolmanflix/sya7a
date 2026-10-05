/**
 * Live Pricing Service — website side.
 * The admin dashboard writes plan prices to /pricing/{planId}; this service
 * reads them so the marketing site, plan selection, checkout, and billing
 * modal always show the latest admin-set prices (falling back to the
 * hardcoded PRICING_PLANS defaults when no override exists).
 */
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { rtdb } from './firebaseClient';

export interface PriceOverride {
  priceMonthly?: number;
  priceAnnual?: number;
}

export type PriceOverrides = Record<string, PriceOverride>;

let cachedOverrides: PriceOverrides | null = null;
let inflight: Promise<PriceOverrides> | null = null;

const isValidPrice = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0;

/** Reads /pricing once (module-cached) — safe to call from multiple components. */
export function fetchPriceOverrides(): Promise<PriceOverrides> {
  if (cachedOverrides) return Promise.resolve(cachedOverrides);
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const snap = await get(ref(rtdb, 'pricing'));
      const val = snap.val();
      if (val && typeof val === 'object') {
        const cleaned: PriceOverrides = {};
        for (const [planId, entry] of Object.entries(val as Record<string, unknown>)) {
          if (entry && typeof entry === 'object') {
            const e = entry as PriceOverride;
            cleaned[planId] = {
              ...(isValidPrice(e.priceMonthly) ? { priceMonthly: e.priceMonthly } : {}),
              ...(isValidPrice(e.priceAnnual) ? { priceAnnual: e.priceAnnual } : {}),
            };
          }
        }
        cachedOverrides = cleaned;
        return cleaned;
      }
      cachedOverrides = {};
      return {};
    } catch (err) {
      console.warn('[PricingService] using default prices — override fetch failed:', err);
      inflight = null; // allow retry on next mount
      return {};
    }
  })();

  return inflight;
}

/** React hook: live overrides, re-rendering once prices arrive. */
export function usePriceOverrides(): PriceOverrides {
  const [overrides, setOverrides] = useState<PriceOverrides>(() => cachedOverrides ?? {});

  useEffect(() => {
    let alive = true;
    fetchPriceOverrides().then((next) => {
      if (alive) setOverrides(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  return overrides;
}

/**
 * Returns a copy of PRICING_PLANS with admin-set prices applied.
 * Plans without overrides keep their default prices untouched.
 */
export function applyPriceOverrides<
  T extends { id: string; priceMonthly: number; priceAnnual: number },
>(plans: T[], overrides: PriceOverrides): T[] {
  if (!overrides || Object.keys(overrides).length === 0) return plans;
  return plans.map((plan) => {
    const o = overrides[plan.id];
    if (!o) return plan;
    return {
      ...plan,
      priceMonthly: isValidPrice(o.priceMonthly) ? o.priceMonthly : plan.priceMonthly,
      priceAnnual: isValidPrice(o.priceAnnual) ? o.priceAnnual : plan.priceAnnual,
    };
  });
}
