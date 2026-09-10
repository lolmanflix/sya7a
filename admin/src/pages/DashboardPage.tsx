import React, { useState } from 'react';
import { Bus, Building2, UserCheck, Activity, AlertTriangle, Radio, Camera, Mic, Video, ShieldCheck } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { FleetMap } from '../components/map/FleetMap';
import { LiveBusLocation, BusRouteDefinition, CompanyRecord, DriverProfile } from '../types';
import { terminateLiveSession } from '../services/telemetryService';
import { DriverSafetyMediaModal } from '../components/modals/DriverSafetyMediaModal';
import { toast } from 'sonner';

interface DashboardPageProps {
  liveLocations: LiveBusLocation[];
  buses: BusRouteDefinition[];
  companies: CompanyRecord[];
  drivers: DriverProfile[];
  onSelectBus: (busId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  liveLocations,
  buses,
  companies,
  drivers,
  onSelectBus,
}) => {
  const [mediaModalDriver, setMediaModalDriver] = useState<LiveBusLocation | null>(null);
  const activeCatalogBuses = buses.filter((b) => b.isActive);

  const handleForceStopSession = async (lineId: string, driverUid: string) => {
    try {
      await terminateLiveSession(lineId, driverUid);
      toast.success('Terminated live broadcast session.');
    } catch {
      toast.error('Failed to terminate session.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active On Road"
          value={liveLocations.length}
          subtitle={`${activeCatalogBuses.length} routes marked active`}
          icon={Bus}
          color="emerald"
          trend="Live GPS"
        />
        <StatCard
          title="Transit Companies"
          value={companies.length}
          subtitle="CTA, BRT, Super Jet, etc."
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Registered Drivers"
          value={drivers.length}
          subtitle={`${liveLocations.length} currently broadcasting`}
          icon={UserCheck}
          color="indigo"
        />
        <StatCard
          title="Catalog Routes"
          value={buses.length}
          subtitle="Registered line terminals"
          icon={Activity}
          color="amber"
        />
      </div>

      {/* Main Map & Live Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Fleet Map (2 columns on large) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live Telemetry Map (Cairo & Intercity)
            </h3>
            <span className="text-xs text-slate-400">
              {liveLocations.length} active GPS beacons streaming
            </span>
          </div>
          <div className="h-[480px]">
            <FleetMap
              liveLocations={liveLocations}
              catalogBuses={buses}
              onSelectBus={onSelectBus}
            />
          </div>
        </div>

        {/* Live Streaming Activity Feed */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" />
              Active Trips ({liveLocations.length})
            </h4>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {liveLocations.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Radio className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
                <p className="text-xs">No drivers are currently broadcasting live GPS.</p>
                <p className="text-[11px] text-slate-600">When a driver starts a trip in the Wasalt app, they will appear here in real time.</p>
              </div>
            ) : (
              liveLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-2 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Line: {loc.lineId}</span>
                      <div className="flex items-center gap-1">
                        <span
                          title={loc.cameraMonitored ? 'Cabin camera actively monitored' : 'Camera inactive'}
                          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            loc.cameraMonitored ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          <Camera className="w-2.5 h-2.5" /> CAM
                        </span>
                        <span
                          title={loc.micMonitored ? 'Cabin microphone actively monitored' : 'Microphone inactive'}
                          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            loc.micMonitored ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          <Mic className="w-2.5 h-2.5" /> MIC
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                      {new Date(loc.lastUpdated).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="text-slate-400 space-y-0.5">
                    <p><span className="text-slate-300">Driver:</span> {loc.driverName}</p>
                    <p className="truncate text-slate-500">{loc.driverEmail}</p>
                    {loc.endPoint && (
                      <p className="truncate text-brand-300 pt-1">
                        🎯 <span className="text-slate-400">Heading to:</span> {loc.endPoint}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setMediaModalDriver(loc)}
                      className="px-2.5 py-1 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 text-brand-300 border border-brand-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      title="Inspect driver cabin camera and microphone stream"
                    >
                      <Video className="w-3 h-3 text-brand-400" />
                      Safety Check
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                        {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                      </span>
                      <button
                        onClick={() => handleForceStopSession(loc.lineId, loc.driverUid)}
                        className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1"
                        title="Force terminate trip broadcast"
                      >
                        <AlertTriangle className="w-3 h-3" /> Stop
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Driver Safety & Media Stream Modal */}
      {mediaModalDriver && (
        <DriverSafetyMediaModal
          isOpen={Boolean(mediaModalDriver)}
          onClose={() => setMediaModalDriver(null)}
          driverUid={mediaModalDriver.driverUid}
          driverName={mediaModalDriver.driverName || 'Active Driver'}
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
