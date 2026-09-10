import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { LiveBusLocation, BusRouteDefinition } from '../../types';
import { Layers, Eye, Filter, Crosshair, Maximize2 } from 'lucide-react';
import { fetchRoadRoute } from '../../services/routingService';

interface FleetMapProps {
  liveLocations: LiveBusLocation[];
  catalogBuses: BusRouteDefinition[];
  selectedBusId?: string | null;
  onSelectBus?: (busId: string) => void;
}

export const FleetMap: React.FC<FleetMapProps> = ({
  liveLocations,
  catalogBuses,
  selectedBusId,
  onSelectBus,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const linesLayerRef = useRef<L.LayerGroup | null>(null);
  const initialFitDoneRef = useRef<boolean>(false);
  const latestBoundsRef = useRef<L.LatLngBounds | null>(null);

  // Map Filter Controls
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(true);

  // Extract unique companies present in the catalog
  const companiesList = useMemo(() => {
    const set = new Set<string>();
    catalogBuses.forEach((b) => {
      if (b.companyId) set.add(b.companyId.toLowerCase());
    });
    return Array.from(set);
  }, [catalogBuses]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [30.0444, 31.2357], // Cairo center
      zoom: 12,
      zoomControl: false, // We'll position zoom on top-right
    });

    // Zoom control on top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Standard OpenStreetMap tiles (100% free, zero commercial API keys)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    linesLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Recalculate & Render Markers and Route Polylines
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !linesLayerRef.current) return;
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const linesLayer = linesLayerRef.current;

    markersLayer.clearLayers();
    linesLayer.clearLayers();

    const boundsPoints: L.LatLngExpression[] = [];

    // Filter catalog buses based on company & active toggles
    const visibleCatalogBuses = catalogBuses.filter((b) => {
      const matchCompany = selectedCompany === 'all' || b.companyId.toLowerCase() === selectedCompany.toLowerCase();
      const matchActive = !showActiveOnly || b.isActive;
      return matchCompany && matchActive;
    });

    // 1. Draw Active Bus Route Polylines (Lines between terminals)
    visibleCatalogBuses.forEach((bus) => {
      const hasValidStart = typeof bus.startLat === 'number' && typeof bus.startLng === 'number' && bus.startLat !== 0;
      const hasValidEnd = typeof bus.endLat === 'number' && typeof bus.endLng === 'number' && bus.endLat !== 0;

      if (hasValidStart && hasValidEnd) {
        const startLatLng: [number, number] = [bus.startLat, bus.startLng];
        const endLatLng: [number, number] = [bus.endLat, bus.endLng];
        boundsPoints.push(startLatLng, endLatLng);

        const isSelected = selectedBusId === bus.busId;
        const lineColor = bus.isActive ? (isSelected ? '#F59E0B' : '#10B981') : '#64748B';

        // Glowing outer casing polyline for active routes
        let glowLine: L.Polyline | null = null;
        if (bus.isActive) {
          glowLine = L.polyline([startLatLng, endLatLng], {
            color: lineColor,
            weight: 8,
            opacity: 0.25,
            lineCap: 'round',
          });
          linesLayer.addLayer(glowLine);
        }

        // Main route polyline
        const polyline = L.polyline([startLatLng, endLatLng], {
          color: lineColor,
          weight: bus.isActive ? 4 : 2,
          opacity: bus.isActive ? 0.9 : 0.45,
          dashArray: bus.isActive ? undefined : '6, 6',
          lineCap: 'round',
        });

        // Dynamically update coordinates to follow actual roads via OSRM routing engine
        fetchRoadRoute(bus.startLat, bus.startLng, bus.endLat, bus.endLng).then((res) => {
          if (!mapInstanceRef.current) return;
          polyline.setLatLngs(res.coordinates);
          if (glowLine) glowLine.setLatLngs(res.coordinates);
        });

        polyline.bindPopup(`
          <div class="p-1 min-w-[200px] text-slate-900 text-xs">
            <div class="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
              <span class="font-bold text-sm text-slate-900">${bus.lineId}</span>
              <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${bus.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                ${bus.isActive ? 'Active Route' : 'Idle Route'}
              </span>
            </div>
            <p class="text-slate-600 font-medium">Operator: <strong class="text-slate-900 uppercase">${bus.companyId}</strong></p>
            <p class="text-slate-700 mt-1"><strong>A:</strong> ${bus.startPoint}</p>
            <p class="text-slate-700"><strong>B:</strong> ${bus.endPoint}</p>
          </div>
        `);

        polyline.on('click', () => {
          if (onSelectBus) onSelectBus(bus.busId);
        });

        linesLayer.addLayer(polyline);

        // 2. Draw Start (A) & End (B) Terminal Badges
        const startIcon = L.divIcon({
          className: 'terminal-marker-start',
          html: `<div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">A</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        const mStart = L.marker(startLatLng, { icon: startIcon });
        mStart.bindPopup(`<div class="text-xs text-slate-900"><strong>Start (Line ${bus.lineId}):</strong><br>${bus.startPoint}</div>`);
        markersLayer.addLayer(mStart);

        const endIcon = L.divIcon({
          className: 'terminal-marker-end',
          html: `<div class="w-5 h-5 rounded-full bg-purple-600 border-2 border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">B</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        const mEnd = L.marker(endLatLng, { icon: endIcon });
        mEnd.bindPopup(`<div class="text-xs text-slate-900"><strong>Destination (Line ${bus.lineId}):</strong><br>${bus.endPoint}</div>`);
        markersLayer.addLayer(mEnd);

        // 3. Render Bus Vehicle Marker along the line
        // If a live driver stream exists for this line, use live location.
        // Otherwise, place a catalog bus marker at midpoint (50% between start and end).
        const liveMatch = liveLocations.find((loc) => loc.lineId.toLowerCase() === bus.lineId.toLowerCase());
        const busPos: [number, number] = liveMatch
          ? [liveMatch.latitude, liveMatch.longitude]
          : [(bus.startLat + bus.endLat) / 2, (bus.startLng + bus.endLng) / 2];

        boundsPoints.push(busPos);

        const isBusSelected = selectedBusId === bus.busId;
        const busBadgeColor = bus.isActive ? (isBusSelected ? 'bg-amber-500' : 'bg-emerald-600') : 'bg-slate-700';

        const catalogBusIcon = L.divIcon({
          className: 'custom-bus-marker',
          html: `
            <div class="relative flex flex-col items-center">
              ${bus.isActive ? '<span class="animate-ping absolute -top-1 inline-flex h-7 w-7 rounded-full bg-emerald-500 opacity-60"></span>' : ''}
              <div class="relative px-2 py-1 rounded-lg ${busBadgeColor} text-white flex items-center gap-1.5 shadow-xl border-2 border-white text-[11px] font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/><path d="M4 10h16"/></svg>
                <span>${bus.lineId}</span>
              </div>
            </div>
          `,
          iconSize: [80, 30],
          iconAnchor: [40, 15],
        });

        const busMarker = L.marker(busPos, { icon: catalogBusIcon });
        busMarker.bindPopup(`
          <div class="p-1 min-w-[210px] text-slate-900 text-xs">
            <div class="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
              <span class="font-bold text-sm text-slate-900">${bus.lineId}</span>
              <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${bus.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">
                ${bus.isActive ? (liveMatch ? '🟢 Live GPS' : 'Active Bus') : '⚪ Idle'}
              </span>
            </div>
            <p class="text-slate-600">Company: <strong class="text-slate-900 uppercase">${bus.companyId}</strong></p>
            <p class="text-slate-600 font-mono text-[10px]">Bus ID: ${bus.busId}</p>
            ${liveMatch ? `<p class="text-emerald-700 font-semibold mt-1">Driver: ${liveMatch.driverName}</p>` : ''}
            <div class="mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-slate-700 space-y-0.5">
              <p><strong>A:</strong> ${bus.startPoint}</p>
              <p><strong>B:</strong> ${bus.endPoint}</p>
            </div>
          </div>
        `);

        busMarker.on('click', () => {
          if (onSelectBus) onSelectBus(bus.busId);
        });

        markersLayer.addLayer(busMarker);
      }
    });

    // 4. Plot any Orphan Live Driver Beacons (not mapped to catalog routes)
    liveLocations.forEach((loc) => {
      const alreadyPlotted = visibleCatalogBuses.some((b) => b.lineId.toLowerCase() === loc.lineId.toLowerCase());
      if (!alreadyPlotted) {
        const livePos: [number, number] = [loc.latitude, loc.longitude];
        boundsPoints.push(livePos);

        const orphanIcon = L.divIcon({
          className: 'custom-orphan-pin',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-cyan-500 opacity-60"></span>
              <div class="relative px-2 py-1 rounded-lg bg-cyan-600 text-white flex items-center gap-1 shadow-lg border-2 border-white text-[11px] font-bold">
                <span>${loc.lineId}</span>
              </div>
            </div>
          `,
          iconSize: [60, 26],
          iconAnchor: [30, 13],
        });

        const m = L.marker(livePos, { icon: orphanIcon });
        m.bindPopup(`
          <div class="text-xs text-slate-900">
            <strong>Line ${loc.lineId} (Live Driver Beacon)</strong><br>
            Driver: ${loc.driverName}<br>
            Email: ${loc.driverEmail}
          </div>
        `);
        markersLayer.addLayer(m);
      }
    });

    // 5. Store latest bounds & auto-fit ONLY on initial load (prevents jumping during live telemetry streaming)
    if (boundsPoints.length > 0) {
      try {
        const latLngBounds = L.latLngBounds(boundsPoints);
        latestBoundsRef.current = latLngBounds;

        if (!initialFitDoneRef.current) {
          map.fitBounds(latLngBounds.pad(0.18), { maxZoom: 14, animate: false });
          initialFitDoneRef.current = true;
        }
      } catch (err) {
        console.error('Error calculating map bounds:', err);
      }
    }
  }, [liveLocations, catalogBuses, selectedBusId, selectedCompany, showActiveOnly, onSelectBus]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([30.0444, 31.2357], 12);
    }
  };

  const handleFitAll = () => {
    if (mapInstanceRef.current && latestBoundsRef.current && latestBoundsRef.current.isValid()) {
      mapInstanceRef.current.fitBounds(latestBoundsRef.current.pad(0.18), { maxZoom: 14, animate: true });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([30.0444, 31.2357], 12);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[440px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Filter Bar Overlaid on Map */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 text-xs shadow-xl pointer-events-auto">
        {/* Company Dropdown Filter */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-300">
          <Filter className="w-3.5 h-3.5 text-brand-400" />
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
          >
            <option value="all" className="bg-slate-900">All Operators</option>
            {companiesList.map((cid) => (
              <option key={cid} value={cid} className="bg-slate-900 uppercase">
                {cid}
              </option>
            ))}
          </select>
        </div>

        {/* Show Active Routes Only Toggle */}
        <button
          type="button"
          onClick={() => setShowActiveOnly(!showActiveOnly)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
            showActiveOnly
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showActiveOnly ? 'Active Routes Only' : 'Show All Routes'}</span>
        </button>

        {/* Fit All Routes & Fleet */}
        <button
          type="button"
          onClick={handleFitAll}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs font-medium transition-colors"
          title="Fit all active routes and buses to view"
        >
          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Fit All</span>
        </button>

        {/* Center Cairo Button */}
        <button
          type="button"
          onClick={handleResetView}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs font-medium transition-colors"
          title="Reset to Cairo Center"
        >
          <Crosshair className="w-3.5 h-3.5 text-slate-400" />
          <span>Center</span>
        </button>
      </div>

      {/* Modern Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-xs space-y-2 shadow-2xl pointer-events-auto">
        <span className="font-bold text-white tracking-wider text-[10px] uppercase block border-b border-slate-800 pb-1 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-brand-400" /> Map Legend
        </span>
        <div className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-emerald-500 shadow-sm"></span>
          <span className="text-slate-300 font-medium">Active Bus Line (Road Network)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-5 rounded bg-emerald-600 border border-white text-[8px] font-bold text-white flex items-center justify-center">BUS</span>
          <span className="text-slate-300">Active Bus Vehicle</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-600 border border-white text-[8px] text-white flex items-center justify-center font-bold">A</span>
          <span className="text-slate-300">Start Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-purple-600 border border-white text-[8px] text-white flex items-center justify-center font-bold">B</span>
          <span className="text-slate-300">Destination Terminal</span>
        </div>
      </div>
    </div>
  );
};
