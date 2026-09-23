import L from "leaflet";
import { LiveBusLocation, BusRouteDefinition } from "../../types";

/**
 * Creates a terminal depot A or B pin marker with popup.
 */
export function createTerminalMarker(
  latLng: [number, number],
  type: "A" | "B",
  lineId: string,
  pointName: string
): L.Marker {
  const isA = type === "A";
  const bg = isA ? "bg-blue-600" : "bg-purple-600";
  const icon = L.divIcon({
    className: `terminal-marker-${type.toLowerCase()}`,
    html: `<div class="w-5 h-5 rounded-full ${bg} border-2 border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">${type}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
  const m = L.marker(latLng, { icon });
  m.bindPopup(
    `<div class="text-xs text-slate-900"><strong>${isA ? "Start" : "Destination"} (Line ${lineId}):</strong><br>${pointName}</div>`
  );
  return m;
}

/**
 * Creates a bus vehicle marker along the line with telemetry popup.
 */
export function createCatalogBusMarker(
  pos: [number, number],
  bus: BusRouteDefinition,
  isSelected: boolean,
  liveMatch: LiveBusLocation | undefined,
  onSelectBus?: (busId: string) => void
): L.Marker {
  const badgeColor = bus.isActive ? (isSelected ? "bg-amber-500" : "bg-emerald-600") : "bg-slate-700";
  const ping = bus.isActive ? "<span class='animate-ping absolute -top-1 inline-flex h-7 w-7 rounded-full bg-emerald-500 opacity-60'></span>" : "";
  const icon = L.divIcon({
    className: "custom-bus-marker",
    html: `
      <div class="relative flex flex-col items-center">
        ${ping}
        <div class="relative px-2 py-1 rounded-lg ${badgeColor} text-white flex items-center gap-1.5 shadow-xl border-2 border-white text-[11px] font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/><path d="M4 10h16"/></svg>
          <span>${bus.lineId}</span>
        </div>
      </div>
    `,
    iconSize: [80, 30],
    iconAnchor: [40, 15],
  });

  const marker = L.marker(pos, { icon });
  const statusBadge = bus.isActive
    ? (liveMatch ? "<span class='text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800'>🟢 Live GPS</span>" : "<span class='text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800'>Active Bus</span>")
    : "<span class='text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700'>⚪ Idle</span>";
  const driverInfo = liveMatch ? `<p class="text-emerald-700 font-semibold mt-1">Driver: ${liveMatch.driverName}</p>` : "";

  marker.bindPopup(`
    <div class="p-1 min-w-[210px] text-slate-900 text-xs">
      <div class="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
        <span class="font-bold text-sm text-slate-900">${bus.lineId}</span>
        ${statusBadge}
      </div>
      <p class="text-slate-600">Company: <strong class="text-slate-900 uppercase">${bus.companyId}</strong></p>
      ${driverInfo}
      <div class="mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-slate-700 space-y-0.5">
        <p><strong>A:</strong> ${bus.startPoint}</p>
        <p><strong>B:</strong> ${bus.endPoint}</p>
      </div>
    </div>
  `);

  if (onSelectBus) {
    marker.on("click", () => onSelectBus(bus.busId));
  }
  return marker;
}

/**
 * Creates an orphan live driver beacon marker with radar ping.
 */
export function createLiveBeaconMarker(pos: [number, number], loc: LiveBusLocation): L.Marker {
  const icon = L.divIcon({
    className: "custom-orphan-pin",
    html: `
      <div class="relative flex flex-col items-center">
        <span class="animate-ping absolute -top-1 inline-flex h-7 w-7 rounded-full bg-cyan-400 opacity-60"></span>
        <div class="relative px-2 py-1 rounded-lg bg-cyan-600 text-white flex items-center gap-1.5 shadow-xl border-2 border-white text-[11px] font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/><path d="M4 10h16"/></svg>
          <span>${loc.lineId}</span>
        </div>
      </div>
    `,
    iconSize: [80, 30],
    iconAnchor: [40, 15],
  });

  const destInfo = loc.endPoint ? `<p class="text-purple-700 font-medium text-[11px] mt-1">🎯 Destination: ${loc.endPoint}</p>` : "";

  const m = L.marker(pos, { icon });
  m.bindPopup(`
    <div class="p-1 min-w-[210px] text-slate-900 text-xs">
      <div class="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
        <span class="font-bold text-sm text-cyan-800">${loc.lineId}</span>
        <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800">
          🟢 Live GPS
        </span>
      </div>
      <p class="text-slate-700 font-semibold mt-1">Driver: ${loc.driverName}</p>
      <p class="text-slate-500 font-mono text-[10px] truncate">${loc.driverEmail}</p>
      ${destInfo}
    </div>
  `);
  return m;
}
