import React from 'react';
import { Badge } from '../common/Badge';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { Building, Bus, Route, Radio, BarChart3 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { t, language } = useLanguageTheme();

  const steps = [
    {
      number: '01',
      icon: Building,
      title: t('howItWorks.step1Title'),
      description: t('howItWorks.step1Desc'),
    },
    {
      number: '02',
      icon: Bus,
      title: t('howItWorks.step2Title'),
      description: t('howItWorks.step2Desc'),
    },
    {
      number: '03',
      icon: Radio,
      title: t('howItWorks.step3Title'),
      description: t('howItWorks.step3Desc'),
    },
    {
      number: '04',
      icon: Route,
      title: t('howItWorks.step4Title'),
      description: t('howItWorks.step4Desc'),
    },
    {
      number: '05',
      icon: BarChart3,
      title: t('howItWorks.step5Title'),
      description: t('howItWorks.step5Desc'),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-4">
            {t('howItWorks.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                {/* Step pill */}
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl mb-6 shadow-sm border border-blue-100 dark:border-slate-700 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>

                <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {language === 'ar' ? 'الخطوة' : 'STEP'} {step.number}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
