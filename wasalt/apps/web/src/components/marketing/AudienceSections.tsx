import React from 'react';
import { Badge } from '../common/Badge';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { Building2, Check, Clock3, School, Smartphone } from 'lucide-react';

const Audience = ({
  id,
  icon: Icon,
  title,
  copy,
  items,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  copy: string;
  items: string[];
}) => (
  <section id={id} className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[.85fr_1.15fr] gap-12 items-center">
      <div>
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">{copy}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex gap-3 shadow-sm"
            key={item}
          >
            <Check className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const AudienceSections: React.FC = () => {
  const { t } = useLanguageTheme();
  return (
    <>
      <Audience
        id="schools"
        icon={School}
        title={t('audience.schoolsTitle')}
        copy={t('audience.schoolsSubtitle')}
        items={[
          t('audience.sItem1'),
          t('audience.sItem2'),
          t('audience.sItem3'),
          t('audience.sItem4'),
          t('audience.sItem5'),
          t('audience.sItem6'),
        ]}
      />
      <Audience
        id="companies"
        icon={Building2}
        title={t('audience.companiesTitle')}
        copy={t('audience.companiesSubtitle')}
        items={[
          t('audience.cItem1'),
          t('audience.cItem2'),
          t('audience.cItem3'),
          t('audience.cItem4'),
          t('audience.cItem5'),
          t('audience.cItem6'),
        ]}
      />
    </>
  );
};

export const EcosystemSection: React.FC = () => {
  const { t } = useLanguageTheme();
  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="primary" size="md" className="mb-4">
          {t('ecosystem.badge')}
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('ecosystem.title')}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto mt-4">
          {t('ecosystem.subtitle')}
        </p>
        <div className="mt-12 grid md:grid-cols-2 gap-6 text-left">
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/20 p-7">
            <School className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-xl text-slate-900 dark:text-white mt-4">{t('ecosystem.schoolTitle')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{t('ecosystem.schoolDesc')}</p>
          </div>
          <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50 dark:bg-teal-950/20 p-7">
            <Building2 className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-xl text-slate-900 dark:text-white mt-4">{t('ecosystem.companyTitle')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{t('ecosystem.companyDesc')}</p>
          </div>
        </div>
        <div className="mt-7 rounded-2xl bg-slate-900 dark:bg-slate-900/90 text-white p-7 flex flex-col sm:flex-row gap-6 justify-around text-left border border-slate-800">
          <div>
            <p className="font-bold text-white">{t('ecosystem.feat1Title')}</p>
            <p className="text-sm text-slate-400 mt-1">{t('ecosystem.feat1Desc')}</p>
          </div>
          <div>
            <p className="font-bold text-white">{t('ecosystem.feat2Title')}</p>
            <p className="text-sm text-slate-400 mt-1">{t('ecosystem.feat2Desc')}</p>
          </div>
          <div>
            <p className="font-bold text-white">{t('ecosystem.feat3Title')}</p>
            <p className="text-sm text-slate-400 mt-1">{t('ecosystem.feat3Desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const DriverEcosystem: React.FC = () => {
  const { t } = useLanguageTheme();
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <Badge variant="primary" size="md" className="mb-4">
            {t('driver.badge')}
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('driver.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg mt-4 leading-relaxed">
            {t('driver.subtitle')}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{t('driver.routeViewTitle')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('driver.routeViewSubtitle')}</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {[t('driver.task1'), t('driver.task2'), t('driver.task3'), t('driver.task4')].map((x) => (
              <div className="flex gap-3 text-sm text-slate-700 dark:text-slate-300" key={x}>
                <Clock3 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{x}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
