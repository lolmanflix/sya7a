import React, { useMemo, useState } from 'react';
import { PRICING_PLANS } from '@wasalt/config';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { usePriceOverrides, applyPriceOverrides } from '../../services/pricingService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { X, ShieldCheck, Lock, ArrowRight, ExternalLink, AlertCircle } from 'lucide-react';
import {
  createCheckout,
  BillingCycle,
  PaymentContext,
  savePendingCheckout,
} from '../../services/kashierService';

interface PaymentCheckoutProps {
  planId: string;
  billingCycle?: BillingCycle;
  companyId: string;
  companyName?: string;
  /** 'onboarding' after signup, 'billing' for an in-dashboard upgrade. */
  context?: PaymentContext;
  /** User chose "pay later" / closed the modal — continue without paying. */
  onExit: () => void;
}

/** Formatted amount for the given plan + cycle (annual = priceAnnual × 12). */
function formatAmount(priceMonthly: number, priceAnnual: number, cycle: BillingCycle) {
  return cycle === 'annual' ? priceAnnual * 12 : priceMonthly;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  planId,
  billingCycle: initialCycle = 'monthly',
  companyId,
  companyName,
  context = 'onboarding',
  onExit,
}) => {
  const { language } = useLanguageTheme();
  const currencySymbol = language === 'ar' ? 'ج.م' : 'EGP';

  const [cycle, setCycle] = useState<BillingCycle>(initialCycle);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live admin-set prices from the admin dashboard (server re-validates the charge).
  const overrides = usePriceOverrides();
  const plan = useMemo(
    () => applyPriceOverrides(PRICING_PLANS, overrides).find((p) => p.id === planId),
    [overrides, planId]
  );

  const amount = plan ? formatAmount(plan.priceMonthly, plan.priceAnnual, cycle) : 0;

  const startPayment = async () => {
    if (!plan || isPaying) return;
    setError(null);
    setIsPaying(true);
    try {
      const session = await createCheckout({
        planId: plan.id,
        billingCycle: cycle,
        companyId,
        companyName,
        amountEgp: amount,
      });
      // Remember enough context to activate the plan when the browser returns.
      savePendingCheckout({
        context,
        order: session.order,
        planId: plan.id,
        billingCycle: cycle,
        companyId,
        companyName,
      });
      window.location.assign(session.sessionUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start checkout');
      setIsPaying(false);
    }
  };

  if (!plan) {
    return null;
  }

  const features =
    language === 'ar'
      ? plan.features.slice(0, 4).map((f) => f.text)
      : plan.features.slice(0, 4).map((f) => f.text);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={isPaying ? undefined : onExit} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'إتمام الاشتراك' : 'Complete your subscription'}
                </h3>
                <Badge variant="neutral">{cycle === 'annual' ? (language === 'ar' ? 'سنوي' : 'Annual') : language === 'ar' ? 'شهري' : 'Monthly'}</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'خطة' : 'Plan'}{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">{plan.name}</span>
                {companyName ? ` · ${companyName}` : ''}
              </p>
            </div>
            <button
              onClick={onExit}
              disabled={isPaying}
              aria-label="Close"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Billing cycle toggle */}
          <div className="mt-4 flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 w-fit text-xs font-semibold">
            {(['monthly', 'annual'] as BillingCycle[]).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                disabled={isPaying}
                className={`px-3.5 py-1.5 rounded-md transition-colors ${
                  cycle === c
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {c === 'monthly'
                  ? language === 'ar'
                    ? 'شهري'
                    : 'Monthly'
                  : language === 'ar'
                    ? 'سنوي'
                    : 'Annual'}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">
              {language === 'ar' ? 'الإجمالي' : 'Total'}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {amount.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{currencySymbol}</span>
                <span className="text-[11px] text-slate-500">
                  {cycle === 'annual'
                    ? language === 'ar'
                      ? '/سنة'
                      : '/year'
                    : language === 'ar'
                      ? '/شهرياً'
                      : '/month'}
                </span>
              </div>
              {cycle === 'annual' && (
                <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  {language === 'ar'
                    ? `وفّر ${(plan.priceMonthly * 12 - amount).toLocaleString()} ${currencySymbol} سنوياً`
                    : `Save ${(plan.priceMonthly * 12 - amount).toLocaleString()} ${currencySymbol}/year`}
                </div>
              )}
            </div>
            <div className="text-right text-[11px] text-slate-500 leading-tight max-w-[45%]">
              {language === 'ar'
                ? 'تجديد تلقائي — يمكنك الإلغاء في أي وقت'
                : 'Auto-renews · cancel anytime'}
            </div>
          </div>

          <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-tight">{feat}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg p-2.5">
            <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>
              {language === 'ar'
                ? 'سيتم تحويلك إلى صفحة دفع Kashier الآمنة لإدخال بيانات البطاقة أو المحفظة الإلكترونية.'
                : "You'll be redirected to Kashier's secure hosted page to pay by card or mobile wallet. We never see your card details."}
            </span>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg p-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="px-5 pb-5 space-y-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500"
            onClick={startPayment}
            isLoading={isPaying}
            icon={isPaying ? undefined : <ArrowRight className="w-4 h-4" />}
          >
            {isPaying
              ? language === 'ar'
                ? 'جارٍ التحويل…'
                : 'Redirecting…'
              : `${language === 'ar' ? 'ادفع الآن عبر' : 'Pay now with'} Kashier — ${amount.toLocaleString()} ${currencySymbol}`}
          </Button>
          <button
            onClick={onExit}
            disabled={isPaying}
            className="w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1.5 transition-colors disabled:opacity-40"
          >
            {language === 'ar' ? 'لاحقاً — أكمل بالتجربة المجانية' : 'Maybe later — continue with free trial'}
          </button>
          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 pt-1">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> 3-D Secure
            </span>
            <span className="inline-flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> test.kashier.io
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
