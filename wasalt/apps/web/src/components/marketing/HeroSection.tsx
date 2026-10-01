import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import {
  ArrowRight,
  Bus,
  CheckCircle2,
  Clock3,
  Play,
  Route,
  Users,
  Radio,
  MapPin,
} from 'lucide-react';
import {
  HeroTelemetryMap,
  HERO_MOCK_VEHICLES,
  VehicleTelemetry,
} from './HeroTelemetryMap';

interface HeroSectionProps {
  onStartOnboarding: () => void;
  onExploreDemo: () => void;
}

const Stat = ({
  label,
  value,
  icon: Icon,
  detail,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  detail: string;
}) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
      <span>{label}</span>
      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    </div>
    <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{detail}</div>
  </div>
);

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartOnboarding,
  onExploreDemo,
}) => {
  const { t, language } = useLanguageTheme();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTelemetry>(
    HERO_MOCK_VEHICLES[0]
  );

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden transition-colors">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-600/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
            {t('hero.headlineMain')}{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              {t('hero.headlineGradient')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl">
            {t('hero.subheadline')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
            <Button
              size="lg"
              variant="primary"
              onClick={onStartOnboarding}
              icon={<ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />}
              className="w-full sm:w-auto shadow-lg shadow-blue-600/25"
            >
              {t('hero.ctaStartTrial')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onExploreDemo}
              icon={<Play className={`w-4 h-4 fill-slate-700 dark:fill-slate-200 ${language === 'ar' ? 'rotate-180' : ''}`} />}
              className="w-full sm:w-auto"
            >
              {t('hero.ctaExplore')}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t('hero.badgeNoCard')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t('hero.badgeBuiltFor')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t('hero.badgeOperations')}
            </span>
          </div>
        </div>

        {/* Live Command Center Preview Container */}
        <div className="mt-14 max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000" />

          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden">
            {/* Top Bar */}
            <div className="bg-slate-900 dark:bg-black px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <i className="w-3 h-3 rounded-full bg-red-500" />
                <i className="w-3 h-3 rounded-full bg-yellow-500" />
                <i className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  app.wasalt.io/transportation-control-center
                </span>
              </div>
              <Badge variant="primary" size="sm">
                {t('nav.liveViewBadge')}
              </Badge>
            </div>

            {/* Header Content */}
            <div className="p-5 md:p-8 bg-slate-50 dark:bg-slate-900/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t('hero.controlCenterTitle')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('hero.controlCenterSubtitle')}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  {t('hero.liveFleetView')}
                </span>
              </div>

              {/* Four Stat Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <Stat label={t('hero.statActiveBuses')} value="24" icon={Bus} detail={t('hero.statActiveBusesDesc')} />
                <Stat label={t('hero.statActiveRoutes')} value="12" icon={Route} detail={t('hero.statActiveRoutesDesc')} />
                <Stat label={t('hero.statDriversOnline')} value="21" icon={Users} detail={t('hero.statDriversOnlineDesc')} />
                <Stat label={t('hero.statUpcomingArrivals')} value="8" icon={Clock3} detail={t('hero.statUpcomingArrivalsDesc')} />
              </div>

              {/* Map & Selected Vehicle Grid */}
              <div className="grid lg:grid-cols-[1.4fr_.9fr] gap-4 mt-4">
                {/* Real Interactive Leaflet Map */}
                <HeroTelemetryMap
                  selectedVehicleId={selectedVehicle.id}
                  onSelectVehicle={setSelectedVehicle}
                />

                {/* Selected Vehicle Detail Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 flex flex-col justify-between shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {t('hero.selectedVehicle')}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {t('hero.gpsActive')}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedVehicle.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{selectedVehicle.route}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-2.5 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-100 dark:border-emerald-800">
                        <span className="text-[10px] block text-emerald-600/70 dark:text-emerald-400/80 font-normal">
                          {t('hero.statusLabel')}
                        </span>
                        {selectedVehicle.status}
                      </div>
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-800/80 p-2.5 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] block text-slate-500 dark:text-slate-400 font-normal">
                          {t('hero.etaLabel')}
                        </span>
                        ETA {selectedVehicle.eta}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">{t('hero.assignedDriver')}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedVehicle.driver}</span>
                    </div>
                  </div>

                  <button
                    onClick={onExploreDemo}
                    className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>{t('hero.viewRouteDetails')}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
