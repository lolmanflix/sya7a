import React from 'react';
import { PLATFORM_FEATURES } from '@wasalt/config';
import { Badge } from '../common/Badge';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import {
  Layers,
  ShieldCheck,
  Bus,
  MapPinned,
  Route,
  Users,
  CalendarClock,
  LucideIcon,
  CheckCircle2,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Layers,
  ShieldCheck,
  Bus,
  MapPinned,
  Route,
  Users,
  CalendarClock,
};

const featureTranslationsAr: Record<string, { title: string; desc: string; badge: string }> = {
  'live-tracking': {
    title: 'التتبع المباشر للحافلات',
    desc: 'راقب الحافلات النشطة وتقدمها في خطوط السير الحالي من عرض نقل مركزي.',
    badge: 'عرض الأسطول',
  },
  'fleet-management': {
    title: 'إدارة الأسطول',
    desc: 'احتفظ بحافلات مؤسستك منظمة في مكان واحد إلى جانب عمليات النقل.',
    badge: 'مركزي',
  },
  'route-management': {
    title: 'إدارة الخطوط والمحطات',
    desc: 'أنشئ وحافظ على خطوط السير ومحطات النقل والمعلومات التي يحتاجها فريقك لتشغيلها.',
    badge: 'منظّم',
  },
  'driver-management': {
    title: 'إدارة السائقين',
    desc: 'امنح فريق النقل طريقة واضحة لإدارة السائقين والمركبات والمسارات المخصصة.',
    badge: 'تعيينات',
  },
  scheduling: {
    title: 'جدولة النقل',
    desc: 'نظم جداول النقل وعمليات خطوط السير حول مدرستك أو شركتك.',
    badge: 'عمليات',
  },
  'organization-management': {
    title: 'إدارة المؤسسات حسب الدور',
    desc: 'ادعم عدة مشرفين للنقل بمستوى وصول مناسب على مستوى المؤسسة.',
    badge: 'منصة داعمة',
  },
};

export const FeaturesGrid: React.FC = () => {
  const { t, language } = useLanguageTheme();

  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-4">
            {t('features.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('features.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLATFORM_FEATURES.map((feature) => {
            const IconComponent = iconMap[feature.icon] || Layers;
            const title = language === 'ar' && featureTranslationsAr[feature.id]
              ? featureTranslationsAr[feature.id].title
              : feature.title;
            const desc = language === 'ar' && featureTranslationsAr[feature.id]
              ? featureTranslationsAr[feature.id].desc
              : feature.description;

            const badgeText = language === 'ar' && featureTranslationsAr[feature.id]
              ? featureTranslationsAr[feature.id].badge
              : feature.badge;

            return (
              <div
                key={feature.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-7 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {badgeText && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {badgeText}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'ar' ? 'جاهز للتشغيل المؤسسي' : 'Enterprise grade capability'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
