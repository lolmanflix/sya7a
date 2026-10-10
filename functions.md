# Automated Functions Catalog (`functions.md`)

> **Note:** This file is automatically compiled by `scripts/generate_functions_doc.py`.
> Do not manually edit this file. Keep inline docstrings updated in the source code.

**Total Documented Functions:** 572

---

## [App.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/App.tsx)
`admin/src/App.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L28 | `App()` | *none* | Root React Native application entry point component. |

## [AccountSwitcher.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/common/AccountSwitcher.tsx)
`admin/src/components/common/AccountSwitcher.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L7 | `roleLabel()` | `account: AccountRecord, t: Translate` | No description provided. |
| L14 | `AccountSwitcher()` | *none* | Profile chip with an account-switcher dropdown: lists every added account (instant silent switch), plus "Add another account" and "Sign out". |
| L26 | `onKeyDown()` | `e: KeyboardEvent` | No description provided. |
| L29 | `onMouseDown()` | `e: MouseEvent` | No description provided. |
| L43 | `handleSwitch()` | `id: string` | No description provided. |

## [Modal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/common/Modal.tsx)
`admin/src/components/common/Modal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `Modal()` | `{   isOpen,   onClose,   title,   subtitle,   children,   maxWidth = 'lg', }` | Reusable modal dialog overlay component. |
| L28 | `handleKeyDown()` | `e: KeyboardEvent` | Listens for Escape key press to dismiss modal. |

## [Navbar.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/common/Navbar.tsx)
`admin/src/components/common/Navbar.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L13 | `Navbar()` | `{   activeVehiclesCount,   onOpenLogin,   isDemo = false,   company = null,   onToggleSidebar, }` | Active company (dispatcher) — shown instead of the Wasalt brand. */ company?: CompanyRecord | null; /** Toggles the mobile navigation drawer (hamburger). */ onToggleSidebar?: () => void; } /** Top navigation bar for Admin Web Portal. |
| L32 | `toggleLanguage()` | *none* | Toggles between EN/AR — the pill shows the language you would switch to. |

## [Sidebar.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/common/Sidebar.tsx)
`admin/src/components/common/Sidebar.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L23 | `Sidebar()` | `{   currentTab,   onSelectTab,   counts,   mobileOpen = false,   onCloseMobile, }` | Collapsible left navigation sidebar for Admin Web Portal. |
| L43 | `handleSelect()` | `tab: NavTab` | No description provided. |

## [StatCard.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/common/StatCard.tsx)
`admin/src/components/common/StatCard.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `StatCard()` | `{   title,   value,   subtitle,   icon: Icon,   color = 'blue',   trend, }` | Summary metric card with icon, count, and trend indicator. |

## [AddBusLineModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/AddBusLineModal.tsx)
`admin/src/components/companies/AddBusLineModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `AddBusLineModal()` | `{   isOpen,   onClose,   companies,   initialCompanyId,   onLineAdded, }` | Modal allowing dispatchers to register a new bus line. |
| L34 | `handleSubmit()` | `e: React.FormEvent` | Submits new line registration to company catalog. |

## [AddCompanyModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/AddCompanyModal.tsx)
`admin/src/components/companies/AddCompanyModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `AddCompanyModal()` | `{   isOpen,   onClose,   onSuccess, }` | @file AddCompanyModal.tsx @description Modal dialog allowing administrators to register new transit operators, university campus shuttles, private carriers, or school transport authorities. / import React, { useState } from 'react'; import { Building2 } from 'lucide-react'; import { Modal } from '../common/Modal'; import { saveCompany } from '../../services/companiesService'; import { useTranslation } from '../../i18n/useTranslation'; import { toast } from 'sonner'; interface AddCompanyModalProps { isOpen: boolean; onClose: () => void; onSuccess?: (companyId: string, name: string) => void; } /** Modal form component to register new transit operating company. @param props - Modal visibility and close callbacks. @returns JSX Element. |
| L37 | `handleSubmit()` | `e: React.FormEvent` | Handles company registration submission to Firebase RTDB. |

## [CompaniesGridView.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/CompaniesGridView.tsx)
`admin/src/components/companies/CompaniesGridView.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `CompaniesGridView()` | `{   companies,   buses,   onSelectCompanyForLines,   onDeleteCompany,   onOpenAddCompany,   onConfirmPayment, }` | @file CompaniesGridView.tsx @description Renders a responsive grid of transit operator cards and handles empty search state representations. / import React from 'react'; import { Building2, Plus } from 'lucide-react'; import { CompanyCard } from './CompanyCard'; import { CompanyRecord, BusRouteDefinition } from '../../types'; import { useTranslation } from '../../i18n/useTranslation'; interface CompaniesGridViewProps { companies: CompanyRecord[]; buses: BusRouteDefinition[]; onSelectCompanyForLines: (company: CompanyRecord) => void; onDeleteCompany: (companyId: string) => void; onOpenAddCompany: () => void; /** Super-admin only: confirm payment and activate subscription. */ onConfirmPayment?: (companyId: string) => void; } /** Grid view component rendering operator cards or an empty search prompt. @param props - Filtered company records, bus route definitions, and action handlers. @returns JSX Element. |
| L39 | `getBusCount()` | `companyId: string` | Calculates the total buses assigned to a company. |

## [CompanyCard.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/CompanyCard.tsx)
`admin/src/components/companies/CompanyCard.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L11 | `CompanyCard()` | `{   company,   busesCount,   onManageLines,   onDeleteCompany,   onConfirmPayment,   isDuplicate, }` | Super-admin only: manually confirm payment and activate subscription. */ onConfirmPayment?: (companyId: string) => void; isDuplicate?: boolean; } /** Card component rendering company metrics and quick actions. |

## [LineManagerModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/LineManagerModal.tsx)
`admin/src/components/companies/LineManagerModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `LineManagerModal()` | `{   isOpen,   onClose,   company, }` | Modal for managing bus lines assigned to a specific transport company. |
| L32 | `handleAddLine()` | `e: React.FormEvent` | Adds a new bus line to the company line catalog. |
| L56 | `handleStartRename()` | `line: string` | Initiates inline line renaming mode. |
| L64 | `handleSaveRename()` | `oldLine: string` | Persists updated line name across all related routes. |
| L86 | `handleDeleteLine()` | `lineToDelete: string` | Removes a bus line from the company. |

## [LinesTableView.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/LinesTableView.tsx)
`admin/src/components/companies/LinesTableView.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `LinesTableView()` | `{   lines,   onDeleteLine,   onRenameLine,   onOpenAddLine, }` | @file LinesTableView.tsx @description Master tabular catalog of all transit lines across all operators, providing inline line renaming, route count metrics, and line deletions. / import React, { useState } from 'react'; import { Route, Edit2, Trash2, Layers } from 'lucide-react'; import { useTranslation } from '../../i18n/useTranslation'; export interface FlattenedLineItem { companyId: string; companyName: string; lineName: string; busesCount: number; } interface LinesTableViewProps { lines: FlattenedLineItem[]; onDeleteLine: (companyId: string, lineName: string) => void; onRenameLine: (companyId: string, oldName: string, newName: string) => void; onOpenAddLine: () => void; } /** Tabular component rendering cross-company bus lines with inline editing. @param props - Filtered lines catalog, delete/rename callbacks, and modal trigger. @returns JSX Element. |
| L41 | `handleStartRename()` | `rowKey: string, currentName: string` | Initiates inline line renaming in the lines table. |
| L49 | `handleSaveRename()` | `companyId: string, oldName: string` | Persists inline renamed line identifier to RTDB. |

## [DriverAssignModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/drivers/DriverAssignModal.tsx)
`admin/src/components/drivers/DriverAssignModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `DriverAssignModal()` | `{   isOpen,   onClose,   driver,   companies,   onSaveAssignments, }` | Modal dialog for assigning operating lines to a driver. |
| L37 | `handleToggleLine()` | `line: string` | Toggles line assignment checkbox state. |
| L48 | `handleSave()` | *none* | Persists updated line assignments to driver RTDB node. |

## [DriverTable.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/drivers/DriverTable.tsx)
`admin/src/components/drivers/DriverTable.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `DriverTable()` | `{   drivers,   onAssignDriver,   onDeleteDriver,   onSafetyCheck,   selectedCompanyFilter, }` | Directory table rendering driver accounts, lines, and actions. |
| L29 | `handleCopy()` | `uid: string` | Copies driver UID or email to clipboard. |

## [BusEditorModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/fleet/BusEditorModal.tsx)
`admin/src/components/fleet/BusEditorModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `BusEditorModal()` | `{   isOpen,   onClose,   busToEdit,   companies,   onSaveBus, }` | Modal for creating or editing a bus vehicle and route definition. |
| L85 | `handleStopsChange()` | `updatedStops: BusStop[],     start: { lat: number; lng: number; address: string },     end: { lat: number; lng: number; address: string }` | Updates waypoint stops sequence in the route definition. |
| L102 | `handleSubmit()` | `e: React.FormEvent` | Saves bus route definition to Firebase RTDB. |

## [BusTable.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/fleet/BusTable.tsx)
`admin/src/components/fleet/BusTable.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `BusTable()` | `{   buses,   onToggleActive,   onEditBus,   onDeleteBus,   selectedCompanyFilter, }` | Table rendering fleet buses and route details. |

## [VehicleRegistrationModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/fleet/VehicleRegistrationModal.tsx)
`admin/src/components/fleet/VehicleRegistrationModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `VehicleRegistrationModal()` | `{   isOpen,   onClose,   companies,   existingBuses,   onSaveVehicle,   vehicleToEdit, }` | Modal for registering a new bus vehicle in the fleet. |
| L45 | `handleSubmit()` | `e: React.FormEvent` | Persists new vehicle registration data. |

## [EgyptianLandmarksPicker.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/EgyptianLandmarksPicker.tsx)
`admin/src/components/map/EgyptianLandmarksPicker.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L10 | `EgyptianLandmarksPicker()` | `{   onSelectLandmark, }` | Dropdown picker for preset Egyptian landmarks and transit hubs. |

## [FleetMap.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/FleetMap.tsx)
`admin/src/components/map/FleetMap.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L27 | `FleetMap()` | `{   liveLocations,   catalogBuses,   selectedBusId,   onSelectBus, }` | Real-time fleet overview map displaying active buses, routes, and telemetry. |
| L211 | `handleResetView()` | *none* | No description provided. |
| L217 | `handleFitAll()` | *none* | No description provided. |

## [FleetMapLegend.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/FleetMapLegend.tsx)
`admin/src/components/map/FleetMapLegend.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `FleetMapLegend()` | *none* | Modern floating legend overlay for the fleet map showing route and marker conventions. |

## [LineFilterPopover.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/LineFilterPopover.tsx)
`admin/src/components/map/LineFilterPopover.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L19 | `LineFilterPopover()` | `{   options,   hiddenLines,   onToggle,   onShowAll,   onHideAll, }` | Multi-select popover for showing/hiding bus lines on the fleet map. A line is hidden when its lowercased id is present in `hiddenLines`. |
| L36 | `onDocPointer()` | `ev: MouseEvent` | No description provided. |

## [MapThemeSelector.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/MapThemeSelector.tsx)
`admin/src/components/map/MapThemeSelector.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L7 | `MapThemeSelector()` | *none* | Compact light/dark base-map toggle pill. Persists the choice (localStorage `wasalt_map_style`), swaps the OpenFreeMap style on every mounted map via `setMapStyle`, and stays in sync across components through store subscription. |
| L16 | `handleSelect()` | `next: MapStyleMode` | No description provided. |

## [RouteMapToolbar.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/RouteMapToolbar.tsx)
`admin/src/components/map/RouteMapToolbar.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `RouteMapToolbar()` | `{   activeMode,   onSetActiveMode,   onUseCurrentLocation,   onFitRoute,   routeStats,   isCalculatingRoute,   stopsCount, }` | Toolbar controls for the Route Picker Leaflet map. |

## [RoutePickerMap.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/RoutePickerMap.tsx)
`admin/src/components/map/RoutePickerMap.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L27 | `RoutePickerMap()` | `{   initialStops,   startLat = 30.0444,   startLng = 31.2357,   endLat = 30.0561,   endLng = 31.3300,   startAddress = 'Start Station',   endAddress = 'Destination',   onPointsSelected,   onStopsChange, }` | Interactive Leaflet map for picking route waypoints and stops. |
| L142 | `notifyChanges()` | `updatedStops: BusStop[]` | Sync stops changes to callbacks |
| L218 | `updateStopWithLandmark()` | `targetId: string, lat: number, lng: number` | Asynchronously resolves the nearest named landmark via Overpass/Nominatim and updates stop name. @suggestion [INTEGRATE]: Connect this function to the map click handler below so that newly dropped custom waypoint pins automatically resolve and populate the nearest real-world landmark name. |
| L240 | `handleClick()` | `e: L.LeafletMouseEvent` | Handles map click event to add a coordinate stop. |
| L282 | `removeStop()` | `index: number` | Removes an intermediate waypoint stop from the route sequence. |
| L291 | `updateStopName()` | `index: number, name: string` | Updates the descriptive landmark label for a waypoint stop. |
| L300 | `addPresetAsStop()` | `landmark: EgyptianLandmark` | Appends an Egyptian transit preset landmark to the route sequence. |
| L327 | `useCurrentLocationForStart()` | *none* | Sets the route starting point to current GPS location. |

## [RouteStopsList.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/RouteStopsList.tsx)
`admin/src/components/map/RouteStopsList.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `RouteStopsList()` | `{   stops,   onUpdateName,   onRemoveStop, }` | Numbered list of intermediate waypoint stops with reordering controls. |

## [fleetMapHelpers.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/fleetMapHelpers.ts)
`admin/src/components/map/fleetMapHelpers.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `shortLineCode()` | `lineId: string` | Translation function injected from the consuming component (hooks stay out of plain helpers). */ export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string; /** Extracts the short operator code from a full line id, e.g. "صفط اللبن - عبد المنعم رياض (CTA 15)" → "CTA 15". Falls back to the full id when no parenthesized suffix exists. |
| L17 | `createTerminalMarker()` | `latLng: [number, number],   type: "A" | "B",   lineId: string,   pointName: string,   t: TranslateFn` | Creates a terminal depot A or B pin marker with popup. |
| L45 | `createCatalogBusMarker()` | `pos: [number, number],   bus: BusRouteDefinition,   isSelected: boolean,   liveMatch: LiveBusLocation | undefined,   onSelectBus?: (busId: string` | Creates a bus vehicle marker along the line with telemetry popup. |
| L102 | `createLiveBeaconMarker()` | `pos: [number, number], loc: LiveBusLocation, t: TranslateFn` | Creates an orphan live driver beacon marker with radar ping. |

## [mapDrawLayers.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/mapDrawLayers.ts)
`admin/src/components/map/mapDrawLayers.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `filterVisibleCatalog()` | `catalogBuses: BusRouteDefinition[],   selectedCompany: string,   showActiveOnly: boolean,   isLineVisible: (lineId: string` | @file mapDrawLayers.ts @description Pure Leaflet layer-drawing helpers for FleetMap, split out so the component keeps separate render passes: static geometry (polylines, terminals, stop pins, beacon corridors) vs dynamic vehicles (live marker positions). / import L from "leaflet"; import { LiveBusLocation, BusRouteDefinition } from "../../types"; import { fetchRoadRoute } from "../../services/routingService"; import { getLineColor } from "../../utils/lineColors"; import { createTerminalMarker, createCatalogBusMarker, createLiveBeaconMarker, TranslateFn, } from "./fleetMapHelpers"; type SelectFn = (busId: string) => void; /** Applies company / active-only / per-line visibility filters to the catalog. |
| L36 | `splitOrphanBeacons()` | `liveLocations: LiveBusLocation[],   catalogBuses: BusRouteDefinition[]` | Returns live beacons whose line id is missing from the catalog. |
| L49 | `orphanBeaconKey()` | `beacons: LiveBusLocation[]` | Stable identity key for orphan beacon corridors. Ignoring raw GPS coordinates means corridors redraw only when trip endpoints change — not on every tick. |
| L62 | `drawCatalogRoutes()` | `opts: {   linesLayer: L.LayerGroup;   staticLayer: L.LayerGroup;   buses: BusRouteDefinition[];   selectedBusId?: string | null;   onSelectBus?: SelectFn;   t: TranslateFn; }` | Draws catalog route polylines (plus glow, popups, road-snapped paths), stop pins and terminal markers. Returns the bounds points for the initial fit. |
| L174 | `drawBeaconCorridors()` | `opts: {   linesLayer: L.LayerGroup;   staticLayer: L.LayerGroup;   beacons: LiveBusLocation[];   t: TranslateFn; }` | Draws road-corridor lines and terminal pins for orphan (non-catalog) beacons. Markers themselves are drawn by drawLiveVehicles. Returns bounds points. |
| L270 | `drawLiveVehicles()` | `opts: {   markersLayer: L.LayerGroup;   catalogBuses: BusRouteDefinition[];   beacons: LiveBusLocation[];   liveLocations: LiveBusLocation[];   selectedBusId?: string | null;   onSelectBus?: SelectFn;   t: TranslateFn; }` | Clears and redraws only the dynamic vehicle markers. Catalog badges render exclusively for lines with a live GPS match (or the selected line) — phantom mid-route cards for every catalog entry are intentionally suppressed. Called on every telemetry tick — deliberately free of polyline/network work. |

## [mapLayerManager.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/mapLayerManager.ts)
`admin/src/components/map/mapLayerManager.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `paintContainer()` | `map: L.Map, mode: MapStyleMode` | @file mapLayerManager.ts @description Attaches the OpenFreeMap vector base layer (MapLibre GL rendered through Leaflet via @maplibre/maplibre-gl-leaflet) to admin Leaflet maps, and owns runtime light/dark style switching for every registered map. Failures (no WebGL, offline, blocked worker) degrade to a visible empty base map with a single toast warning. / import L from 'leaflet'; import { maplibreGL } from '@maplibre/maplibre-gl-leaflet'; import { toast } from 'sonner'; import { ensureMapLibreWorker } from '../../utils/mapLibreWorker'; import { ATTRIBUTION, MapStyleMode, getStoredMapStyle, storeMapStyle, styleUrlForMode, } from '../../config/openFreeMap'; /** Container background matching each style palette (prevents white/dark flashes while tiles load). */ const CONTAINER_BACKGROUND: Record<MapStyleMode, string> = { dark: '#090d16', light: '#f8fafc', }; interface BaseLayerEntry { mode: MapStyleMode; dispose: () => void; } /** Maps currently holding a base layer, so `setMapStyle` can swap styles at runtime. */ const activeLayers = new Map<L.Map, BaseLayerEntry>(); /** Paints the Leaflet container background to match the active style palette. @param map - Leaflet map instance. @param mode - Active style mode. |
| L48 | `forceDeregisterLayer()` | `map: L.Map, layer: L.Layer` | Force-deregisters a half-added layer when Leaflet's own removal path fails (MapLibre constructor can throw before its GL map exists, leaving the layer registered with `getEvents` handlers still bound). @param map - Leaflet map instance. @param layer - Layer that failed to finish adding. |
| L71 | `detachLayerSafely()` | `map: L.Map, layer: L.Layer` | Removes a MapLibre-GL-Leaflet layer without ever throwing. @param map - Leaflet map instance. @param layer - Layer to remove. |
| L85 | `attachLayer()` | `map: L.Map, mode: MapStyleMode` | Creates and adds the OpenFreeMap vector base layer, wiring resilience handlers. @param map - Leaflet map instance. @param mode - Style mode to render. @returns Entry whose `dispose` removes the layer (idempotent, never throws). |
| L97 | `warnOnce()` | `message: string` | No description provided. |
| L145 | `attachMapBaseStyle()` | `map: L.Map, mode?: MapStyleMode` | Attaches the OpenFreeMap vector base layer to a Leaflet map instance. @param map - Leaflet map instance. @param mode - Optional mode override; defaults to the persisted preference. @returns Cleanup function that detaches the layer on unmount/theme change. |
| L165 | `setMapStyle()` | `mode: MapStyleMode` | Switches the base style on every registered map and persists the preference. Re-adds the MapLibre layer per map with the new style; individual failures are isolated so one broken map cannot prevent the rest from switching. @param mode - 'light' (Positron) or 'dark' (OpenFreeMap Dark). |

## [DriverSafetyAudioMonitor.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/modals/DriverSafetyAudioMonitor.tsx)
`admin/src/components/modals/DriverSafetyAudioMonitor.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L11 | `DriverSafetyAudioMonitor()` | `{   isMuted,   remoteStream,   onToggleMute, }` | Live audio monitor bar displaying RMS telemetry, audio waveform animation, and mute controls. |

## [DriverSafetyMediaModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/modals/DriverSafetyMediaModal.tsx)
`admin/src/components/modals/DriverSafetyMediaModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L28 | `DriverSafetyMediaModal()` | `{   isOpen,   onClose,   driverUid: initialDriverUid,   driverName: initialDriverName,   driverEmail: initialDriverEmail,   lineId,   cameraMonitored = false,   micMonitored = false,   latitude,   longitude, }` | SafeTrip video monitoring modal inspecting real-time driver WebRTC camera feed. |
| L110 | `handleSendRequest()` | `kind: MediaRequestKind` | Sends camera feed request signal to driver mobile device. |
| L128 | `handleEndSession()` | *none* | Terminates active SafeTrip video monitoring session. |
| L143 | `handleSimulateConsent()` | `approved: boolean` | Simulates driver consent response in test environments. |
| L161 | `switchToActiveDriver()` | *none* | Switches active video viewport to another broadcasting driver. |

## [DriverSafetyVideoViewport.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/modals/DriverSafetyVideoViewport.tsx)
`admin/src/components/modals/DriverSafetyVideoViewport.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L18 | `DriverSafetyVideoViewport()` | `{   streamData,   remoteStream,   webrtcStats,   isMuted = false,   driverName,   lineId,   latitude,   longitude, }` | Video viewport element rendering incoming driver WebRTC stream. |
| L55 | `toggleLocalWebcam()` | *none* | Toggle local browser webcam for testing without mobile device. @suggestion [DELETE]: SafeTrip WebRTC P2P hardware streaming from mobile devices is fully operational; this local browser loopback mock is an unused development artifact and can be safely deleted once confirmed. |

## [LineCatalogTable.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/routes/LineCatalogTable.tsx)
`admin/src/components/routes/LineCatalogTable.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L21 | `LineCatalogTable()` | `{   lines,   companies,   onRenameLine,   onDeleteLine,   onOpenCompanyLineManager, }` | Table component displaying bus line routes and metadata. |
| L35 | `handleSaveRename()` | `companyId: string, oldLine: string` | Saves renamed bus line in the catalog. |

## [SosAlertBell.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/sos/SosAlertBell.tsx)
`admin/src/components/sos/SosAlertBell.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L6 | `formatTriggerTime()` | `triggeredAt: string` | No description provided. |
| L17 | `SosAlertBell()` | *none* | Navbar SOS beacon: red badge with the active emergency count plus a dropdown panel listing live driver SOS alerts with acknowledge/dismiss. Renders nothing when no admin session is active. |
| L31 | `onKeyDown()` | `e: KeyboardEvent` | No description provided. |
| L34 | `onMouseDown()` | `e: MouseEvent` | No description provided. |
| L51 | `handleAcknowledge()` | `alert: SosAlertRecord` | No description provided. |

## [masterAdmin.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/config/masterAdmin.ts)
`admin/src/config/masterAdmin.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `parseList()` | `raw: string | undefined` | Admin credential configuration. Single source of truth for master-admin secrets and privileged identities. Values are injected exclusively from `admin/.env` (gitignored) through Vite env vars — no fallback defaults ever: a missing value surfaces as a loud, actionable configuration error instead of shipping a working credential inside the public JS bundle (which would make the 2FA gate decorative). Keys: VITE_MASTER_ADMIN_USERNAME   - master login username VITE_MASTER_ADMIN_PASSWORD   - master login password (also the Firebase service password) VITE_MASTER_ADMIN_TOTP_SECRET- base32 TOTP seed for authenticator apps VITE_FIREBASE_ADMIN_EMAILS   - comma-separated Firebase service identities (first = primary) VITE_SUPER_ADMIN_EMAILS      - comma-separated emails granted SUPER_ADMIN on dispatcher login (optional demo target: VITE_DEMO_DRIVER_UID / VITE_DEMO_DRIVER_NAME → config/demoTarget.ts) / /** Raw environment values; `undefined` when the key is absent. */ const username = import.meta.env.VITE_MASTER_ADMIN_USERNAME as string | undefined; const password = import.meta.env.VITE_MASTER_ADMIN_PASSWORD as string | undefined; const totpSecret = import.meta.env.VITE_MASTER_ADMIN_TOTP_SECRET as string | undefined; const firebaseEmailsRaw = import.meta.env.VITE_FIREBASE_ADMIN_EMAILS as string | undefined; const superAdminEmailsRaw = import.meta.env.VITE_SUPER_ADMIN_EMAILS as string | undefined; /** Env keys required for a working master-admin login (used to build the error message). */ const REQUIRED_KEYS = [ 'VITE_MASTER_ADMIN_USERNAME', 'VITE_MASTER_ADMIN_PASSWORD', 'VITE_MASTER_ADMIN_TOTP_SECRET', 'VITE_FIREBASE_ADMIN_EMAILS', ] as const; /** Maps each required key to its parsed raw value for presence checks. */ const KEY_VALUES: Record<(typeof REQUIRED_KEYS)[number], string | undefined> = { VITE_MASTER_ADMIN_USERNAME: username, VITE_MASTER_ADMIN_PASSWORD: password, VITE_MASTER_ADMIN_TOTP_SECRET: totpSecret, VITE_FIREBASE_ADMIN_EMAILS: firebaseEmailsRaw, }; /** Parses a comma-separated env list into trimmed, lowercase entries. @param raw - Raw env string (may be undefined). @returns Normalized list; empty array when unset/blank. |
| L53 | `getMissingMasterKeys()` | *none* | Returns the required env keys that are currently unset or blank. |
| L57 | `getMasterConfigError()` | *none* | Builds the actionable remediation message for incomplete configuration. @returns Empty string when fully configured (callers should check isMasterConfigured() first). |
| L70 | `isMasterConfigured()` | *none* | True when every required master-admin value is present. |

## [openFreeMap.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/config/openFreeMap.ts)
`admin/src/config/openFreeMap.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `styleUrlForMode()` | `mode: MapStyleMode` | @file openFreeMap.ts @description Single source of truth for OpenFreeMap vector tile/style URLs, attribution, and light/dark base-style persistence. No other admin module may hardcode map URLs. Style choice: OpenFreeMap's Quick Start canonically demonstrates `liberty`, which we use as the light/default style (kept identical to the mobile app); `dark` is the dark-mode option. / /** Base layer mode: 'light' = Liberty (default), 'dark' = OpenFreeMap Dark. */ export type MapStyleMode = 'light' | 'dark'; /** OpenFreeMap vector tile endpoint (Planet PBF). Styles reference this server themselves. */ export const TILE_URL = 'https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf'; /** Default OpenFreeMap light style (Liberty — the style OFM's Quick Start demonstrates). */ export const STYLE_LIGHT_URL = 'https://tiles.openfreemap.org/styles/liberty'; /** OpenFreeMap dark style for the admin dark-slate theme. */ export const STYLE_DARK_URL = 'https://tiles.openfreemap.org/styles/dark'; /** Attribution required by OpenFreeMap: "© OpenMapTiles © OpenStreetMap contributors". */ export const ATTRIBUTION = '&copy; <a href="https://www.openmaptiles.org/copyright" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'; /** localStorage key for the persisted base-style preference. */ export const MAP_STYLE_STORAGE_KEY = 'wasalt_map_style'; /** Window event dispatched whenever the persisted style changes (cross-component sync). */ export const MAP_STYLE_CHANGE_EVENT = 'wasalt:map-style-change'; /** Resolves the MapLibre style URL for a mode. @param mode - 'light' or 'dark'. @returns Absolute style URL served by OpenFreeMap. |
| L41 | `getStoredMapStyle()` | *none* | Reads the persisted base-style preference. @returns Stored mode, or 'light' when unset/unreadable (localStorage can throw in file:// contexts). |
| L55 | `storeMapStyle()` | `mode: MapStyleMode` | Persists the base-style preference and notifies subscribers. @param mode - 'light' or 'dark'. @returns True when persistence succeeded, false when storage was unavailable. |
| L76 | `subscribeMapStyle()` | `listener: (mode: MapStyleMode` | Subscribes to base-style changes (from this or other tabs/components). @param listener - Called with the new mode on every change. @returns Unsubscribe function. |
| L81 | `handler()` | `event: Event` | No description provided. |

## [AuthContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/contexts/AuthContext.tsx)
`admin/src/contexts/AuthContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L47 | `AuthProvider()` | `{ children }` | Provides authentication state, multi-account registry, and session context. Accounts persist in localStorage until manually removed via logout. |
| L60 | `commitActive()` | `record: AccountRecord | null` | True while a programmatic login (master or dispatcher) is completing — suppresses the onAuthStateChanged self-adoption path so the service identity is never registered as a phantom dispatcher account. */ const suppressAdoptRef = useRef(false); const syncAccounts = () => setAccounts(loadAccounts()); /** Commits an account as the active session (registry id + AdminSession). For master accounts with no Firebase identity yet, re-establishes the service identity in the background (never blocks). |
| L87 | `activateRecord()` | `input: AccountInput` | Upserts (bumping lastUsedAt), syncs state, and activates the record. |
| L141 | `loginMasterAdmin()` | `username: string,     pass: string,     otpToken: string` | Master Admin Login requiring Username, Password, and Authenticator App OTP. Always persists the account to the registry (no remember-me distinction). |
| L191 | `loginWithFirebase()` | `email: string, pass: string` | Company Dispatcher login via Firebase Auth. Role/companyId are resolved from the RTDB admin profile when present, falling back to email heuristics. Always persisted to the registry. |
| L217 | `switchAccount()` | `id: string` | Instantly switches to another already-added account (silent, no password/TOTP re-entry). Unknown ids warn without crashing. |
| L246 | `removeAccount()` | `id: string` | Removes a single account from the registry. Removing the active account activates the most-recent remaining one, or falls back to the login screen. |
| L275 | `logout()` | *none* | Manual sign-out: removes ONLY the current account from the registry, clears the Firebase identity, then activates the most-recent remaining account (other added accounts stay signed in). |
| L309 | `beginAddAccount()` | *none* | No description provided. |
| L311 | `cancelAddAccount()` | *none* | No description provided. |
| L337 | `useAdminAuth()` | *none* | Provides master admin authentication credentials and actions. |

## [useLineOperations.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/hooks/useLineOperations.ts)
`admin/src/hooks/useLineOperations.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `useLineOperations()` | *none* | @file useLineOperations.ts @description Centralized custom hook for bus line administrative operations (renaming and deletion) with confirmation prompts, RTDB persistence, and toast feedback. / import { useCallback } from 'react'; import { toast } from 'sonner'; import { renameCompanyLine, deleteCompanyLine } from '../services/companiesService'; import { useTranslation } from '../i18n/useTranslation'; /** Custom hook providing standardized line mutation workflows with user confirmations and feedback. |

## [useSosAlerts.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/hooks/useSosAlerts.ts)
`admin/src/hooks/useSosAlerts.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L8 | `useSosAlerts()` | *none* | Minimum gap between consecutive SOS toasts so bursts don't spam the stack. */ const SOS_TOAST_GAP_MS = 1500; /** Binds the realtime SOS listener to the authenticated admin session. - Subscribes only while an adminSession exists; unsubscribes on logout/unmount. - Beacons present at initial load are baseline-only (no toast), later ones raise a persistent error toast, deduped per beacon and rate-limited. - Dismiss removes the beacon locally and attempts to persist status 'acknowledged' (falls back to local-only when database rules reject it). |
| L39 | `showSosToast()` | `alert: SosAlertRecord` | No description provided. |
| L47 | `drainQueue()` | *none* | No description provided. |
| L57 | `enqueueToast()` | `alert: SosAlertRecord` | No description provided. |
| L66 | `handleSnapshot()` | `incoming: SosAlertRecord[]` | No description provided. |

## [TranslationContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/i18n/TranslationContext.tsx)
`admin/src/i18n/TranslationContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `TranslationProvider()` | `{ children }` | Warn about each missing key only once per session (dev-visible). */ const warnedKeys = new Set<string>(); const detectInitialLang = (): Lang => { try { const stored = window.localStorage.getItem(STORAGE_KEY); if (stored === 'en' || stored === 'ar') return stored; } catch { Storage unavailable (private mode / blocked) — fall through to navigator. } return typeof navigator !== 'undefined' && navigator.language?.startsWith('ar') ? 'ar' : 'en'; }; const dirForLang = (lang: Lang): Dir => (lang === 'ar' ? 'rtl' : 'ltr'); const interpolate = (template: string, vars?: TranslationVars): string => { if (!vars) return template; return template.replace(/\{(\w+)\}/g, (match, name: string) => Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match ); }; /** Provides EN/AR dictionaries, language persistence, and document dir/lang syncing. |

## [useTranslation.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/i18n/useTranslation.ts)
`admin/src/i18n/useTranslation.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `useTranslation()` | *none* | Hook exposing the active translation function and language controls. |

## [CompaniesPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/CompaniesPage.tsx)
`admin/src/pages/CompaniesPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L2 | `CompaniesPage()` | `{   companies,   buses, }` | @file CompaniesPage.tsx @description Primary administrative portal for managing transit operators, corporate shuttles, school bus authorities, and cross-operator bus lines. / import React, { useState, useMemo } from 'react'; import { Plus, Search, Building2, Route } from 'lucide-react'; import { CompanyRecord, BusRouteDefinition } from '../types'; import { removeCompany, } from '../services/companiesService'; import { activateSubscription } from '../services/subscriptionsService'; import { useAdminAuth } from '../contexts/AuthContext'; import { useTranslation } from '../i18n/useTranslation'; import { toast } from 'sonner'; Modular Presentation Components import { CompaniesGridView } from '../components/companies/CompaniesGridView'; import { LinesTableView, FlattenedLineItem } from '../components/companies/LinesTableView'; import { AddCompanyModal } from '../components/companies/AddCompanyModal'; import { LineManagerModal } from '../components/companies/LineManagerModal'; import { AddBusLineModal } from '../components/companies/AddBusLineModal'; interface CompaniesPageProps { companies: CompanyRecord[]; buses: BusRouteDefinition[]; } /** Main Companies & Transit Lines management page coordinator. @param props - System company records and active bus route definitions. @returns JSX Element. |
| L96 | `handleDeleteCompany()` | `companyId: string` | Deletes a transit operator node with user confirmation. |
| L111 | `handleConfirmPayment()` | `companyId: string` | Manually confirms a received payment and activates the subscription. Super-admin only — mirrors the website's pending_payment flow. |

## [DashboardPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/DashboardPage.tsx)
`admin/src/pages/DashboardPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L20 | `DashboardPage()` | `{   liveLocations,   buses,   companies,   drivers,   onSelectBus, }` | Master administrative overview metrics dashboard. |
| L39 | `handleMapSelect()` | `busId: string` | No description provided. |
| L45 | `handleForceStopSession()` | `lineId: string, driverUid: string` | Forcefully terminates an active driver telemetry broadcast session. |

## [DriversPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/DriversPage.tsx)
`admin/src/pages/DriversPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `DriversPage()` | `{ drivers, companies }` | Administrative directory for driver assignments, profiles, and permissions. |
| L37 | `handleSaveAssignments()` | `driverUid: string, companyId: string, lines: string[]` | Saves driver line assignments to Firebase RTDB. |
| L45 | `handleDeleteDriver()` | `driverUid: string, driverName: string` | Removes driver account and assignment records from the system. |
| L59 | `handleCreateDriver()` | `e: React.FormEvent` | Creates a new driver record in the system directory. |

## [FleetPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/FleetPage.tsx)
`admin/src/pages/FleetPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `FleetPage()` | `{ buses, companies }` | Fleet management dashboard showing road readiness, active vehicles, and dispatch controls. |
| L29 | `handleToggle()` | `companyId: string, busId: string, currentActive: boolean` | Toggles active dispatch status for a vehicle. |
| L46 | `handleDelete()` | `companyId: string, busId: string` | Deletes a vehicle record from the fleet directory. |
| L60 | `handleOpenNew()` | *none* | Opens the vehicle registration modal. |
| L68 | `handleOpenEdit()` | `bus: BusRouteDefinition` | Opens the vehicle editor modal for an existing bus. |

## [LoginPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/LoginPage.tsx)
`admin/src/pages/LoginPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `LoginPage()` | `{ onBackToDashboard }` | Administrative login screen supporting master 2FA TOTP and company dispatch authentication. |
| L28 | `handleSubmit()` | `e: React.FormEvent` | Submits admin login credentials to authentication services. |

## [PassengersPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/PassengersPage.tsx)
`admin/src/pages/PassengersPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `PassengersPage()` | `{ passengers }` | Administrative directory for commuter passenger accounts and trip records. |
| L39 | `handleCopyUid()` | `uid: string` | Copies commuter UID to system clipboard. |
| L49 | `handleClearHistory()` | `uid: string` | Clears trip history records for the selected passenger. |
| L66 | `handleDeleteUser()` | `uid: string, name: string` | Deletes a passenger account from the system directory. |

## [PricingPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/PricingPage.tsx)
`admin/src/pages/PricingPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `buildInitialPrices()` | `overrides: Record<string, { priceMonthly?: number; priceAnnual?: number }>` | No description provided. |
| L26 | `PricingPage()` | *none* | Pricing editor — lets the master admin update the live website prices (public pricing section + website upgrade modal) stored at /pricing. |
| L52 | `handleChange()` | `planId: string, field: keyof PlanPriceInput, value: string` | No description provided. |
| L65 | `handleSave()` | *none* | No description provided. |

## [RoutesPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/RoutesPage.tsx)
`admin/src/pages/RoutesPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L18 | `RoutesPage()` | `{ buses, companies }` | Transit corridors manager and visual route designer page. |
| L77 | `handleDeleteRoute()` | `companyId: string, busId: string` | Deletes a configured route definition from the company node. |

## [SecurityPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/SecurityPage.tsx)
`admin/src/pages/SecurityPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `SecurityPage()` | `{ companies }` | System diagnostic and security audit dashboard. |
| L20 | `handleCleanDuplicateBrt()` | *none* | Cleans duplicate bus route corridor nodes from the database. |

## [busesService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/busesService.ts)
`admin/src/services/busesService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `subscribeAllBuses()` | `callback: (buses: BusRouteDefinition[]` | Subscribes to buses for all companies in the Realtime Database. |
| L52 | `saveBus()` | `companyId: string, bus: BusRouteDefinition` | Saves or updates a bus in /companies/<companyId>/buses/<busId>. Automatically ensures the assigned lineId is synchronized with the company's busLines list. |
| L86 | `toggleBusActive()` | `companyId: string, busId: string, isActive: boolean` | Toggles a bus operational active/idle flag. |
| L94 | `deleteBus()` | `companyId: string, busId: string` | Deletes a bus from /companies/<companyId>/buses/<busId>. |

## [companiesService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/companiesService.ts)
`admin/src/services/companiesService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `subscribeCompanies()` | `callback: (companies: CompanyRecord[]` | Subscribes to real-time company directory updates from Firebase. |
| L42 | `saveCompany()` | `companyId: string, data: Partial<CompanyRecord>` | Creates or updates a transit company record. |
| L58 | `updateCompanyLines()` | `companyId: string, lines: string[]` | Updates the busLines array for a given company. |
| L66 | `addCompanyLine()` | `companyId: string, lineName: string` | Directly appends a new bus line to a company's busLines array in Firebase RTDB. |
| L81 | `renameCompanyLine()` | `companyId: string,   oldLine: string,   newLine: string` | Renames a bus line and cascades the update to all assigned buses. |
| L108 | `deleteCompanyLine()` | `companyId: string, lineToDelete: string` | Deletes a bus line from a company. |
| L119 | `removeCompany()` | `companyId: string` | Safely removes a company key. |

## [driverMediaService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/driverMediaService.ts)
`admin/src/services/driverMediaService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `requestDriverMedia()` | `driverUid: string,   kind: MediaRequestKind,   adminEmail: string` | Dispatches a remote camera/microphone safety check request to a driver's mobile device. Writes to /driverControls/<driverUid>/mediaRequest adhering to SafeTrip protocol. |
| L26 | `subscribeToDriverMediaRequest()` | `driverUid: string,   callback: (request: DriverMediaRequest | null` | Listens in real time to the driver's consent state and safety check stream status. |
| L65 | `subscribeToDriverMediaStream()` | `driverUid: string,   callback: (stream: DriverMediaStream | null` | Subscribes to the live incoming video/audio stream frames from the driver's mobile handset. Listens to /driverControls/<driverUid>/mediaStream. |
| L93 | `closeDriverMediaRequest()` | `driverUid: string` | Terminates an active or pending safety stream check session. |
| L104 | `simulateDriverResponse()` | `driverUid: string, approved: boolean` | Diagnostic/Simulation Helper: Simulates the mobile driver tapping 'Accept' or 'Decline' in the SafeTrip prompt. Enables live stream interface verification in offline testing environments. Uses update() so kind/requestedAt/requestedBy are preserved (set() would wipe them). |

## [driversService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/driversService.ts)
`admin/src/services/driversService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `subscribeDrivers()` | `callback: (drivers: DriverProfile[]` | Subscribes to driver directory in Realtime Database. |
| L36 | `updateDriverLines()` | `driverUid: string, lines: string[]` | Updates assigned bus lines for a specific driver. |
| L44 | `updateDriverCompany()` | `driverUid: string, companyId: string` | Updates assigned company for a driver. |
| L52 | `saveDriverProfile()` | `driver: DriverProfile` | Saves or provisions a driver profile in RTDB. |
| L65 | `removeDriverProfile()` | `driverUid: string` | Removes a driver record from RTDB. |

## [landmarkService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/landmarkService.ts)
`admin/src/services/landmarkService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `getCacheKey()` | `lat: number, lng: number` | @file landmarkService.ts @description Pure in-memory offline landmark and transit hub resolution service. Operates with zero third-party network dependencies or cloud APIs. / import { OFFLINE_EGYPTIAN_LANDMARKS, EgyptianLandmark } from '../constants/landmarks'; import { haversineDistanceMeters } from '../utils/geoUtils'; export interface NearestLandmarkResult { name: string; category?: string; distanceMeters: number; isFallback?: boolean; } In-memory cache for resolved coordinates (keyed by rounded lat,lng) const landmarkCache = new Map<string, NearestLandmarkResult>(); /** Generates coordinate cache key for landmark resolution caching. @param lat - Latitude coordinate. @param lng - Longitude coordinate. @returns Deterministic cache key string. |
| L30 | `findClosestPreset()` | `lat: number, lng: number` | Finds the closest offline Egyptian landmark using geodesic distance. @param lat - Latitude coordinate. @param lng - Longitude coordinate. @returns Nearest landmark record with distance in meters. |
| L53 | `resolveNearestLandmark()` | `lat: number,   lng: number` | Resolves the nearest named transit hub, campus, or landmark from local spatial memory. Completely offline with zero third-party network dependencies. @param lat - Latitude coordinate. @param lng - Longitude coordinate. @returns Nearest named landmark result. |

## [pricingService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/pricingService.ts)
`admin/src/services/pricingService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `fetchPricingOverrides()` | *none* | Pricing Service — RTDB-backed live plan pricing. Prices live at /pricing/{planId} and override the hardcoded defaults, so the master admin can change website prices from this dashboard. / import { ref, get, update } from 'firebase/database'; import { database } from '../config/firebase'; export interface PlanPriceInput { priceMonthly: number; priceAnnual: number; } export interface PlanPriceRecord extends PlanPriceInput { updatedAt?: string; updatedBy?: string; } /** Fallback defaults — mirror of packages/config PRICING_PLANS. */ export const DEFAULT_PLAN_PRICES: Record< string, { name: string; priceMonthly: number; priceAnnual: number } > = { starter: { name: 'Starter', priceMonthly: 1450, priceAnnual: 1150 }, pro: { name: 'Professional', priceMonthly: 3850, priceAnnual: 3100 }, enterprise: { name: 'Enterprise', priceMonthly: 8900, priceAnnual: 7200 }, }; /** Reads the live pricing overrides from /pricing. Missing entries fall back to DEFAULT_PLAN_PRICES. |
| L47 | `savePricing()` | `prices: Record<string, PlanPriceInput>,   updatedBy: string` | Persists prices for all plans to /pricing (merge update). Only the SUPER_ADMIN page should call this. |

## [routingService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/routingService.ts)
`admin/src/services/routingService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `buildWaypointKey()` | `waypoints: WaypointCoord[]` | @file routingService.ts @description Online road-following routing service for Wasalt Admin Panel. Uses the Project-OSRM public driving engine to compute authentic road geometries, distances, and durations between waypoints with smart in-memory caching and graceful straight-line fallback. / export interface WaypointCoord { lat: number; lng: number; name?: string; } export interface RouteGeometryResult { coordinates: [number, number][]; distanceKm: number; durationMin: number; isFallback: boolean; } In-memory cache for computed road paths to avoid redundant network requests const routeCache = new Map<string, RouteGeometryResult>(); /** Builds a deterministic cache key from a list of waypoints. @param waypoints - List of route waypoints. @returns Serialized string key. |
| L34 | `haversineDistance()` | `lat1: number, lon1: number, lat2: number, lon2: number` | Calculates great-circle haversine distance between two coordinates in kilometers. @param lat1 - Latitude of origin. @param lon1 - Longitude of origin. @param lat2 - Latitude of destination. @param lon2 - Longitude of destination. @returns Geodesic distance in kilometers. |
| L55 | `normalizeWaypoints()` | `startLatOrWaypoints: number | WaypointCoord[],   startLng?: number,   endLat?: number,   endLng?: number` | Normalizes input arguments into a clean array of valid coordinates. @param startLatOrWaypoints - Starting latitude or array of waypoints. @param startLng - Optional starting longitude. @param endLat - Optional ending latitude. @param endLng - Optional ending longitude. @returns Array of validated WaypointCoord objects. |
| L88 | `fetchRoadRoute()` | `startLatOrWaypoints: number | WaypointCoord[],   startLng?: number,   endLat?: number,   endLng?: number` | Computes road-following route coordinates between two or more stops using the OSRM online driving engine. Supports passing either an array of WaypointCoord or traditional (startLat, startLng, endLat, endLng). @param startLatOrWaypoints - Starting latitude or array of waypoints. @param startLng - Optional starting longitude. @param endLat - Optional ending latitude. @param endLng - Optional ending longitude. @returns Computed road route geometry, distance, and duration. |

## [sosService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/sosService.ts)
`admin/src/services/sosService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `buildSosAlertId()` | `driverUid: string, triggeredAt: string` | Single config constant for the RTDB subtree this feature owns (read-only listener; acknowledgement attempts a targeted status update only). */ const DRIVER_CONTROLS_PATH = 'driverControls'; const ACTIVE_SOS_STATUS = 'critical_sos'; function asText(value: unknown, fallback: string): string { return typeof value === 'string' && value.trim() ? value.trim() : fallback; } /** Builds a stable dedupe id for an SOS beacon. |
| L22 | `parseSosAlert()` | `driverUid: string, raw: unknown` | Parses a raw sosAlert node into a displayable record. Returns null for missing/malformed/non-critical entries — never throws. |
| L43 | `subscribeSosAlerts()` | `callback: (alerts: SosAlertRecord[]` | Realtime listener over /driverControls that surfaces every active (status === 'critical_sos') driver SOS beacon, newest first. Errors are logged and degrade to an empty list — never throws. |
| L87 | `acknowledgeSosAlert()` | `driverUid: string,   adminEmail: string` | Attempts to persist an acknowledgement by flipping sosAlert/status. RTDB rules only allow this for whitelisted admin identities (or the driver themselves); any denial is swallowed so callers can fall back to a local-only dismiss. Never throws. @returns true when the acknowledgement reached the database. |

## [subscriptionsService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/subscriptionsService.ts)
`admin/src/services/subscriptionsService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `fetchSubscription()` | `companyId: string` | Subscription record stored in /subscriptions/{companyId}/ by the website onboarding flow (shared RTDB node). / export interface SubscriptionRecord { id: string; companyId: string; planId: string; status: string; billingCycle?: string; currentPeriodStart?: string; currentPeriodEnd?: string; paymentStatus?: string; selectedAt?: string; confirmedAt?: string; } /** Reads a company's subscription from /subscriptions/{companyId}/. |
| L35 | `activateSubscription()` | `companyId: string` | Manually activates a subscription after payment is confirmed by the master admin (Egyptian market: bank transfer / Vodafone Cash). Updates both /subscriptions/{companyId}/ and /companies/{companyId}/ so the website and Electron app reflect the change immediately. |

## [telemetryService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/telemetryService.ts)
`admin/src/services/telemetryService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `subscribeLiveTelemetry()` | `callback: (locations: LiveBusLocation[]` | Subscribes to live high-frequency bus locations broadcasted by active drivers. |
| L55 | `terminateLiveSession()` | `lineId: string, driverUid: string` | Administrative override: Forcefully terminates a rogue or stranded driver session from /busLocations. |

## [usersService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/usersService.ts)
`admin/src/services/usersService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `subscribePassengers()` | `callback: (passengers: PassengerRecord[]` | Subscribes to registered passengers and their ride history logs. |
| L62 | `clearPassengerHistory()` | `uid: string` | Clears passenger trip history logs from RTDB. |
| L70 | `deleteUserFromRTDB()` | `uid: string` | Removes a user record from RTDB. |

## [webrtcAdminService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/webrtcAdminService.ts)
`admin/src/services/webrtcAdminService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `subscribeToWebRtcStream()` | `driverUid: string,   onRemoteStream: (stream: MediaStream | null` | Wasalt SafeTrip™ - Browser WebRTC Receiver Service Handles P2P WebRTC session negotiation with the driver mobile app via Firebase RTDB, delivering 30 FPS hardware-accelerated video and live Opus audio. / import { ref, set, onValue, remove } from 'firebase/database'; import { database } from '../config/firebase'; export interface WebRtcCallStats { status: 'idle' | 'waiting-offer' | 'negotiating' | 'connected' | 'disconnected' | 'failed'; fps: number; bitrateKbps: number; resolution?: string; } const RTC_CONFIG: RTCConfiguration = { iceServers: [ { urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }, { urls: 'stun:stun2.l.google.com:19302' }, ], }; /** Initiates and manages a WebRTC P2P receiver connection for an active driver safety stream. |

## [accountStore.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/utils/accountStore.ts)
`admin/src/utils/accountStore.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L27 | `getLocalStorage()` | *none* | No description provided. |
| L35 | `getSessionStorage()` | *none* | No description provided. |
| L43 | `readRaw()` | `storage: Storage | null, key: string` | No description provided. |
| L52 | `writeRaw()` | `storage: Storage | null, key: string, value: string` | No description provided. |
| L60 | `removeRaw()` | `storage: Storage | null, key: string` | No description provided. |
| L68 | `parseRecord()` | `value: unknown` | No description provided. |
| L87 | `loadAccounts()` | *none* | No description provided. |
| L100 | `saveAccounts()` | `accounts: AccountRecord[]` | No description provided. |
| L104 | `getActiveId()` | *none* | No description provided. |
| L108 | `setActiveId()` | `id: string | null` | No description provided. |
| L118 | `upsertAccount()` | `input: AccountInput` | Inserts or refreshes an account in the registry (dedupe by id, or by kind+email). Preserves `addedAt`; bumps `lastUsedAt`. Returns the stored record. |
| L143 | `removeAccount()` | `id: string` | No description provided. |
| L151 | `pickMostRecent()` | `accounts: AccountRecord[]` | No description provided. |
| L156 | `toAdminSession()` | `record: AccountRecord` | No description provided. |
| L162 | `migrateLegacySession()` | *none* | One-time migration of the pre-multi-account single-session keys (`wasalt_admin_session` / `sya7a_admin_session` in BOTH localStorage and sessionStorage) into the registry. Inserts the legacy session if absent, marks it active, and removes all legacy key occurrences. @returns The newly active migrated record, or null when nothing was found. |

## [authResolvers.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/utils/authResolvers.ts)
`admin/src/utils/authResolvers.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `resolveRole()` | `email: string` | @file authResolvers.ts @description Pure authentication helpers extracted from AuthContext: role resolution (email heuristics + RTDB admin profiles) and the Firebase service-identity establishment used to satisfy RTDB rules. / import { signInWithEmailAndPassword } from 'firebase/auth'; import { ref, get } from 'firebase/database'; import { auth, database } from '../config/firebase'; import { AdminRole } from '../types'; import { masterFirebaseEmails, superAdminEmails } from '../config/masterAdmin'; interface RoleResolution { role: AdminRole; companyId?: string; } /** Resolves the role from an email address. SUPER_ADMIN is granted ONLY to addresses explicitly listed in VITE_SUPER_ADMIN_EMAILS — never by name-substring match or default (least privilege: unknown emails fall back to COMPANY_ADMIN). |
| L47 | `resolveRoleFromRTDB()` | `uid: string,   email: string` | Resolves an admin's role from RTDB /admins/{uid}/ profile (companyIds ownership), falling back to email heuristics for legacy/master accounts. |
| L79 | `establishFirebaseIdentity()` | `cfgPassword: string` | Signs into Firebase with the configured service identities (ordered list, first = primary) so RTDB rules see `auth != null`. Never throws. @param cfgPassword - Password shared by the service identities. @returns True when a Firebase session was established. |

## [brandTheme.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/utils/brandTheme.ts)
`admin/src/utils/brandTheme.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `blend()` | `from: string, to: string, t: number` | Applies a company's theme (from /companies/{id}/theme/) to the admin console by setting the --brand-* CSS variables consumed by the Tailwind `brand` palette (see tailwind.config.js). Clears them when no theme is given, restoring the default Wasalt palette. / import { CompanyThemeLike } from '../types'; const SHADE_VARS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const; function parseHex(hex: string): [number, number, number] | null { const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim()); if (!m) return null; const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; } function toHex(r: number, g: number, b: number): string { const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); return `#${c(r)}${c(g)}${c(b)}`; } /** Linearly blends `from` toward `to` (t = 0 keeps `from`, t = 1 keeps `to`). |
| L31 | `applyCompanyTheme()` | `theme?: CompanyThemeLike | null` | Sets --brand-50..950 from the company's primary/primaryHover/primaryLight colors. Safe to call with undefined (resets to defaults). |

## [cn.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/utils/cn.ts)
`admin/src/utils/cn.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `cn()` | `...inputs: ClassValue[]` | Combines conditional class names with Tailwind CSS conflicts resolved. |

## [geoUtils.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/utils/geoUtils.ts)
`admin/src/utils/geoUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `haversineDistanceMeters()` | `lat1: number,   lon1: number,   lat2: number,   lon2: number` | @file geoUtils.ts @description Centralized geolocation mathematics and distance calculation utilities. / const EARTH_RADIUS_METERS = 6371000; const EARTH_RADIUS_KM = 6371; /** Calculates the great-circle distance between two GPS coordinates in meters via the Haversine formula. @param lat1 - Origin latitude in degrees. @param lon1 - Origin longitude in degrees. @param lat2 - Destination latitude in degrees. @param lon2 - Destination longitude in degrees. @returns Distance in meters. |
| L35 | `haversineDistanceKm()` | `lat1: number,   lon1: number,   lat2: number,   lon2: number` | Calculates the great-circle distance between two GPS coordinates in kilometers via the Haversine formula. @param lat1 - Origin latitude in degrees. @param lon1 - Origin longitude in degrees. @param lat2 - Destination latitude in degrees. @param lon2 - Destination longitude in degrees. @returns Distance in kilometers. |

## [lineColors.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/utils/lineColors.ts)
`admin/src/utils/lineColors.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `hashString()` | `value: string` | Deterministic per-line color assignment for the fleet map. Same lineId always maps to the same palette color so operators can visually tell corridors apart across renders and sessions. Amber (#F59E0B) is intentionally reserved for the selected-line highlight. / const LINE_PALETTE: readonly string[] = [ '#EF4444', // red '#84CC16', // lime '#22C55E', // green '#14B8A6', // teal '#0EA5E9', // sky '#3B82F6', // blue '#6366F1', // indigo '#8B5CF6', // violet '#D946EF', // fuchsia '#EC4899', // pink '#F43F5E', // rose '#65A30D', // olive '#0891B2', // cyan-600 '#7C3AED', // violet-700 '#DB2777', // pink-600 '#EA580C', // orange-600 ] as const; /** djb2 string hash — stable, allocation-free, good spread for short labels. |
| L36 | `getLineColor()` | `lineId: string` | Returns the stable palette color for a bus line label. |

## [mapLibreWorker.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/utils/mapLibreWorker.ts)
`admin/src/utils/mapLibreWorker.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `ensureMapLibreWorker()` | *none* | @file mapLibreWorker.ts @description One-time MapLibre GL worker URL wiring for Vite. MapLibre resolves its default worker relative to `import.meta.url`, which 404s under Vite dev pre-bundling (`.vite/deps/maplibre-gl-worker.mjs` does not exist) and in the production bundle. Pointing `setWorkerUrl` at Vite's `?worker&url` asset makes the worker load in both dev and build (relative-base safe via `import.meta.url`). / import { setWorkerUrl } from 'maplibre-gl'; import workerAssetUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'; let configured = false; /** Registers the bundled MapLibre worker URL exactly once. Idempotent and failure-tolerant: on failure MapLibre falls back to its own default worker resolution. |

## [timeUtils.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/utils/timeUtils.ts)
`admin/src/utils/timeUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `formatDuration()` | `seconds: number` | @file timeUtils.ts @description Time, elapsed duration, and clock formatting helpers. / /** Formats a duration in seconds into digital clock string (mm:ss or hh:mm:ss). @param seconds - Total elapsed seconds. @returns Digital clock format string. |

## [totp.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/utils/totp.ts)
`admin/src/utils/totp.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `base32ToBytes()` | `base32: string` | Standard RFC 6238 TOTP (Time-based One-Time Password) Verification Utility. Compatible with Google Authenticator, Microsoft Authenticator, Authy, and 1Password. Uses the Web Cryptography API (crypto.subtle) without external dependencies. / const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; /** Decodes a Base32 string into a Uint8Array. |
| L32 | `generateHOTP()` | `secretBytes: Uint8Array, counter: number` | Generates a 6-digit TOTP code for a given counter using HMAC-SHA1. |
| L63 | `verifyTOTP()` | `token: string, base32Secret: string, stepSeconds = 30` | Verifies a 6-digit TOTP token against a Base32 secret key. Allows a +/- 1 step (30-second) drift window to accommodate client clock differences. |
| L92 | `getTOTPUri()` | `accountName: string, issuer: string, base32Secret: string` | Generates an otpauth:// URI string for setting up Google Authenticator via QR code. @suggestion [INTEGRATE]: Connect this function to a 'Show 2FA QR Code' modal in SecurityPage.tsx so new administrators can scan their TOTP key directly into Google Authenticator or Microsoft Authenticator. |

## [localMapStyles.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/future_plans/offline_maps_and_routing/admin/components_map/localMapStyles.ts)
`future_plans/offline_maps_and_routing/admin/components_map/localMapStyles.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `createLocalVectorStyle()` | `theme: 'dark' | 'clean', tileOrigin?: string` | @file localMapStyles.ts @description MapLibre GL vector styling definitions for 100% local MBTiles rendering. Translates OpenMapTiles vector layers (water, roads, buildings, landuse) into high-contrast dark and daytime cartographic presentations with zero external server dependencies. / import type { StyleSpecification } from 'maplibre-gl'; /** Generates MapLibre vector style specification for the local MBTiles endpoint. @param theme - 'dark' | 'clean' @param tileOrigin - Host origin for tiles (default window.location.origin) |

## [offlineMapLayer.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/future_plans/offline_maps_and_routing/admin/components_map/offlineMapLayer.ts)
`future_plans/offline_maps_and_routing/admin/components_map/offlineMapLayer.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `preloadOfflineMapAssets()` | *none* | @file offlineMapLayer.ts @description Attaches high-performance, 100% offline vector base map layers (River Nile, coastlines, and Egyptian transit road network) directly to any Leaflet map instance. Eliminates all external tile server network requests. / import L from 'leaflet'; interface RoadProperties { c?: string; // class s?: number; // speed } let cachedWaterGeoJson: GeoJSON.FeatureCollection | null = null; let cachedRoadsGeoJson: GeoJSON.FeatureCollection | null = null; /** Preloads vector map assets in background to ensure instantaneous rendering. |
| L36 | `attachOfflineVectorBaseMap()` | `map: L.Map` | Attaches offline vector base map layers to a Leaflet map. @param map - Leaflet map instance. @returns Clean-up function to remove layers when map unmounts. |
| L48 | `renderWater()` | `geojson: GeoJSON.FeatureCollection` | 1. Render Water Layer (River Nile & Waterbodies) |
| L74 | `renderRoads()` | `geojson: GeoJSON.FeatureCollection` | 2. Render Road Network Layer (Arteries, Ring Road, Corridors) |

## [bidirectionalAStar.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/future_plans/offline_maps_and_routing/admin/services/bidirectionalAStar.ts)
`future_plans/offline_maps_and_routing/admin/services/bidirectionalAStar.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L196 | `heuristic()` | `id: string` | No description provided. |

## [localRoutingEngine.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/future_plans/offline_maps_and_routing/admin/services/localRoutingEngine.ts)
`future_plans/offline_maps_and_routing/admin/services/localRoutingEngine.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `computeLocalRoadRoute()` | `waypoints: RouteWaypoint[]` | @file localRoutingEngine.ts @description Edge-device transit routing engine for Egyptian corridors. Operates completely offline with zero external cloud routing API dependencies. Computes authentic turn-by-turn road network paths dynamically with zero hardcoded routes. / import { haversineDistanceKm } from '../utils/geoUtils'; import { bidirectionalRouter } from './bidirectionalAStar'; export interface RouteWaypoint { lat: number; lng: number; name?: string; } export interface LocalRouteResult { coordinates: [number, number][]; distanceKm: number; durationMin: number; isFallback: boolean; } Asynchronously load the Egyptian road network graph into the edge router if (typeof window !== 'undefined' && typeof fetch !== 'undefined') { fetch('/data/egypt_road_graph.json') .then((r) => (r.ok ? r.json() : null)) .then((data) => { if (data?.nodes && Array.isArray(data.nodes)) { bidirectionalRouter.loadNodes(data.nodes); console.log(`[RoutingEngine] Preloaded ${data.nodes.length} road network nodes.`); } }) .catch((e) => console.warn('[RoutingEngine] Road graph preload note:', e)); } /** Computes an authentic road-following transit polyline, distance, and duration across arbitrary waypoints. Strictly calculates geometry dynamically along the road network on the edge device. @param waypoints - Sequence of GPS waypoints along the route. @returns Local route result with road polyline geometry, distance in km, and duration in minutes. |

## [build_road_graph.py](file:////home/kimo/Projects/active/bus-tracker-sya7a/future_plans/offline_maps_and_routing/scripts/build_road_graph.py)
`future_plans/offline_maps_and_routing/scripts/build_road_graph.py`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L44 | `main()` | *none* | No description provided. |

## [extract_demo_map.py](file:////home/kimo/Projects/active/bus-tracker-sya7a/future_plans/offline_maps_and_routing/scripts/extract_demo_map.py)
`future_plans/offline_maps_and_routing/scripts/extract_demo_map.py`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L254 | `build_simplifier()` | *none* | Create Douglas-Peucker simplifier using shapely. |
| L266 | `main()` | *none* | Execute full demo map vector extraction and synchronization. |

## [vite_mbtiles_plugin.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/future_plans/offline_maps_and_routing/vite_mbtiles_plugin.ts)
`future_plans/offline_maps_and_routing/vite_mbtiles_plugin.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `localMBTilesPlugin()` | `mbtilesPath = '/home/kimo/Storage/datasets/map.mbtiles'` | In-process Vite/Electron plugin to serve local OpenStreetMap vector tiles directly from /home/kimo/Storage/datasets/map.mbtiles. |

## [App.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/App.tsx)
`mobile/App.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L31 | `AnimatedTabButton()` | `{ children, onPress, accessibilityState }: any` | Animated tab button with bounce effect |
| L40 | `handlePress()` | *none* | Handles navigation tab press event. |
| L63 | `MainTabs()` | *none* | Bottom tab navigator for passenger application flows. |
| L116 | `AppNavigator()` | *none* | Root stack navigator coordinating role selection, login, and main tabs. |
| L152 | `AccountScopedProviders()` | `{ children }: { children: React.ReactNode }` | Scopes subscription state to the active account: remounting on account change re-reads AsyncStorage after switch/logout clears the tier key, so no plan state bleeds from one account to the next. |
| L166 | `App()` | *none* | Root React Native application entry point component. Provider order matters: UserTypeProvider must wrap AuthProvider so AuthContext can update the active role during silent account switches. |

## [SettingsModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/SettingsModal.tsx)
`mobile/src/components/SettingsModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `SettingsModal()` | `{ visible, onClose, onLogout }: Props` | Modal for user application preferences, theme toggling, and language switcher. |

## [SidebarAccountsSection.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/SidebarAccountsSection.tsx)
`mobile/src/components/SidebarAccountsSection.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `initialsOf()` | `label: string` | @file SidebarAccountsSection.tsx @description Sidebar block listing previously added accounts for silent switching (password from the SecureStore vault) plus an "Add account" row that signs out of the current session while keeping it saved. / import React, { useState } from 'react'; import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { useAuth } from '../contexts/AuthContext'; import { useTheme } from '../contexts/ThemeContext'; import { useI18n } from '../contexts/I18nContext'; interface SidebarAccountsSectionProps { /** Invoked after a successful switch or once the add-account flow starts. */ onClose: () => void; } /** Builds a 1-2 letter avatar label from a display name or email. |
| L38 | `SidebarAccountsSection()` | `{ onClose }: SidebarAccountsSectionProps` | Accounts switcher + "Add account" entry for the slide-out menu. |
| L47 | `handleSwitchPress()` | `uid: string` | Silently switches to another added account (re-authenticates in background). |
| L64 | `handleAddAccountPress()` | *none* | Starts the "add a new login" flow: signs out of Firebase only, so the current account (and its password) stays in the registry for switching. |

## [SidebarMenu.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/SidebarMenu.tsx)
`mobile/src/components/SidebarMenu.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L37 | `SidebarMenu()` | `{ visible, onClose }: SidebarMenuProps` | Slide-out drawer navigation menu displaying profile, links, and logout action. |
| L72 | `closeWithAnimation()` | *none* | Animates the sidebar drawer off-screen before invoking close callback. |
| L90 | `handleLogout()` | *none* | Logs out the authenticated user and closes the drawer. |
| L115 | `goToScreen()` | `name: string` | Navigates to the specified target screen and dismisses the sidebar. |
| L127 | `handleHistoryPress()` | *none* | Navigates to Commuter History screen. |
| L135 | `handleBusTrackerPress()` | *none* | Navigates to Live Map tracking screen. |
| L143 | `handleSubscriptionPress()` | *none* | Opens the Subscription plan upgrade modal. |

## [SubscriptionModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/SubscriptionModal.tsx)
`mobile/src/components/SubscriptionModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L67 | `SubscriptionModal()` | `{ visible, onClose }: Props` | Modal presenting available commuter subscription plan tiers. |
| L89 | `closeWithAnimation()` | *none* | Animates subscription modal exit transition. |
| L100 | `handleSelectPlan()` | `plan: PlanTier` | Processes plan selection and saves tier to context. |

## [AuthHeader.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/auth/AuthHeader.tsx)
`mobile/src/components/auth/AuthHeader.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `AuthHeader()` | `{   isSignUp,   isRTL,   branding, }` | @file AuthHeader.tsx @description Authentication screen header displaying dynamic branding icon, institutional application title, and welcoming subtitle. / import React from "react"; import { View, Text, Image } from "react-native"; import Animated, { FadeInUp } from "react-native-reanimated"; import { styles } from "../../styles/loginStyles"; import { TenantBranding } from "../../config/tenantConfig"; export interface AuthHeaderProps { isSignUp: boolean; isRTL: boolean; branding: TenantBranding; } /** Renders the top branding and titles for the login screen. @param props - Header configuration including sign up mode and tenant branding. |

## [DriverCompanyPickerModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/auth/DriverCompanyPickerModal.tsx)
`mobile/src/components/auth/DriverCompanyPickerModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `DriverCompanyPicker()` | `{   companies,   selectedCompany,   selectedCompanyName,   modalVisible,   isRTL,   vocabulary,   branding,   onOpenModal,   onCloseModal,   onSelectCompany, }` | @file DriverCompanyPickerModal.tsx @description Company and institution selector component and bottom sheet modal utilized during driver authentication to assign the driver's operating entity. / import React from "react"; import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native"; import { useSafeAreaInsets } from "react-native-safe-area-context"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/loginStyles"; import { CompanyItem } from "../../hooks/useAuthForm"; import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig"; export interface DriverCompanyPickerProps { companies: CompanyItem[]; selectedCompany: string; selectedCompanyName: string; modalVisible: boolean; isRTL: boolean; vocabulary: TenantVocabulary; branding: TenantBranding; onOpenModal: () => void; onCloseModal: () => void; onSelectCompany: (companyId: string) => void; } /** Renders company dropdown trigger button and modal selection sheet for driver login. @param props - Companies catalog, selection state, and modal visibility handlers. |

## [ForgotPasswordModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/auth/ForgotPasswordModal.tsx)
`mobile/src/components/auth/ForgotPasswordModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `ForgotPasswordModal()` | `{   visible,   email,   loading,   isRTL,   onChangeEmail,   onClose,   onSubmit, }` | @file ForgotPasswordModal.tsx @description Modal dialog allowing users to request a password reset email link. / import React from "react"; import { View, Text, TouchableOpacity, Modal } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import Animated, { FadeInUp } from "react-native-reanimated"; import { styles } from "../../styles/loginStyles"; import { useTheme } from "../../contexts/ThemeContext"; import { Input } from "../ui/Input"; import { Button } from "../ui/Button"; export interface ForgotPasswordModalProps { visible: boolean; email: string; loading: boolean; isRTL: boolean; onChangeEmail: (text: string) => void; onClose: () => void; onSubmit: () => void; } /** Modal dialog for password reset requests. @param props - Visibility, email input state, loading flag, and submission handlers. |

## [SignedInAccountsChooser.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/auth/SignedInAccountsChooser.tsx)
`mobile/src/components/auth/SignedInAccountsChooser.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `SignedInAccountsChooser()` | *none* | @file SignedInAccountsChooser.tsx @description Lists every previously added account while signed out so the user can silently switch back (password comes from the SecureStore vault) or pick the normal login form below to add a new login. / import React, { useState } from 'react'; import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { useAuth } from '../../contexts/AuthContext'; import { useTheme } from '../../contexts/ThemeContext'; import { useI18n } from '../../contexts/I18nContext'; function initialsFor(label: string): string { return label .split(' ') .map((word) => word[0] ?? '') .join('') .toUpperCase() .slice(0, 2) || 'U'; } /** Compact "Signed-in accounts" list rendered above the login form. |
| L42 | `handleSwitch()` | `uid: string` | Triggers a silent re-authentication switch into the tapped account. |

## [UserTypeToggle.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/auth/UserTypeToggle.tsx)
`mobile/src/components/auth/UserTypeToggle.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `UserTypeToggle()` | `{   userType,   vocabulary,   branding,   onSelectUserType, }` | @file UserTypeToggle.tsx @description Segmented role toggle component allowing users to switch between Passenger (Commuter/Student/Employee) and Driver modes. / import React from "react"; import { View, Text, TouchableOpacity } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/loginStyles"; import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig"; export interface UserTypeToggleProps { userType: "passenger" | "driver" | null; vocabulary: TenantVocabulary; branding: TenantBranding; onSelectUserType: (type: "passenger" | "driver") => void; } /** Segmented control component for selecting user persona. @param props - Current user type and selection handler. |

## [DriverHeader.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverHeader.tsx)
`mobile/src/components/driver/DriverHeader.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `DriverHeader()` | `{   driverInitials,   driverName,   companyId,   companyName,   sharing,   isRTL,   isDark,   vocabulary,   branding,   onOpenCompanyPicker,   onOpenSettings,   onLogout, }` | @file DriverHeader.tsx @description Driver profile header component displaying avatar, name, dynamic company/tenant badge, operational status chip, and settings/logout action buttons. / import React from "react"; import { View, Text, TouchableOpacity } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/driverHeaderStyles"; import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig"; export interface DriverHeaderProps { driverInitials: string; driverName: string; companyId: string | null; /** Resolved display name of the assigned company (falls back to the raw id). */ companyName?: string | null; sharing: boolean; isRTL: boolean; isDark: boolean; vocabulary: TenantVocabulary; branding: TenantBranding; onOpenCompanyPicker: () => void; onOpenSettings: () => void; onLogout: () => void; } /** Driver top navigation header bar displaying profile avatar, operational status, dynamic company badge, and action buttons. @param props - Driver header properties including avatar initials and modal triggers. |

## [DriverModals.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverModals.tsx)
`mobile/src/components/driver/DriverModals.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `CompanyPickerModal()` | `{   visible,   companies,   currentCompanyId,   isRTL,   isDark,   branding,   onClose,   onSelectCompany, }` | @file DriverModals.tsx @description Modal dialogs for the driver portal, including the Company/Institution Picker Modal. / import React from "react"; import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native"; import { useSafeAreaInsets } from "react-native-safe-area-context"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/driverModalStyles"; import { CompanyOption } from "../../hooks/useDriverProfile"; import { TenantBranding } from "../../config/tenantConfig"; export interface CompanyPickerModalProps { visible: boolean; companies: CompanyOption[]; currentCompanyId: string | null; isRTL: boolean; isDark: boolean; branding: TenantBranding; onClose: () => void; onSelectCompany: (companyId: string) => void; } /** Company and transit institution selection modal allowing drivers to switch active operating company. @param props - Modal visibility, company options list, and selection callback. |

## [DriverRouteTimeline.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverRouteTimeline.tsx)
`mobile/src/components/driver/DriverRouteTimeline.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `DriverRouteTimeline()` | `{   busLines,   selectedBusLine,   activeRoute,   driverLocation,   isRTL,   isDark,   vocabulary,   branding,   onSelectLine, }` | @file DriverRouteTimeline.tsx @description Renders the route line selector and multi-stop itinerary timeline, visualizing intermediate stops, landmarks, and dynamic Point A location. / import React from "react"; import { View, Text, TouchableOpacity, ScrollView } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/driverRouteStyles"; import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig"; import { DriverLocationPoint } from "../../hooks/useDriverTripState"; export interface DriverRouteTimelineProps { busLines: string[]; selectedBusLine: string | null; activeRoute: any; driverLocation: DriverLocationPoint | null; isRTL: boolean; isDark: boolean; vocabulary: TenantVocabulary; branding: TenantBranding; onSelectLine: (lineId: string) => void; } /** Route selector and multi-stop itinerary timeline visualizing sequential transit stops, landmarks, and Point A. @param props - Available lines, selected line, route stop sequence, and line selection callback. |

## [DriverSafetyOverlay.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverSafetyOverlay.tsx)
`mobile/src/components/driver/DriverSafetyOverlay.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `DriverSafetyOverlay()` | `{   cameraPermissionGranted,   micPermissionGranted,   cameraFacing,   cameraPreviewOpen,   cameraRef,   isSafetyStreaming,   webrtcHtml,   webViewRef,   isRTL,   isDark,   branding,   onFlipCamera,   onTogglePreview,   onRequestPermissions,   onWebViewMessage, }` | @file DriverSafetyOverlay.tsx @description SafeTrip™ Remote Hardware Safety Monitoring component. Embeds CameraView for driver cab monitoring, audio stream indicator, permission request prompt, and WebRTC peer streaming bridge. / import React from "react"; import { View, Text, TouchableOpacity, StyleSheet } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { CameraView } from "expo-camera"; import { WebView } from "react-native-webview"; import { styles } from "../../styles/driverSafetyStyles"; import { TenantBranding } from "../../config/tenantConfig"; export interface DriverSafetyOverlayProps { cameraPermissionGranted: boolean; micPermissionGranted: boolean; cameraFacing: "front" | "back"; cameraPreviewOpen: boolean; cameraRef: React.RefObject<any>; isSafetyStreaming: boolean; webrtcHtml: string; webViewRef: React.RefObject<any>; isRTL: boolean; isDark: boolean; branding: TenantBranding; onFlipCamera: () => void; onTogglePreview: () => void; onRequestPermissions: () => void; onWebViewMessage: (event: any) => void; } /** SafeTrip remote cabin safety camera monitoring overlay and WebRTC P2P streaming bridge. @param props - Hardware camera permissions, facing toggle, stream state, and signaling callbacks. |

## [DriverTripCard.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverTripCard.tsx)
`mobile/src/components/driver/DriverTripCard.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `DriverTripCard()` | `{   sharing,   currentSpeed,   tripSeconds,   selectedBusLine,   activeRoute,   driverLocation,   isRTL,   isDark,   vocabulary,   branding,   onStartSharing,   onStopSharing,   onSendSOS, }` | @file DriverTripCard.tsx @description Cockpit telemetry card rendering live speedometer, trip duration counter, dynamic Point A to Point B terminals, emergency SOS beacon, and start/stop broadcast actions. / import React from "react"; import { View, Text, TouchableOpacity } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/driverTripStyles"; import { formatTimer, DriverLocationPoint } from "../../hooks/useDriverTripState"; import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig"; export interface DriverTripCardProps { sharing: boolean; currentSpeed: number; tripSeconds: number; selectedBusLine: string | null; activeRoute: any; driverLocation: DriverLocationPoint | null; isRTL: boolean; isDark: boolean; vocabulary: TenantVocabulary; branding: TenantBranding; onStartSharing: () => void; onStopSharing: () => void; onSendSOS: () => void; } /** Cockpit telemetry card rendering live speedometer gauge, trip duration timer, route endpoints, and broadcast actions. @param props - Speed metrics, timer, route metadata, and start/stop broadcast handlers. |

## [ActiveBusCardItem.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/home/ActiveBusCardItem.tsx)
`mobile/src/components/home/ActiveBusCardItem.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `ActiveBusCardItem()` | `{   item,   index,   onSelect, }` | @file ActiveBusCardItem.tsx @description Card component rendering a live active vehicle with animated status beacon, driver badge, real-time timestamp, and selection handler. / import React from 'react'; import { View, Text, TouchableOpacity } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { useTheme } from '../../contexts/ThemeContext'; import { useI18n } from '../../contexts/I18nContext'; import { Card } from '../ui/Card'; import { styles } from '../../styles/homeStyles'; import { ActiveBus } from '../../hooks/useHomeBuses'; interface ActiveBusCardItemProps { item: ActiveBus; index: number; onSelect: (item: ActiveBus) => void; } /** Live active vehicle card item component. @param props - Active vehicle data and selection handler. @returns JSX Element. |

## [ActiveBusModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/home/ActiveBusModal.tsx)
`mobile/src/components/home/ActiveBusModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `ActiveBusModal()` | `{   selectedBus,   onClose,   onOpenMap, }` | @file ActiveBusModal.tsx @description Bottom sheet overlay modal presenting selected vehicle telemetry, driver details, geodesic distance/bearing, and one-tap map navigation. / import React from 'react'; import { View, Text, TouchableOpacity } from 'react-native'; import { useSafeAreaInsets } from 'react-native-safe-area-context'; import { Ionicons } from '@expo/vector-icons'; import { useTheme } from '../../contexts/ThemeContext'; import { useI18n } from '../../contexts/I18nContext'; import { Card } from '../ui/Card'; import { Button } from '../ui/Button'; import { styles } from '../../styles/homeStyles'; import { ActiveBus } from '../../hooks/useHomeBuses'; interface ActiveBusModalProps { selectedBus: ActiveBus | null; onClose: () => void; onOpenMap: (bus: ActiveBus) => void; } /** Bottom modal sheet showing active bus details and action button. @param props - Selected bus data and modal actions. @returns JSX Element or null if unselected. |

## [BusCardItem.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/home/BusCardItem.tsx)
`mobile/src/components/home/BusCardItem.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `BusCardItem()` | `{   item,   index,   isFavorite,   isAuthenticated,   onPress,   onToggleFavorite,   onSaveBookmark, }` | @file BusCardItem.tsx @description Catalog route line card rendering active bus status, GPS distance badge, estimated travel duration, and bookmark triggers. / import React from 'react'; import { View, Text, TouchableOpacity } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { useTheme } from '../../contexts/ThemeContext'; import { useI18n } from '../../contexts/I18nContext'; import { Card } from '../ui/Card'; import { styles } from '../../styles/homeStyles'; import { Bus } from '../../hooks/useHomeBuses'; interface BusCardItemProps { item: Bus; index: number; isFavorite: boolean; isAuthenticated: boolean; onPress: (bus: Bus) => void; onToggleFavorite: (lineName: string) => void; onSaveBookmark: (bus: Bus) => void; } /** Individual route line item card in the catalog listing. @param props - Card data, index, and callback handlers. @returns JSX Element. |

## [HomeHeader.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/home/HomeHeader.tsx)
`mobile/src/components/home/HomeHeader.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `HomeHeader()` | `{   onOpenSidebar,   onOpenSettings, }` | @file HomeHeader.tsx @description Navigation bar for HomeScreen incorporating multi-tenant white-label branding, sidebar drawer trigger, and settings launcher. / import React from 'react'; import { View, Text, TouchableOpacity } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { useTheme } from '../../contexts/ThemeContext'; import { useI18n } from '../../contexts/I18nContext'; import { getTenantBranding, getTenantVocabulary } from '../../config/tenantConfig'; import { useTenantArchetype } from '../../hooks/useTenantArchetype'; import { styles } from '../../styles/homeStyles'; interface HomeHeaderProps { onOpenSidebar: () => void; onOpenSettings: () => void; } /** Top header component rendering institutional tenant identity and actions. @param props - Navigation callback handlers. @returns JSX Element. |

## [BusDetailsSheet.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/map/BusDetailsSheet.tsx)
`mobile/src/components/map/BusDetailsSheet.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L41 | `BusDetailsSheet()` | `{   selectedBus,   onCloseBus,   routeDefinition,   busLine,   user,   isDark,   theme,   t,   isRTL,   savingRoute,   onSaveRoute, }: BusDetailsSheetProps` | Bottom sheet modal displaying selected vehicle details, stops, and ETA. |

## [MapFloatingHeader.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/map/MapFloatingHeader.tsx)
`mobile/src/components/map/MapFloatingHeader.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `MapFloatingHeader()` | `{   busLine,   activeBusCount,   onBack,   onSaveRoute,   onOpenSettings, }` | @file MapFloatingHeader.tsx @description Floating glassmorphic top navigation bar on the MapScreen, displaying transit line identity, active fleet count, and bookmark actions. / import React from 'react'; import { View, Text, TouchableOpacity } from 'react-native'; import { useSafeAreaInsets } from 'react-native-safe-area-context'; import { Ionicons } from '@expo/vector-icons'; import Animated, { FadeInUp } from 'react-native-reanimated'; import { useTheme } from '../../contexts/ThemeContext'; import { useI18n } from '../../contexts/I18nContext'; import { getTenantVocabulary } from '../../config/tenantConfig'; import { useTenantArchetype } from '../../hooks/useTenantArchetype'; import { styles } from '../../styles/mapStyles'; interface MapFloatingHeaderProps { busLine: string; activeBusCount: number; onBack: () => void; onSaveRoute: () => void; onOpenSettings: () => void; } /** Top floating header bar component providing route metadata and quick actions. @param props - Header route data and action callbacks. @returns JSX Element. |

## [passengerMapHtml.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/map/passengerMapHtml.ts)
`mobile/src/components/map/passengerMapHtml.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `getMapHTML()` | `isDark: boolean` | @file passengerMapHtml.ts @description Commuter passenger WebView map HTML template. Basemap = OpenFreeMap vector styles (light: liberty, dark: dark) rendered through @maplibre/maplibre-gl-leaflet, so every React Native bridge function keeps operating on a real Leaflet instance (markers, polylines, fitBounds). Overlay geometry comes from the local offline routing engine; tiles never do. / import { MAP_ATTRIBUTION, MAP_CDN, OFM_STYLES } from '../../config/mapConfig'; /** Builds the passenger map HTML document. @param isDark - Initial theme mode (true = OpenFreeMap dark style). @returns Self-contained HTML string for react-native-webview. |
| L56 | `showFallback()` | `message` | No description provided. |
| L63 | `hideFallback()` | *none* | No description provided. |
| L68 | `applyPageBackground()` | `mode` | No description provided. |
| L75 | `reportToNative()` | `payload` | No description provided. |
| L106 | `createGlLayer()` | `styleUrl` | No description provided. |
| L114 | `bindGlEvents()` | `layer` | No description provided. |
| L256 | `updateBusMarkers()` | `busLocations` | Live Bus Vehicle Markers |

## [Button.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/ui/Button.tsx)
`mobile/src/components/ui/Button.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L33 | `Button()` | `{   title,   onPress,   variant = 'primary',   size = 'medium',   loading = false,   disabled = false,   style,   textStyle,   icon, }` | Reusable animated button component with variant styling and loading spinners. |
| L52 | `handlePressIn()` | *none* | Triggers button press-in spring scale animation. |
| L60 | `handlePressOut()` | *none* | Triggers button press-out spring release animation. |
| L73 | `getVariantStyles()` | *none* | Resolves container background and border styles based on button variant. Tenant brand primary/danger tokens are applied over the static base styles. |
| L98 | `getTextStyles()` | *none* | Resolves typography color styles based on button variant. |
| L115 | `getSizeStyles()` | *none* | Resolves padding and dimension styles based on button size. |

## [Card.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/ui/Card.tsx)
`mobile/src/components/ui/Card.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L13 | `Card()` | `{ style, children, animated = false, delay = 0, ...props }` | Reusable card container component with theme border and entrance animation. |

## [Input.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/ui/Input.tsx)
`mobile/src/components/ui/Input.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L29 | `Input()` | `{   label,   error,   containerStyle,   iconName,   isPassword,   onFocus,   onBlur,   style,   ...props }` | Reusable text input component with floating label, icon, and error validation. |
| L49 | `handleFocus()` | `e: any` | Handles text input focus state and animation transitions. |
| L58 | `handleBlur()` | `e: any` | Handles text input blur event and reset animations. |

## [mapConfig.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/config/mapConfig.ts)
`mobile/src/config/mapConfig.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `resolveMapStyleUrl()` | `mode?: MapThemeMode | null` | @file mapConfig.ts @description Centralized OpenFreeMap configuration for the commuter mobile map. Every tile endpoint, style URL, attribution string and pinned CDN asset used by WebView map HTML is declared here. No other module may hardcode map URLs. Tiles come exclusively from the public OpenFreeMap instance (https://openfreemap.org/) — no OSM raster tiles and no local/self-hosted tile servers. Offline routing keeps using localRoutingEngine.ts and is intentionally not configured here. / /** Supported map theme modes; mirrored from ThemeContext ('light' | 'dark'). */ export type MapThemeMode = 'light' | 'dark'; /** Default Egyptian transit coordinates and bounds. / export const DEFAULT_MAP_CENTER = { latitude: 30.0444, longitude: 31.2357, zoom: 12, }; /** OpenFreeMap planet vector tiles (Mapbox Vector Tiles, OpenMapTiles schema). Styles fetched below reference this endpoint internally; exported so any consumer needing raw MVT tiles never hardcodes the URL. / export const OFM_TILE_URL_TEMPLATE = 'https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf'; /** Official OpenFreeMap default style (declared in the Quick Start Guide: https://openfreemap.org/quick_start/). Warm, light basemap — used for light mode. / export const OFM_STYLE_LIGHT = 'https://tiles.openfreemap.org/styles/liberty'; /** OpenFreeMap dark style — used for dark mode. */ export const OFM_STYLE_DARK = 'https://tiles.openfreemap.org/styles/dark'; /** Style URL lookup keyed by map theme mode. */ export const OFM_STYLES: Record<MapThemeMode, string> = { light: OFM_STYLE_LIGHT, dark: OFM_STYLE_DARK, }; /** Attribution required by OpenFreeMap / OpenMapTiles / OpenStreetMap. Rendered through Leaflet's attribution control (glue layer passes it through). / export const MAP_ATTRIBUTION = '© OpenMapTiles © OpenStreetMap contributors'; /** Pinned CDN assets for the WebView map document (Leaflet + MapLibre GL + glue). Versions are pinned so a CDN "latest" bump cannot silently break the page. / export const MAP_CDN = { leafletCss: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', leafletJs: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', maplibreGlCss: 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css', maplibreGlJs: 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js', maplibreGlLeafletJs: 'https://unpkg.com/@maplibre/maplibre-gl-leaflet@0.1.4/dist/leaflet-maplibre-gl.js', } as const; /** Resolves the OpenFreeMap style URL for the requested map theme mode. Defaults to the light style for unknown/absent values. @param mode - Live theme mode ('light' | 'dark'). @returns Absolute OpenFreeMap style URL. |

## [tenantConfig.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/config/tenantConfig.ts)
`mobile/src/config/tenantConfig.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `getTenantBranding()` | `archetype: TenantArchetype = ACTIVE_TENANT` | @file tenantConfig.ts @description Centralized White-Label Multi-Tenant Configuration. Enables dynamic re-branding, custom color themes, company logos, and localized institutional vocabulary for public transit, private schools, universities, and corporate call center shuttles without modifying component code. / export type TenantArchetype = | 'public_transit' | 'school' | 'call_center' | 'university' | 'corporate_fleet'; export interface TenantBranding { /** Display name of the institution or transport service */ appName: string; /** Arabic display name */ appNameAr: string; /** Primary brand accent color (e.g., #2563EB for transit, #F59E0B for school) */ primaryColor: string; /** Secondary accent color */ secondaryColor: string; /** Header / Card background tint */ accentColor: string; /** Remote or local logo URL */ logoUrl?: string; /** Slogan or organization subtitle */ tagline: string; /** Arabic tagline */ taglineAr: string; } export interface TenantVocabulary { /** e.g. "Bus Line" vs "School Route" vs "Shift Shuttle" */ routeLabel: string; /** e.g. "Bus Stop" vs "Student Pickup" vs "Meeting Point" */ stopLabel: string; /** e.g. "Passenger" vs "Student" vs "Employee" */ passengerLabel: string; /** e.g. "Terminal Depot" vs "School Campus" vs "Corporate HQ" */ terminalLabel: string; /** e.g. "Start Terminal" vs "First Pickup" */ startPointLabel: string; /** e.g. "Destination" vs "School Destination" */ endPointLabel: string; /** e.g. "Driver" vs "School Bus Driver" vs "Captain" */ driverTitle: string; } export interface TenantProfile { archetype: TenantArchetype; branding: TenantBranding; en: TenantVocabulary; ar: TenantVocabulary; } /** Built-in institutional profile presets. / export const TENANT_PROFILES: Record<TenantArchetype, TenantProfile> = { public_transit: { archetype: 'public_transit', branding: { appName: 'Wasalt Transit', appNameAr: 'وصلت للنقل الجماعي', primaryColor: '#2563EB', secondaryColor: '#1D4ED8', accentColor: '#EFF6FF', tagline: 'Smart Public Transit & Fleet Operations', taglineAr: 'منظومة النقل والتتبع الذكي', }, en: { routeLabel: 'Bus Line', stopLabel: 'Bus Stop', passengerLabel: 'Passenger', terminalLabel: 'Terminal Depot', startPointLabel: 'Starting Station', endPointLabel: 'Destination Terminal', driverTitle: 'Transit Captain', }, ar: { routeLabel: 'خط الحافلة', stopLabel: 'محطة توقف', passengerLabel: 'راكب', terminalLabel: 'المحطة النهائية', startPointLabel: 'محطة البداية', endPointLabel: 'محطة الوصول', driverTitle: 'كابتن الحافلة', }, }, school: { archetype: 'school', branding: { appName: 'SchoolBus SafeTrip', appNameAr: 'باص المدرسة الآمن', primaryColor: '#F59E0B', secondaryColor: '#D97706', accentColor: '#FFFBEB', tagline: 'Safe Student Commute & Live Monitoring', taglineAr: 'متابعة حية لرحلات الطلاب المدرسية', }, en: { routeLabel: 'School Route', stopLabel: 'Student Pickup Point', passengerLabel: 'Student', terminalLabel: 'School Campus', startPointLabel: 'First Student Pickup', endPointLabel: 'School Campus Gate', driverTitle: 'School Bus Driver', }, ar: { routeLabel: 'خط المدرسة', stopLabel: 'نقطة تجمع الطلاب', passengerLabel: 'طالب', terminalLabel: 'مبنى المدرسة', startPointLabel: 'أول نقطة تجمع', endPointLabel: 'بوابة المدرسة', driverTitle: 'سائق الحافلة المدرسية', }, }, call_center: { archetype: 'call_center', branding: { appName: 'Corporate Shuttle Command', appNameAr: 'نظام النقل المؤسسي والورديات', primaryColor: '#059669', secondaryColor: '#047857', accentColor: '#ECFDF5', tagline: 'Employee Shift Shuttles & Operations Dispatch', taglineAr: 'إدارة ورديات الموظفين ونقل الشركات', }, en: { routeLabel: 'Shift Shuttle Line', stopLabel: 'Employee Pickup Station', passengerLabel: 'Employee', terminalLabel: 'Corporate Headquarters', startPointLabel: 'Route Departure Station', endPointLabel: 'Office Facility', driverTitle: 'Shuttle Operator', }, ar: { routeLabel: 'خط الوردية', stopLabel: 'نقطة استلام الموظف', passengerLabel: 'موظف', terminalLabel: 'المقر الرئيسي', startPointLabel: 'محطة التحرك', endPointLabel: 'مقر العمل', driverTitle: 'سائق الوردية', }, }, university: { archetype: 'university', branding: { appName: 'Campus Transit', appNameAr: 'نقل الحرم الجامعي', primaryColor: '#7C3AED', secondaryColor: '#6D28D9', accentColor: '#F5F3FF', tagline: 'University Shuttle & Inter-Campus Network', taglineAr: 'شبكة خطوط الحرم الجامعي والمحطات', }, en: { routeLabel: 'Campus Line', stopLabel: 'Campus Station', passengerLabel: 'Student / Staff', terminalLabel: 'University Gate', startPointLabel: 'Metro / Hub Station', endPointLabel: 'University Campus', driverTitle: 'Campus Driver', }, ar: { routeLabel: 'خط الحرم الجامعي', stopLabel: 'محطة الجامعة', passengerLabel: 'طالب / عضو هيئة', terminalLabel: 'بوابة الجامعة', startPointLabel: 'محطة التجمع', endPointLabel: 'الحرم الجامعي', driverTitle: 'سائق حافلة الجامعة', }, }, corporate_fleet: { archetype: 'corporate_fleet', branding: { appName: 'Fleet Logistics', appNameAr: 'لوجستيات الأسطول', primaryColor: '#0EA5E9', secondaryColor: '#0284C7', accentColor: '#F0F9FF', tagline: 'Enterprise Passenger Fleet Telematics', taglineAr: 'إدارة ومتابعة أساطيل النقل الخاص', }, en: { routeLabel: 'Fleet Route', stopLabel: 'Waypoint Station', passengerLabel: 'Client / Passenger', terminalLabel: 'Operations Depot', startPointLabel: 'Dispatch Point', endPointLabel: 'Terminal Destination', driverTitle: 'Fleet Captain', }, ar: { routeLabel: 'مسار الأسطول', stopLabel: 'محطة المرور', passengerLabel: 'عميل / راكب', terminalLabel: 'مركز العمليات', startPointLabel: 'نقطة الانطلاق', endPointLabel: 'وجهة الوصول', driverTitle: 'قائد الأسطول', }, }, }; /** Global default tenant configuration. To re-theme the app for a school or corporate client, simply adjust this archetype! / export const ACTIVE_TENANT: TenantArchetype = 'public_transit'; /** Retrieves the branding tokens for a given archetype. @param archetype - Target tenant archetype or default active tenant. @returns Complete branding configuration including primary colors and app names. |
| L236 | `getTenantVocabulary()` | `isRTL: boolean,   archetype: TenantArchetype = ACTIVE_TENANT` | Retrieves the localized vocabulary mapping for the specified tenant. @param isRTL - Whether the user interface is currently in Arabic (RTL). @param archetype - Target tenant archetype or default active tenant. @returns Localized nomenclature for routes, stops, terminals, and passengers. |

## [AuthContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/contexts/AuthContext.tsx)
`mobile/src/contexts/AuthContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L45 | `useAuth()` | *none* | Silent switch to an already-added account (re-authenticates in background). */ switchAccount: (uid: string) => Promise<void>; /** Signs out of Firebase but keeps the current account saved, for a new login. */ addAccount: () => Promise<void>; logout: () => Promise<void>; } const AuthContext = createContext<AuthContextType | undefined>(undefined); /** Accesses the current user authentication state and methods. |
| L65 | `AuthProvider()` | `{ children }: { children: React.ReactNode }` | Provides authentication state and user session context to child components. Requires UserTypeProvider as an ancestor (wired in App.tsx) so account switches can update the active role without provider-order races. |
| L144 | `registerSession()` | `profile: { uid: string; email?: string | null; displayName?: string | null },     password: string` | Records a successful email/password session: registry upsert, active pointer, and password vault entry (failures degrade, never block login). |
| L172 | `signIn()` | `email: string, password: string` | Signs in a user with email and password via Firebase Auth. |
| L183 | `signUp()` | `email: string, password: string, username: string` | Registers a new user account with email, password, and username. |
| L206 | `signInWithGoogle()` | *none* | Initiates Google OAuth single sign-on authentication. @suggestion [INTEGRATE]: If Google SSO is required for commuters, configure native Google Sign-In credentials in app.json and wire a button in LoginScreen.tsx, or remove if Email/Password and Apple SSO suffice. |
| L215 | `signInWithApple()` | *none* | Initiates Apple ID OAuth single sign-on authentication. |
| L251 | `resetPassword()` | `email: string` | Sends a password reset email to the specified address. |
| L262 | `switchAccount()` | `uid: string` | Silently switches to another added account using its stored password. Throws a friendly message on failure (caller shows the Alert). |
| L289 | `addAccount()` | *none* | Begins "add a new login": signs out of Firebase only. The current account stays in the registry (with its credentials) and remains switchable. |
| L306 | `logout()` | *none* | Signs out and removes ONLY the current account from the list. Other added accounts and their stored credentials remain available for switching. |

## [I18nContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/contexts/I18nContext.tsx)
`mobile/src/contexts/I18nContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L270 | `I18nProvider()` | `{ children }: { children: React.ReactNode }` | Provides localization dictionaries and RTL layout direction context. |
| L303 | `useI18n()` | *none* | Accesses translation helper `t` and RTL status boolean. |

## [LocationContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/contexts/LocationContext.tsx)
`mobile/src/contexts/LocationContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `useLocation()` | *none* | Accesses the active device GPS location and location services. |
| L28 | `LocationProvider()` | `{ children }: { children: React.ReactNode }` | Provides GPS coordinate stream and permission states to child components. |
| L49 | `requestLocationPermission()` | *none* | Prompts device for foreground and background location permissions. |
| L98 | `getCurrentLocation()` | *none* | Fetches the current high-accuracy device GPS position once. |
| L129 | `startLocationUpdates()` | *none* | Starts listening for continuous background GPS coordinate updates. |
| L174 | `stopLocationUpdates()` | *none* | Halts continuous device GPS coordinate listening. |

## [SubscriptionContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/contexts/SubscriptionContext.tsx)
`mobile/src/contexts/SubscriptionContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `SubscriptionProvider()` | `{ children }: { children: React.ReactNode }` | Provides commuter subscription plan state to child components. |
| L32 | `setPlan()` | `plan: PlanTier` | Updates the active commuter subscription tier. |
| L51 | `useSubscription()` | *none* | Accesses commuter subscription tier details and operations. |

## [ThemeContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/contexts/ThemeContext.tsx)
`mobile/src/contexts/ThemeContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `ThemeProvider()` | `{ children }: { children: React.ReactNode }` | @file ThemeContext.tsx @description Application color scheme provider. Light/dark token palettes are branded from the active white-label tenant (primary follows getTenantBranding().primaryColor) while mode-specific success/danger/text tokens keep their platform semantics. / import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'; import AsyncStorage from '@react-native-async-storage/async-storage'; import { getTenantBranding } from '../config/tenantConfig'; import { useTenantArchetype } from '../hooks/useTenantArchetype'; type ThemeMode = 'light' | 'dark'; interface Theme { mode: ThemeMode; colors: { background: string; card: string; border: string; textPrimary: string; textSecondary: string; primary: string; success: string; danger: string; muted: string; searchBg: string; }; } interface ThemeContextType { theme: Theme; mode: ThemeMode; setMode: (mode: ThemeMode) => void; toggleMode: () => void; } const ThemeContext = createContext<ThemeContextType | undefined>(undefined); const LIGHT: Theme = { mode: 'light', colors: { background: '#FFFFFF', card: '#FFFFFF', border: '#F0F0F0', textPrimary: '#000000', textSecondary: '#666666', primary: '#007AFF', success: '#34C759', danger: '#FF3B30', muted: '#999999', searchBg: '#F8F8F8', }, }; const DARK: Theme = { mode: 'dark', colors: { background: '#000000', card: '#121212', border: '#222222', textPrimary: '#FFFFFF', textSecondary: '#D0D0D0', primary: '#0A84FF', success: '#30D158', danger: '#FF453A', muted: '#8E8E93', searchBg: '#1C1C1E', }, }; const STORAGE_KEY = 'app_theme_mode_v1'; /** Provides application color scheme, mode toggle, and the tenant-branded primary color (from getTenantBranding().primaryColor) for the active archetype. |
| L98 | `useTheme()` | *none* | Applies the tenant brand primary over the mode palette, keeping every other token (success/danger/text/background) mode-specific. / const theme = useMemo(() => { const base = mode === 'dark' ? DARK : LIGHT; const brandPrimary = getTenantBranding(archetype).primaryColor; if (!brandPrimary || brandPrimary === base.colors.primary) return base; return { ...base, colors: { ...base.colors, primary: brandPrimary } }; }, [mode, archetype]); const value = useMemo( () => ({ theme, mode, setMode, toggleMode: () => setMode(prev => (prev === 'dark' ? 'light' : 'dark')) }), [theme, mode] ); return ( <ThemeContext.Provider value={value}> {children} </ThemeContext.Provider> ); } /** Accesses current theme tokens, color palette, and mode toggle. |

## [UserTypeContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/contexts/UserTypeContext.tsx)
`mobile/src/contexts/UserTypeContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `UserTypeProvider()` | `{ children }: { children: React.ReactNode }` | Provides user role state (passenger, driver) to child components. |
| L33 | `setUserType()` | `type: Exclude<UserType, null>` | Updates and persists active user role selection. |
| L41 | `clearUserType()` | *none* | Clears the active user role selection from state. Invoked by AuthContext during account switch / logout / add-account so no role state bleeds between accounts. |
| L60 | `useUserType()` | *none* | Accesses the active user role selection. |

## [useAuthForm.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/hooks/useAuthForm.ts)
`mobile/src/hooks/useAuthForm.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `validateAuthInput()` | `email: string, password: string, isSignUp: boolean, username: string` | @file useAuthForm.ts @description Authentication form custom hook managing credentials state, sign-in/sign-up validation, Apple authentication, password reset workflows, driver company assignment, and session conflict prevention. / import { useState, useEffect, useMemo } from "react"; import { Alert } from "react-native"; import { ref, onValue, off, get, set, update } from "firebase/database"; import { database, auth } from "../config/firebase"; import { useAuth } from "../contexts/AuthContext"; import { useUserType } from "../contexts/UserTypeContext"; import { setDriverCompanyId } from "../utils/driverStorage"; export interface CompanyItem { id: string; name: string; } /** Validates basic authentication credentials and required fields. |
| L34 | `checkActiveDriverBroadcast()` | `normalizedEmail: string` | Checks Realtime Database for any active concurrent broadcasting sessions for a driver email. |
| L61 | `syncDriverCompanyProfile()` | `uid: string,   email: string,   fallbackName: string,   companyId: string` | Synchronizes driver profile and company affiliation to Realtime Database and storage. |
| L88 | `displayAuthError()` | `error: any, onResetPassword: (` | Maps authentication errors to human-friendly dialogs with recovery actions. |
| L106 | `useAuthForm()` | *none* | Custom hook encapsulating authentication form logic. |
| L157 | `handleAuth()` | *none* | Coordinates authentication workflow across validation, credentials auth, and profile synchronization. |
| L215 | `handleAppleSignIn()` | *none* | Executes Apple Single Sign-On flow. |
| L229 | `handlePasswordReset()` | *none* | Dispatches password reset email. |

## [useDriverProfile.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/hooks/useDriverProfile.ts)
`mobile/src/hooks/useDriverProfile.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `useDriverProfile()` | `user: any` | @file useDriverProfile.ts @description Custom hook managing driver identity, company/institution assignment, real-time line catalogs, route stop sequences, and company switching. / import { useEffect, useMemo, useState } from "react"; import { ref, onValue, off } from "firebase/database"; import { auth, database } from "../config/firebase"; import { getDriverCompanyId, setDriverCompanyId, getDriverBusLine, } from "../utils/driverStorage"; export interface CompanyOption { id: string; name: string; } /** Driver profile & line catalog hook managing assigned company ID, real-time line catalogs, route stop sequences, and company switching. @param user - Authenticated Firebase user instance. @returns Driver profile state, available companies, bus lines, active route, and selection handlers. |
| L60 | `fetchDriverAndCompanyData()` | *none* | Subscribes to real-time driver profile assignment and company catalog nodes in RTDB. |
| L158 | `handleSelectCompany()` | `newCompanyId: string` | Switches the active operating company or institution. |

## [useDriverTripState.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/hooks/useDriverTripState.ts)
`mobile/src/hooks/useDriverTripState.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L2 | `useDriverTripState()` | `{   user,   driverName,   selectedBusLine,   activeRoute,   isRTL,   cameraGranted,   micGranted,   onEnsurePermissions, }: UseDriverTripStateProps` | @file useDriverTripState.ts @description Custom hook encapsulating live GPS telemetry tracking, speed calculation, trip duration timer, emergency SOS signaling, and Firebase Realtime Database telemetry sync. / import { useEffect, useRef, useState } from "react"; import { Alert } from "react-native"; import * as Location from "expo-location"; import { ref, set, remove } from "firebase/database"; import { auth, database } from "../config/firebase"; import { setDriverBusLine } from "../utils/driverStorage"; /** Formats total trip elapsed seconds into HH:MM:SS or MM:SS */ import { haversineMeters, formatTimer, isValidCoordinate, sanitizePathKey, } from "../utils/geoUtils"; export { haversineMeters, formatTimer, isValidCoordinate, sanitizePathKey }; export interface DriverLocationPoint { lat: number; lng: number; name: string; } export interface UseDriverTripStateProps { user: any; driverName: string; selectedBusLine: string | null; activeRoute: any; isRTL: boolean; cameraGranted: boolean; micGranted: boolean; onEnsurePermissions: () => Promise<boolean>; } /** Core driver trip state hook managing live GPS tracking loop, velocity smoothing, duration timer, dynamic Point A reverse geocoding, and RTDB telemetry sync. @param props - Hook configuration including user auth, route metadata, and permission triggers. @returns State properties and actions (startSharing, stopSharing, sendSOS, currentSpeed). |
| L67 | `startSharing()` | *none* | RTDB path captured when the trip starts so stop() never depends on live props. */ const tripPathRef = useRef<string | null>(null); /** Trip generation counter — bumped on start/stop to invalidate stale GPS writers. */ const tripGenRef = useRef(0); Initial Point A capture on screen mount useEffect(() => { let isMounted = true; (async () => { try { const { status } = await Location.requestForegroundPermissionsAsync(); if (status === "granted") { const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }); if (!isMounted) return; let placeName = ""; try { const [geo] = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, }); if (geo) { placeName = [geo.name || geo.street, geo.district, geo.city].filter(Boolean).join(", "); } } catch {} setDriverLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, name: placeName || (isRTL ? "موقعك الحالي (GPS)" : "Current Driver GPS Location"), }); } } catch (err) { console.warn("[DriverGPS] Initial Point A location fetch error:", err); } })(); return () => { isMounted = false; }; }, [isRTL]); Trip duration second ticker useEffect(() => { let timer: ReturnType<typeof setInterval>; if (sharing) { timer = setInterval(() => { setTripSeconds((prev) => prev + 1); }, 1000); } else { setTripSeconds(0); setCurrentSpeed(0); } return () => { if (timer) clearInterval(timer); }; }, [sharing]); Cleanup GPS subscription on unmount useEffect(() => { return () => { if (locationSubRef.current) { locationSubRef.current.remove(); locationSubRef.current = null; } }; }, []); /** Starts high-frequency GPS tracking and RTDB telemetry sync. / /** Coordinates driver trip initiation, hardware GPS acquisition, initial RTDB sync, and location stream subscription. |
| L263 | `stopSharing()` | *none* | Prompts driver to end trip, detaches GPS watcher, and removes ephemeral RTDB telematics. |
| L306 | `handleSendSOS()` | *none* | Dispatches instant distress beacon to operations command. |

## [useHomeBuses.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/hooks/useHomeBuses.ts)
`mobile/src/hooks/useHomeBuses.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `useHomeBuses()` | `{ userId, userCoords, isRTL }: UseHomeBusesProps` | @file useHomeBuses.ts @description State hook managing bus catalog lines, active live vehicles, real-time Firebase RTDB listeners, geodesic ETA telemetry, search filtering, and user bookmarks. / import { useState, useEffect, useMemo, useCallback } from 'react'; import { database } from '../config/firebase'; import { ref, onValue, off } from 'firebase/database'; import { saveToHistory } from '../utils/historyUtils'; import { listenToFavorites, toggleFavorite } from '../utils/favoritesUtils'; import { calculateDistanceKm, calculateBearing, getDirectionName, calculateTimeToArrival, } from '../utils/geoUtils'; /** Catalog route bus line definition. / export interface Bus { id: string; lineName: string; companyName: string; activeBusCount: number; eta?: string; latitude?: number; longitude?: number; distance?: number; direction?: string; timeToArrival?: string; } /** Live active vehicle telemetry record. / export interface ActiveBus { id: string; lineName: string; driverId: string; latitude: number; longitude: number; lastUpdated: string; distance?: number; direction?: string; timeToArrival?: string; driverName?: string; } interface UseHomeBusesProps { userId?: string | null; userCoords?: { latitude: number; longitude: number } | null; isRTL: boolean; } /** Hook to manage live bus discovery, catalog filtering, and RTDB telemetry synchronization. @param props - User context and coordinate props. @returns State and handlers for HomeScreen. |

## [useMapBuses.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/hooks/useMapBuses.ts)
`mobile/src/hooks/useMapBuses.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `useMapBuses()` | `{ busLine, userCoords, isRTL }: UseMapBusesProps` | @file useMapBuses.ts @description Hook managing real-time vehicle telemetry, line route geometry, closest bus auto-selection, and Firebase RTDB listeners for MapScreen. / import { useState, useEffect } from 'react'; import { database } from '../config/firebase'; import { ref, onValue, off } from 'firebase/database'; import { BusLocation } from '../components/map/BusDetailsSheet'; import { calculateDistanceKm, calculateBearing, getDirectionName, calculateTimeToArrival, } from '../utils/geoUtils'; interface UseMapBusesProps { busLine: string; userCoords: { latitude: number; longitude: number } | null; isRTL: boolean; } /** Custom hook providing live vehicle telemetry and route definition for a specific transit line. @param props - Transit line name, user coordinates, and RTL flag. @returns State properties and selection handlers. |

## [useTenantArchetype.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/hooks/useTenantArchetype.ts)
`mobile/src/hooks/useTenantArchetype.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `isTenantArchetype()` | `value: unknown` | @file useTenantArchetype.ts @description Data-driven white-label tenant archetype resolution. Resolves the active TenantArchetype for the signed-in user with the priority: 1. Driver company override -> companies/<companyId>/tenantArchetype (validated). 2. User profile fields -> users/<uid>/tenantArchetype | archetype | company(id). 3. ACTIVE_TENANT default from tenantConfig. Resolutions are cached per uid + role so consumers never re-query per render. / import { useEffect, useState } from "react"; import { ref, get } from "firebase/database"; import { database } from "../config/firebase"; import { useAuth } from "../contexts/AuthContext"; import { useUserType } from "../contexts/UserTypeContext"; import { ACTIVE_TENANT, TenantArchetype } from "../config/tenantConfig"; import { getDriverCompanyId } from "../utils/driverStorage"; /** Known archetype identifiers, mirrored from the TENANT_PROFILES keys. */ const VALID_ARCHETYPES: readonly string[] = [ "public_transit", "school", "call_center", "university", "corporate_fleet", ]; /** RTDB-safe id: rejects path separators and reserved characters. */ const SAFE_ID_PATTERN = /^[A-Za-z0-9_-]+$/; /** Resolved archetype cache keyed by `${uid}:${role}` (survives remounts). */ const resolvedCache = new Map<string, TenantArchetype>(); /** In-flight dedupe so simultaneous mounts share a single RTDB read. */ const inFlight = new Map<string, Promise<TenantArchetype>>(); /** Type guard validating a raw RTDB value against the TenantArchetype union. |
| L43 | `readCompanyArchetype()` | `companyId: string` | Reads companies/<companyId>/tenantArchetype, returning null when missing, malformed, or unreadable so callers can fall through safely. |
| L59 | `readDriverCompanyId()` | `uid: string` | Reads the driver's assigned companyId from drivers/<uid>, falling back to the locally persisted company id (same pattern as useDriverProfile). |
| L78 | `readProfileArchetype()` | `uid: string` | Reads the passenger/user profile for a direct archetype field or a company reference that resolves to one. |
| L98 | `resolveTenantArchetype()` | `uid: string,   userType: string | null` | Resolves the active tenant archetype for a signed-in user (cached + deduped). @param uid - Firebase Auth uid of the active account. @param userType - Active role: drivers consult company overrides first. @returns Validated archetype, or ACTIVE_TENANT when nothing resolves. |
| L113 | `task()` | `async (` | No description provided. |
| L138 | `useTenantArchetype()` | *none* | Resolves and caches the active white-label tenant archetype for the current session. Safe to call from any provider or screen; signed-out callers immediately receive the ACTIVE_TENANT default. @returns Validated TenantArchetype for branding and vocabulary lookups. |

## [CompaniesScreen.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/CompaniesScreen.tsx)
`mobile/src/screens/CompaniesScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L28 | `CompaniesScreen()` | *none* | Screen browsing transit companies catalog and their operating lines. |
| L82 | `handleCompanyPress()` | `company: Company` | Handles user tap on a transit operating company. |
| L89 | `handleBusLinePress()` | `busLine: string` | Handles user tap on an operating bus line. |
| L98 | `renderCompanyItem()` | `{ item, index }: { item: Company; index: number }` | Renders individual company item card in the FlatList. |
| L125 | `renderBusLineItem()` | `{ item, index }: { item: string; index: number }` | Renders individual bus line item in the company list. |

## [DriverHomeScreen.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/DriverHomeScreen.tsx)
`mobile/src/screens/DriverHomeScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `DriverHomeScreen()` | *none* | @file DriverHomeScreen.tsx @description Driver operations dashboard coordinator screen. Orchestrates live GPS telemetry broadcasting, cockpit speed metrics, multi-stop itinerary timeline, SafeTrip WebRTC emergency camera monitoring, and white-label multi-tenant institution customization. / import React, { useRef, useState } from "react"; import { Alert, KeyboardAvoidingView, Platform, ScrollView, } from "react-native"; import { SafeAreaView } from "react-native-safe-area-context"; import { useCameraPermissions, useMicrophonePermissions } from "expo-camera"; import { useTheme } from "../contexts/ThemeContext"; import { useI18n } from "../contexts/I18nContext"; import { useAuth } from "../contexts/AuthContext"; import { clearDriverSession } from "../utils/driverStorage"; import { useDriverSafetyStream } from "../utils/driverSafetyStream"; import { getTenantBranding, getTenantVocabulary } from "../config/tenantConfig"; import { useTenantArchetype } from "../hooks/useTenantArchetype"; Modular Hooks import { useDriverProfile } from "../hooks/useDriverProfile"; import { useDriverTripState } from "../hooks/useDriverTripState"; Modular Presentation Components import { DriverHeader } from "../components/driver/DriverHeader"; import { DriverTripCard } from "../components/driver/DriverTripCard"; import { DriverSafetyOverlay } from "../components/driver/DriverSafetyOverlay"; import { DriverRouteTimeline } from "../components/driver/DriverRouteTimeline"; import { CompanyPickerModal } from "../components/driver/DriverModals"; import SettingsModal from "../components/SettingsModal"; Modular Layout Styles import { layoutStyles } from "../styles/driverHomeStyles"; /** Main Driver Portal Screen Component. |
| L84 | `ensureSafetyPermissions()` | *none* | Checks and requests camera & mic permissions |
| L140 | `handleLogout()` | *none* | Handles safe session logout |

## [HistoryScreen.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/HistoryScreen.tsx)
`mobile/src/screens/HistoryScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L28 | `HistoryScreen()` | *none* | Screen displaying commuter past trips and searched routes. |
| L59 | `handleHistoryItemPress()` | `item: HistoryItem` | Navigates to map tracking for selected historical trip item. |
| L66 | `handleClearHistory()` | *none* | Clears commuter trip history records. |
| L94 | `renderHistoryItem()` | `{ item, index }: { item: HistoryItem; index: number }` | Renders a historical trip record item in the FlatList. |
| L136 | `renderEmptyState()` | *none* | Renders empty state illustration when trip history is blank. |

## [HomeScreen.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/HomeScreen.tsx)
`mobile/src/screens/HomeScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `HomeScreen()` | *none* | @file HomeScreen.tsx @description Primary commuter discovery screen coordinator. Orchestrates live active fleet discovery, catalog browsing, real-time search, geodesic proximity calculations, and multi-tenant institutional branding. / import React, { useState } from 'react'; import { View, Text, FlatList, Alert, RefreshControl, } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useNavigation } from '@react-navigation/native'; import { useAuth } from '../contexts/AuthContext'; import { useLocation } from '../contexts/LocationContext'; import { useTheme } from '../contexts/ThemeContext'; import { useI18n } from '../contexts/I18nContext'; Modular UI Components & Hook import { useHomeBuses, Bus, ActiveBus } from '../hooks/useHomeBuses'; import { HomeHeader } from '../components/home/HomeHeader'; import { BusCardItem } from '../components/home/BusCardItem'; import { ActiveBusModal } from '../components/home/ActiveBusModal'; import SidebarMenu from '../components/SidebarMenu'; import SettingsModal from '../components/SettingsModal'; import { Input } from '../components/ui/Input'; import { styles } from '../styles/homeStyles'; /** Commuter home screen providing real-time bus and shuttle discovery. @returns JSX Element. |
| L73 | `handleBusPress()` | `bus: Bus` | Opens the trip card for a line with live vehicles — cards stay hidden until the associated line is tapped (falls back to the map view when the trip row has no position yet). |
| L99 | `handleSaveBookmark()` | `bus: Bus` | Bookmarks route and provides user feedback toast/alert. |
| L114 | `handleOpenMapForActiveBus()` | `activeBus: ActiveBus` | Launches MapScreen focused on a selected active vehicle. |

## [LoginScreen.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/LoginScreen.tsx)
`mobile/src/screens/LoginScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `LoginScreen()` | *none* | @file LoginScreen.tsx @description Primary authentication screen coordinator. Orchestrates commuter & driver login, registration, Apple SSO, password recovery, dynamic company assignment, and institutional white-labeling. / import React from "react"; import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, } from "react-native"; import { useSafeAreaInsets } from "react-native-safe-area-context"; import { Ionicons } from "@expo/vector-icons"; import Animated, { FadeInDown } from "react-native-reanimated"; import { useI18n } from "../contexts/I18nContext"; import { useTheme } from "../contexts/ThemeContext"; import { getTenantBranding, getTenantVocabulary } from "../config/tenantConfig"; import { useTenantArchetype } from "../hooks/useTenantArchetype"; Modular Hook & Components import { useAuthForm } from "../hooks/useAuthForm"; import { AuthHeader } from "../components/auth/AuthHeader"; import { UserTypeToggle } from "../components/auth/UserTypeToggle"; import { DriverCompanyPicker } from "../components/auth/DriverCompanyPickerModal"; import { ForgotPasswordModal } from "../components/auth/ForgotPasswordModal"; import SignedInAccountsChooser from "../components/auth/SignedInAccountsChooser"; import { Input } from "../components/ui/Input"; import { Button } from "../components/ui/Button"; Styles import { styles } from "../styles/loginStyles"; /** Main User & Driver Authentication Screen. |

## [MapScreen.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/MapScreen.tsx)
`mobile/src/screens/MapScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `MapScreen()` | *none* | @file MapScreen.tsx @description Primary commuter live map tracking coordinator screen. Orchestrates real-time Leaflet WebView rendering, GPS telemetry updates, multi-stop route geometry polylines, vehicle selection, and bookmarking. / import React, { useState, useEffect, useMemo, useRef } from 'react'; import { View, Alert } from 'react-native'; import { WebView } from 'react-native-webview'; import { useRoute, useNavigation } from '@react-navigation/native'; import { useLocation } from '../contexts/LocationContext'; import { useAuth } from '../contexts/AuthContext'; import { useTheme } from '../contexts/ThemeContext'; import { useI18n } from '../contexts/I18nContext'; import { saveToHistory } from '../utils/historyUtils'; Modular Presentation & State Layers import { getMapHTML } from '../components/map/passengerMapHtml'; import BusDetailsSheet, { BusLocation } from '../components/map/BusDetailsSheet'; import SettingsModal from '../components/SettingsModal'; import { MapFloatingHeader } from '../components/map/MapFloatingHeader'; import { useMapBuses } from '../hooks/useMapBuses'; import { injectBusLocations, injectUserLocation, injectUserToBusRoute, injectFullRouteWithStops, injectMapStyle, } from '../utils/mapBridgeUtils'; import { styles } from '../styles/mapStyles'; /** Commuter interactive map screen displaying active vehicle fleet and route corridor. @returns JSX Element. |
| L116 | `handleSaveRoute()` | `line: string, destination: string` | Saves route to user history with feedback notifications. |

## [RoleSelectionScreen.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/RoleSelectionScreen.tsx)
`mobile/src/screens/RoleSelectionScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `RoleCard()` | `{    title,    iconName,    onPress,    delay,   theme  }: {    title: string;    iconName: keyof typeof Ionicons.glyphMap;    onPress: (` | Interactive card representing a selectable system user role. |
| L59 | `RoleSelectionScreen()` | *none* | Initial landing screen allowing selection between Passenger or Driver. |
| L68 | `choose()` | `type: 'passenger' | 'driver'` | Selects a system role and navigates to the respective portal. |

## [accountStore.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/accountStore.ts)
`mobile/src/utils/accountStore.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `loadAccounts()` | *none* | @file accountStore.ts @description Multi-account registry (AsyncStorage `app_accounts_v1`) plus secure credential vault (expo-secure-store `wasalt_acct_<uid>`) so accounts re-authenticate silently on switch. Owns the global (non uid-scoped) session keys too; theme/language are untouched. / import AsyncStorage from '@react-native-async-storage/async-storage'; import * as SecureStore from 'expo-secure-store'; import { clearDriverSession, getDriverCompanyId, getDriverBusLine, setDriverBusLine, setDriverCompanyId, } from './driverStorage'; export type AccountRole = 'passenger' | 'driver'; export interface AccountRecord { uid: string; email: string; displayName: string; userType: AccountRole; addedAt: number; lastUsedAt: number; /** Captured at switch-away time so a driver returns to the same company/line. */ driverCompanyId?: string | null; driverBusLine?: string | null; } export interface StoredCredentials { email: string; password: string; } export type AccountPatch = Partial<AccountRecord> & { uid: string }; const ACCOUNTS_KEY = 'app_accounts_v1'; const ACTIVE_ACCOUNT_KEY = 'app_active_account_v1'; const CREDENTIAL_KEY_PREFIX = 'wasalt_acct_'; const GLOBAL_SESSION_KEYS = ['app_user_subscription_tier_v1', 'app_user_type_v1']; /** Serializes read-modify-write cycles so concurrent updates never drop records. */ let mutationQueue: Promise<unknown> = Promise.resolve(); function enqueueMutation<T>(task: () => Promise<T>): Promise<T> { const run = mutationQueue.then(task, task); mutationQueue = run.then( () => undefined, () => undefined ); return run; } const credentialKey = (uid: string) => `${CREDENTIAL_KEY_PREFIX}${uid}`; function isAccountRecord(value: unknown): value is AccountRecord { const rec = value as AccountRecord | null; return ( !!rec && typeof rec === 'object' && typeof rec.uid === 'string' && typeof rec.email === 'string' && (rec.userType === 'passenger' || rec.userType === 'driver') ); } function applyPatch(target: AccountRecord, patch: AccountPatch): AccountRecord { const clean: Record<string, unknown> = {}; (Object.keys(patch) as (keyof AccountPatch)[]).forEach((key) => { const value = patch[key]; if (value !== undefined) clean[key] = value; }); return Object.assign({}, target, clean); } /** Reads the full account registry; degrades to [] on any failure. |
| L85 | `persistAccounts()` | `accounts: AccountRecord[]` | No description provided. |
| L96 | `upsertAccount()` | `patch: AccountPatch` | Inserts or merges a record (undefined patch fields stay intact); returns registry. |
| L121 | `removeAccount()` | `uid: string` | Removes one account; also clears the active pointer if it matched. |
| L138 | `getActiveUid()` | *none* | Returns the active account uid, or null. |
| L148 | `setActiveUid()` | `uid: string | null` | Points the active-account marker at a uid (null removes it). |
| L158 | `migrateCurrentUser()` | `user: { uid: string; email?: string | null; displayName?: string | null },   userType: AccountRole` | Boot-time registration of a restored Firebase session not yet in the registry. |
| L179 | `storeCredentials()` | `uid: string, email: string, password: string` | Saves a password in Keystore/Keychain; degrades with console.warn if it throws. |
| L190 | `readCredentials()` | `uid: string` | Reads stored credentials for silent re-auth; null when absent or unavailable. |
| L206 | `deleteCredentials()` | `uid: string` | Deletes one account's stored password (on sign-out of that account). |
| L215 | `clearGlobalAppKeys()` | *none* | Clears global session keys (subscription tier, user type, driver session). |
| L229 | `captureDriverSession()` | `uid: string` | Snapshots driver company/line into the record before global keys are wiped. |
| L240 | `restoreDriverSession()` | `record: AccountRecord` | Restores a driver account's company/line session keys after re-authentication. |

## [accountSwitch.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/accountSwitch.ts)
`mobile/src/utils/accountSwitch.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `isCredentialAuthError()` | `error: unknown` | @file accountSwitch.ts @description Orchestration for multi-account flows: silent account switching (Firebase Auth allows one currentUser, so switching re-authenticates with the password stored in SecureStore), adding a new login without dropping the current account, and manual logout of only the current account. All UI feedback (Alerts) stays in the calling components — this module only throws friendly Error messages. / import { User, signOut, signInWithEmailAndPassword } from 'firebase/auth'; import { get, ref } from 'firebase/database'; import { auth, database } from '../config/firebase'; import { AccountRecord, captureDriverSession, clearGlobalAppKeys, deleteCredentials, getActiveUid, loadAccounts, readCredentials, removeAccount, restoreDriverSession, setActiveUid, upsertAccount, } from './accountStore'; export interface SessionControls { setUserType: (type: 'passenger' | 'driver') => void; clearUserType: () => void; } export interface SwitchOptions { accounts: AccountRecord[]; currentUser: User | null; currentIsDriver: boolean; controls: SessionControls; } const SESSION_EXPIRED = (email: string) => `Session expired for ${email} — please sign in again.`; const CREDENTIAL_ERROR_CODES = new Set([ 'auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials', 'auth/user-not-found', 'auth/user-disabled', ]); /** True when re-auth failed because the stored password is no longer valid. |
| L57 | `ensureNoActiveDriverTrip()` | `user: User | null` | Blocks while the current driver still has a live broadcast in RTDB (mirrors the DriverHomeScreen "end trip first" logout guard). |
| L91 | `performAccountSwitch()` | `targetUid: string,   options: SwitchOptions` | Silently switches to another added account. Order matters: driver session is captured → credentials read (abort while the current session is still intact if missing) → global keys wiped → sign-out → target role and driver session restored BEFORE Firebase notifies observers → re-authenticate. On credential failure the stored password and record are dropped so the user can re-add the account through the normal Login flow. |
| L154 | `performAddAccount()` | `currentUser: User | null,   currentIsDriver: boolean,   controls: SessionControls` | "Add account": signs out of Firebase WITHOUT removing the current record or its credentials, so the account stays in the list and can be restored with a silent switch later. Global keys are wiped so the next login starts clean. |
| L174 | `performLogout()` | `currentUser: User | null,   controls: SessionControls` | Manual logout: removes ONLY the current account (record + stored password). Every other added account and its credentials stay available. |
| L193 | `reloadAccounts()` | *none* | Refreshes the registry snapshot after a flow completes (best effort). |

## [bidirectionalAStar.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/bidirectionalAStar.ts)
`mobile/src/utils/bidirectionalAStar.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L194 | `heuristic()` | `id: string` | No description provided. |

## [driverSafetyStream.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/driverSafetyStream.ts)
`mobile/src/utils/driverSafetyStream.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `useDriverSafetyStream()` | `{   user,   driverName = 'Driver',   cameraRef,   isRTL = false,   onSessionStart,   onSessionEnd, }: UseDriverSafetyStreamOptions` | Wasalt SafeTrip™ - Driver Safety Stream Controller & Hook Standalone service managing WebRTC P2P 30 FPS video & audio signaling, remote admin consent inspection, and zero-cost Firebase RTDB token exchange. / import { useEffect, useRef, useState, useCallback } from 'react'; import { Alert } from 'react-native'; import { ref, set, onValue, remove } from 'firebase/database'; import { database } from '../config/firebase'; import { getWebRtcBroadcasterHtml } from './webrtcBroadcasterHtml'; export type MediaRequestKind = 'audio' | 'video' | 'both'; export type MediaRequestStatus = 'pending' | 'accepted' | 'declined' | 'failed' | 'closed'; export interface DriverMediaRequestData { kind: MediaRequestKind; status: MediaRequestStatus; requestedAt: string; requestedBy: string; respondedAt?: string; driverUid?: string; error?: string; } /** Delay after session acceptance before the WebView broadcaster touches the camera sensor, giving the native expo-camera preview time to release the exclusive Android Camera HAL handle. / const BROADCASTER_START_DELAY_MS = 500; export interface UseDriverSafetyStreamOptions { user: { uid: string; email?: string | null; displayName?: string | null } | null; driverName?: string; cameraRef?: React.RefObject<any>; isRTL?: boolean; onSessionStart?: () => void; onSessionEnd?: () => void; } export interface UseDriverSafetyStreamResult { pendingRequest: DriverMediaRequestData | null; isStreaming: boolean; activeSession: DriverMediaRequestData | null; acceptRequest: () => Promise<void>; declineRequest: () => Promise<void>; endStream: () => Promise<void>; webrtcHtml: string; webViewRef: React.RefObject<any>; onWebViewMessage: (event: any) => void; } /** React Hook for Driver Handsets: Manages SafeTrip consent requests and WebRTC P2P signaling via Firebase RTDB. |

## [driverStorage.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/driverStorage.ts)
`mobile/src/utils/driverStorage.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L6 | `setDriverCompanyId()` | `companyId: string` | Persists the assigned operating company ID into local AsyncStorage. |
| L13 | `getDriverCompanyId()` | *none* | Retrieves the stored operating company ID from local AsyncStorage. |
| L20 | `setDriverBusLine()` | `busLine: string` | Persists the assigned bus line ID into local AsyncStorage. |
| L27 | `getDriverBusLine()` | *none* | Retrieves the stored bus line ID from local AsyncStorage. |
| L34 | `clearDriverSession()` | *none* | Clears stored driver company and line session credentials. |

## [driverTripHelpers.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/driverTripHelpers.ts)
`mobile/src/utils/driverTripHelpers.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `validateTripPrerequisites()` | `user: any,   selectedBusLine: string | null,   isRTL: boolean` | @file driverTripHelpers.ts @description Single-responsibility helper functions for driver trip initiation, permission verification, GPS payload construction, and velocity calculation. / import { Alert } from "react-native"; import * as Location from "expo-location"; import { ref, set } from "firebase/database"; import { database } from "../config/firebase"; import { setDriverBusLine } from "./driverStorage"; import { haversineMeters } from "./geoUtils"; export interface InitialTripPayloadOptions { latitude: number; longitude: number; startPoint: string; endPoint: string; endLat: number | null; endLng: number | null; stops: any[] | null; driverName: string; driverEmail: string | null; cameraMonitored: boolean; micMonitored: boolean; } /** Validates pre-conditions required to begin active trip sharing. @returns Error alert details if invalid, or null if valid. |
| L52 | `verifyLocationPermissions()` | `isRTL: boolean` | Verifies that device location services are enabled and foreground permissions are granted. @returns True if permissions and services are active. |
| L76 | `buildInitialTripPayload()` | `opts: InitialTripPayloadOptions` | Constructs the canonical initial telemetry payload for Realtime Database. |
| L100 | `persistInitialTrip()` | `safeLineKey: string,   driverUid: string,   payload: any,   selectedBusLine: string` | Persists the initial trip state to Firebase Realtime Database and device storage. |
| L113 | `calculateInstantVelocity()` | `prevLat: number,   prevLng: number,   currLat: number,   currLng: number,   dtSeconds: number,   rawSpeed: number | null` | Calculates smoothed instantaneous velocity between consecutive GPS updates. |

## [favoritesUtils.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/favoritesUtils.ts)
`mobile/src/utils/favoritesUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L6 | `listenToFavorites()` | `userId: string, onChange: (lines: Set<string>` | Listens for real-time changes to user favorite bus lines in RTDB. |
| L24 | `addFavorite()` | `userId: string, lineName: string` | Adds a bus line to user favorites in RTDB. @suggestion [INTEGRATE]: Currently invoked only by toggleFavorite(); can be exposed directly if explicit bookmark buttons or swipe-actions are added to line lists. |
| L32 | `removeFavorite()` | `userId: string, lineName: string` | Removes a bus line from user favorites in RTDB. @suggestion [INTEGRATE]: Currently invoked only by toggleFavorite(); can be exposed directly for swipe-to-delete interactions on commuter favorites list. |
| L40 | `toggleFavorite()` | `userId: string, lineName: string, isFavorite: boolean` | Toggles favorite state of a bus line in RTDB. |

## [geoUtils.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/geoUtils.ts)
`mobile/src/utils/geoUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `haversineMeters()` | `lat1: number, lon1: number, lat2: number, lon2: number` | @file geoUtils.ts @description Geolocation mathematical helpers, coordinate boundary validation, path sanitization, bearing calculation, ETA formatting, and trip duration formatters. / /** Calculates the great-circle distance between two coordinates in meters via Haversine formula. @param lat1 - Origin latitude. @param lon1 - Origin longitude. @param lat2 - Destination latitude. @param lon2 - Destination longitude. @returns Distance in meters. |
| L29 | `calculateDistanceKm()` | `lat1: number, lon1: number, lat2: number, lon2: number` | Calculates distance in kilometers between two coordinates. @param lat1 - Origin latitude. @param lon1 - Origin longitude. @param lat2 - Destination latitude. @param lon2 - Destination longitude. @returns Distance in kilometers. |
| L42 | `calculateBearing()` | `lat1: number, lon1: number, lat2: number, lon2: number` | Calculates the forward azimuth / initial bearing from origin to destination coordinate. @param lat1 - Origin latitude. @param lon1 - Origin longitude. @param lat2 - Destination latitude. @param lon2 - Destination longitude. @returns Azimuth degree between 0 and 360. |
| L61 | `getDirectionName()` | `bearing: number` | Resolves a 16-point cardinal compass direction string from a bearing angle. @param bearing - Azimuth angle in degrees (0 - 360). @returns Compass direction acronym (e.g. 'N', 'NE', 'SSW'). |
| L73 | `calculateTimeToArrival()` | `distanceKm: number, isRTL: boolean = false` | Estimates arrival time based on distance in kilometers assuming standard city transit speed (30 km/h). @param distanceKm - Distance to vehicle in kilometers. @param isRTL - Whether to format string in Arabic (RTL) or English. @returns Localized estimated travel duration string. |
| L91 | `isValidCoordinate()` | `lat: number, lng: number` | Validates that coordinates are within legitimate WGS84 GPS boundaries. @param lat - Latitude degree (-90 to 90). @param lng - Longitude degree (-180 to 180). @returns True if coordinate is within standard valid boundaries. |
| L111 | `sanitizePathKey()` | `key: string` | Sanitizes line identifiers to prevent RTDB path injection or invalid characters. @param key - Raw line identifier string. @returns Sanitized key safe for Firebase Realtime Database path usage. |
| L121 | `formatTimer()` | `totalSeconds: number` | Formats total trip elapsed seconds into HH:MM:SS or MM:SS format. @param totalSeconds - Total seconds elapsed in current trip. @returns Formatted digital clock string. |

## [historyUtils.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/historyUtils.ts)
`mobile/src/utils/historyUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L11 | `saveToHistory()` | `userId: string, busLine: string, companyName: string` | Appends a visited bus line and destination to the commuter history. |

## [localRoutingEngine.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/localRoutingEngine.ts)
`mobile/src/utils/localRoutingEngine.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `computeLocalRoadRoute()` | `waypoints: RouteWaypoint[]` | @file localRoutingEngine.ts @description Embedded edge routing engine for mobile commuter maps. Calculates turn-by-turn road curves, distances, and travel times offline with 0 cloud dependencies. Dynamic edge computation with zero hardcoded routes. / import { calculateDistanceKm } from './geoUtils'; import { bidirectionalRouter } from './bidirectionalAStar'; export interface RouteWaypoint { lat: number; lng: number; name?: string; } export interface LocalRouteResult { coordinates: [number, number][]; distanceKm: number; durationMin: number; isFallback: boolean; } let graphLoaded = false; function ensureGraphLoaded(): void { if (graphLoaded) return; try { Dynamic offline road network graph load eslint-disable-next-line @typescript-eslint/no-var-requires const graphData = require('../../assets/data/egypt_road_graph.json'); if (graphData?.nodes && Array.isArray(graphData.nodes)) { bidirectionalRouter.loadNodes(graphData.nodes); graphLoaded = true; console.log(`[MobileRoutingEngine] Loaded ${graphData.nodes.length} road graph nodes.`); } } catch (err) { console.warn('[MobileRoutingEngine] Lazy road graph load notice:', err); } } /** Computes an offline, road-following transit polyline, distance, and duration across arbitrary waypoints. Strictly follows real road geometry with zero synthetic spline shortcuts. @param waypoints - Sequence of GPS waypoints along the route. @returns Local route result with polyline geometry, distance in km, and duration in minutes. |

## [mapBridgeUtils.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/mapBridgeUtils.ts)
`mobile/src/utils/mapBridgeUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `injectMapStyle()` | `webViewRef: React.RefObject<WebView | null>,   mode: MapThemeMode` | @file mapBridgeUtils.ts @description Injects real-time vehicle telemetry, user GPS coordinates, and authentic road-following route geometries into the Leaflet WebView instance. / import React from 'react'; import { WebView } from 'react-native-webview'; import { BusLocation } from '../components/map/BusDetailsSheet'; import { computeLocalRoadRoute, RouteWaypoint } from './localRoutingEngine'; import type { MapThemeMode } from '../config/mapConfig'; /** Switches the OpenFreeMap basemap style inside the map WebView without a reload. Delegates to the page-level bridge function `window.__setMapStyle(mode)`. @param webViewRef - Reference to the active WebView component. @param mode - Target map theme mode ('light' | 'dark'). |
| L34 | `injectBusLocations()` | `webViewRef: React.RefObject<WebView | null>,   locations: BusLocation[]` | Injects updated active vehicle locations into the Leaflet map runtime. @param webViewRef - Reference to the active WebView component. @param locations - Array of active bus location telemetry points. |
| L54 | `injectUserLocation()` | `webViewRef: React.RefObject<WebView | null>,   latitude: number,   longitude: number` | Injects current user GPS position into the Leaflet map runtime. @param webViewRef - Reference to the active WebView component. @param latitude - User latitude. @param longitude - User longitude. |
| L76 | `injectUserToBusRoute()` | `webViewRef: React.RefObject<WebView | null>,   userLat: number,   userLng: number,   busLat: number,   busLng: number` | Injects direct transit polyline between commuter location and selected vehicle. @param webViewRef - Reference to the active WebView component. @param userLat - User latitude. @param userLng - User longitude. @param busLat - Vehicle latitude. @param busLng - Vehicle longitude. |
| L102 | `injectFullRouteWithStops()` | `webViewRef: React.RefObject<WebView | null>,   routeDef: any,   activeBus?: any` | Injects full route road geometry and intermediate mandatory stop waypoints. Enriches route definition with authentic road network coordinates. @param webViewRef - Reference to the active WebView component. @param routeDef - Route definition containing start, end, and stops. @param activeBus - Optional active vehicle to anchor Point A dynamically. |

## [webrtcBroadcasterHtml.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/webrtcBroadcasterHtml.ts)
`mobile/src/utils/webrtcBroadcasterHtml.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `getWebRtcBroadcasterHtml()` | *none* | Wasalt SafeTrip™ - WebRTC Broadcaster HTML Engine Embedded into React Native WebView for hardware-accelerated 30 FPS video and low-latency Opus audio streaming with zero custom native compilation. |
| L58 | `sendToNative()` | `data` | Sends WebRTC signaling messages from WebView to native React Native layer. |
| L67 | `updateStatus()` | `text, color, isError` | Updates status display banner in the WebRTC stream monitor. |
| L80 | `teardown()` | *none* | Stops any live local stream and peer connection. |
| L97 | `acquireMedia()` | *none* | Acquires camera/mic with progressively looser constraints so a busy camera sensor or missing mic degrades gracefully instead of failing the whole inspection (final fallback: audio-only). |
| L129 | `initWebRtc()` | *none* | Initializes WebRTC peer connection and media stream acquisition. |
| L192 | `requestStart()` | *none* | Starts broadcasting once the engine is ready (or immediately if it is). |
| L203 | `handleAdminMessage()` | `event` | Processes incoming signaling data messages from dispatch admin and native session lifecycle commands (start/stop). |

## [build_road_graph.py](file:////home/kimo/Projects/active/bus-tracker-sya7a/scripts/build_road_graph.py)
`scripts/build_road_graph.py`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L44 | `main()` | *none* | No description provided. |

## [extract_demo_map.py](file:////home/kimo/Projects/active/bus-tracker-sya7a/scripts/extract_demo_map.py)
`scripts/extract_demo_map.py`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L254 | `build_simplifier()` | *none* | Create Douglas-Peucker simplifier using shapely. |
| L266 | `main()` | *none* | Execute full demo map vector extraction and synchronization. |

## [test_dev_rules.py](file:////home/kimo/Projects/active/bus-tracker-sya7a/scripts/test_dev_rules.py)
`scripts/test_dev_rules.py`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L33 | `count_lines()` | `filepath` | Counts total lines in a source code file. |
| L38 | `get_active_files()` | *none* | Retrieves all active source files excluding build and archive dirs. |

## [main.js](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/desktop/main.js)
`wasalt/apps/desktop/main.js`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `createWindow()` | *none* | No description provided. |

## [App.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/App.tsx)
`wasalt/apps/web/src/App.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L24 | `AppContent()` | *none* | No description provided. |
| L40 | `handleStartOnboarding()` | `planId: string = 'pro',     billingCycle: 'monthly' | 'annual' = 'annual'` | No description provided. |
| L50 | `handleOnboardingComplete()` | `companyName: string` | No description provided. |
| L56 | `handleLoginSuccess()` | *none* | No description provided. |
| L63 | `handleSignIn()` | `target?: 'login' | 'dashboard'` | Navbar sign-in entry: authenticated users jump straight to the dashboard. |
| L80 | `onHashChange()` | *none* | No description provided. |
| L107 | `handleLegalBack()` | *none* | Closing a legal page returns home without leaving a stale hash behind. |
| L235 | `App()` | *none* | No description provided. |

## [DownloadPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/DownloadPage.tsx)
`wasalt/apps/web/src/components/DownloadPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L9 | `DownloadPage()` | `{ companyName = 'Your Workspace', onGoToDashboard }` | No description provided. |

## [ForgotPasswordModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/auth/ForgotPasswordModal.tsx)
`wasalt/apps/web/src/components/auth/ForgotPasswordModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L10 | `ForgotPasswordModal()` | `{ isOpen, onClose }` | No description provided. |
| L15 | `handleSubmit()` | `e: React.FormEvent` | No description provided. |
| L27 | `handleClose()` | *none* | No description provided. |

## [LoginForm.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/auth/LoginForm.tsx)
`wasalt/apps/web/src/components/auth/LoginForm.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `LoginForm()` | `{   onSuccess,   onCancel,   onForgotPassword,   onSwitchToSignUp, }` | No description provided. |
| L25 | `handleSubmit()` | `e: React.FormEvent` | No description provided. |

## [ProfileModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/auth/ProfileModal.tsx)
`wasalt/apps/web/src/components/auth/ProfileModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `ProfileModal()` | `{ isOpen, onClose }` | Profile modal — lets an authenticated admin view their account info and update their full name (synced to Firebase Auth + RTDB /admins/{uid}). |
| L24 | `handleSave()` | *none* | No description provided. |

## [Badge.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/common/Badge.tsx)
`wasalt/apps/web/src/components/common/Badge.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L8 | `Badge()` | `{   children,   variant = 'neutral',   size = 'md',   className = '', }` | No description provided. |

## [Button.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/common/Button.tsx)
`wasalt/apps/web/src/components/common/Button.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L9 | `Button()` | `{   children,   variant = 'primary',   size = 'md',   isLoading = false,   icon,   className = '',   disabled,   ...props }` | No description provided. |

## [Footer.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/common/Footer.tsx)
`wasalt/apps/web/src/components/common/Footer.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L3 | `Footer()` | *none* | No description provided. |

## [Modal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/common/Modal.tsx)
`wasalt/apps/web/src/components/common/Modal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L10 | `Modal()` | `{   isOpen,   onClose,   title,   children,   maxWidth = 'md', }` | No description provided. |
| L19 | `handleKeyDown()` | `e: KeyboardEvent` | No description provided. |

## [Navbar.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/common/Navbar.tsx)
`wasalt/apps/web/src/components/common/Navbar.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `Navbar()` | `{   onStartOnboarding,   onSignIn,   isAuthenticated, }` | No description provided. |
| L45 | `handleScroll()` | *none* | No description provided. |

## [BillingView.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/dashboard/BillingView.tsx)
`wasalt/apps/web/src/components/dashboard/BillingView.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `BillingView()` | *none* | No description provided. |
| L87 | `handleUpgrade()` | *none* | No description provided. |

## [BrandingSettingsView.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/dashboard/BrandingSettingsView.tsx)
`wasalt/apps/web/src/components/dashboard/BrandingSettingsView.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `BrandingSettingsView()` | *none* | No description provided. |
| L30 | `handleFileUpload()` | `e: React.ChangeEvent<HTMLInputElement>` | No description provided. |
| L55 | `handleSelectPreset()` | `presetId: string` | No description provided. |
| L61 | `handleSave()` | *none* | No description provided. |

## [CompanySettingsView.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/dashboard/CompanySettingsView.tsx)
`wasalt/apps/web/src/components/dashboard/CompanySettingsView.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `CompanySettingsView()` | *none* | No description provided. |
| L27 | `handleSave()` | `e: React.FormEvent` | No description provided. |

## [DashboardHeader.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/dashboard/DashboardHeader.tsx)
`wasalt/apps/web/src/components/dashboard/DashboardHeader.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L11 | `DashboardHeader()` | `{   onCreateNewWorkspace,   onToggleSidebar, }` | No description provided. |
| L22 | `handleClickOutside()` | `e: MouseEvent` | No description provided. |

## [DashboardLayout.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/dashboard/DashboardLayout.tsx)
`wasalt/apps/web/src/components/dashboard/DashboardLayout.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `DashboardLayout()` | `{   onExitToWebsite,   onCreateNewWorkspace, }` | No description provided. |

## [DashboardSidebar.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/dashboard/DashboardSidebar.tsx)
`wasalt/apps/web/src/components/dashboard/DashboardSidebar.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L29 | `DashboardSidebar()` | `{   currentTab,   onSelectTab,   onExitToWebsite,   isOpen = false, }` | No description provided. |

## [OverviewView.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/dashboard/OverviewView.tsx)
`wasalt/apps/web/src/components/dashboard/OverviewView.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L23 | `OverviewView()` | `{ onNavigateTab }` | No description provided. |

## [TeamManagementView.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/dashboard/TeamManagementView.tsx)
`wasalt/apps/web/src/components/dashboard/TeamManagementView.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `TeamManagementView()` | *none* | No description provided. |
| L30 | `loadMembers()` | *none* | No description provided. |
| L45 | `handleInviteSubmit()` | `e: React.FormEvent` | No description provided. |
| L76 | `handleRoleChange()` | `memberId: string, role: AdminRole` | No description provided. |
| L84 | `handleRemove()` | `memberId: string` | No description provided. |

## [WorkspaceSwitcher.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/dashboard/WorkspaceSwitcher.tsx)
`wasalt/apps/web/src/components/dashboard/WorkspaceSwitcher.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L7 | `WorkspaceSwitcher()` | `{   onCreateNewWorkspace, }` | No description provided. |
| L16 | `handleClickOutside()` | `e: MouseEvent` | No description provided. |

## [AudienceSections.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/AudienceSections.tsx)
`wasalt/apps/web/src/components/marketing/AudienceSections.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `Audience()` | `{   id,   icon: Icon,   title,   copy,   items, }: {   id: string;   icon: React.ElementType;   title: string;   copy: string;   items: string[]; }` | No description provided. |
| L43 | `AudienceSections()` | *none* | No description provided. |
| L79 | `EcosystemSection()` | *none* | No description provided. |
| L124 | `DriverEcosystem()` | *none* | No description provided. |

## [CtaBanner.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/CtaBanner.tsx)
`wasalt/apps/web/src/components/marketing/CtaBanner.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L11 | `CtaBanner()` | `{   onStartOnboarding,   isAuthenticated,   onSignIn, }` | No description provided. |

## [FaqSection.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/FaqSection.tsx)
`wasalt/apps/web/src/components/marketing/FaqSection.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L32 | `FaqSection()` | *none* | No description provided. |
| L36 | `toggleItem()` | `id: string` | No description provided. |

## [FeaturesGrid.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/FeaturesGrid.tsx)
`wasalt/apps/web/src/components/marketing/FeaturesGrid.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L58 | `FeaturesGrid()` | *none* | No description provided. |

## [FleetExperience.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/FleetExperience.tsx)
`wasalt/apps/web/src/components/marketing/FleetExperience.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `MapPanel()` | *none* | No description provided. |
| L50 | `FleetExperience()` | *none* | No description provided. |

## [HeroSection.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/HeroSection.tsx)
`wasalt/apps/web/src/components/marketing/HeroSection.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `HeroSection()` | `{   onStartOnboarding,   onExploreDemo,   isAuthenticated,   onSignIn, }` | No description provided. |

## [HeroTelemetryMap.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/HeroTelemetryMap.tsx)
`wasalt/apps/web/src/components/marketing/HeroTelemetryMap.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L52 | `HeroTelemetryMap()` | `{   selectedVehicleId,   onSelectVehicle, }` | No description provided. |

## [HowItWorksSection.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/HowItWorksSection.tsx)
`wasalt/apps/web/src/components/marketing/HowItWorksSection.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `HowItWorksSection()` | *none* | No description provided. |

## [LiveThemeDemo.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/LiveThemeDemo.tsx)
`wasalt/apps/web/src/components/marketing/LiveThemeDemo.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L33 | `LiveThemeDemo()` | `{   onStartWithTheme,   isAuthenticated,   onSignIn, }` | No description provided. |
| L47 | `handlePresetSelect()` | `id: string, color: string` | No description provided. |
| L52 | `handleColorChange()` | `hex: string` | No description provided. |

## [PricingSection.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/PricingSection.tsx)
`wasalt/apps/web/src/components/marketing/PricingSection.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L63 | `PricingSection()` | `{   onSelectPlan,   isAuthenticated, }` | No description provided. |

## [ProblemSolutionSection.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/ProblemSolutionSection.tsx)
`wasalt/apps/web/src/components/marketing/ProblemSolutionSection.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `ProblemSolutionSection()` | *none* | No description provided. |

## [TestimonialsSection.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/marketing/TestimonialsSection.tsx)
`wasalt/apps/web/src/components/marketing/TestimonialsSection.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L3 | `TestimonialsSection()` | *none* | No description provided. |

## [OnboardingWizard.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/onboarding/OnboardingWizard.tsx)
`wasalt/apps/web/src/components/onboarding/OnboardingWizard.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L19 | `OnboardingWizard()` | `{   onComplete,   onCancel,   initialPlanId = 'pro',   billingCycle = 'monthly', }` | No description provided. |
| L57 | `handleStep1Next()` | `data: {     fullName: string;     email: string;     password: string;     jobTitle?: string;   }` | No description provided. |
| L84 | `handleStep2Next()` | `data: {     name: string;     slug: string;     industry: string;     companySize: string;     website?: string;   }` | No description provided. |
| L101 | `handleStep3Next()` | `chosenTheme: CompanyTheme, uploadedLogo?: string` | No description provided. |
| L107 | `handleProceedToPaymentAndDownload()` | *none* | No description provided. |

## [StepAdminAccount.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/onboarding/StepAdminAccount.tsx)
`wasalt/apps/web/src/components/onboarding/StepAdminAccount.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `StepAdminAccount()` | `{   initialData,   onNext,   onCancel, }` | No description provided. |
| L26 | `handleSubmit()` | `e: React.FormEvent` | No description provided. |

## [StepBrandTheme.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/onboarding/StepBrandTheme.tsx)
`wasalt/apps/web/src/components/onboarding/StepBrandTheme.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L23 | `StepBrandTheme()` | `{   initialTheme,   companyName,   onNext,   onBack, }` | No description provided. |
| L38 | `handleFileUpload()` | `e: React.ChangeEvent<HTMLInputElement>` | No description provided. |
| L63 | `handleSelectPreset()` | `presetId: string` | No description provided. |
| L69 | `handleSubmit()` | `e: React.FormEvent` | No description provided. |

## [StepCompanyDetails.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/onboarding/StepCompanyDetails.tsx)
`wasalt/apps/web/src/components/onboarding/StepCompanyDetails.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L22 | `StepCompanyDetails()` | `{   initialData,   onNext,   onBack, }` | No description provided. |
| L34 | `handleNameChange()` | `val: string` | No description provided. |
| L45 | `handleSubmit()` | `e: React.FormEvent` | No description provided. |

## [StepConfirmWorkspace.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/onboarding/StepConfirmWorkspace.tsx)
`wasalt/apps/web/src/components/onboarding/StepConfirmWorkspace.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L24 | `StepConfirmWorkspace()` | `{   adminData,   companyData,   theme,   logoUrl,   isLoading,   onLaunch,   onBack, }` | No description provided. |

## [StepPlanSelection.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/onboarding/StepPlanSelection.tsx)
`wasalt/apps/web/src/components/onboarding/StepPlanSelection.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L42 | `StepPlanSelection()` | `{   selectedPlanId,   billingCycle = 'monthly',   onSelectPlan,   onProceedToPaymentAndDownload,   onBack, }` | No description provided. |

## [DownloadPanelPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/pages/DownloadPanelPage.tsx)
`wasalt/apps/web/src/components/pages/DownloadPanelPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L25 | `DownloadPanelPage()` | `{   companyName,   adminEmail,   planName,   onGoToWebDashboard, }` | Post-payment page where the user can download the admin panel desktop app or access the web-based dashboard. |
| L37 | `handleCopy()` | *none* | ${PRODUCT_CONFIG.domain}/${companyName.toLowerCase().replace(/\s+/g, '-')}`; |

## [LegalPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/pages/LegalPage.tsx)
`wasalt/apps/web/src/components/pages/LegalPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L8 | `LegalPage()` | `{ doc, onBack }` | Returns to the marketing home page. */ onBack: () => void; } /** Full-page legal document (Privacy Policy / Terms of Service), rendered in the active UI language (EN/AR) with RTL support. |

## [PaymentCheckout.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/pages/PaymentCheckout.tsx)
`wasalt/apps/web/src/components/pages/PaymentCheckout.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L22 | `PaymentCheckout()` | `{   planId,   companyName,   onPaymentComplete,   onCancel, }` | Mock payment checkout modal. Simulates a payment flow after onboarding. |
| L36 | `handlePayment()` | *none* | No description provided. |

## [PrivacyPolicyPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/pages/PrivacyPolicyPage.tsx)
`wasalt/apps/web/src/components/pages/PrivacyPolicyPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L9 | `PrivacyPolicyPage()` | `{ onBack }` | Privacy Policy legal page for Wasalt platform. |

## [SecurityPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/pages/SecurityPage.tsx)
`wasalt/apps/web/src/components/pages/SecurityPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L20 | `SecurityFeature()` | `{   icon: Icon,   title,   description,   color, }: {   icon: React.ElementType;   title: string;   description: string;   color: string; }` | No description provided. |
| L44 | `SecurityPage()` | `{ onBack }` | Security overview page for Wasalt platform. |

## [TermsOfServicePage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/components/pages/TermsOfServicePage.tsx)
`wasalt/apps/web/src/components/pages/TermsOfServicePage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L9 | `TermsOfServicePage()` | `{ onBack }` | Terms of Service legal page for Wasalt platform. |

## [AuthContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/context/AuthContext.tsx)
`wasalt/apps/web/src/context/AuthContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L19 | `AuthProvider()` | `{ children }` | No description provided. |
| L34 | `login()` | `credentials: AdminCredentials` | No description provided. |
| L44 | `signUp()` | `credentials: AdminCredentials` | No description provided. |
| L54 | `logout()` | *none* | No description provided. |
| L59 | `updateProfile()` | `fullName: string` | No description provided. |
| L81 | `useAuth()` | *none* | No description provided. |

## [CompanyContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/context/CompanyContext.tsx)
`wasalt/apps/web/src/context/CompanyContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L20 | `CompanyProvider()` | `{ children }` | No description provided. |
| L27 | `loadCompanies()` | *none* | No description provided. |
| L56 | `setActiveCompanyId()` | `companyId: string` | No description provided. |
| L66 | `createNewCompany()` | `payload: CompanyCreatePayload` | No description provided. |
| L74 | `updateCurrentCompany()` | `updates: Partial<Company>` | No description provided. |
| L102 | `useCompany()` | *none* | No description provided. |

## [LanguageThemeContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/context/LanguageThemeContext.tsx)
`wasalt/apps/web/src/context/LanguageThemeContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `LanguageThemeProvider()` | `{ children }` | No description provided. |
| L42 | `setLanguage()` | `lang: Language` | No description provided. |
| L44 | `setColorMode()` | `mode: ColorMode` | No description provided. |
| L45 | `toggleColorMode()` | *none* | No description provided. |
| L46 | `t()` | `key: string` | No description provided. |
| L67 | `useLanguageTheme()` | *none* | No description provided. |

## [ThemeContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/context/ThemeContext.tsx)
`wasalt/apps/web/src/context/ThemeContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `ThemeProvider()` | `{ initialTheme, children }` | No description provided. |
| L27 | `setTheme()` | `newTheme: CompanyTheme` | No description provided. |
| L32 | `applyTemporaryTheme()` | `tempTheme: CompanyTheme` | No description provided. |
| L36 | `resetToCompanyTheme()` | *none* | No description provided. |
| L54 | `useTheme()` | *none* | No description provided. |

## [authService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/services/authService.ts)
`wasalt/apps/web/src/services/authService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `getCurrentAdmin()` | *none* | Authentication Service — Real Firebase Auth + RTDB Replaces the localStorage mock. Creates real Firebase Auth users and persists admin profiles to /admins/{uid}/ in the shared RTDB. / import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, } from 'firebase/auth'; import { ref, set, get, update } from 'firebase/database'; import { auth, rtdb } from './firebaseClient'; import { AdminProfile, AdminCredentials } from '@wasalt/types'; const ADMIN_STORAGE_KEY = 'wasalt_current_admin'; /** Returns the currently authenticated admin profile. Checks Firebase Auth state first, then RTDB for the profile. |
| L53 | `signInAdmin()` | `credentials: AdminCredentials` | Signs in an existing admin via Firebase Auth and loads their RTDB profile. |
| L68 | `signUpAdmin()` | `credentials: AdminCredentials` | Creates a new Firebase Auth user and writes their profile to /admins/{uid}/. |
| L76 | `updateAdminProfile()` | `fullName: string` | Updates the signed-in admin's profile info (full name). Writes to both Firebase Auth displayName and /admins/{uid} in RTDB. |
| L110 | `signOutAdmin()` | *none* | Signs out the current user from Firebase Auth and clears local session. |
| L118 | `sendPasswordReset()` | `email: string` | Sends a password reset email via Firebase Auth. |
| L129 | `_createAdminProfile()` | `uid: string,   credentials: AdminCredentials` | Writes an admin profile record to /admins/{uid}/ in RTDB. |

## [companyService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/services/companyService.ts)
`wasalt/apps/web/src/services/companyService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `fetchCompaniesForAdmin()` | `adminId: string` | Company Tenant Service — Real RTDB Writes company data to /companies/{slug}/ in the shared Firebase RTDB. This is the same node the admin dashboard reads — no sync needed. / import { ref, set, get, update } from 'firebase/database'; import { rtdb, auth } from './firebaseClient'; import { Company, CompanyCreatePayload } from '@wasalt/types'; /** Deep-strips `undefined` values (RTDB rejects them anywhere in a payload, including nested objects like theme.presetId from generated themes). / function stripUndefined<T>(value: T): T { if (Array.isArray(value)) { return value.filter((v) => v !== undefined).map(stripUndefined) as unknown as T; } if (value && typeof value === 'object') { const out: Record<string, unknown> = {}; Object.entries(value as Record<string, unknown>).forEach(([key, v]) => { if (v !== undefined) out[key] = stripUndefined(v); }); return out as T; } return value; } /** Fetches all companies owned by or associated with a given admin. Reads the admin's companyIds list from /admins/{uid}/, then fetches each company. |
| L54 | `createCompany()` | `payload: CompanyCreatePayload` | Creates a new company in /companies/{slug}/ and links it to the admin in /admins/{uid}/companyIds. |
| L112 | `updateCompany()` | `id: string, updates: Partial<Company>` | Updates an existing company's fields in RTDB. |

## [membershipService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/services/membershipService.ts)
`wasalt/apps/web/src/services/membershipService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `fetchMembersForCompany()` | `companyId: string` | AdminCompanyMembership Service — Real RTDB Team invitations, role changes, and member management stored in /memberships/{companyId}/ in the shared Firebase RTDB (org-scoped). / import { ref, set, get, update, remove } from 'firebase/database'; import { rtdb } from './firebaseClient'; import { AdminCompanyMembership, AdminRole, InviteMemberPayload } from '@wasalt/types'; /** Fetches all memberships for a company from /memberships/{companyId}/. |
| L25 | `_findAdminIdByEmail()` | `email: string` | Best-effort lookup of an existing admin's UID by email in /admins/. Returns null when no signed-up admin matches the invited email. |
| L43 | `inviteMember()` | `companyId: string,   payload: InviteMemberPayload` | Creates an invitation record for a company in /memberships/{companyId}/. |
| L69 | `updateMemberRole()` | `companyId: string,   membershipId: string,   newRole: AdminRole` | Updates a member's role within a company. |
| L92 | `removeMember()` | `companyId: string, membershipId: string` | Removes a member from a company. |

## [pricingService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/services/pricingService.ts)
`wasalt/apps/web/src/services/pricingService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `fetchPriceOverrides()` | *none* | Live Pricing Service — website side. The admin dashboard writes plan prices to /pricing/{planId}; this service reads them so the marketing site, plan selection, checkout, and billing modal always show the latest admin-set prices (falling back to the hardcoded PRICING_PLANS defaults when no override exists). / import { useEffect, useState } from 'react'; import { ref, get } from 'firebase/database'; import { rtdb } from './firebaseClient'; export interface PriceOverride { priceMonthly?: number; priceAnnual?: number; } export type PriceOverrides = Record<string, PriceOverride>; let cachedOverrides: PriceOverrides | null = null; let inflight: Promise<PriceOverrides> | null = null; const isValidPrice = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0; /** Reads /pricing once (module-cached) — safe to call from multiple components. |
| L60 | `usePriceOverrides()` | *none* | React hook: live overrides, re-rendering once prices arrive. |

## [subscriptionService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/apps/web/src/services/subscriptionService.ts)
`wasalt/apps/web/src/services/subscriptionService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `fetchSubscription()` | `companyId: string` | Subscription & Billing Service — Real RTDB Stores subscription state in /subscriptions/{companyId}/ in Firebase RTDB. Also updates /companies/{companyId}/subscriptionPlanId for admin dashboard visibility. Payment flow for Egyptian market: 1. User selects plan → status written as 'pending_payment' 2. User sees bank transfer / Vodafone Cash instructions on DownloadPage 3. Master admin manually sets status → 'active' via admin dashboard / import { ref, set, get, update } from 'firebase/database'; import { rtdb } from './firebaseClient'; import { Subscription } from '@wasalt/types'; /** Fetches the current subscription for a company from RTDB. |
| L29 | `recordPlanSelection()` | `companyId: string,   planId: string,   billingCycle: 'monthly' | 'annual' = 'monthly'` | Records a plan selection from the onboarding wizard. Sets status to 'pending_payment' — master admin activates after payment confirmation. |
| L70 | `updatePlan()` | `companyId: string,   newPlanId: string,   billingCycle?: 'monthly' | 'annual'` | Updates the plan for an existing company subscription. Used from the billing settings in the dashboard. |
| L98 | `activateSubscription()` | `companyId: string` | Called by master admin to activate a subscription after payment is confirmed. |

## [colorExtractor.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/packages/theme/src/colorExtractor.ts)
`wasalt/packages/theme/src/colorExtractor.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `extractColorsFromImageUrl()` | `imageUrl: string` | Client-Side Canvas Dominant Color Extractor Extracts dominant tones from an image/logo without external dependencies. / import { RGB, rgbToHex } from './colorUtils'; export interface ExtractedColorResult { dominantHex: string; palette: string[]; // Up to 5 dominant colors } /** Quantizes image pixels from an HTMLImageElement or data URL via Offscreen/HTML Canvas. |

## [colorUtils.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/packages/theme/src/colorUtils.ts)
`wasalt/packages/theme/src/colorUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `getRelativeLuminance()` | `rgb: RGB` | Color math and conversion utilities (Hex, RGB, HSL, Relative Luminance) / export interface RGB { r: number; g: number; b: number; } export interface HSL { h: number; s: number; l: number; } export function hexToRgb(hex: string): RGB { let cleaned = hex.replace('#', '').trim(); if (cleaned.length === 3) { cleaned = cleaned .split('') .map((c) => c + c) .join(''); } const intVal = parseInt(cleaned, 16); if (isNaN(intVal) || cleaned.length !== 6) { return { r: 37, g: 99, b: 235 }; // Fallback to Sapphire Blue } return { r: (intVal >> 16) & 255, g: (intVal >> 8) & 255, b: intVal & 255, }; } export function rgbToHex(rgb: RGB): string { const toHex = (n: number) => { const clamped = Math.max(0, Math.min(255, Math.round(n))); return clamped.toString(16).padStart(2, '0'); }; return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`; } export function rgbToHsl(rgb: RGB): HSL { const r = rgb.r / 255; const g = rgb.g / 255; const b = rgb.b / 255; const max = Math.max(r, g, b); const min = Math.min(r, g, b); let h = 0; let s = 0; const l = (max + min) / 2; if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; } return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100), }; } export function hslToRgb(hsl: HSL): RGB { const h = hsl.h / 360; const s = hsl.s / 100; const l = hsl.l / 100; if (s === 0) { const val = Math.round(l * 255); return { r: val, g: val, b: val }; } const hue2rgb = (p: number, q: number, t: number) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }; const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q; return { r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255), g: Math.round(hue2rgb(p, q, h) * 255), b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255), }; } /** Calculates WCAG 2.1 Relative Luminance of an sRGB color. |

## [contrastValidator.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/packages/theme/src/contrastValidator.ts)
`wasalt/packages/theme/src/contrastValidator.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `calculateContrastRatio()` | `foregroundHex: string, backgroundHex: string` | WCAG 2.1 Contrast Calculation and Automated Adjustment Engine / import { hexToRgb, getRelativeLuminance, rgbToHsl, hslToRgb, rgbToHex } from './colorUtils'; export interface ContrastResult { ratio: number; isAccessible: boolean; // >= 4.5:1 isLargeAccessible: boolean; // >= 3:1 grade: 'AAA' | 'AA' | 'AA-Large' | 'Fail'; } /** Calculates WCAG 2.1 contrast ratio between two hex colors. |
| L28 | `evaluateContrast()` | `foregroundHex: string, backgroundHex: string` | No description provided. |
| L48 | `ensureAccessibleColor()` | `colorHex: string, backgroundHex: string = '#FFFFFF'` | Adjusts color luminance dynamically until it satisfies WCAG AA (4.5:1) against a background. |

## [cssVariables.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/packages/theme/src/cssVariables.ts)
`wasalt/packages/theme/src/cssVariables.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `applyThemeTokens()` | `theme: CompanyTheme, targetElement?: HTMLElement | null` | No description provided. |

## [paletteGenerator.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/packages/theme/src/paletteGenerator.ts)
`wasalt/packages/theme/src/paletteGenerator.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `generateThemeFromColor()` | `options: GenerateThemeOptions` | No description provided. |

## [presetThemes.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/packages/theme/src/presetThemes.ts)
`wasalt/packages/theme/src/presetThemes.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L45 | `getPresetThemeById()` | `id: string` | No description provided. |

## [authSchemas.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/packages/validation/src/authSchemas.ts)
`wasalt/packages/validation/src/authSchemas.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L8 | `validateSignUp()` | `data: {   fullName?: string;   email?: string;   password?: string; }` | No description provided. |
| L34 | `validateLogin()` | `data: { email?: string; password?: string }` | No description provided. |

## [companySchemas.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/packages/validation/src/companySchemas.ts)
`wasalt/packages/validation/src/companySchemas.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `validateCompanySetup()` | `data: {   name?: string;   slug?: string;   industry?: string;   website?: string; }` | No description provided. |

## [memberSchemas.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/wasalt/packages/validation/src/memberSchemas.ts)
`wasalt/packages/validation/src/memberSchemas.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `validateInviteMember()` | `data: {   email?: string;   fullName?: string;   role?: AdminRole; }` | No description provided. |
