import React, { useState } from 'react';
import { FAQ_ITEMS } from '@wasalt/config';
import { Badge } from '../common/Badge';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { ChevronDown } from 'lucide-react';

const faqTranslationsAr: Record<string, { q: string; a: string }> = {
  faq_1: {
    q: 'ما هو نموذج العمل الأساسي لمنصة وصل؟',
    a: 'وصل هي منصة متعددة المؤسسات بنظام SaaS تتيح للمشرف الواحد إدارة عدة مدارس أو شركات أو أساطيل نقل مع عزل تام لكل منظومة في التخصيص والصلاحيات.',
  },
  faq_2: {
    q: 'كيف يعمل استخراج ألوان الهوية تلقائياً؟',
    a: 'بمجرد رفع شعار المؤسسة، يقوم محرك الألوان الخاص بالمنصة بتحليل الدرجات اللونية الأساسية، وتوليد باليت متناسق، وفحص مطابقة التباين WCAG AA تلقائياً.',
  },
  faq_3: {
    q: 'هل يمكن تشغيل المنصة كبرنامج لسطح المكتب؟',
    a: 'نعم، إلى جانب تطبيق الويب السريع، توفر وصل تطبيق سطح مكتب مبني على Electron يعمل بكفاءة وسرعة على أنظمة Windows و macOS و Linux.',
  },
  faq_4: {
    q: 'كيف تتم مشاركة موقع الحافلة والتتبع المباشر؟',
    a: 'يرتبط سائقو الحافلات بتطبيق السائق المتوافق لمشاركة الموقع الجغرافي اللحظي أثناء الرحلات المعينة فقط، مما يضمن دقة التتبع وخصوصية السائق.',
  },
  faq_5: {
    q: 'ما هي معايير حماية وأمان البيانات؟',
    a: 'تطبق المنصة أماناً مشدداً على مستوى قواعد البيانات وتشفير الاتصالات وصلاحيات وصول مبنية على الأدوار RBAC لضمان عدم تسرب أي بيانات بين المؤسسات.',
  },
};

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);
  const { t, language } = useLanguageTheme();

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="primary" size="md" className="mb-4">
            {t('faq.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const arInfo = faqTranslationsAr[item.id];
            const question = language === 'ar' && arInfo ? arInfo.q : item.question;
            const answer = language === 'ar' && arInfo ? arInfo.a : item.answer;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left rtl:text-right p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="text-base font-bold text-slate-900 dark:text-white">{question}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/80 pt-4">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
