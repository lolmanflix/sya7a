import React, { useState } from 'react';
import { PRICING_PLANS } from '@wasalt/config';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { Check, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planId: string) => void;
}

const planTranslationsAr: Record<string, { name: string; tagline: string; cta: string; features: string[] }> = {
  starter: {
    name: 'البداية (حتى 5 باصات)',
    tagline: 'مثالية للمدارس الخاصة الناشئة وشركات النقل الصغيرة.',
    cta: 'ابدأ تجربة مجانية 14 يوماً',
    features: [
      'مساحة عمل واحدة لمؤسسة النقل',
      'حتى 5 مركبات وأسطول باصات',
      'حتى 3 حسابات مشرفين للنقل',
      'خريطة تتبع حي ومتابعة خط السير',
      'استخراج تلقائي للهوية من الشعار',
      'تحليلات قياسية وسجل النشاطات',
      'التبديل بين الشركات (غير متضمن)',
      'مدير حساب مخصص (غير متضمن)',
    ],
  },
  pro: {
    name: 'المحترف (حتى 25 باص)',
    tagline: 'للأساطيل المتنامية، والمدارس الكبرى، ونقل موظفي الشركات.',
    cta: 'إطلاق مساحة عمل المحترف',
    features: [
      'حتى 5 مساحات عمل للمؤسسة',
      'حتى 25 مركبة باص مع تتبع فوري شامل',
      'حتى 15 مقعد مشرف للمنظومة',
      'تبديل فوري وسريع بين الشركات والفروع',
      'محرك متقدم للألوان وفحص التباين',
      'صلاحيات وصول متقدمة حسب الدور',
      'توجيه السائقين وإدارة الورديات',
      'دعم محلي ذو أولوية (هاتف وواتساب)',
    ],
  },
  enterprise: {
    name: 'المؤسسات الكبرى (أسطول غير محدود)',
    tagline: 'لشركات السياحة والنقل الجماعي والجامعات والمجمعات متعددة الفروع.',
    cta: 'تواصل مع فريق المبيعات',
    features: [
      'مساحات عمل وفروع غير محدودة',
      'عدد باصات وخطوط سير غير محدودة',
      'مقاعد غير محدودة للإداريين والسائقين',
      'تخصيص كامل للنطاقات والهوية (وايت ليبل)',
      'حزم برامج سطح مكتب مخصصة Electron',
      'ربط أمني مخصص مع أنظمة SSO و SAML',
      'مدير نجاح عملاء مخصص في مصر (24/7)',
      'تقارير عمليات تشغيلية ومالية مخصصة',
    ],
  },
};

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { t, language } = useLanguageTheme();

  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="primary" size="md" className="mb-4">
            {t('pricing.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mb-8">
            {language === 'ar'
              ? 'أسعار واضحة ومرنة بالجنيه المصري مصممة لتناسب مختلف أحجام أساطيل النقل في السوق المصري.'
              : 'Flexible and transparent pricing in Egyptian Pound (EGP), tailored for transport fleets in Egypt.'}
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                !isAnnual
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{t('pricing.annual')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500 text-white font-bold">
                {t('pricing.save20')}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            const isHighlighted = plan.highlighted;
            const arInfo = planTranslationsAr[plan.id];
            const planName = language === 'ar' && arInfo ? arInfo.name : plan.name;
            const planTagline = language === 'ar' && arInfo ? arInfo.tagline : plan.tagline;
            const ctaText = language === 'ar' && arInfo ? arInfo.cta : plan.ctaText;
            const currencyLabel = language === 'ar' ? 'ج.م' : 'EGP';

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-white dark:bg-slate-800 border-2 border-blue-600 dark:border-blue-500 shadow-2xl shadow-blue-500/10 lg:-translate-y-2'
                    : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}</span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{planName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px] leading-relaxed">
                        {planTagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1.5 my-6">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {price.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {currencyLabel}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t('pricing.perMonth')}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700/80 mb-8">
                    {plan.features.map((feat, idx) => {
                      const featText = language === 'ar' && arInfo?.features?.[idx] ? arInfo.features[idx] : feat.text;
                      return (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              feat.included ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                          <span className={feat.included ? 'font-medium' : 'text-slate-400 dark:text-slate-500'}>
                            {featText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant={isHighlighted ? 'primary' : 'outline'}
                  size="lg"
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full justify-center ${
                    !isHighlighted ? 'dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700' : ''
                  }`}
                >
                  {ctaText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
