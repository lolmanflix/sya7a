import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import { LiveBusLocation, BusRouteDefinition } from "../../types";
import { Eye, Filter, Crosshair, Maximize2 } from "lucide-react";
import { FleetMapLegend } from "./FleetMapLegend";
import { attachMapBaseStyle } from "./mapLayerManager";
import { MapThemeSelector } from "./MapThemeSelector";
import {
  filterVisibleCatalog,
  splitOrphanBeacons,
  orphanBeaconKey,
  drawCatalogRoutes,
  drawBeaconCorridors,
  drawLiveVehicles,
} from "./mapDrawLayers";
import { useTranslation } from "../../i18n/useTranslation";
import { getLineColor } from "../../utils/lineColors";
import { LineFilterPopover, LineFilterOption } from "./LineFilterPopover";

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
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const staticLayerRef = useRef<L.LayerGroup | null>(null);
  const linesLayerRef = useRef<L.LayerGroup | null>(null);
  const initialFitDoneRef = useRef<boolean>(false);
  const latestBoundsRef = useRef<L.LatLngBounds | null>(null);

  // Map Filter Controls
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(true);
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());

  // Extract unique companies present in the catalog
  const companiesList = useMemo(() => {
    const set = new Set<string>();
    catalogBuses.forEach((b) => {
      if (b.companyId) set.add(b.companyId.toLowerCase());
    });
    return Array.from(set);
  }, [catalogBuses]);

  // Unique line ids (case-insensitive) for the line filter, with stable colors
  const lineOptions = useMemo<LineFilterOption[]>(() => {
    const seen = new Map<string, LineFilterOption>();
    catalogBuses.forEach((b) => {
      const id = b.lineId;
      if (!id) return;
      const key = id.toLowerCase();
      if (!seen.has(key)) seen.set(key, { lineId: id, color: getLineColor(id) });
    });
    return Array.from(seen.values()).sort((a, b) =>
      a.lineId.localeCompare(b.lineId, undefined, { numeric: true })
    );
  }, [catalogBuses]);

  const isLineVisible = useCallback(
    (lineId: string) => !hiddenLines.has((lineId || "").toLowerCase()),
    [hiddenLines]
  );

  // Stable select wrapper: parent callbacks may be re-created each render, but
  // layer effects must not re-run because of it (reads the latest via ref).
  const onSelectBusRef = useRef(onSelectBus);
  useEffect(() => {
    onSelectBusRef.current = onSelectBus;
  });
  const handleSelectBus = useCallback((busId: string) => {
    onSelectBusRef.current?.(busId);
  }, []);

  // Orphan beacons (live lines missing from the catalog) + a coarse identity
  // key so corridor geometry redraws only on trip endpoint changes.
  const orphanBeacons = useMemo(
    () => splitOrphanBeacons(liveLocations, catalogBuses),
    [liveLocations, catalogBuses]
  );
  const beaconCorridorKey = useMemo(
    () => orphanBeaconKey(orphanBeacons),
    [orphanBeacons]
  );
  const orphanBeaconsRef = useRef(orphanBeacons);
  useEffect(() => {
    orphanBeaconsRef.current = orphanBeacons;
  });

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
    staticLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // OpenFreeMap vector base layer (light/dark via MapThemeSelector -> setMapStyle)
    const detachBaseStyle = attachMapBaseStyle(map);

    return () => {
      detachBaseStyle();
      try {
        map.remove();
      } catch (err) {
        console.warn("[FleetMap] Map teardown warning:", err);
      }
      mapInstanceRef.current = null;
    };
  }, []);

  // ── Static geometry pass: polylines, terminals, stop pins, beacon corridors.
  // Keyed by beaconCorridorKey (not raw GPS) so telemetry ticks never rebuild
  // routes or re-trigger road-snapping fetches — the previous single-effect
  // design cleared every layer on each tick and caused significant lag.
  useEffect(() => {
    if (!mapInstanceRef.current || !staticLayerRef.current || !linesLayerRef.current) return;
    const map = mapInstanceRef.current;
    const linesLayer = linesLayerRef.current;
    const staticLayer = staticLayerRef.current;

    linesLayer.clearLayers();
    staticLayer.clearLayers();

    const visibleBuses = filterVisibleCatalog(
      catalogBuses,
      selectedCompany,
      showActiveOnly,
      isLineVisible
    );
    const visibleOrphans = orphanBeaconsRef.current.filter((l) =>
      isLineVisible(l.lineId)
    );

    const boundsPoints: L.LatLngExpression[] = [
      ...drawCatalogRoutes({
        linesLayer,
        staticLayer,
        buses: visibleBuses,
        selectedBusId,
        onSelectBus: handleSelectBus,
        t,
      }),
      ...drawBeaconCorridors({
        linesLayer,
        staticLayer,
        beacons: visibleOrphans,
        t,
      }),
    ];

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
  }, [catalogBuses, selectedBusId, selectedCompany, showActiveOnly, hiddenLines, isLineVisible, handleSelectBus, beaconCorridorKey, t]);

  // ── Dynamic vehicle pass: repositions live markers only. Runs per telemetry
  // tick but performs zero polyline/network work.
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const visibleBuses = filterVisibleCatalog(
      catalogBuses,
      selectedCompany,
      showActiveOnly,
      isLineVisible
    );
    const visibleOrphans = orphanBeacons.filter((l) =>
      isLineVisible(l.lineId)
    );

    drawLiveVehicles({
      markersLayer: markersLayerRef.current,
      catalogBuses: visibleBuses,
      beacons: visibleOrphans,
      liveLocations,
      selectedBusId,
      onSelectBus: handleSelectBus,
      t,
    });
  }, [liveLocations, catalogBuses, selectedBusId, selectedCompany, showActiveOnly, hiddenLines, isLineVisible, handleSelectBus, orphanBeacons, t]);

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
    <div className="relative w-full h-full min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Filter Bar Overlaid on Map */}
      <div className="absolute top-3 start-3 max-w-[calc(100%-1.5rem)] z-[400] flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 text-xs shadow-xl pointer-events-auto">
        <MapThemeSelector />

        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-300">
          <Filter className="w-3.5 h-3.5 text-brand-400" />
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer text-xs max-w-[110px] sm:max-w-[160px] truncate"
          >
            <option value="all" className="bg-slate-900">{t("map.allOperators")}</option>
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
          <span>{showActiveOnly ? t("map.activeRoutes") : t("map.allRoutes")}</span>
        </button>

        <LineFilterPopover
          options={lineOptions}
          hiddenLines={hiddenLines}
          onToggle={(id) =>
            setHiddenLines((prev) => {
              const key = id.toLowerCase();
              const next = new Set(prev);
              if (next.has(key)) next.delete(key);
              else next.add(key);
              return next;
            })
          }
          onShowAll={() => setHiddenLines(new Set())}
          onHideAll={() => setHiddenLines(new Set(lineOptions.map((o) => o.lineId.toLowerCase())))}
        />

        <button
          type="button"
          onClick={handleFitAll}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs font-medium transition-colors"
          title={t("map.fitAllTitle")}
        >
          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
          <span>{t("map.fitAll")}</span>
        </button>

        <button
          type="button"
          onClick={handleResetView}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs font-medium transition-colors"
          title={t("map.centerTitle")}
        >
          <Crosshair className="w-3.5 h-3.5 text-slate-400" />
          <span>{t("map.center")}</span>
        </button>
      </div>

      <FleetMapLegend />
    </div>
  );
};
