import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Landmark, Route, Clock, CheckCircle2, Plus, Trash2, Locate } from 'lucide-react';
import { fetchRoadRoute, RouteGeometryResult } from '../../services/routingService';
import { BusStop } from '../../types';

interface RoutePickerMapProps {
  initialStops?: BusStop[];
  startLat?: number;
  startLng?: number;
  endLat?: number;
  endLng?: number;
  startAddress?: string;
  endAddress?: string;
  onPointsSelected?: (start: { lat: number; lng: number; address: string }, end: { lat: number; lng: number; address: string }) => void;
  onStopsChange?: (stops: BusStop[], start: { lat: number; lng: number; address: string }, end: { lat: number; lng: number; address: string }) => void;
}

const OFFLINE_EGYPTIAN_LANDMARKS = [
  { name: 'الجامعة المصرية الصينية (ECU Nasr City)', lat: 30.0345, lng: 31.3588 },
  { name: 'ميدان التحرير (Tahrir Square)', lat: 30.0444, lng: 31.2357 },
  { name: 'ميدان رمسيس / محطة مصر (Ramses)', lat: 30.0626, lng: 31.2469 },
  { name: 'مدينة نصر - مكرم عبيد (Nasr City)', lat: 30.0561, lng: 31.3300 },
  { name: 'ميدان لبنان - المهندسين (Lebanon Sq)', lat: 30.0610, lng: 31.2017 },
  { name: 'التجمع الخامس (New Cairo / 5th Settl)', lat: 30.0073, lng: 31.4916 },
  { name: 'مطار القاهرة الدولي (Cairo Airport)', lat: 30.1219, lng: 31.4055 },
  { name: 'أهرامات الجيزة (Giza Pyramids)', lat: 29.9792, lng: 31.1342 },
  { name: 'جامعة القاهرة (Cairo University)', lat: 30.0264, lng: 31.2086 },
  { name: 'المعادي (Maadi)', lat: 29.9600, lng: 31.2700 },
  { name: 'مدينة 6 أكتوبر (6th of October)', lat: 29.9637, lng: 30.9177 },
];

export const RoutePickerMap: React.FC<RoutePickerMapProps> = ({
  initialStops,
  startLat = 30.0444,
  startLng = 31.2357,
  endLat = 30.0561,
  endLng = 31.3300,
  startAddress = 'Start Station',
  endAddress = 'Destination',
  onPointsSelected,
  onStopsChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const routeGlowRef = useRef<L.Polyline | null>(null);

  const [activeMode, setActiveMode] = useState<'addStop' | 'setStart' | 'setEnd'>('addStop');
  const [stops, setStops] = useState<BusStop[]>(() => {
    if (initialStops && initialStops.length >= 2) return initialStops;
    return [
      { id: 'stop-start', name: startAddress, lat: startLat, lng: startLng, order: 0 },
      { id: 'stop-end', name: endAddress, lat: endLat, lng: endLng, order: 1 },
    ];
  });

  const [routeStats, setRouteStats] = useState<RouteGeometryResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [startLat, startLng],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    routeGlowRef.current = L.polyline([], {
      color: '#3B82F6',
      weight: 7,
      opacity: 0.25,
      lineCap: 'round',
    }).addTo(map);

    routeLineRef.current = L.polyline([], {
      color: '#2563EB',
      weight: 4,
      opacity: 0.9,
      lineCap: 'round',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync stops changes to callbacks
  const notifyChanges = (updatedStops: BusStop[]) => {
    setStops(updatedStops);
    if (updatedStops.length >= 2) {
      const s = updatedStops[0];
      const e = updatedStops[updatedStops.length - 1];
      const sObj = { lat: s.lat, lng: s.lng, address: s.name };
      const eObj = { lat: e.lat, lng: e.lng, address: e.name };
      if (onPointsSelected) onPointsSelected(sObj, eObj);
      if (onStopsChange) onStopsChange(updatedStops, sObj, eObj);
    }
  };

  // Re-render stop markers and recalculate road polyline whenever stops change
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    stops.forEach((stop, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === stops.length - 1;
      const badgeBg = isFirst ? 'bg-blue-600' : isLast ? 'bg-purple-600' : 'bg-emerald-600';
      const label = isFirst ? 'A' : isLast ? 'B' : String(idx + 1);

      const icon = L.divIcon({
        className: 'custom-stop-marker',
        html: `<div class="w-6 h-6 rounded-full ${badgeBg} border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">${label}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const m = L.marker([stop.lat, stop.lng], { icon });
      m.bindPopup(`<div class="text-xs text-slate-900 font-medium"><strong>Stop ${idx + 1}:</strong><br>${stop.name}</div>`);
      markersLayer.addLayer(m);
    });

    let isMounted = true;
    setIsCalculatingRoute(true);

    fetchRoadRoute(stops)
      .then((res) => {
        if (!isMounted) return;
        setIsCalculatingRoute(false);
        setRouteStats(res);

        if (routeLineRef.current && routeGlowRef.current) {
          routeLineRef.current.setLatLngs(res.coordinates);
          routeGlowRef.current.setLatLngs(res.coordinates);
          routeLineRef.current.setStyle({
            dashArray: res.isFallback ? '6, 6' : undefined,
            color: res.isFallback ? '#64748B' : '#2563EB',
          });
        }
      })
      .catch(() => {
        if (isMounted) setIsCalculatingRoute(false);
      });

    return () => {
      isMounted = false;
    };
  }, [stops]);

  // Click on Map to add/set stops
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const fallbackName = `Stop @ ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      if (activeMode === 'setStart') {
        const next = [...stops];
        next[0] = { ...next[0], lat, lng, name: fallbackName };
        notifyChanges(next);
        setActiveMode('addStop');
      } else if (activeMode === 'setEnd') {
        const next = [...stops];
        next[next.length - 1] = { ...next[next.length - 1], lat, lng, name: fallbackName };
        notifyChanges(next);
        setActiveMode('addStop');
      } else {
        // Insert new intermediate stop before final destination
        const newStop: BusStop = {
          id: `stop-${Date.now()}`,
          name: fallbackName,
          lat,
          lng,
          order: stops.length - 1,
        };
        const next = [...stops.slice(0, -1), newStop, stops[stops.length - 1]];
        notifyChanges(next);
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [activeMode, stops]);

  const removeStop = (index: number) => {
    if (stops.length <= 2) return; // Keep at least start and destination
    const next = stops.filter((_, idx) => idx !== index);
    notifyChanges(next);
  };

  const updateStopName = (index: number, name: string) => {
    const next = [...stops];
    next[index] = { ...next[index], name };
    notifyChanges(next);
  };

  const addPresetAsStop = (landmark: { name: string; lat: number; lng: number }) => {
    if (activeMode === 'setStart') {
      const next = [...stops];
      next[0] = { ...next[0], lat: landmark.lat, lng: landmark.lng, name: landmark.name };
      notifyChanges(next);
      setActiveMode('addStop');
    } else if (activeMode === 'setEnd') {
      const next = [...stops];
      next[next.length - 1] = { ...next[next.length - 1], lat: landmark.lat, lng: landmark.lng, name: landmark.name };
      notifyChanges(next);
      setActiveMode('addStop');
    } else {
      const newStop: BusStop = {
        id: `stop-${Date.now()}`,
        name: landmark.name,
        lat: landmark.lat,
        lng: landmark.lng,
        order: stops.length - 1,
      };
      const next = [...stops.slice(0, -1), newStop, stops[stops.length - 1]];
      notifyChanges(next);
    }
  };

  const useCurrentLocationForStart = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const next = [...stops];
      next[0] = { ...next[0], lat: pos.coords.latitude, lng: pos.coords.longitude, name: 'Current Location (Point A)' };
      notifyChanges(next);
      mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 14);
    });
  };

  return (
    <div className="space-y-3">
      {/* Mode Buttons & Route Summary Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveMode('addStop')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              activeMode === 'addStop'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Stop
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('setStart')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              activeMode === 'setStart'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Set Start (A)
          </button>
          <button
            type="button"
            onClick={useCurrentLocationForStart}
            title="Set Point A to Current GPS Location"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 bg-cyan-900/50 text-cyan-200 border border-cyan-700/50 hover:bg-cyan-800/80 transition-all"
          >
            <Locate className="w-3.5 h-3.5 text-cyan-400" />
            GPS (A)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('setEnd')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              activeMode === 'setEnd'
                ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            Set End (B)
          </button>
        </div>

        {/* Real-time distance and stop count metrics */}
        {routeStats && !isCalculatingRoute && (
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-lg">
            <span className="text-emerald-400 font-semibold">{stops.length} Mandatory Stops</span>
            <span className="text-slate-500">•</span>
            <span className="font-semibold text-white">{routeStats.distanceKm} km</span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              ~{routeStats.durationMin} min
            </span>
          </div>
        )}
      </div>

      {/* Interactive Map Box */}
      <div className="h-60 rounded-xl overflow-hidden border border-slate-700/80 shadow-inner relative">
        <div ref={containerRef} className="w-full h-full" />
        <div className="absolute top-2 right-2 z-[400] px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-[10px] font-medium flex items-center gap-1 shadow-lg">
          <Route className="w-3 h-3 text-blue-400" />
          {isCalculatingRoute ? (
            <span className="text-amber-300 animate-pulse">Calculating road route...</span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Multi-stop Road Route
            </span>
          )}
        </div>
      </div>

      {/* Interactive Ordered Stops Itinerary List */}
      <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
          <span>Route Stops Sequence ({stops.length}):</span>
          <span className="text-slate-500 font-normal">Click map to append intermediate stops</span>
        </div>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {stops.map((stop, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === stops.length - 1;
            const badgeBg = isFirst ? 'bg-blue-600' : isLast ? 'bg-purple-600' : 'bg-emerald-600';
            const label = isFirst ? 'A' : isLast ? 'B' : String(idx + 1);

            return (
              <div key={stop.id || idx} className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60">
                <span className={`w-5 h-5 rounded-full ${badgeBg} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                  {label}
                </span>
                <input
                  type="text"
                  value={stop.name}
                  onChange={(e) => updateStopName(idx, e.target.value)}
                  className="bg-transparent text-xs text-slate-200 flex-1 focus:outline-none border-b border-transparent focus:border-slate-500 px-1"
                />
                <span className="text-[10px] font-mono text-slate-400">
                  {stop.lat.toFixed(3)}, {stop.lng.toFixed(3)}
                </span>
                {!isFirst && !isLast && (
                  <button
                    type="button"
                    onClick={() => removeStop(idx)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove stop"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Egyptian Transit Hub Presets */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Landmark className="w-3.5 h-3.5 text-brand-400" />
          Click to Add Egyptian Transit Station Preset:
        </span>
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
          {OFFLINE_EGYPTIAN_LANDMARKS.map((lm) => (
            <button
              key={lm.name}
              type="button"
              onClick={() => addPresetAsStop(lm)}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] transition-colors"
            >
              + {lm.name.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

