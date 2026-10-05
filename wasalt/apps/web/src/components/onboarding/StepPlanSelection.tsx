import React from 'react';
import { PRICING_PLANS } from '@wasalt/config';
import { Button } from '../common/Button';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { usePriceOverrides, applyPriceOverrides } from '../../services/pricingService';
import { Check, ShieldCheck, Download } from 'lucide-react';

interface StepPlanSelectionProps {
  selectedPlanId: string;
  billingCycle?: 'monthly' | 'annual';
  onSelectPlan: (planId: string) => void;
  onProceedToPaymentAndDownload: () => void;
  onBack: () => void;
}

const planNamesAr: Record<string, string> = {
  starter: 'البداية',
  pro: 'المحترف',
  enterprise: 'المؤسسات الكبرى',
};

/** First-four feature bullets shown on each plan card (mirrors PRICING_PLANS order). */
const planFeaturesAr: Record<string, string[]> = {
  starter: [
    'مساحة عمل واحدة لمؤسسة النقل',
    'أسطول باصات وخطوط سير غير محدودة',
    'حتى 3 حسابات مشرفين للنقل',
    'خريطة تتبع حي ومتابعة خط السير',
  ],
  pro: [
    'حتى 5 مساحات عمل للمؤسسة',
    'أسطول باصات وخطوط سير غير محدودة مع تتبع فوري شامل',
    'حتى 15 مقعد مشرف للمنظومة',
    'تبديل فوري وسريع بين الشركات والفروع',
  ],
  enterprise: [
    'مساحات عمل غير محدودة',
    'أسطول باصات وخطوط سير غير محدودة',
    'مقاعد غير محدودة للإداريين والسائقين',
    'تخصيص كامل للنطاقات والهوية (وايت ليبل)',
  ],
};

export const StepPlanSelection: React.FC<StepPlanSelectionProps> = ({
  selectedPlanId,
  billingCycle = 'monthly',
  onSelectPlan,
  onProceedToPaymentAndDownload,
  onBack,
}) => {
  const { t, language } = useLanguageTheme();
  const currencySymbol = language === 'ar' ? 'ج.م' : 'EGP';
  // Live admin-set prices from the admin dashboard.
  const plans = applyPriceOverrides(PRICING_PLANS, usePriceOverrides());

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="text-center">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          {t('plan.selectTitle')}
        </h3>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {t('plan.selectSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const displayName = language === 'ar' && planNamesAr[plan.id] ? planNamesAr[plan.id] : plan.name;

          return (
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={`cursor-pointer rounded-xl p-4 transition-all duration-200 relative flex flex-col justify-between border ${
                isSelected
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-bold uppercase rounded-full shadow-sm whitespace-nowrap">
                  {language === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {displayName}
                  </h4>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {(billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly).toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {currencySymbol}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {billingCycle === 'annual'
                      ? language === 'ar'
                        ? '/شهرياً (سنوي)'
                        : '/mo (annual)'
                      : language === 'ar'
                        ? '/شهرياً'
                        : '/mo'}
                  </span>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 mb-4">
                  {plan.features.slice(0, 4).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-tight">
                        {language === 'ar' && planFeaturesAr[plan.id]?.[idx]
                          ? planFeaturesAr[plan.id][idx]
                          : feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={isSelected ? 'primary' : 'outline'}
                className="w-full justify-center text-[11px] py-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlan(plan.id);
                }}
              >
                {isSelected ? (language === 'ar' ? 'تم الاختيار' : 'Selected') : (language === 'ar' ? 'اختيار' : 'Select')}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button variant="ghost" onClick={onBack} className="text-xs">
          {language === 'ar' ? 'السابق' : 'Back'}
        </Button>
        <Button
          variant="primary"
          onClick={onProceedToPaymentAndDownload}
          icon={<Download className="w-3.5 h-3.5" />}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2"
        >
          {t('plan.payAndDownload')}
        </Button>
      </div>
    </div>
  );
};
