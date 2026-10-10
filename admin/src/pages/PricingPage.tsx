import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../contexts/AuthContext';
import {
  DEFAULT_PLAN_PRICES,
  fetchPricingOverrides,
  savePricing,
  PlanPriceInput,
} from '../services/pricingService';
import { DollarSign, Save, Lock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

type PriceMap = Record<string, PlanPriceInput>;

const buildInitialPrices = (overrides: Record<string, { priceMonthly?: number; priceAnnual?: number }>): PriceMap => {
  const base: PriceMap = {};
  for (const [planId, plan] of Object.entries(DEFAULT_PLAN_PRICES)) {
    const o = overrides[planId];
    base[planId] = {
      priceMonthly: typeof o?.priceMonthly === 'number' ? o.priceMonthly : plan.priceMonthly,
      priceAnnual: typeof o?.priceAnnual === 'number' ? o.priceAnnual : plan.priceAnnual,
    };
  }
  return base;
};

/**
 * Pricing editor — lets the master admin update the live website prices
 * (public pricing section + website upgrade modal) stored at /pricing.
 */
export const PricingPage: React.FC = () => {
  const { adminSession } = useAdminAuth();
  const { t } = useTranslation();
  const isSuperAdmin = adminSession?.role === 'SUPER_ADMIN';

  const [prices, setPrices] = useState<PriceMap>(() => buildInitialPrices({}));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPricingOverrides().then((overrides) => {
      if (alive) {
        setPrices(buildInitialPrices(overrides));
        setIsLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const handleChange = (planId: string, field: keyof PlanPriceInput, value: string) => {
    const num = Number(value);
    setPrices((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: Number.isFinite(num) && num >= 0 ? num : 0,
      },
    }));
    setSavedAt(null);
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await savePricing(prices, adminSession?.email || 'unknown');
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('[PricingPage] save failed:', err);
      setError(t('pricing.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            {t('pricing.title')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {savedAt && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {t('pricing.savedAt', { time: savedAt })}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!isSuperAdmin || isSaving || isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-colors whitespace-nowrap"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {t('pricing.savePrices')}
          </button>
        </div>
      </div>

      {!isSuperAdmin && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
          <Lock className="w-4 h-4 shrink-0" />
          {t('pricing.readonly')}
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {Object.entries(DEFAULT_PLAN_PRICES).map(([planId, plan]) => {
          const value = prices[planId];
          const savings =
            value.priceMonthly > 0 && value.priceAnnual > 0
              ? Math.round((1 - value.priceAnnual / value.priceMonthly) * 100)
              : 0;

          return (
            <div
              key={planId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5"
            >
              <div className="flex items-center justify-between gap-2 min-w-0">
                <h2 className="text-lg font-bold text-white truncate">{plan.name}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                  {planId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                    {t('pricing.monthly')}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={value?.priceMonthly ?? ''}
                    onChange={(e) => handleChange(planId, 'priceMonthly', e.target.value)}
                    disabled={!isSuperAdmin || isLoading}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold text-lg focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                    {t('pricing.annualPerMonth')}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={value?.priceAnnual ?? ''}
                    onChange={(e) => handleChange(planId, 'priceAnnual', e.target.value)}
                    disabled={!isSuperAdmin || isLoading}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold text-lg focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-4">
                <span>{t('pricing.annualDiscount')}</span>
                <span
                  className={
                    savings > 0
                      ? 'font-bold text-emerald-400'
                      : 'font-bold text-slate-400'
                  }
                >
                  {savings}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="text-xs text-slate-500 animate-pulse">{t('pricing.loading')}</div>
      )}
    </div>
  );
};

export default PricingPage;
