/**
 * @file mapDrawLayers.ts
 * @description Pure Leaflet layer-drawing helpers for FleetMap, split out so the
 * component keeps separate render passes: static geometry (polylines, terminals,
 * stop pins, beacon corridors) vs dynamic vehicles (live marker positions).
 */
import L from "leaflet";
import { LiveBusLocation, BusRouteDefinition } from "../../types";
import { fetchRoadRoute } from "../../services/routingService";
import { getLineColor } from "../../utils/lineColors";
import {
  createTerminalMarker,
  createCatalogBusMarker,
  createLiveBeaconMarker,
  TranslateFn,
} from "./fleetMapHelpers";

type SelectFn = (busId: string) => void;

/** Applies company / active-only / per-line visibility filters to the catalog. */
export function filterVisibleCatalog(
  catalogBuses: BusRouteDefinition[],
  selectedCompany: string,
  showActiveOnly: boolean,
  isLineVisible: (lineId: string) => boolean
): BusRouteDefinition[] {
  return catalogBuses.filter((b) => {
    const matchCompany =
      selectedCompany === "all" ||
      b.companyId.toLowerCase() === selectedCompany.toLowerCase();
    const matchActive = !showActiveOnly || b.isActive;
    return matchCompany && matchActive && isLineVisible(b.lineId);
  });
}

/** Returns live beacons whose line id is missing from the catalog. */
export function splitOrphanBeacons(
  liveLocations: LiveBusLocation[],
  catalogBuses: BusRouteDefinition[]
): LiveBusLocation[] {
  const catalogIds = new Set(
    catalogBuses.map((b) => (b.lineId || "").toLowerCase())
  );
  return liveLocations.filter(
    (l) => !catalogIds.has((l.lineId || "").toLowerCase())
  );
}

/**
 * Stable identity key for orphan beacon corridors. Ignoring raw GPS coordinates
 * means corridors redraw only when trip endpoints change — not on every tick.
 */
export function orphanBeaconKey(beacons: LiveBusLocation[]): string {
  return beacons
    .map(
      (l) =>
        `${l.lineId}|${l.startLat ?? 0},${l.startLng ?? 0},${l.endLat ?? 0},${l.endLng ?? 0}`
    )
    .join(";");
}

/**
 * Draws catalog route polylines (plus glow, popups, road-snapped paths), stop
 * pins and terminal markers. Returns the bounds points for the initial fit.
 */
export function drawCatalogRoutes(opts: {
  linesLayer: L.LayerGroup;
  staticLayer: L.LayerGroup;
  buses: BusRouteDefinition[];
  selectedBusId?: string | null;
  onSelectBus?: SelectFn;
  t: TranslateFn;
}): L.LatLngExpression[] {
  const { linesLayer, staticLayer, buses, selectedBusId, onSelectBus, t } = opts;
  const boundsPoints: L.LatLngExpression[] = [];

  buses.forEach((bus) => {
    const hasValidStart =
      typeof bus.startLat === "number" &&
      typeof bus.startLng === "number" &&
      bus.startLat !== 0;
    const hasValidEnd =
      typeof bus.endLat === "number" &&
      typeof bus.endLng === "number" &&
      bus.endLat !== 0;
    if (!hasValidStart || !hasValidEnd) return;

    const startLatLng: [number, number] = [bus.startLat, bus.startLng];
    const endLatLng: [number, number] = [bus.endLat, bus.endLng];
    boundsPoints.push(startLatLng, endLatLng);

    const isSelected = selectedBusId === bus.busId;
    const lineColor = isSelected ? "#F59E0B" : getLineColor(bus.lineId);

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

    const waypoints =
      bus.stops && bus.stops.length >= 2
        ? bus.stops
        : [
            { lat: bus.startLat, lng: bus.startLng },
            { lat: bus.endLat, lng: bus.endLng },
          ];

    fetchRoadRoute(waypoints).then((res) => {
      if (res.coordinates.length === 0) return;
      polyline.setLatLngs(res.coordinates);
      if (glowLine) glowLine.setLatLngs(res.coordinates);
    });

    if (bus.stops && bus.stops.length > 2) {
      bus.stops.slice(1, -1).forEach((stop, sIdx) => {
        const stopIcon = L.divIcon({
          className: "intermediate-stop-pin",
          html: `<div style="background:${lineColor}" class="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex items-center justify-center text-[7px] font-bold text-white">${sIdx + 2}</div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const mStop = L.marker([stop.lat, stop.lng], { icon: stopIcon });
        mStop.bindPopup(
          `<div class="text-xs text-slate-900"><strong>${t("map.popupStop", { n: sIdx + 2, line: bus.lineId })}</strong><br>${stop.name}</div>`
        );
        staticLayer.addLayer(mStop);
      });
    }

    polyline.bindPopup(`
      <div class="p-1 min-w-[200px] text-slate-900 text-xs">
        <div class="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
          <span class="font-bold text-sm text-slate-900">${bus.lineId}</span>
          <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${bus.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}">
            ${bus.isActive ? t("map.activeRoute") : t("map.idleRoute")}
          </span>
        </div>
        <p class="text-slate-600 font-medium">${t("map.operatorLabel")} <strong class="text-slate-900 uppercase">${bus.companyId}</strong></p>
        <p class="text-slate-700 mt-1"><strong>A:</strong> ${bus.startPoint}</p>
        <p class="text-slate-700"><strong>B:</strong> ${bus.endPoint}</p>
      </div>
    `);

    polyline.on("click", () => {
      onSelectBus?.(bus.busId);
    });

    linesLayer.addLayer(polyline);
    staticLayer.addLayer(
      createTerminalMarker(startLatLng, "A", bus.lineId, bus.startPoint, t)
    );
    staticLayer.addLayer(
      createTerminalMarker(endLatLng, "B", bus.lineId, bus.endPoint, t)
    );
  });

  return boundsPoints;
}

/**
 * Draws road-corridor lines and terminal pins for orphan (non-catalog) beacons.
 * Markers themselves are drawn by drawLiveVehicles. Returns bounds points.
 */
export function drawBeaconCorridors(opts: {
  linesLayer: L.LayerGroup;
  staticLayer: L.LayerGroup;
  beacons: LiveBusLocation[];
  t: TranslateFn;
}): L.LatLngExpression[] {
  const { linesLayer, staticLayer, beacons, t } = opts;
  const boundsPoints: L.LatLngExpression[] = [];

  beacons.forEach((loc) => {
    const livePos: [number, number] = [loc.latitude, loc.longitude];
    boundsPoints.push(livePos);
    if (
      typeof loc.endLat !== "number" ||
      typeof loc.endLng !== "number" ||
      loc.endLat === 0
    ) {
      return;
    }

    const originLat =
      typeof loc.startLat === "number" && loc.startLat !== 0
        ? loc.startLat
        : loc.latitude;
    const originLng =
      typeof loc.startLng === "number" && loc.startLng !== 0
        ? loc.startLng
        : loc.longitude;
    const originPt: [number, number] = [originLat, originLng];
    const destPt: [number, number] = [loc.endLat, loc.endLng];
    boundsPoints.push(originPt, destPt);

    const liveRouteHalo = L.polyline([originPt, destPt], {
      color: "#06b6d4",
      weight: 9,
      opacity: 0.3,
      lineCap: "round",
      lineJoin: "round",
    });
    linesLayer.addLayer(liveRouteHalo);

    const liveRouteCasing = L.polyline([originPt, destPt], {
      color: "#083344",
      weight: 5.5,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
    });
    linesLayer.addLayer(liveRouteCasing);

    const liveRouteLine = L.polyline([originPt, destPt], {
      color: "#22d3ee",
      weight: 3.5,
      opacity: 1.0,
      lineCap: "round",
      lineJoin: "round",
    });
    linesLayer.addLayer(liveRouteLine);

    fetchRoadRoute([
      { lat: originLat, lng: originLng },
      { lat: destPt[0], lng: destPt[1] },
    ]).then((res) => {
      if (res.coordinates.length === 0) return;
      liveRouteLine.setLatLngs(res.coordinates);
      liveRouteCasing.setLatLngs(res.coordinates);
      liveRouteHalo.setLatLngs(res.coordinates);
    });

    staticLayer.addLayer(
      createTerminalMarker(
        originPt,
        "A",
        loc.lineId,
        loc.startPoint || t("map.startTerminal"),
        t
      )
    );
    staticLayer.addLayer(
      createTerminalMarker(
        destPt,
        "B",
        loc.lineId,
        loc.endPoint || t("map.destination"),
        t
      )
    );
  });

  return boundsPoints;
}

/**
 * Clears and redraws only the dynamic vehicle markers. Catalog badges render
 * exclusively for lines with a live GPS match (or the selected line) — phantom
 * mid-route cards for every catalog entry are intentionally suppressed. Called
 * on every telemetry tick — deliberately free of polyline/network work.
 */
export function drawLiveVehicles(opts: {
  markersLayer: L.LayerGroup;
  catalogBuses: BusRouteDefinition[];
  beacons: LiveBusLocation[];
  liveLocations: LiveBusLocation[];
  selectedBusId?: string | null;
  onSelectBus?: SelectFn;
  t: TranslateFn;
}): void {
  const {
    markersLayer,
    catalogBuses,
    beacons,
    liveLocations,
    selectedBusId,
    onSelectBus,
    t,
  } = opts;
  markersLayer.clearLayers();

  catalogBuses.forEach((bus) => {
    const hasValidStart =
      typeof bus.startLat === "number" &&
      typeof bus.startLng === "number" &&
      bus.startLat !== 0;
    const hasValidEnd =
      typeof bus.endLat === "number" &&
      typeof bus.endLng === "number" &&
      bus.endLat !== 0;
    if (!hasValidStart || !hasValidEnd) return;

    const liveMatch = liveLocations.find(
      (loc) => loc.lineId.toLowerCase() === bus.lineId.toLowerCase()
    );
    const isSelected = selectedBusId === bus.busId;
    // Only badge lines that are actually broadcasting (or the selected line).
    if (!liveMatch && !isSelected) return;

    const busPos: [number, number] = liveMatch
      ? [liveMatch.latitude, liveMatch.longitude]
      : [(bus.startLat + bus.endLat) / 2, (bus.startLng + bus.endLng) / 2];

    markersLayer.addLayer(
      createCatalogBusMarker(
        busPos,
        bus,
        isSelected,
        liveMatch,
        onSelectBus,
        t
      )
    );
  });

  beacons.forEach((loc) => {
    markersLayer.addLayer(
      createLiveBeaconMarker([loc.latitude, loc.longitude], loc, t)
    );
  });
}
