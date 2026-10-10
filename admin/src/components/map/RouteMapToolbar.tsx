import React from 'react';
import { Plus, MapPin, Locate, Navigation, Maximize2, Clock } from 'lucide-react';
import { RouteGeometryResult } from '../../services/routingService';
import { useTranslation } from '../../i18n/useTranslation';

interface RouteMapToolbarProps {
  activeMode: 'addStop' | 'setStart' | 'setEnd';
  onSetActiveMode: (mode: 'addStop' | 'setStart' | 'setEnd') => void;
  onUseCurrentLocation: () => void;
  onFitRoute: () => void;
  routeStats: RouteGeometryResult | null;
  isCalculatingRoute: boolean;
  stopsCount: number;
}

/**
 * Toolbar controls for the Route Picker Leaflet map.
 */
export const RouteMapToolbar: React.FC<RouteMapToolbarProps> = ({
  activeMode,
  onSetActiveMode,
  onUseCurrentLocation,
  onFitRoute,
  routeStats,
  isCalculatingRoute,
  stopsCount,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => onSetActiveMode('addStop')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
            activeMode === 'addStop'
              ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          {t('map.addStop')}
        </button>

        <button
          type="button"
          onClick={() => onSetActiveMode('setStart')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
            activeMode === 'setStart'
              ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          {t('map.setStart')}
        </button>

        <button
          type="button"
          onClick={onUseCurrentLocation}
          title={t('map.setStartTitle')}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 bg-cyan-900/50 text-cyan-200 border border-cyan-700/50 hover:bg-cyan-800/80 transition-all"
        >
          <Locate className="w-3.5 h-3.5 text-cyan-400" />
          {t('map.gpsA')}
        </button>

        <button
          type="button"
          onClick={() => onSetActiveMode('setEnd')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
            activeMode === 'setEnd'
              ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          {t('map.setEnd')}
        </button>

        <button
          type="button"
          onClick={onFitRoute}
          title={t('map.fitRouteTitle')}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
          {t('map.fitRoute')}
        </button>
      </div>

      {/* Real-time distance, duration, and stop count metrics */}
      {routeStats && !isCalculatingRoute && (
        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-lg">
          <span className="text-emerald-400 font-semibold">{t('map.stopsCount', { count: stopsCount })}</span>
          <span className="text-slate-500">•</span>
          <span className="font-semibold text-white">{t('map.distanceKm', { km: routeStats.distanceKm })}</span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-slate-400" />
            {t('map.durationMin', { min: routeStats.durationMin })}
          </span>
        </div>
      )}
    </div>
  );
};
