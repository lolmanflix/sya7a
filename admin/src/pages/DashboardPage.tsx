import React, { useState } from 'react';
import { Bus, Building2, UserCheck, Activity, AlertTriangle, Radio, Camera, Mic, Video, ShieldCheck, X } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { FleetMap } from '../components/map/FleetMap';
import { shortLineCode } from '../components/map/fleetMapHelpers';
import { LiveBusLocation, BusRouteDefinition, CompanyRecord, DriverProfile } from '../types';
import { terminateLiveSession } from '../services/telemetryService';
import { DriverSafetyMediaModal } from '../components/modals/DriverSafetyMediaModal';
import { useTranslation } from '../i18n/useTranslation';
import { toast } from 'sonner';

interface DashboardPageProps {
  liveLocations: LiveBusLocation[];
  buses: BusRouteDefinition[];
  companies: CompanyRecord[];
  drivers: DriverProfile[];
  onSelectBus: (busId: string) => void;
}

/**
 * Master administrative overview metrics dashboard.
 */
export const DashboardPage: React.FC<DashboardPageProps> = ({
  liveLocations,
  buses,
  companies,
  drivers,
  onSelectBus,
}) => {
  const { t } = useTranslation();
  const [mediaModalDriver, setMediaModalDriver] = useState<LiveBusLocation | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const activeCatalogBuses = buses.filter((b) => b.isActive);

  // Single-line inspection: only the clicked route shows its info card
  const selectedBus = selectedBusId ? buses.find((b) => b.busId === selectedBusId) ?? null : null;
  const selectedLoc = selectedBus
    ? liveLocations.find((l) => l.lineId.toLowerCase() === selectedBus.lineId.toLowerCase()) ?? null
    : null;
  const handleMapSelect = (busId: string) => {
    setSelectedBusId((prev) => (prev === busId ? null : busId));
    onSelectBus(busId);
  };

  /**
   * Forcefully terminates an active driver telemetry broadcast session.
   */
  const handleForceStopSession = async (lineId: string, driverUid: string) => {
    try {
      await terminateLiveSession(lineId, driverUid);
      toast.success(t('dashboard.terminateSuccess'));
    } catch {
      toast.error(t('dashboard.terminateError'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.activeOnRoad')}
          value={liveLocations.length}
          subtitle={t('dashboard.activeRoutesSubtitle', { count: activeCatalogBuses.length })}
          icon={Bus}
          color="emerald"
          trend={t('dashboard.liveGps')}
        />
        <StatCard
          title={t('dashboard.transitCompanies')}
          value={companies.length}
          subtitle={t('dashboard.companiesSubtitle')}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title={t('dashboard.registeredDrivers')}
          value={drivers.length}
          subtitle={t('dashboard.broadcastingSubtitle', { count: liveLocations.length })}
          icon={UserCheck}
          color="indigo"
        />
        <StatCard
          title={t('dashboard.catalogRoutes')}
          value={buses.length}
          subtitle={t('dashboard.lineTerminalsSubtitle')}
          icon={Activity}
          color="amber"
        />
      </div>

      {/* Main Map + right rail: auto-populating active buses box, or selected line's trip panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Fleet Map (2 of 3 columns) */}
        <div className="space-y-3 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              {t('dashboard.liveMapTitle')}
            </h3>
            <span className="text-xs text-slate-400">
              {selectedBus
                ? t('dashboard.beaconsStreaming', { count: liveLocations.length })
                : t('dashboard.clickRouteHint')}
            </span>
          </div>
          <div className="h-[320px] sm:h-[400px] lg:h-[480px]">
            <FleetMap
              liveLocations={liveLocations}
              catalogBuses={buses}
              selectedBusId={selectedBusId}
              onSelectBus={handleMapSelect}
            />
          </div>
        </div>

        {/* Right rail — auto-populating active buses box, or single-line trip panel on selection */}
        {selectedBus ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 min-w-0">
                <Activity className="w-4 h-4 text-brand-400 shrink-0" />
                <span className="truncate">{t('dashboard.lineLabel', { line: selectedBus.lineId })}</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  {t('dashboard.live')}
                </span>
              </h4>
              <button
                type="button"
                onClick={() => setSelectedBusId(null)}
                title={t('common.close')}
                aria-label={t('common.close')}
                className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedLoc ? (
              <div
                key={selectedLoc.id}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <span
                      title={selectedLoc.cameraMonitored ? t('dashboard.camMonitored') : t('dashboard.camInactive')}
                      className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                        selectedLoc.cameraMonitored ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Camera className="w-2.5 h-2.5" /> CAM
                    </span>
                    <span
                      title={selectedLoc.micMonitored ? t('dashboard.micMonitored') : t('dashboard.micInactive')}
                      className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                        selectedLoc.micMonitored ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Mic className="w-2.5 h-2.5" /> MIC
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono shrink-0">
                    {new Date(selectedLoc.lastUpdated).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-slate-400 space-y-0.5">
                  <p><span className="text-slate-300">{t('dashboard.driverLabel')}</span> {selectedLoc.driverName}</p>
                  <p className="truncate text-slate-500">{selectedLoc.driverEmail}</p>
                  {selectedLoc.endPoint && (
                    <p className="truncate text-brand-300 pt-1">
                      🎯 <span className="text-slate-400">{t('dashboard.headingTo')}</span> {selectedLoc.endPoint}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setMediaModalDriver(selectedLoc)}
                    className="px-2.5 py-1 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 text-brand-300 border border-brand-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-sm shrink-0 whitespace-nowrap"
                    title={t('dashboard.safetyCheckTitle')}
                  >
                    <Video className="w-3 h-3 text-brand-400" />
                    {t('dashboard.safetyCheck')}
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block max-w-[130px] truncate align-middle">
                      {selectedLoc.latitude.toFixed(4)}, {selectedLoc.longitude.toFixed(4)}
                    </span>
                    <button
                      onClick={() => handleForceStopSession(selectedLoc.lineId, selectedLoc.driverUid)}
                      className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 shrink-0"
                      title={t('dashboard.stopTitle')}
                    >
                      <AlertTriangle className="w-3 h-3" /> {t('dashboard.stop')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <Radio className="w-7 h-7 mx-auto text-slate-600" />
                <p className="text-xs text-slate-400">{t('dashboard.noActiveTrip')}</p>
                <p className="text-[11px] text-slate-500">
                  {selectedBus.startPoint} → {selectedBus.endPoint}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Auto-populating active buses box — rows appear as soon as drivers broadcast */
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-xl space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 min-w-0">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                {t('dashboard.activeBusesTitle')}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                {liveLocations.length}
              </span>
            </div>

            {liveLocations.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Radio className="w-7 h-7 mx-auto text-slate-600" />
                <p className="text-xs text-slate-400">{t('dashboard.activeBusesEmpty')}</p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[430px] overflow-y-auto pr-1">
                {liveLocations.map((loc) => {
                  const bus = buses.find(
                    (b) => b.lineId.toLowerCase() === loc.lineId.toLowerCase()
                  );
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      disabled={!bus}
                      onClick={() => bus && handleMapSelect(bus.busId)}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl border text-left transition-colors ${
                        bus
                          ? 'bg-slate-800/50 border-slate-700/60 hover:border-emerald-500/40 hover:bg-slate-800 cursor-pointer'
                          : 'bg-slate-800/30 border-slate-800 cursor-default'
                      }`}
                    >
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-white truncate">
                          {shortLineCode(loc.lineId)}
                        </span>
                        <span className="block text-[10px] text-slate-400 truncate">
                          {loc.driverName}
                          {loc.endPoint ? ` · ${loc.endPoint}` : ''}
                        </span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 shrink-0">
                        {new Date(loc.lastUpdated).toLocaleTimeString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Driver Safety & Media Stream Modal */}
      {mediaModalDriver && (
        <DriverSafetyMediaModal
          isOpen={Boolean(mediaModalDriver)}
          onClose={() => setMediaModalDriver(null)}
          driverUid={mediaModalDriver.driverUid}
          driverName={mediaModalDriver.driverName || t('dashboard.activeDriverFallback')}
          driverEmail={mediaModalDriver.driverEmail}
          lineId={mediaModalDriver.lineId}
          cameraMonitored={mediaModalDriver.cameraMonitored}
          micMonitored={mediaModalDriver.micMonitored}
          latitude={mediaModalDriver.latitude}
          longitude={mediaModalDriver.longitude}
        />
      )}
    </div>
  );
};
