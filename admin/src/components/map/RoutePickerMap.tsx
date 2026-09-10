import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Route, CheckCircle2 } from 'lucide-react';
import { fetchRoadRoute, RouteGeometryResult } from '../../services/routingService';
import { resolveNearestLandmark } from '../../services/landmarkService';
import { BusStop } from '../../types';
import { EgyptianLandmark } from '../../constants/landmarks';
import { RouteStopsList } from './RouteStopsList';
import { EgyptianLandmarksPicker } from './EgyptianLandmarksPicker';
import { RouteMapToolbar } from './RouteMapToolbar';

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

  // Sync with incoming initialStops when editing changes
  useEffect(() => {
    if (initialStops && initialStops.length >= 2) {
      setStops((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(initialStops)) return prev;
        return initialStops;
      });
    }
  }, [initialStops]);

  // Fit map viewport to currently configured route stops and road geometry
  const fitRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.invalidateSize();
    const coords = routeStats && routeStats.coordinates && routeStats.coordinates.length > 0
      ? routeStats.coordinates
      : stops.map((s) => [s.lat, s.lng] as [number, number]);

    if (coords.length >= 2) {
      const b = L.latLngBounds(coords);
      if (b.isValid()) {
        map.fitBounds(b, { padding: [35, 35], maxZoom: 15 });
      }
    }
  }, [routeStats, stops]);

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

    // Invalidate container size shortly after modal appearance and fit bounds
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        const coords = stops.map((s) => [s.lat, s.lng] as [number, number]);
        if (coords.length >= 2) {
          const b = L.latLngBounds(coords);
          if (b.isValid()) {
            mapRef.current.fitBounds(b, { padding: [35, 35], maxZoom: 15 });
          }
        }
      }
    }, 200);

    return () => {
      clearTimeout(timer);
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
    const map = mapRef.current;
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

        // Auto-center and fit bounds on the calculated route
        if (mapRef.current) {
          const coords = res.coordinates.length > 0 ? res.coordinates : stops.map((s) => [s.lat, s.lng] as [number, number]);
          if (coords.length >= 2) {
            const b = L.latLngBounds(coords);
            if (b.isValid()) {
              mapRef.current.fitBounds(b, { padding: [35, 35], maxZoom: 15 });
            }
          }
        }
      })
      .catch(() => {
        if (isMounted) setIsCalculatingRoute(false);
      });

    return () => {
      isMounted = false;
    };
  }, [stops]);

  // Asynchronously resolve the nearest named landmark and update stop name
  const updateStopWithLandmark = (targetId: string, lat: number, lng: number) => {
    resolveNearestLandmark(lat, lng).then((res) => {
      setStops((current) => {
        const idx = current.findIndex((s) => s.id === targetId);
        if (idx === -1) return current;
        const next = [...current];
        next[idx] = { ...next[idx], name: res.name };
        notifyChanges(next);
        return next;
      });
    });
  };

  // Click on Map to add/set stops
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (activeMode === 'setStart') {
        const next = [...stops];
        const targetId = next[0].id;
        next[0] = { ...next[0], lat, lng, name: 'Finding landmark...' };
        notifyChanges(next);
        setActiveMode('addStop');
        updateStopWithLandmark(targetId, lat, lng);
      } else if (activeMode === 'setEnd') {
        const next = [...stops];
        const targetId = next[next.length - 1].id;
        next[next.length - 1] = { ...next[next.length - 1], lat, lng, name: 'Finding landmark...' };
        notifyChanges(next);
        setActiveMode('addStop');
        updateStopWithLandmark(targetId, lat, lng);
      } else {
        // Insert new intermediate stop before final destination
        const stopId = `stop-${Date.now()}`;
        const newStop: BusStop = {
          id: stopId,
          name: 'Finding landmark...',
          lat,
          lng,
          order: stops.length - 1,
        };
        const next = [...stops.slice(0, -1), newStop, stops[stops.length - 1]];
        notifyChanges(next);
        updateStopWithLandmark(stopId, lat, lng);
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

  const addPresetAsStop = (landmark: EgyptianLandmark) => {
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
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const next = [...stops];
      const targetId = next[0].id;
      next[0] = { ...next[0], lat, lng, name: 'Current Location (Point A)' };
      notifyChanges(next);
      mapRef.current?.setView([lat, lng], 14);
      updateStopWithLandmark(targetId, lat, lng);
    });
  };

  return (
    <div className="space-y-3">
      {/* Mode Buttons & Route Summary Badges */}
      <RouteMapToolbar
        activeMode={activeMode}
        onSetActiveMode={setActiveMode}
        onUseCurrentLocation={useCurrentLocationForStart}
        onFitRoute={fitRoute}
        routeStats={routeStats}
        isCalculatingRoute={isCalculatingRoute}
        stopsCount={stops.length}
      />

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
      <RouteStopsList
        stops={stops}
        onUpdateName={updateStopName}
        onRemoveStop={removeStop}
      />

      {/* Egyptian Transit Hub Presets */}
      <EgyptianLandmarksPicker onSelectLandmark={addPresetAsStop} />
    </div>
  );
};

