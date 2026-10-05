import React from 'react';
import { Badge } from '../common/Badge';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { Bus, Building2, Check, Clock3, MapPin, Route, School, Smartphone, Users } from 'lucide-react';

const fleetRowsEn = [
  ['102', 'School → Maadi', 'Ahmed', 'On Route', '08:42'],
  ['204', 'Nasr City → School', 'Mohamed', 'Approaching', '08:47'],
  ['307', '6th October → School', 'Omar', 'On Route', '08:51'],
];

const fleetRowsAr = [
  ['102', 'مدرسة ← المعادي', 'أحمد', 'في الطريق', '08:42'],
  ['204', 'مدينة نصر ← المدرسة', 'محمد', 'يقترب من المحطة', '08:47'],
  ['307', '6 أكتوبر ← المدرسة', 'عمر', 'في الطريق', '08:51'],
];

const MapPanel = () => {
  const { language } = useLanguageTheme();
  const isAr = language === 'ar';
  return (
    <div className="relative min-h-[340px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-sky-50 dark:bg-slate-900 shadow-sm">
      <div
        className="absolute inset-0 opacity-60 dark:opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M55 300 C160 80 270 360 415 165 S650 75 830 190" fill="none" stroke="#2563eb" strokeWidth="7" strokeLinecap="round" strokeDasharray="10 12" />
        <path d="M60 100 C175 270 320 50 465 255 S700 340 850 280" fill="none" stroke="#0d9488" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 12" />
      </svg>
      <Bus className="absolute left-[18%] top-[26%] w-9 h-9 text-blue-600 fill-white dark:fill-slate-900 drop-shadow-md" />
      <Bus className="absolute left-[48%] top-[42%] w-9 h-9 text-teal-600 fill-white dark:fill-slate-900 drop-shadow-md" />
      <Bus className="absolute right-[17%] top-[27%] w-9 h-9 text-blue-600 fill-white dark:fill-slate-900 drop-shadow-md" />
      <MapPin className="absolute left-[11%] bottom-[21%] w-6 h-6 text-slate-600 dark:text-slate-300 fill-white dark:fill-slate-900" />
      <MapPin className="absolute right-[20%] bottom-[18%] w-6 h-6 text-slate-600 dark:text-slate-300 fill-white dark:fill-slate-900" />
      <div className="absolute top-4 left-4 rounded-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-sm px-3 py-2">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
          {isAr ? 'الحافلة المحددة' : 'SELECTED BUS'}
        </p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {isAr ? 'حافلة 102 · في الطريق' : 'Bus 102 · On Route'}
        </p>
      </div>
    </div>
  );
};

export const FleetExperience: React.FC = () => {
  const { t, language } = useLanguageTheme();
  const fleetRows = language === 'ar' ? fleetRowsAr : fleetRowsEn;

  return (
    <>
      <section id="live-tracking" className="py-24 bg-slate-900 dark:bg-black text-white overflow-hidden transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <Badge variant="primary" size="md" className="bg-blue-900/60 text-blue-200 border-blue-700 mb-4">
              {t('fleet.badge')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {t('fleet.title')}
            </h2>
            <p className="text-slate-300 dark:text-slate-400 text-lg">
              {t('fleet.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.45fr_.8fr] gap-6">
            <MapPanel />
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl p-5 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{t('fleet.overviewTitle')}</p>
                  <h3 className="font-bold mt-1 text-slate-900 dark:text-white">{t('fleet.activeVehicles')}</h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{t('fleet.illustrativeData')}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-5">
                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-3 border border-blue-100 dark:border-blue-900/40">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('hero.statActiveBuses')}</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">24</p>
                </div>
                <div className="rounded-xl bg-teal-50 dark:bg-teal-950/40 p-3 border border-teal-100 dark:border-teal-900/40">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('hero.statActiveRoutes')}</p>
                  <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">12</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('hero.statDriversOnline')}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">21</p>
                </div>
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3 border border-amber-100 dark:border-amber-900/40">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('hero.statUpcomingArrivals')}</p>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">8</p>
                </div>
              </div>

              <div className="space-y-3">
                {fleetRows.map(([bus, route, driver, status, eta]) => (
                  <div key={bus} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {language === 'ar' ? `حافلة ${bus}` : `Bus ${bus}`}
                      </span>
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 rounded px-2 py-0.5">
                        {status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{route}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{driver} · {eta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="primary" size="md" className="mb-4">
              {t('fleet.productBadge')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {t('fleet.dashboardTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {t('fleet.dashboardSubtitle')}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden bg-slate-50 dark:bg-slate-900">
            <div className="flex">
              <aside className="hidden md:block w-48 bg-slate-900 dark:bg-black text-slate-300 p-5 shrink-0 border-r border-slate-800">
                <div className="font-bold text-white flex items-center gap-2 mb-8">
                  <Bus className="w-5 h-5 text-blue-400" /> Wasalt
                </div>
                {(language === 'ar'
                  ? ['لوحة التحكم','الأسطول المباشر','الحافلات','السائقون','المسارات','المحطات','الركاب','التحليلات','الفريق','الفوترة','الإعدادات']
                  : ['Dashboard','Live Fleet','Buses','Drivers','Routes','Stops','Passengers','Analytics','Team','Billing','Settings']
                ).map((item, i) => (
                  <div className={`text-sm py-2 px-3 rounded-lg mb-1 ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400'}`} key={item}>
                    {item}
                  </div>
                ))}
              </aside>

              <div className="p-5 md:p-7 flex-1 min-w-0">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('fleet.greeting')}</p>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('fleet.overviewHeader')}</h3>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t('fleet.illustrativeData')}</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                  {[
                    [t('hero.statActiveBuses'), '24'],
                    [t('hero.statActiveRoutes'), '12'],
                    [t('hero.statDriversOnline'), '21'],
                    [t('hero.statUpcomingArrivals'), '8'],
                  ].map(([l, v]) => (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700" key={l}>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{l}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{v}</p>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-4">
                  <MapPanel />
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 dark:text-white">{t('fleet.routeStatusTitle')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('fleet.routeStatusSubtitle')}</p>
                    <div className="mt-5 space-y-4">
                      {(language === 'ar'
                        ? ['المسار أ · في الطريق','المسار ب · يقترب من المحطة','المسار ج · في الطريق']
                        : ['Route A · On Route','Route B · Approaching stop','Route C · On Route']
                      ).map((route, i) => (
                        <div key={route}>
                          <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">{route}</span>
                            <span>{[72, 48, 64][i]}%</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: `${[72, 48, 64][i]}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                    {t('fleet.tableActiveBuses')}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs">
                        <tr>
                          {[t('fleet.thBus'), t('fleet.thRoute'), t('fleet.thDriver'), t('fleet.thStatus'), t('fleet.thEta')].map((x) => (
                            <th className="text-left font-medium px-4 py-3" key={x}>
                              {x}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {fleetRows.map((r) => (
                          <tr className="border-t border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200" key={r[0]}>
                            {r.map((x, i) => (
                              <td className="px-4 py-3" key={i}>
                                {i === 3 ? (
                                  <span className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded">
                                    {x}
                                  </span>
                                ) : (
                                  x
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

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
