import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import { LiveBusLocation, BusRouteDefinition } from "../../types";
import { Eye, Filter, Crosshair, Maximize2 } from "lucide-react";
import { FleetMapLegend } from "./FleetMapLegend";
import { fetchRoadRoute } from "../../services/routingService";
import { attachMapBaseTheme, MapTheme } from "./mapLayerManager";
import { MapThemeSelector } from "./MapThemeSelector";
import {
  createTerminalMarker,
  createCatalogBusMarker,
  createLiveBeaconMarker,
} from "./fleetMapHelpers";

interface FleetMapProps {
  liveLocations: LiveBusLocation[];
  catalogBuses: BusRouteDefinition[];
  selectedBusId?: string | null;
  onSelectBus?: (busId: string) => void;
}

/**
 * Real-time fleet overview map displaying active buses, routes, and telemetry.
 */
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

  // Map Filter & Theme Controls
  const [mapTheme, setMapTheme] = useState<MapTheme>("dark");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
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
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    linesLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Synchronize Map Base Theme (Carto Dark, Clean Voyager, or Offline)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const cleanup = attachMapBaseTheme(mapInstanceRef.current, mapTheme);
    return () => cleanup();
  }, [mapTheme]);

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
      const matchCompany = selectedCompany === "all" || b.companyId.toLowerCase() === selectedCompany.toLowerCase();
      const matchActive = !showActiveOnly || b.isActive;
      return matchCompany && matchActive;
    });

    // 1. Draw Catalog Bus Route Polylines
    visibleCatalogBuses.forEach((bus) => {
      const hasValidStart = typeof bus.startLat === "number" && typeof bus.startLng === "number" && bus.startLat !== 0;
      const hasValidEnd = typeof bus.endLat === "number" && typeof bus.endLng === "number" && bus.endLat !== 0;

      if (hasValidStart && hasValidEnd) {
        const startLatLng: [number, number] = [bus.startLat, bus.startLng];
        const endLatLng: [number, number] = [bus.endLat, bus.endLng];
        boundsPoints.push(startLatLng, endLatLng);

        const isSelected = selectedBusId === bus.busId;
        const lineColor = bus.isActive ? (isSelected ? "#F59E0B" : "#10B981") : "#64748B";

        let glowLine: L.Polyline | null = null;
        if (bus.isActive) {
          glowLine = L.polyline([startLatLng, endLatLng], {
            color: lineColor,
            weight: 8,
            opacity: 0.25,
            lineCap: "round",
          });
          linesLayer.addLayer(glowLine);
        }

        const polyline = L.polyline([startLatLng, endLatLng], {
          color: lineColor,
          weight: bus.isActive ? 4 : 2,
          opacity: bus.isActive ? 0.9 : 0.45,
          dashArray: bus.isActive ? undefined : "6, 6",
          lineCap: "round",
        });

        const waypoints = bus.stops && bus.stops.length >= 2 ? bus.stops : [
          { lat: bus.startLat, lng: bus.startLng },
          { lat: bus.endLat, lng: bus.endLng },
        ];

        fetchRoadRoute(waypoints).then((res) => {
          if (!mapInstanceRef.current) return;
          polyline.setLatLngs(res.coordinates);
          if (glowLine) glowLine.setLatLngs(res.coordinates);
        });

        // Intermediate stop pins
        if (bus.stops && bus.stops.length > 2) {
          bus.stops.slice(1, -1).forEach((stop, sIdx) => {
            const stopIcon = L.divIcon({
              className: "intermediate-stop-pin",
              html: `<div class="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white shadow-sm flex items-center justify-center text-[7px] font-bold text-white">${sIdx + 2}</div>`,
              iconSize: [14, 14],
              iconAnchor: [7, 7],
            });
            const mStop = L.marker([stop.lat, stop.lng], { icon: stopIcon });
            mStop.bindPopup(`<div class="text-xs text-slate-900"><strong>Stop ${sIdx + 2} (${bus.lineId}):</strong><br>${stop.name}</div>`);
            markersLayer.addLayer(mStop);
          });
        }

        polyline.bindPopup(`
          <div class="p-1 min-w-[200px] text-slate-900 text-xs">
            <div class="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
              <span class="font-bold text-sm text-slate-900">${bus.lineId}</span>
              <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${bus.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}">
                ${bus.isActive ? "Active Route" : "Idle Route"}
              </span>
            </div>
            <p class="text-slate-600 font-medium">Operator: <strong class="text-slate-900 uppercase">${bus.companyId}</strong></p>
            <p class="text-slate-700 mt-1"><strong>A:</strong> ${bus.startPoint}</p>
            <p class="text-slate-700"><strong>B:</strong> ${bus.endPoint}</p>
          </div>
        `);

        polyline.on("click", () => {
          if (onSelectBus) onSelectBus(bus.busId);
        });

        linesLayer.addLayer(polyline);
        markersLayer.addLayer(createTerminalMarker(startLatLng, "A", bus.lineId, bus.startPoint));
        markersLayer.addLayer(createTerminalMarker(endLatLng, "B", bus.lineId, bus.endPoint));

        // Vehicle Marker
        const liveMatch = liveLocations.find((loc) => loc.lineId.toLowerCase() === bus.lineId.toLowerCase());
        const busPos: [number, number] = liveMatch
          ? [liveMatch.latitude, liveMatch.longitude]
          : [(bus.startLat + bus.endLat) / 2, (bus.startLng + bus.endLng) / 2];

        boundsPoints.push(busPos);
        const isBusSelected = selectedBusId === bus.busId;
        markersLayer.addLayer(createCatalogBusMarker(busPos, bus, isBusSelected, liveMatch, onSelectBus));
      }
    });

    // 2. Plot Active Live Driver Beacons (not in catalog) with Road Route & Terminals
    liveLocations.forEach((loc) => {
      const alreadyPlotted = visibleCatalogBuses.some((b) => b.lineId.toLowerCase() === loc.lineId.toLowerCase());
      if (!alreadyPlotted) {
        const livePos: [number, number] = [loc.latitude, loc.longitude];
        boundsPoints.push(livePos);

        // If beacon has destination coordinates, draw road route and terminal B
        if (typeof loc.endLat === "number" && typeof loc.endLng === "number" && loc.endLat !== 0) {
          const startPt: [number, number] = [loc.latitude, loc.longitude];
          const endPt: [number, number] = [loc.endLat, loc.endLng];
          boundsPoints.push(startPt, endPt);

          const liveRouteGlow = L.polyline([startPt, endPt], {
            color: "#06B6D4",
            weight: 8,
            opacity: 0.25,
            lineCap: "round",
          });
          linesLayer.addLayer(liveRouteGlow);

          const liveRouteLine = L.polyline([startPt, endPt], {
            color: "#0891B2",
            weight: 4,
            opacity: 0.9,
            lineCap: "round",
          });
          linesLayer.addLayer(liveRouteLine);

          fetchRoadRoute([
            { lat: startPt[0], lng: startPt[1] },
            { lat: loc.latitude, lng: loc.longitude },
            { lat: endPt[0], lng: endPt[1] },
          ]).then((res) => {
            if (mapInstanceRef.current) {
              liveRouteLine.setLatLngs(res.coordinates);
              liveRouteGlow.setLatLngs(res.coordinates);
            }
          });

          markersLayer.addLayer(createTerminalMarker(endPt, "B", loc.lineId, loc.endPoint || "Destination"));
        }

        markersLayer.addLayer(createLiveBeaconMarker(livePos, loc));
      }
    });

    if (boundsPoints.length > 0) {
      try {
        const latLngBounds = L.latLngBounds(boundsPoints);
        latestBoundsRef.current = latLngBounds;
        if (!initialFitDoneRef.current && latLngBounds.isValid()) {
          map.fitBounds(latLngBounds.pad(0.18), { maxZoom: 14, animate: false });
          initialFitDoneRef.current = true;
        }
      } catch {
        // Fallback bounds gracefully
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
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Filter Bar Overlaid on Map */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 text-xs shadow-xl pointer-events-auto">
        <MapThemeSelector currentTheme={mapTheme} onThemeChange={setMapTheme} />

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

        <button
          type="button"
          onClick={() => setShowActiveOnly(!showActiveOnly)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
            showActiveOnly
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
              : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showActiveOnly ? "Active Routes" : "All Routes"}</span>
        </button>

        <button
          type="button"
          onClick={handleFitAll}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs font-medium transition-colors"
          title="Fit all active routes and buses to view"
        >
          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Fit All</span>
        </button>

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

      <FleetMapLegend />
    </div>
  );
};
