# Automated Functions Catalog (`functions.md`)

> **Note:** This file is automatically compiled by `scripts/generate_functions_doc.py`.
> Do not manually edit this file. Keep inline docstrings updated in the source code.

**Total Documented Functions:** 295

---

## [App.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/App.tsx)
`admin/src/App.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L22 | `App()` | *none* | Root React Native application entry point component. |

## [Modal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/common/Modal.tsx)
`admin/src/components/common/Modal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L13 | `Modal()` | `{   isOpen,   onClose,   title,   subtitle,   children,   maxWidth = 'lg', }` | Reusable modal dialog overlay component. |
| L25 | `handleKeyDown()` | `e: KeyboardEvent` | Listens for Escape key press to dismiss modal. |

## [Navbar.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/common/Navbar.tsx)
`admin/src/components/common/Navbar.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L9 | `Navbar()` | `{ activeVehiclesCount }` | Top navigation bar for Admin Web Portal. |

## [Sidebar.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/common/Sidebar.tsx)
`admin/src/components/common/Sidebar.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L20 | `Sidebar()` | `{ currentTab, onSelectTab, counts }` | Collapsible left navigation sidebar for Admin Web Portal. |

## [StatCard.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/common/StatCard.tsx)
`admin/src/components/common/StatCard.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `StatCard()` | `{   title,   value,   subtitle,   icon: Icon,   color = 'blue',   trend, }` | Summary metric card with icon, count, and trend indicator. |

## [AddBusLineModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/AddBusLineModal.tsx)
`admin/src/components/companies/AddBusLineModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `AddBusLineModal()` | `{   isOpen,   onClose,   companies,   initialCompanyId,   onLineAdded, }` | Modal allowing dispatchers to register a new bus line. |
| L32 | `handleSubmit()` | `e: React.FormEvent` | Submits new line registration to company catalog. |

## [AddCompanyModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/AddCompanyModal.tsx)
`admin/src/components/companies/AddCompanyModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `AddCompanyModal()` | `{   isOpen,   onClose,   onSuccess, }` | @file AddCompanyModal.tsx @description Modal dialog allowing administrators to register new transit operators, university campus shuttles, private carriers, or school transport authorities. / import React, { useState } from 'react'; import { Building2 } from 'lucide-react'; import { Modal } from '../common/Modal'; import { saveCompany } from '../../services/companiesService'; import { toast } from 'sonner'; interface AddCompanyModalProps { isOpen: boolean; onClose: () => void; onSuccess?: (companyId: string, name: string) => void; } /** Modal form component to register new transit operating company. @param props - Modal visibility and close callbacks. @returns JSX Element. |
| L35 | `handleSubmit()` | `e: React.FormEvent` | Handles company registration submission to Firebase RTDB. |

## [CompaniesGridView.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/CompaniesGridView.tsx)
`admin/src/components/companies/CompaniesGridView.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `CompaniesGridView()` | `{   companies,   buses,   onSelectCompanyForLines,   onDeleteCompany,   onOpenAddCompany, }` | @file CompaniesGridView.tsx @description Renders a responsive grid of transit operator cards and handles empty search state representations. / import React from 'react'; import { Building2, Plus } from 'lucide-react'; import { CompanyCard } from './CompanyCard'; import { CompanyRecord, BusRouteDefinition } from '../../types'; interface CompaniesGridViewProps { companies: CompanyRecord[]; buses: BusRouteDefinition[]; onSelectCompanyForLines: (company: CompanyRecord) => void; onDeleteCompany: (companyId: string) => void; onOpenAddCompany: () => void; } /** Grid view component rendering operator cards or an empty search prompt. @param props - Filtered company records, bus route definitions, and action handlers. @returns JSX Element. |
| L33 | `getBusCount()` | `companyId: string` | Calculates the total buses assigned to a company. |

## [CompanyCard.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/CompanyCard.tsx)
`admin/src/components/companies/CompanyCard.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L13 | `CompanyCard()` | `{   company,   busesCount,   onManageLines,   onDeleteCompany,   isDuplicate, }` | Card component rendering company metrics and quick actions. |

## [LineManagerModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/LineManagerModal.tsx)
`admin/src/components/companies/LineManagerModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `LineManagerModal()` | `{   isOpen,   onClose,   company, }` | Modal for managing bus lines assigned to a specific transport company. |
| L29 | `handleAddLine()` | `e: React.FormEvent` | Adds a new bus line to the company line catalog. |
| L53 | `handleStartRename()` | `line: string` | Initiates inline line renaming mode. |
| L61 | `handleSaveRename()` | `oldLine: string` | Persists updated line name across all related routes. |
| L83 | `handleDeleteLine()` | `lineToDelete: string` | Removes a bus line from the company. |

## [LinesTableView.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/companies/LinesTableView.tsx)
`admin/src/components/companies/LinesTableView.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `LinesTableView()` | `{   lines,   onDeleteLine,   onRenameLine,   onOpenAddLine, }` | @file LinesTableView.tsx @description Master tabular catalog of all transit lines across all operators, providing inline line renaming, route count metrics, and line deletions. / import React, { useState } from 'react'; import { Route, Edit2, Trash2, Layers } from 'lucide-react'; export interface FlattenedLineItem { companyId: string; companyName: string; lineName: string; busesCount: number; } interface LinesTableViewProps { lines: FlattenedLineItem[]; onDeleteLine: (companyId: string, lineName: string) => void; onRenameLine: (companyId: string, oldName: string, newName: string) => void; onOpenAddLine: () => void; } /** Tabular component rendering cross-company bus lines with inline editing. @param props - Filtered lines catalog, delete/rename callbacks, and modal trigger. @returns JSX Element. |
| L39 | `handleStartRename()` | `rowKey: string, currentName: string` | Initiates inline line renaming in the lines table. |
| L47 | `handleSaveRename()` | `companyId: string, oldName: string` | Persists inline renamed line identifier to RTDB. |

## [DriverAssignModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/drivers/DriverAssignModal.tsx)
`admin/src/components/drivers/DriverAssignModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `DriverAssignModal()` | `{   isOpen,   onClose,   driver,   companies,   onSaveAssignments, }` | Modal dialog for assigning operating lines to a driver. |
| L34 | `handleToggleLine()` | `line: string` | Toggles line assignment checkbox state. |
| L45 | `handleSave()` | *none* | Persists updated line assignments to driver RTDB node. |

## [DriverTable.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/drivers/DriverTable.tsx)
`admin/src/components/drivers/DriverTable.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `DriverTable()` | `{   drivers,   onAssignDriver,   onDeleteDriver,   onSafetyCheck,   selectedCompanyFilter, }` | Directory table rendering driver accounts, lines, and actions. |
| L27 | `handleCopy()` | `uid: string` | Copies driver UID or email to clipboard. |

## [BusEditorModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/fleet/BusEditorModal.tsx)
`admin/src/components/fleet/BusEditorModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `BusEditorModal()` | `{   isOpen,   onClose,   busToEdit,   companies,   onSaveBus, }` | Modal for creating or editing a bus vehicle and route definition. |
| L83 | `handleStopsChange()` | `updatedStops: BusStop[],     start: { lat: number; lng: number; address: string },     end: { lat: number; lng: number; address: string }` | Updates waypoint stops sequence in the route definition. |
| L100 | `handleSubmit()` | `e: React.FormEvent` | Saves bus route definition to Firebase RTDB. |

## [BusTable.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/fleet/BusTable.tsx)
`admin/src/components/fleet/BusTable.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L13 | `BusTable()` | `{   buses,   onToggleActive,   onEditBus,   onDeleteBus,   selectedCompanyFilter, }` | Table rendering fleet buses and route details. |

## [VehicleRegistrationModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/fleet/VehicleRegistrationModal.tsx)
`admin/src/components/fleet/VehicleRegistrationModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `VehicleRegistrationModal()` | `{   isOpen,   onClose,   companies,   existingBuses,   onSaveVehicle,   vehicleToEdit, }` | Modal for registering a new bus vehicle in the fleet. |
| L43 | `handleSubmit()` | `e: React.FormEvent` | Persists new vehicle registration data. |

## [EgyptianLandmarksPicker.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/EgyptianLandmarksPicker.tsx)
`admin/src/components/map/EgyptianLandmarksPicker.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L9 | `EgyptianLandmarksPicker()` | `{   onSelectLandmark, }` | Dropdown picker for preset Egyptian landmarks and transit hubs. |

## [FleetMap.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/FleetMap.tsx)
`admin/src/components/map/FleetMap.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L22 | `FleetMap()` | `{   liveLocations,   catalogBuses,   selectedBusId,   onSelectBus, }` | Real-time fleet overview map displaying active buses, routes, and telemetry. |
| L251 | `handleResetView()` | *none* | No description provided. |
| L257 | `handleFitAll()` | *none* | No description provided. |

## [FleetMapLegend.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/FleetMapLegend.tsx)
`admin/src/components/map/FleetMapLegend.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `FleetMapLegend()` | *none* | Modern floating legend overlay for the fleet map showing route and marker conventions. |

## [MapThemeSelector.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/MapThemeSelector.tsx)
`admin/src/components/map/MapThemeSelector.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L10 | `MapThemeSelector()` | `{   currentTheme,   onThemeChange, }` | Toolbar widget allowing operators to switch between Dark Ops, Clean Street, and Offline maps. |

## [RouteMapToolbar.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/RouteMapToolbar.tsx)
`admin/src/components/map/RouteMapToolbar.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `RouteMapToolbar()` | `{   activeMode,   onSetActiveMode,   onUseCurrentLocation,   onFitRoute,   routeStats,   isCalculatingRoute,   stopsCount, }` | Toolbar controls for the Route Picker Leaflet map. |

## [RoutePickerMap.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/RoutePickerMap.tsx)
`admin/src/components/map/RoutePickerMap.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L25 | `RoutePickerMap()` | `{   initialStops,   startLat = 30.0444,   startLng = 31.2357,   endLat = 30.0561,   endLng = 31.3300,   startAddress = 'Start Station',   endAddress = 'Destination',   onPointsSelected,   onStopsChange, }` | Interactive Leaflet map for picking route waypoints and stops. |
| L135 | `notifyChanges()` | `updatedStops: BusStop[]` | Sync stops changes to callbacks |
| L211 | `updateStopWithLandmark()` | `targetId: string, lat: number, lng: number` | Asynchronously resolves the nearest named landmark via Overpass/Nominatim and updates stop name. @suggestion [INTEGRATE]: Connect this function to the map click handler below so that newly dropped custom waypoint pins automatically resolve and populate the nearest real-world landmark name. |
| L233 | `handleClick()` | `e: L.LeafletMouseEvent` | Handles map click event to add a coordinate stop. |
| L275 | `removeStop()` | `index: number` | Removes an intermediate waypoint stop from the route sequence. |
| L284 | `updateStopName()` | `index: number, name: string` | Updates the descriptive landmark label for a waypoint stop. |
| L293 | `addPresetAsStop()` | `landmark: EgyptianLandmark` | Appends an Egyptian transit preset landmark to the route sequence. |
| L320 | `useCurrentLocationForStart()` | *none* | Sets the route starting point to current GPS location. |

## [RouteStopsList.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/RouteStopsList.tsx)
`admin/src/components/map/RouteStopsList.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L11 | `RouteStopsList()` | `{   stops,   onUpdateName,   onRemoveStop, }` | Numbered list of intermediate waypoint stops with reordering controls. |

## [fleetMapHelpers.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/fleetMapHelpers.ts)
`admin/src/components/map/fleetMapHelpers.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `createTerminalMarker()` | `latLng: [number, number],   type: "A" | "B",   lineId: string,   pointName: string` | Creates a terminal depot A or B pin marker with popup. |
| L28 | `createCatalogBusMarker()` | `pos: [number, number],   bus: BusRouteDefinition,   isSelected: boolean,   liveMatch: LiveBusLocation | undefined,   onSelectBus?: (busId: string` | Creates a bus vehicle marker along the line with telemetry popup. |
| L82 | `createLiveBeaconMarker()` | `pos: [number, number], loc: LiveBusLocation` | Creates an orphan live driver beacon marker with radar ping. |

## [mapLayerManager.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/mapLayerManager.ts)
`admin/src/components/map/mapLayerManager.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `attachMapBaseTheme()` | `map: L.Map, theme: MapTheme` | @file mapLayerManager.ts @description Manages cartographic base tile layers and themes for Leaflet maps. Supports CartoDB Dark Matter (operations dark mode), CartoDB Voyager (clean transit), and an offline vector fallback mode. / import L from 'leaflet'; import { attachOfflineVectorBaseMap } from './offlineMapLayer'; export type MapTheme = 'dark' | 'clean' | 'offline'; const CARTO_DARK_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'; const CARTO_VOYAGER_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'; const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'; /** Attaches the selected cartographic base layer to a Leaflet map instance. @param map - Leaflet map instance. @param theme - Selected map theme ('dark' | 'clean' | 'offline'). @returns Cleanup function to remove base layer on theme change or unmount. |

## [offlineMapLayer.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/map/offlineMapLayer.ts)
`admin/src/components/map/offlineMapLayer.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `preloadOfflineMapAssets()` | *none* | @file offlineMapLayer.ts @description Attaches high-performance, 100% offline vector base map layers (River Nile, coastlines, and Egyptian transit road network) directly to any Leaflet map instance. Eliminates all external tile server network requests. / import L from 'leaflet'; interface RoadProperties { c?: string; // class s?: number; // speed } let cachedWaterGeoJson: GeoJSON.FeatureCollection | null = null; let cachedRoadsGeoJson: GeoJSON.FeatureCollection | null = null; /** Preloads vector map assets in background to ensure instantaneous rendering. |
| L36 | `attachOfflineVectorBaseMap()` | `map: L.Map` | Attaches offline vector base map layers to a Leaflet map. @param map - Leaflet map instance. @returns Clean-up function to remove layers when map unmounts. |
| L48 | `renderWater()` | `geojson: GeoJSON.FeatureCollection` | 1. Render Water Layer (River Nile & Waterbodies) |
| L74 | `renderRoads()` | `geojson: GeoJSON.FeatureCollection` | 2. Render Road Network Layer (Arteries, Ring Road, Corridors) |

## [DriverSafetyAudioMonitor.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/modals/DriverSafetyAudioMonitor.tsx)
`admin/src/components/modals/DriverSafetyAudioMonitor.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L10 | `DriverSafetyAudioMonitor()` | `{   isMuted,   remoteStream,   onToggleMute, }` | Live audio monitor bar displaying RMS telemetry, audio waveform animation, and mute controls. |

## [DriverSafetyMediaModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/modals/DriverSafetyMediaModal.tsx)
`admin/src/components/modals/DriverSafetyMediaModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L26 | `DriverSafetyMediaModal()` | `{   isOpen,   onClose,   driverUid: initialDriverUid,   driverName: initialDriverName,   driverEmail: initialDriverEmail,   lineId,   cameraMonitored = false,   micMonitored = false,   latitude,   longitude, }` | SafeTrip video monitoring modal inspecting real-time driver WebRTC camera feed. |
| L107 | `handleSendRequest()` | `kind: MediaRequestKind` | Sends camera feed request signal to driver mobile device. |
| L123 | `handleEndSession()` | *none* | Terminates active SafeTrip video monitoring session. |
| L138 | `handleSimulateConsent()` | `approved: boolean` | Simulates driver consent response in test environments. |
| L156 | `switchToActiveDriver()` | *none* | Switches active video viewport to another broadcasting driver. |

## [DriverSafetyVideoViewport.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/modals/DriverSafetyVideoViewport.tsx)
`admin/src/components/modals/DriverSafetyVideoViewport.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `DriverSafetyVideoViewport()` | `{   streamData,   remoteStream,   webrtcStats,   isMuted = false,   driverName,   lineId,   latitude,   longitude, }` | Video viewport element rendering incoming driver WebRTC stream. |
| L53 | `toggleLocalWebcam()` | *none* | Toggle local browser webcam for testing without mobile device. @suggestion [DELETE]: SafeTrip WebRTC P2P hardware streaming from mobile devices is fully operational; this local browser loopback mock is an unused development artifact and can be safely deleted once confirmed. |

## [LineCatalogTable.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/components/routes/LineCatalogTable.tsx)
`admin/src/components/routes/LineCatalogTable.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L20 | `LineCatalogTable()` | `{   lines,   companies,   onRenameLine,   onDeleteLine,   onOpenCompanyLineManager, }` | Table component displaying bus line routes and metadata. |
| L33 | `handleSaveRename()` | `companyId: string, oldLine: string` | Saves renamed bus line in the catalog. |

## [AuthContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/contexts/AuthContext.tsx)
`admin/src/contexts/AuthContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L22 | `AuthProvider()` | `{ children }` | Provides authentication state and user session context to child components. |
| L30 | `resolveRole()` | `email: string` | Helper to determine role from email |
| L77 | `loginMasterAdmin()` | `username: string,     pass: string,     otpToken: string,     rememberMe: boolean` | Master Admin Login requiring Username, Password, and Authenticator App OTP. |
| L123 | `loginWithFirebase()` | `email: string, pass: string, rememberMe: boolean` | Company Dispatcher login via Firebase Auth. |
| L142 | `logout()` | *none* | Signs out the currently authenticated user. |
| L163 | `useAdminAuth()` | *none* | Provides master admin authentication credentials and actions. |

## [useLineOperations.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/hooks/useLineOperations.ts)
`admin/src/hooks/useLineOperations.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `useLineOperations()` | *none* | @file useLineOperations.ts @description Centralized custom hook for bus line administrative operations (renaming and deletion) with confirmation prompts, RTDB persistence, and toast feedback. / import { useCallback } from 'react'; import { toast } from 'sonner'; import { renameCompanyLine, deleteCompanyLine } from '../services/companiesService'; /** Custom hook providing standardized line mutation workflows with user confirmations and feedback. |

## [CompaniesPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/CompaniesPage.tsx)
`admin/src/pages/CompaniesPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L2 | `CompaniesPage()` | `{   companies,   buses, }` | @file CompaniesPage.tsx @description Primary administrative portal for managing transit operators, corporate shuttles, school bus authorities, and cross-operator bus lines. / import React, { useState, useMemo } from 'react'; import { Plus, Search, Building2, Route } from 'lucide-react'; import { CompanyRecord, BusRouteDefinition } from '../types'; import { removeCompany, } from '../services/companiesService'; import { toast } from 'sonner'; Modular Presentation Components import { CompaniesGridView } from '../components/companies/CompaniesGridView'; import { LinesTableView, FlattenedLineItem } from '../components/companies/LinesTableView'; import { AddCompanyModal } from '../components/companies/AddCompanyModal'; import { LineManagerModal } from '../components/companies/LineManagerModal'; import { AddBusLineModal } from '../components/companies/AddBusLineModal'; interface CompaniesPageProps { companies: CompanyRecord[]; buses: BusRouteDefinition[]; } /** Main Companies & Transit Lines management page coordinator. @param props - System company records and active bus route definitions. @returns JSX Element. |
| L90 | `handleDeleteCompany()` | `companyId: string` | Deletes a transit operator node with user confirmation. |

## [DashboardPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/DashboardPage.tsx)
`admin/src/pages/DashboardPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L18 | `DashboardPage()` | `{   liveLocations,   buses,   companies,   drivers,   onSelectBus, }` | Master administrative overview metrics dashboard. |
| L31 | `handleForceStopSession()` | `lineId: string, driverUid: string` | Forcefully terminates an active driver telemetry broadcast session. |

## [DriversPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/DriversPage.tsx)
`admin/src/pages/DriversPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `DriversPage()` | `{ drivers, companies }` | Administrative directory for driver assignments, profiles, and permissions. |
| L35 | `handleSaveAssignments()` | `driverUid: string, companyId: string, lines: string[]` | Saves driver line assignments to Firebase RTDB. |
| L43 | `handleDeleteDriver()` | `driverUid: string, driverName: string` | Removes driver account and assignment records from the system. |
| L57 | `handleCreateDriver()` | `e: React.FormEvent` | Creates a new driver record in the system directory. |

## [FleetPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/FleetPage.tsx)
`admin/src/pages/FleetPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `FleetPage()` | `{ buses, companies }` | Fleet management dashboard showing road readiness, active vehicles, and dispatch controls. |
| L27 | `handleToggle()` | `companyId: string, busId: string, currentActive: boolean` | Toggles active dispatch status for a vehicle. |
| L39 | `handleDelete()` | `companyId: string, busId: string` | Deletes a vehicle record from the fleet directory. |
| L53 | `handleOpenNew()` | *none* | Opens the vehicle registration modal. |
| L61 | `handleOpenEdit()` | `bus: BusRouteDefinition` | Opens the vehicle editor modal for an existing bus. |

## [LoginPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/LoginPage.tsx)
`admin/src/pages/LoginPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L6 | `LoginPage()` | *none* | Administrative login screen supporting master 2FA TOTP and company dispatch authentication. |
| L24 | `handleCopySecret()` | *none* | Copies 2FA secret key to clipboard for authenticator setup. |
| L34 | `handleSubmit()` | `e: React.FormEvent` | Submits admin login credentials to authentication services. |

## [PassengersPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/PassengersPage.tsx)
`admin/src/pages/PassengersPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L11 | `PassengersPage()` | `{ passengers }` | Administrative directory for commuter passenger accounts and trip records. |
| L37 | `handleCopyUid()` | `uid: string` | Copies commuter UID to system clipboard. |
| L47 | `handleClearHistory()` | `uid: string` | Clears trip history records for the selected passenger. |
| L64 | `handleDeleteUser()` | `uid: string, name: string` | Deletes a passenger account from the system directory. |

## [RoutesPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/RoutesPage.tsx)
`admin/src/pages/RoutesPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `RoutesPage()` | `{ buses, companies }` | Transit corridors manager and visual route designer page. |
| L75 | `handleDeleteRoute()` | `companyId: string, busId: string` | Deletes a configured route definition from the company node. |

## [SecurityPage.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/pages/SecurityPage.tsx)
`admin/src/pages/SecurityPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L11 | `SecurityPage()` | `{ companies }` | System diagnostic and security audit dashboard. |
| L18 | `handleCleanDuplicateBrt()` | *none* | Cleans duplicate bus route corridor nodes from the database. |

## [bidirectionalAStar.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/bidirectionalAStar.ts)
`admin/src/services/bidirectionalAStar.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `hF()` | `id: string` | @file bidirectionalAStar.ts @description In-memory, high-performance Bidirectional A* Graph Routing Engine for Egypt. Evaluates paths simultaneously forward from start and backward from goal, cutting node expansions by 50-70% and computing turn-by-turn routes in single-digit milliseconds. / import { haversineDistanceKm } from '../utils/geoUtils'; export interface RouteCoord { lat: number; lng: number; } export interface GraphEdge { t: string; // target node id d: number; // distance in km s: number; // speed limit in km/h } export interface GraphNode { id: string; lat: number; lng: number; adj: GraphEdge[]; } export interface BidirectionalRouteResult { coordinates: [number, number][]; distanceKm: number; durationMin: number; isFallback: boolean; } /** Min-Heap priority queue for fast O(log N) node extraction. / class PriorityQueue<T> { private heap: Array<{ item: T; priority: number }> = []; push(item: T, priority: number): void { this.heap.push({ item, priority }); this.bubbleUp(this.heap.length - 1); } pop(): T | undefined { if (this.heap.length === 0) return undefined; const top = this.heap[0].item; const bottom = this.heap.pop(); if (this.heap.length > 0 && bottom !== undefined) { this.heap[0] = bottom; this.bubbleDown(0); } return top; } isEmpty(): boolean { return this.heap.length === 0; } peekPriority(): number { return this.heap.length > 0 ? this.heap[0].priority : Infinity; } private bubbleUp(idx: number): void { while (idx > 0) { const parentIdx = Math.floor((idx - 1) / 2); if (this.heap[idx].priority >= this.heap[parentIdx].priority) break; const tmp = this.heap[idx]; this.heap[idx] = this.heap[parentIdx]; this.heap[parentIdx] = tmp; idx = parentIdx; } } private bubbleDown(idx: number): void { const length = this.heap.length; while (true) { let left = 2 * idx + 1; let right = 2 * idx + 2; let smallest = idx; if (left < length && this.heap[left].priority < this.heap[smallest].priority) { smallest = left; } if (right < length && this.heap[right].priority < this.heap[smallest].priority) { smallest = right; } if (smallest === idx) break; const tmp = this.heap[idx]; this.heap[idx] = this.heap[smallest]; this.heap[smallest] = tmp; idx = smallest; } } } /** High-performance Bidirectional A* Router. / export class BidirectionalAStarRouter { private nodesMap = new Map<string, GraphNode>(); private isLoaded = false; constructor(initialNodes?: GraphNode[]) { if (initialNodes && initialNodes.length > 0) { this.loadNodes(initialNodes); } } /** Populate graph with nodes and adjacency lists. / loadNodes(nodes: GraphNode[]): void { this.nodesMap.clear(); for (const n of nodes) { this.nodesMap.set(n.id, n); } this.isLoaded = true; } /** Find nearest graph node to given coordinates. / findNearestNode(coord: RouteCoord): GraphNode | null { let bestDist = Infinity; let bestNode: GraphNode | null = null; for (const node of this.nodesMap.values()) { const d = haversineDistanceKm(coord.lat, coord.lng, node.lat, node.lng); if (d < bestDist) { bestDist = d; bestNode = node; if (d < 0.05) break; // < 50m is an exact snap } } return bestNode; } /** Executes Bidirectional A* search from start to goal. / findPath(startCoord: RouteCoord, goalCoord: RouteCoord): BidirectionalRouteResult { const directDist = haversineDistanceKm(startCoord.lat, startCoord.lng, goalCoord.lat, goalCoord.lng); If start & goal are very close or graph is empty, return direct line if (directDist < 0.2 || this.nodesMap.size === 0) { return this.buildDirectRoute(startCoord, goalCoord, directDist); } const startNode = this.findNearestNode(startCoord); const goalNode = this.findNearestNode(goalCoord); if (!startNode || !goalNode || startNode.id === goalNode.id) { return this.buildDirectRoute(startCoord, goalCoord, directDist); } Initialize Bidirectional A* structures const forwardPQ = new PriorityQueue<string>(); const backwardPQ = new PriorityQueue<string>(); const distF = new Map<string, number>(); const distB = new Map<string, number>(); const parentF = new Map<string, string>(); const parentB = new Map<string, string>(); const settledF = new Set<string>(); const settledB = new Set<string>(); distF.set(startNode.id, 0); distB.set(goalNode.id, 0); /** Forward Euclidean distance heuristic to goal. |
| L179 | `hB()` | `id: string` | Backward Euclidean distance heuristic to start. |

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
| L37 | `saveCompany()` | `companyId: string, data: Partial<CompanyRecord>` | Creates or updates a transit company record. |
| L53 | `updateCompanyLines()` | `companyId: string, lines: string[]` | Updates the busLines array for a given company. |
| L61 | `addCompanyLine()` | `companyId: string, lineName: string` | Directly appends a new bus line to a company's busLines array in Firebase RTDB. |
| L76 | `renameCompanyLine()` | `companyId: string,   oldLine: string,   newLine: string` | Renames a bus line and cascades the update to all assigned buses. |
| L103 | `deleteCompanyLine()` | `companyId: string, lineToDelete: string` | Deletes a bus line from a company. |
| L114 | `removeCompany()` | `companyId: string` | Safely removes a company key. |

## [driverMediaService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/driverMediaService.ts)
`admin/src/services/driverMediaService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `requestDriverMedia()` | `driverUid: string,   kind: MediaRequestKind,   adminEmail: string` | Dispatches a remote camera/microphone safety check request to a driver's mobile device. Writes to /driverControls/<driverUid>/mediaRequest adhering to SafeTrip protocol. |
| L26 | `subscribeToDriverMediaRequest()` | `driverUid: string,   callback: (request: DriverMediaRequest | null` | Listens in real time to the driver's consent state and safety check stream status. |
| L64 | `subscribeToDriverMediaStream()` | `driverUid: string,   callback: (stream: DriverMediaStream | null` | Subscribes to the live incoming video/audio stream frames from the driver's mobile handset. Listens to /driverControls/<driverUid>/mediaStream. |
| L92 | `closeDriverMediaRequest()` | `driverUid: string` | Terminates an active or pending safety stream check session. |
| L103 | `simulateDriverResponse()` | `driverUid: string, approved: boolean` | Diagnostic/Simulation Helper: Simulates the mobile driver tapping 'Accept' or 'Decline' in the SafeTrip prompt. Enables live stream interface verification in offline testing environments. |

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

## [localRoutingEngine.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/localRoutingEngine.ts)
`admin/src/services/localRoutingEngine.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L2 | `findNearestArteryNode()` | `lat: number, lng: number` | @file localRoutingEngine.ts @description In-memory, zero-dependency client-side transit routing engine for Egyptian corridors. Operates completely offline with zero external cloud routing API dependencies. / import { haversineDistanceKm } from '../utils/geoUtils'; export interface RouteWaypoint { lat: number; lng: number; name?: string; } export interface LocalRouteResult { coordinates: [number, number][]; distanceKm: number; durationMin: number; isFallback: boolean; } /** Key Egyptian arterial transit corridors & highway junction nodes. / interface RoadNode { id: string; lat: number; lng: number; name: string; } const EGYPT_ARTERY_NODES: RoadNode[] = [ Ring Road Key Junctions { id: 'rr_maadi', lat: 29.9744, lng: 31.2800, name: 'Ring Road / Autostrad Maadi' }, { id: 'rr_muneeb', lat: 29.9961, lng: 31.2183, name: 'Ring Road / Muneeb Giza' }, { id: 'rr_maryouteya', lat: 29.9889, lng: 31.1444, name: 'Ring Road / Maryouteya' }, { id: 'rr_wahat', lat: 29.9700, lng: 31.0200, name: 'Wahat Road / 6th Oct Junction' }, { id: 'rr_mehwar_26', lat: 30.0478, lng: 31.1456, name: '26th July Corridor / Ring Rd' }, { id: 'rr_waraq', lat: 30.0989, lng: 31.2056, name: 'Ring Road / Waraq Bridge' }, { id: 'rr_qalyoub', lat: 30.1417, lng: 31.2472, name: 'Ring Road / Alex Agricultural' }, { id: 'rr_musturad', lat: 30.1361, lng: 31.3028, name: 'Ring Road / Musturad' }, { id: 'rr_salam', lat: 30.1633, lng: 31.4328, name: 'Ring Road / El Salam & Ismailia' }, { id: 'rr_suez', lat: 30.0767, lng: 31.4367, name: 'Ring Road / Cairo-Suez Highway' }, { id: 'rr_new_cairo', lat: 30.0150, lng: 31.4389, name: 'Ring Road / 90th St Axis' }, { id: 'rr_katameya', lat: 29.9889, lng: 31.3650, name: 'Ring Road / Ain Sokhna Axis' }, Central City Arteries { id: 'tahrir_hub', lat: 30.0444, lng: 31.2357, name: 'Tahrir Square' }, { id: 'ramses_hub', lat: 30.0626, lng: 31.2469, name: 'Ramses Square' }, { id: 'giza_sq', lat: 30.0131, lng: 31.2089, name: 'Giza Square' }, { id: 'lebanon_sq', lat: 30.0610, lng: 31.2017, name: 'Lebanon Square' }, { id: 'abbasiya_sq', lat: 30.0667, lng: 31.2833, name: 'Abbasiya Square' }, { id: 'nasr_city_makram', lat: 30.0561, lng: 31.3300, name: 'Makram Ebeid Nasr City' }, { id: 'nasr_city_ecu', lat: 30.0345, lng: 31.3588, name: 'ECU Campus Nasr City' }, { id: 'heliopolis_korba', lat: 30.0906, lng: 31.3258, name: 'Korba Heliopolis' }, { id: 'new_cairo_90th', lat: 30.0247, lng: 31.4361, name: '90th Street New Cairo' }, { id: 'new_cairo_auc', lat: 30.0194, lng: 31.4994, name: 'AUC New Cairo' }, { id: 'oct_hosary', lat: 29.9739, lng: 30.9525, name: 'Hosary Mosque 6th Oct' }, { id: 'zayed_hyper', lat: 30.0433, lng: 31.0261, name: 'Hyper One Sheikh Zayed' }, { id: 'smart_village', lat: 30.0744, lng: 31.0189, name: 'Smart Village' } ]; /** Finds the nearest arterial road node for a given GPS coordinate. |
| L83 | `interpolateRoadCurve()` | `p0: [number, number],   p1: [number, number],   p2: [number, number],   p3: [number, number],   steps: number = 6` | Generates natural Catmull-Rom spline curves between control coordinates. |
| L117 | `computeLocalRoadRoute()` | `waypoints: RouteWaypoint[]` | Computes an offline, road-following transit polyline, distance, and duration across arbitrary waypoints. 100% in-memory with zero external API calls. @param waypoints - Sequence of GPS waypoints along the route. @returns Local route result with polyline geometry, distance in km, and duration in minutes. |

## [routingService.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/src/services/routingService.ts)
`admin/src/services/routingService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `buildWaypointKey()` | `waypoints: WaypointCoord[]` | @file routingService.ts @description In-app client-side routing service for Wasalt Admin Panel. Computes road-following driving geometries, distances, and durations offline using the embedded local routing engine with zero external API dependencies. / import { computeLocalRoadRoute, RouteWaypoint, LocalRouteResult } from './localRoutingEngine'; export interface WaypointCoord { lat: number; lng: number; name?: string; } export interface RouteGeometryResult { coordinates: [number, number][]; distanceKm: number; durationMin: number; isFallback: boolean; } In-memory cache for computed road paths to avoid redundant calculations const routeCache = new Map<string, RouteGeometryResult>(); /** Builds a deterministic cache key from a list of waypoints. @param waypoints - List of route waypoints. @returns Serialized string key. |
| L35 | `fetchRoadRoute()` | `startLatOrWaypoints: number | WaypointCoord[],   startLng?: number,   endLat?: number,   endLng?: number` | Computes road-following route coordinates between two or more stops using the embedded local routing engine. Completely offline with zero external cloud dependencies. Supports passing either an array of WaypointCoord or traditional (startLat, startLng, endLat, endLng). @param startLatOrWaypoints - Starting latitude or array of waypoints. @param startLng - Optional starting longitude. @param endLat - Optional ending latitude. @param endLng - Optional ending longitude. @returns Computed route geometry, distance, and duration. |

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
| L1 | `subscribeToWebRtcStream()` | `driverUid: string,   onRemoteStream: (stream: MediaStream | null` | Wasalt SafeTrip™ - Browser WebRTC Receiver Service Handles P2P WebRTC session negotiation with the driver mobile app via Firebase RTDB, delivering 30 FPS hardware-accelerated video and live Opus audio. / import { ref, set, onValue, off, remove } from 'firebase/database'; import { database } from '../config/firebase'; export interface WebRtcCallStats { status: 'idle' | 'waiting-offer' | 'negotiating' | 'connected' | 'disconnected' | 'failed'; fps: number; bitrateKbps: number; resolution?: string; } const RTC_CONFIG: RTCConfiguration = { iceServers: [ { urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }, { urls: 'stun:stun2.l.google.com:19302' }, ], }; /** Initiates and manages a WebRTC P2P receiver connection for an active driver safety stream. |

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

## [vite.config.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/admin/vite.config.ts)
`admin/vite.config.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L6 | `localMBTilesPlugin()` | *none* | In-process Vite plugin to serve local OpenStreetMap vector tiles directly from /home/kimo/Storage/datasets/map.mbtiles on the same server port. |

## [App.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/App.tsx)
`mobile/App.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L30 | `AnimatedTabButton()` | `{ children, onPress, accessibilityState }: any` | Animated tab button with bounce effect |
| L39 | `handlePress()` | *none* | Handles navigation tab press event. |
| L62 | `MainTabs()` | *none* | Bottom tab navigator for passenger application flows. |
| L113 | `AppNavigator()` | *none* | Root stack navigator coordinating role selection, login, and main tabs. |
| L149 | `App()` | *none* | Root React Native application entry point component. |

## [SettingsModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/SettingsModal.tsx)
`mobile/src/components/SettingsModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `SettingsModal()` | `{ visible, onClose, onLogout }: Props` | Modal for user application preferences, theme toggling, and language switcher. |

## [SidebarMenu.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/SidebarMenu.tsx)
`mobile/src/components/SidebarMenu.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L36 | `SidebarMenu()` | `{ visible, onClose }: SidebarMenuProps` | Slide-out drawer navigation menu displaying profile, links, and logout action. |
| L71 | `closeWithAnimation()` | *none* | Animates the sidebar drawer off-screen before invoking close callback. |
| L89 | `handleLogout()` | *none* | Logs out the authenticated user and closes the drawer. |
| L114 | `goToScreen()` | `name: string` | Navigates to the specified target screen and dismisses the sidebar. |
| L126 | `handleHistoryPress()` | *none* | Navigates to Commuter History screen. |
| L134 | `handleBusTrackerPress()` | *none* | Navigates to Live Map tracking screen. |
| L142 | `handleSubscriptionPress()` | *none* | Opens the Subscription plan upgrade modal. |

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
| L1 | `AuthHeader()` | `{   isSignUp,   isRTL,   branding,   vocabulary, }` | @file AuthHeader.tsx @description Authentication screen header displaying dynamic branding icon, institutional application title, and welcoming subtitle. / import React from "react"; import { View, Text } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import Animated, { FadeInUp } from "react-native-reanimated"; import { styles } from "../../styles/loginStyles"; import { TenantBranding, TenantVocabulary } from "../../config/tenantConfig"; export interface AuthHeaderProps { isSignUp: boolean; isRTL: boolean; branding: TenantBranding; vocabulary: TenantVocabulary; } /** Renders the top branding and titles for the login screen. @param props - Header configuration including sign up mode and tenant branding. |

## [DriverCompanyPickerModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/auth/DriverCompanyPickerModal.tsx)
`mobile/src/components/auth/DriverCompanyPickerModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `DriverCompanyPicker()` | `{   companies,   selectedCompany,   selectedCompanyName,   modalVisible,   isRTL,   vocabulary,   branding,   onOpenModal,   onCloseModal,   onSelectCompany, }` | @file DriverCompanyPickerModal.tsx @description Company and institution selector component and bottom sheet modal utilized during driver authentication to assign the driver's operating entity. / import React from "react"; import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/loginStyles"; import { CompanyItem } from "../../hooks/useAuthForm"; import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig"; export interface DriverCompanyPickerProps { companies: CompanyItem[]; selectedCompany: string; selectedCompanyName: string; modalVisible: boolean; isRTL: boolean; vocabulary: TenantVocabulary; branding: TenantBranding; onOpenModal: () => void; onCloseModal: () => void; onSelectCompany: (companyId: string) => void; } /** Renders company dropdown trigger button and modal selection sheet for driver login. @param props - Companies catalog, selection state, and modal visibility handlers. |

## [ForgotPasswordModal.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/auth/ForgotPasswordModal.tsx)
`mobile/src/components/auth/ForgotPasswordModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `ForgotPasswordModal()` | `{   visible,   email,   loading,   isRTL,   onChangeEmail,   onClose,   onSubmit, }` | @file ForgotPasswordModal.tsx @description Modal dialog allowing users to request a password reset email link. / import React from "react"; import { View, Text, TouchableOpacity, Modal } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import Animated, { FadeInUp } from "react-native-reanimated"; import { styles } from "../../styles/loginStyles"; import { Input } from "../ui/Input"; import { Button } from "../ui/Button"; export interface ForgotPasswordModalProps { visible: boolean; email: string; loading: boolean; isRTL: boolean; onChangeEmail: (text: string) => void; onClose: () => void; onSubmit: () => void; } /** Modal dialog for password reset requests. @param props - Visibility, email input state, loading flag, and submission handlers. |

## [UserTypeToggle.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/auth/UserTypeToggle.tsx)
`mobile/src/components/auth/UserTypeToggle.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `UserTypeToggle()` | `{   userType,   vocabulary,   branding,   onSelectUserType, }` | @file UserTypeToggle.tsx @description Segmented role toggle component allowing users to switch between Passenger (Commuter/Student/Employee) and Driver modes. / import React from "react"; import { View, Text, TouchableOpacity } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/loginStyles"; import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig"; export interface UserTypeToggleProps { userType: "passenger" | "driver" | null; vocabulary: TenantVocabulary; branding: TenantBranding; onSelectUserType: (type: "passenger" | "driver") => void; } /** Segmented control component for selecting user persona. @param props - Current user type and selection handler. |

## [DriverHeader.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverHeader.tsx)
`mobile/src/components/driver/DriverHeader.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `DriverHeader()` | `{   driverInitials,   driverName,   companyId,   sharing,   isRTL,   isDark,   vocabulary,   branding,   onOpenCompanyPicker,   onOpenSettings,   onLogout, }` | @file DriverHeader.tsx @description Driver profile header component displaying avatar, name, dynamic company/tenant badge, operational status chip, and settings/logout action buttons. / import React from "react"; import { View, Text, TouchableOpacity } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/driverHeaderStyles"; import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig"; export interface DriverHeaderProps { driverInitials: string; driverName: string; companyId: string | null; sharing: boolean; isRTL: boolean; isDark: boolean; vocabulary: TenantVocabulary; branding: TenantBranding; onOpenCompanyPicker: () => void; onOpenSettings: () => void; onLogout: () => void; } /** Driver top navigation header bar displaying profile avatar, operational status, dynamic company badge, and action buttons. @param props - Driver header properties including avatar initials and modal triggers. |

## [DriverModals.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverModals.tsx)
`mobile/src/components/driver/DriverModals.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `CompanyPickerModal()` | `{   visible,   companies,   currentCompanyId,   isRTL,   isDark,   vocabulary,   branding,   onClose,   onSelectCompany, }` | @file DriverModals.tsx @description Modal dialogs for the driver portal, including the Company/Institution Picker Modal. / import React from "react"; import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/driverModalStyles"; import { CompanyOption } from "../../hooks/useDriverProfile"; import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig"; export interface CompanyPickerModalProps { visible: boolean; companies: CompanyOption[]; currentCompanyId: string | null; isRTL: boolean; isDark: boolean; vocabulary: TenantVocabulary; branding: TenantBranding; onClose: () => void; onSelectCompany: (companyId: string) => void; } /** Company and transit institution selection modal allowing drivers to switch active operating company. @param props - Modal visibility, company options list, and selection callback. |

## [DriverRouteTimeline.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverRouteTimeline.tsx)
`mobile/src/components/driver/DriverRouteTimeline.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `DriverRouteTimeline()` | `{   busLines,   selectedBusLine,   activeRoute,   driverLocation,   isRTL,   isDark,   vocabulary,   branding,   onSelectLine, }` | @file DriverRouteTimeline.tsx @description Renders the route line selector and multi-stop itinerary timeline, visualizing intermediate stops, landmarks, and dynamic Point A location. / import React from "react"; import { View, Text, TouchableOpacity, ScrollView } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { styles } from "../../styles/driverRouteStyles"; import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig"; import { DriverLocationPoint } from "../../hooks/useDriverTripState"; export interface DriverRouteTimelineProps { busLines: string[]; selectedBusLine: string | null; activeRoute: any; driverLocation: DriverLocationPoint | null; isRTL: boolean; isDark: boolean; vocabulary: TenantVocabulary; branding: TenantBranding; onSelectLine: (lineId: string) => void; } /** Route selector and multi-stop itinerary timeline visualizing sequential transit stops, landmarks, and Point A. @param props - Available lines, selected line, route stop sequence, and line selection callback. |

## [DriverSafetyOverlay.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverSafetyOverlay.tsx)
`mobile/src/components/driver/DriverSafetyOverlay.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `DriverSafetyOverlay()` | `{   cameraPermissionGranted,   micPermissionGranted,   cameraFacing,   cameraPreviewOpen,   cameraRef,   isSafetyStreaming,   webrtcHtml,   webViewRef,   isRTL,   isDark,   onFlipCamera,   onTogglePreview,   onRequestPermissions,   onWebViewMessage, }` | @file DriverSafetyOverlay.tsx @description SafeTrip™ Remote Hardware Safety Monitoring component. Embeds CameraView for driver cab monitoring, audio stream indicator, permission request prompt, and WebRTC peer streaming bridge. / import React from "react"; import { View, Text, TouchableOpacity } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import { CameraView } from "expo-camera"; import { WebView } from "react-native-webview"; import { styles } from "../../styles/driverSafetyStyles"; export interface DriverSafetyOverlayProps { cameraPermissionGranted: boolean; micPermissionGranted: boolean; cameraFacing: "front" | "back"; cameraPreviewOpen: boolean; cameraRef: React.RefObject<any>; isSafetyStreaming: boolean; webrtcHtml: string; webViewRef: React.RefObject<any>; isRTL: boolean; isDark: boolean; onFlipCamera: () => void; onTogglePreview: () => void; onRequestPermissions: () => void; onWebViewMessage: (event: any) => void; } /** SafeTrip remote cabin safety camera monitoring overlay and WebRTC P2P streaming bridge. @param props - Hardware camera permissions, facing toggle, stream state, and signaling callbacks. |

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
| L1 | `ActiveBusModal()` | `{   selectedBus,   onClose,   onOpenMap, }` | @file ActiveBusModal.tsx @description Bottom sheet overlay modal presenting selected vehicle telemetry, driver details, geodesic distance/bearing, and one-tap map navigation. / import React from 'react'; import { View, Text, TouchableOpacity } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { useTheme } from '../../contexts/ThemeContext'; import { useI18n } from '../../contexts/I18nContext'; import { Card } from '../ui/Card'; import { Button } from '../ui/Button'; import { styles } from '../../styles/homeStyles'; import { ActiveBus } from '../../hooks/useHomeBuses'; interface ActiveBusModalProps { selectedBus: ActiveBus | null; onClose: () => void; onOpenMap: (bus: ActiveBus) => void; } /** Bottom modal sheet showing active bus details and action button. @param props - Selected bus data and modal actions. @returns JSX Element or null if unselected. |

## [BusCardItem.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/home/BusCardItem.tsx)
`mobile/src/components/home/BusCardItem.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `BusCardItem()` | `{   item,   index,   isFavorite,   isAuthenticated,   onPress,   onToggleFavorite,   onSaveBookmark, }` | @file BusCardItem.tsx @description Catalog route line card rendering active bus status, GPS distance badge, estimated travel duration, and bookmark triggers. / import React from 'react'; import { View, Text, TouchableOpacity } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { useTheme } from '../../contexts/ThemeContext'; import { useI18n } from '../../contexts/I18nContext'; import { Card } from '../ui/Card'; import { styles } from '../../styles/homeStyles'; import { Bus } from '../../hooks/useHomeBuses'; interface BusCardItemProps { item: Bus; index: number; isFavorite: boolean; isAuthenticated: boolean; onPress: (bus: Bus) => void; onToggleFavorite: (lineName: string) => void; onSaveBookmark: (bus: Bus) => void; } /** Individual route line item card in the catalog listing. @param props - Card data, index, and callback handlers. @returns JSX Element. |

## [HomeHeader.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/home/HomeHeader.tsx)
`mobile/src/components/home/HomeHeader.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `HomeHeader()` | `{   onOpenSidebar,   onOpenSettings, }` | @file HomeHeader.tsx @description Navigation bar for HomeScreen incorporating multi-tenant white-label branding, sidebar drawer trigger, and settings launcher. / import React from 'react'; import { View, Text, TouchableOpacity } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { useTheme } from '../../contexts/ThemeContext'; import { useI18n } from '../../contexts/I18nContext'; import { getTenantBranding, getTenantVocabulary, ACTIVE_TENANT } from '../../config/tenantConfig'; import { styles } from '../../styles/homeStyles'; interface HomeHeaderProps { onOpenSidebar: () => void; onOpenSettings: () => void; } /** Top header component rendering institutional tenant identity and actions. @param props - Navigation callback handlers. @returns JSX Element. |

## [BusDetailsSheet.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/map/BusDetailsSheet.tsx)
`mobile/src/components/map/BusDetailsSheet.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L40 | `BusDetailsSheet()` | `{   selectedBus,   onCloseBus,   routeDefinition,   busLine,   user,   isDark,   theme,   t,   isRTL,   savingRoute,   onSaveRoute, }: BusDetailsSheetProps` | Bottom sheet modal displaying selected vehicle details, stops, and ETA. |

## [MapFloatingHeader.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/map/MapFloatingHeader.tsx)
`mobile/src/components/map/MapFloatingHeader.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `MapFloatingHeader()` | `{   busLine,   activeBusCount,   onBack,   onSaveRoute,   onOpenSettings, }` | @file MapFloatingHeader.tsx @description Floating glassmorphic top navigation bar on the MapScreen, displaying transit line identity, active fleet count, and bookmark actions. / import React from 'react'; import { View, Text, TouchableOpacity } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import Animated, { FadeInUp } from 'react-native-reanimated'; import { useTheme } from '../../contexts/ThemeContext'; import { useI18n } from '../../contexts/I18nContext'; import { getTenantVocabulary, ACTIVE_TENANT } from '../../config/tenantConfig'; import { styles } from '../../styles/mapStyles'; interface MapFloatingHeaderProps { busLine: string; activeBusCount: number; onBack: () => void; onSaveRoute: () => void; onOpenSettings: () => void; } /** Top floating header bar component providing route metadata and quick actions. @param props - Header route data and action callbacks. @returns JSX Element. |

## [passengerMapHtml.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/map/passengerMapHtml.ts)
`mobile/src/components/map/passengerMapHtml.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `getMapHTML()` | `isDark: boolean` | Passenger Map HTML Template for Leaflet WebView Renders base map, active bus markers, and multi-point road itineraries with intermediate stops. |
| L41 | `interpolateRoad()` | `pts` | Local in-memory road curvature interpolation (zero external API calls) |
| L62 | `calcDistKm()` | `lat1, lng1, lat2, lng2` | Calculates distance between two coordinates in kilometers. |
| L163 | `updateBusMarkers()` | `busLocations` | --- Live Bus Markers --- |

## [Button.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/ui/Button.tsx)
`mobile/src/components/ui/Button.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L31 | `Button()` | `{   title,   onPress,   variant = 'primary',   size = 'medium',   loading = false,   disabled = false,   style,   textStyle,   icon, }` | Reusable animated button component with variant styling and loading spinners. |
| L48 | `handlePressIn()` | *none* | Triggers button press-in spring scale animation. |
| L56 | `handlePressOut()` | *none* | Triggers button press-out spring release animation. |
| L69 | `getVariantStyles()` | *none* | Resolves container background and border styles based on button variant. |
| L86 | `getTextStyles()` | *none* | Resolves typography color styles based on button variant. |
| L103 | `getSizeStyles()` | *none* | Resolves padding and dimension styles based on button size. |

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

## [tenantConfig.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/config/tenantConfig.ts)
`mobile/src/config/tenantConfig.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `getTenantBranding()` | `archetype: TenantArchetype = ACTIVE_TENANT` | @file tenantConfig.ts @description Centralized White-Label Multi-Tenant Configuration. Enables dynamic re-branding, custom color themes, company logos, and localized institutional vocabulary for public transit, private schools, universities, and corporate call center shuttles without modifying component code. / export type TenantArchetype = | 'public_transit' | 'school' | 'call_center' | 'university' | 'corporate_fleet'; export interface TenantBranding { /** Display name of the institution or transport service */ appName: string; /** Arabic display name */ appNameAr: string; /** Primary brand accent color (e.g., #2563EB for transit, #F59E0B for school) */ primaryColor: string; /** Secondary accent color */ secondaryColor: string; /** Header / Card background tint */ accentColor: string; /** Remote or local logo URL */ logoUrl?: string; /** Slogan or organization subtitle */ tagline: string; /** Arabic tagline */ taglineAr: string; } export interface TenantVocabulary { /** e.g. "Bus Line" vs "School Route" vs "Shift Shuttle" */ routeLabel: string; /** e.g. "Bus Stop" vs "Student Pickup" vs "Meeting Point" */ stopLabel: string; /** e.g. "Passenger" vs "Student" vs "Employee" */ passengerLabel: string; /** e.g. "Terminal Depot" vs "School Campus" vs "Corporate HQ" */ terminalLabel: string; /** e.g. "Start Terminal" vs "First Pickup" */ startPointLabel: string; /** e.g. "Destination" vs "School Destination" */ endPointLabel: string; /** e.g. "Driver" vs "School Bus Driver" vs "Captain" */ driverTitle: string; } export interface TenantProfile { archetype: TenantArchetype; branding: TenantBranding; en: TenantVocabulary; ar: TenantVocabulary; } /** Built-in institutional profile presets. / export const TENANT_PROFILES: Record<TenantArchetype, TenantProfile> = { public_transit: { archetype: 'public_transit', branding: { appName: 'Wasalt Transit', appNameAr: 'وصلت للنقل الجماعي', primaryColor: '#2563EB', secondaryColor: '#1D4ED8', accentColor: '#EFF6FF', tagline: 'Smart Public Transit & Fleet Operations', taglineAr: 'منظومة النقل والتتبع الذكي', }, en: { routeLabel: 'Bus Line', stopLabel: 'Bus Stop', passengerLabel: 'Passenger', terminalLabel: 'Terminal Depot', startPointLabel: 'Starting Station', endPointLabel: 'Destination Terminal', driverTitle: 'Transit Captain', }, ar: { routeLabel: 'خط الحافلة', stopLabel: 'محطة توقف', passengerLabel: 'راكب', terminalLabel: 'المحطة النهائية', startPointLabel: 'محطة البداية', endPointLabel: 'محطة الوصول', driverTitle: 'كابتن الحافلة', }, }, school: { archetype: 'school', branding: { appName: 'SchoolBus SafeTrip', appNameAr: 'باص المدرسة الآمن', primaryColor: '#F59E0B', secondaryColor: '#D97706', accentColor: '#FFFBEB', tagline: 'Safe Student Commute & Live Monitoring', taglineAr: 'متابعة حية لرحلات الطلاب المدرسية', }, en: { routeLabel: 'School Route', stopLabel: 'Student Pickup Point', passengerLabel: 'Student', terminalLabel: 'School Campus', startPointLabel: 'First Student Pickup', endPointLabel: 'School Campus Gate', driverTitle: 'School Bus Driver', }, ar: { routeLabel: 'خط المدرسة', stopLabel: 'نقطة تجمع الطلاب', passengerLabel: 'طالب', terminalLabel: 'مبنى المدرسة', startPointLabel: 'أول نقطة تجمع', endPointLabel: 'بوابة المدرسة', driverTitle: 'سائق الحافلة المدرسية', }, }, call_center: { archetype: 'call_center', branding: { appName: 'Corporate Shuttle Command', appNameAr: 'نظام النقل المؤسسي والورديات', primaryColor: '#059669', secondaryColor: '#047857', accentColor: '#ECFDF5', tagline: 'Employee Shift Shuttles & Operations Dispatch', taglineAr: 'إدارة ورديات الموظفين ونقل الشركات', }, en: { routeLabel: 'Shift Shuttle Line', stopLabel: 'Employee Pickup Station', passengerLabel: 'Employee', terminalLabel: 'Corporate Headquarters', startPointLabel: 'Route Departure Station', endPointLabel: 'Office Facility', driverTitle: 'Shuttle Operator', }, ar: { routeLabel: 'خط الوردية', stopLabel: 'نقطة استلام الموظف', passengerLabel: 'موظف', terminalLabel: 'المقر الرئيسي', startPointLabel: 'محطة التحرك', endPointLabel: 'مقر العمل', driverTitle: 'سائق الوردية', }, }, university: { archetype: 'university', branding: { appName: 'Campus Transit', appNameAr: 'نقل الحرم الجامعي', primaryColor: '#7C3AED', secondaryColor: '#6D28D9', accentColor: '#F5F3FF', tagline: 'University Shuttle & Inter-Campus Network', taglineAr: 'شبكة خطوط الحرم الجامعي والمحطات', }, en: { routeLabel: 'Campus Line', stopLabel: 'Campus Station', passengerLabel: 'Student / Staff', terminalLabel: 'University Gate', startPointLabel: 'Metro / Hub Station', endPointLabel: 'University Campus', driverTitle: 'Campus Driver', }, ar: { routeLabel: 'خط الحرم الجامعي', stopLabel: 'محطة الجامعة', passengerLabel: 'طالب / عضو هيئة', terminalLabel: 'بوابة الجامعة', startPointLabel: 'محطة التجمع', endPointLabel: 'الحرم الجامعي', driverTitle: 'سائق حافلة الجامعة', }, }, corporate_fleet: { archetype: 'corporate_fleet', branding: { appName: 'Fleet Logistics', appNameAr: 'لوجستيات الأسطول', primaryColor: '#0EA5E9', secondaryColor: '#0284C7', accentColor: '#F0F9FF', tagline: 'Enterprise Passenger Fleet Telematics', taglineAr: 'إدارة ومتابعة أساطيل النقل الخاص', }, en: { routeLabel: 'Fleet Route', stopLabel: 'Waypoint Station', passengerLabel: 'Client / Passenger', terminalLabel: 'Operations Depot', startPointLabel: 'Dispatch Point', endPointLabel: 'Terminal Destination', driverTitle: 'Fleet Captain', }, ar: { routeLabel: 'مسار الأسطول', stopLabel: 'محطة المرور', passengerLabel: 'عميل / راكب', terminalLabel: 'مركز العمليات', startPointLabel: 'نقطة الانطلاق', endPointLabel: 'وجهة الوصول', driverTitle: 'قائد الأسطول', }, }, }; /** Global default tenant configuration. To re-theme the app for a school or corporate client, simply adjust this archetype! / export const ACTIVE_TENANT: TenantArchetype = 'public_transit'; /** Retrieves the branding tokens for a given archetype. @param archetype - Target tenant archetype or default active tenant. @returns Complete branding configuration including primary colors and app names. |
| L231 | `getTenantVocabulary()` | `isRTL: boolean,   archetype: TenantArchetype = ACTIVE_TENANT` | Retrieves the localized vocabulary mapping for the specified tenant. @param isRTL - Whether the user interface is currently in Arabic (RTL). @param archetype - Target tenant archetype or default active tenant. @returns Localized nomenclature for routes, stops, terminals, and passengers. |

## [AuthContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/contexts/AuthContext.tsx)
`mobile/src/contexts/AuthContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L30 | `useAuth()` | *none* | Accesses the current user authentication state and methods. |
| L41 | `AuthProvider()` | `{ children }: { children: React.ReactNode }` | Provides authentication state and user session context to child components. |
| L62 | `signIn()` | `email: string, password: string` | Signs in a user with email and password via Firebase Auth. |
| L88 | `signUp()` | `email: string, password: string, username: string` | Registers a new user account with email, password, and username. |
| L103 | `signInWithGoogle()` | *none* | Initiates Google OAuth single sign-on authentication. @suggestion [INTEGRATE]: If Google SSO is required for commuters, configure native Google Sign-In credentials in app.json and wire a button in LoginScreen.tsx, or remove if Email/Password and Apple SSO suffice. |
| L112 | `signInWithApple()` | *none* | Initiates Apple ID OAuth single sign-on authentication. |
| L148 | `resetPassword()` | `email: string` | Sends a password reset email to the specified address. |
| L159 | `logout()` | *none* | Signs out the currently authenticated user. |

## [I18nContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/contexts/I18nContext.tsx)
`mobile/src/contexts/I18nContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L256 | `I18nProvider()` | `{ children }: { children: React.ReactNode }` | Provides localization dictionaries and RTL layout direction context. |
| L289 | `useI18n()` | *none* | Accesses translation helper `t` and RTL status boolean. |

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
| L65 | `ThemeProvider()` | `{ children }: { children: React.ReactNode }` | Provides application color scheme and theme mode (light/dark). |
| L100 | `useTheme()` | *none* | Accesses current theme tokens, color palette, and mode toggle. |

## [UserTypeContext.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/contexts/UserTypeContext.tsx)
`mobile/src/contexts/UserTypeContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `UserTypeProvider()` | `{ children }: { children: React.ReactNode }` | Provides user role state (passenger, driver) to child components. |
| L33 | `setUserType()` | `type: Exclude<UserType, null>` | Updates and persists active user role selection. |
| L41 | `clearUserType()` | *none* | Clears the active user role selection from state. @suggestion [DELETE]: Unused across the application; switching roles or logging out utilizes setUserType() or AuthContext.logout(). Can be safely deleted once confirmed. |
| L59 | `useUserType()` | *none* | Accesses the active user role selection. |

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
| L128 | `startSharing()` | *none* | Starts high-frequency GPS tracking and RTDB telemetry sync. / /** Coordinates driver trip initiation, hardware GPS acquisition, initial RTDB sync, and location stream subscription. |
| L257 | `stopSharing()` | *none* | Prompts driver to end trip, detaches GPS watcher, and removes ephemeral RTDB telematics. |
| L288 | `handleSendSOS()` | *none* | Dispatches instant distress beacon to operations command. |

## [useHomeBuses.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/hooks/useHomeBuses.ts)
`mobile/src/hooks/useHomeBuses.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `useHomeBuses()` | `{ userId, userCoords, isRTL }: UseHomeBusesProps` | @file useHomeBuses.ts @description State hook managing bus catalog lines, active live vehicles, real-time Firebase RTDB listeners, geodesic ETA telemetry, search filtering, and user bookmarks. / import { useState, useEffect, useCallback } from 'react'; import { database } from '../config/firebase'; import { ref, onValue, off } from 'firebase/database'; import { saveToHistory } from '../utils/historyUtils'; import { listenToFavorites, toggleFavorite } from '../utils/favoritesUtils'; import { calculateDistanceKm, calculateBearing, getDirectionName, calculateTimeToArrival, } from '../utils/geoUtils'; /** Catalog route bus line definition. / export interface Bus { id: string; lineName: string; companyName: string; activeBusCount: number; eta?: string; latitude?: number; longitude?: number; distance?: number; direction?: string; timeToArrival?: string; } /** Live active vehicle telemetry record. / export interface ActiveBus { id: string; lineName: string; driverId: string; latitude: number; longitude: number; lastUpdated: string; distance?: number; direction?: string; timeToArrival?: string; driverName?: string; } interface UseHomeBusesProps { userId?: string | null; userCoords?: { latitude: number; longitude: number } | null; isRTL: boolean; } /** Hook to manage live bus discovery, catalog filtering, and RTDB telemetry synchronization. @param props - User context and coordinate props. @returns State and handlers for HomeScreen. |

## [useMapBuses.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/hooks/useMapBuses.ts)
`mobile/src/hooks/useMapBuses.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `useMapBuses()` | `{ busLine, userCoords, isRTL }: UseMapBusesProps` | @file useMapBuses.ts @description Hook managing real-time vehicle telemetry, line route geometry, closest bus auto-selection, and Firebase RTDB listeners for MapScreen. / import { useState, useEffect } from 'react'; import { database } from '../config/firebase'; import { ref, onValue, off } from 'firebase/database'; import { BusLocation } from '../components/map/BusDetailsSheet'; import { calculateDistanceKm, calculateBearing, getDirectionName, calculateTimeToArrival, } from '../utils/geoUtils'; interface UseMapBusesProps { busLine: string; userCoords: { latitude: number; longitude: number } | null; isRTL: boolean; } /** Custom hook providing live vehicle telemetry and route definition for a specific transit line. @param props - Transit line name, user coordinates, and RTL flag. @returns State properties and selection handlers. |

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
| L1 | `DriverHomeScreen()` | *none* | @file DriverHomeScreen.tsx @description Driver operations dashboard coordinator screen. Orchestrates live GPS telemetry broadcasting, cockpit speed metrics, multi-stop itinerary timeline, SafeTrip WebRTC emergency camera monitoring, and white-label multi-tenant institution customization. / import React, { useRef, useState } from "react"; import { Alert, KeyboardAvoidingView, Platform, ScrollView, } from "react-native"; import { SafeAreaView } from "react-native-safe-area-context"; import { useCameraPermissions, useMicrophonePermissions } from "expo-camera"; import { useTheme } from "../contexts/ThemeContext"; import { useI18n } from "../contexts/I18nContext"; import { useAuth } from "../contexts/AuthContext"; import { clearDriverSession } from "../utils/driverStorage"; import { useDriverSafetyStream } from "../utils/driverSafetyStream"; import { getTenantBranding, getTenantVocabulary, ACTIVE_TENANT } from "../config/tenantConfig"; Modular Hooks import { useDriverProfile } from "../hooks/useDriverProfile"; import { useDriverTripState } from "../hooks/useDriverTripState"; Modular Presentation Components import { DriverHeader } from "../components/driver/DriverHeader"; import { DriverTripCard } from "../components/driver/DriverTripCard"; import { DriverSafetyOverlay } from "../components/driver/DriverSafetyOverlay"; import { DriverRouteTimeline } from "../components/driver/DriverRouteTimeline"; import { CompanyPickerModal } from "../components/driver/DriverModals"; import SettingsModal from "../components/SettingsModal"; Modular Layout Styles import { layoutStyles } from "../styles/driverHomeStyles"; /** Main Driver Portal Screen Component. |
| L77 | `ensureSafetyPermissions()` | *none* | Checks and requests camera & mic permissions |
| L130 | `handleLogout()` | *none* | Handles safe session logout |

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
| L1 | `HomeScreen()` | *none* | @file HomeScreen.tsx @description Primary commuter discovery screen coordinator. Orchestrates live active fleet discovery, catalog browsing, real-time search, geodesic proximity calculations, and multi-tenant institutional branding. / import React, { useState } from 'react'; import { View, Text, FlatList, Alert, RefreshControl, SafeAreaView, } from 'react-native'; import { useNavigation } from '@react-navigation/native'; import { useAuth } from '../contexts/AuthContext'; import { useLocation } from '../contexts/LocationContext'; import { useTheme } from '../contexts/ThemeContext'; import { useI18n } from '../contexts/I18nContext'; Modular UI Components & Hook import { useHomeBuses, Bus, ActiveBus } from '../hooks/useHomeBuses'; import { HomeHeader } from '../components/home/HomeHeader'; import { BusCardItem } from '../components/home/BusCardItem'; import { ActiveBusCardItem } from '../components/home/ActiveBusCardItem'; import { ActiveBusModal } from '../components/home/ActiveBusModal'; import SidebarMenu from '../components/SidebarMenu'; import SettingsModal from '../components/SettingsModal'; import { Input } from '../components/ui/Input'; import { styles } from '../styles/homeStyles'; /** Commuter home screen providing real-time bus and shuttle discovery. @returns JSX Element. |
| L74 | `handleBusPress()` | `bus: Bus` | Navigates to MapScreen if line has active vehicles, or displays alert if none. |
| L91 | `handleSaveBookmark()` | `bus: Bus` | Bookmarks route and provides user feedback toast/alert. |
| L106 | `handleOpenMapForActiveBus()` | `activeBus: ActiveBus` | Launches MapScreen focused on a selected active vehicle. |

## [LoginScreen.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/LoginScreen.tsx)
`mobile/src/screens/LoginScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `LoginScreen()` | *none* | @file LoginScreen.tsx @description Primary authentication screen coordinator. Orchestrates commuter & driver login, registration, Apple SSO, password recovery, dynamic company assignment, and institutional white-labeling. / import React from "react"; import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, } from "react-native"; import { Ionicons } from "@expo/vector-icons"; import Animated, { FadeInDown } from "react-native-reanimated"; import { useI18n } from "../contexts/I18nContext"; import { useTheme } from "../contexts/ThemeContext"; import { getTenantBranding, getTenantVocabulary, ACTIVE_TENANT } from "../config/tenantConfig"; Modular Hook & Components import { useAuthForm } from "../hooks/useAuthForm"; import { AuthHeader } from "../components/auth/AuthHeader"; import { UserTypeToggle } from "../components/auth/UserTypeToggle"; import { DriverCompanyPicker } from "../components/auth/DriverCompanyPickerModal"; import { ForgotPasswordModal } from "../components/auth/ForgotPasswordModal"; import { Input } from "../components/ui/Input"; import { Button } from "../components/ui/Button"; Styles import { styles } from "../styles/loginStyles"; /** Main User & Driver Authentication Screen. |

## [MapScreen.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/MapScreen.tsx)
`mobile/src/screens/MapScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `MapScreen()` | *none* | @file MapScreen.tsx @description Primary commuter live map tracking coordinator screen. Orchestrates real-time Leaflet WebView rendering, GPS telemetry updates, multi-stop route geometry polylines, vehicle selection, and bookmarking. / import React, { useState, useEffect, useRef } from 'react'; import { View, Alert } from 'react-native'; import { WebView } from 'react-native-webview'; import { useRoute, useNavigation } from '@react-navigation/native'; import { useLocation } from '../contexts/LocationContext'; import { useAuth } from '../contexts/AuthContext'; import { useTheme } from '../contexts/ThemeContext'; import { useI18n } from '../contexts/I18nContext'; import { saveToHistory } from '../utils/historyUtils'; Modular Presentation & State Layers import { getMapHTML } from '../components/map/passengerMapHtml'; import BusDetailsSheet, { BusLocation } from '../components/map/BusDetailsSheet'; import SettingsModal from '../components/SettingsModal'; import { MapFloatingHeader } from '../components/map/MapFloatingHeader'; import { useMapBuses } from '../hooks/useMapBuses'; import { injectBusLocations, injectUserLocation, injectUserToBusRoute, injectFullRouteWithStops, } from '../utils/mapBridgeUtils'; import { styles } from '../styles/mapStyles'; /** Commuter interactive map screen displaying active vehicle fleet and route corridor. @returns JSX Element. |
| L105 | `handleSaveRoute()` | `line: string, destination: string` | Saves route to user history with feedback notifications. |

## [RoleSelectionScreen.tsx](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/RoleSelectionScreen.tsx)
`mobile/src/screens/RoleSelectionScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `RoleCard()` | `{    title,    iconName,    onPress,    delay,   theme  }: {    title: string;    iconName: keyof typeof Ionicons.glyphMap;    onPress: (` | Interactive card representing a selectable system user role. |
| L58 | `RoleSelectionScreen()` | *none* | Initial landing screen allowing selection between Passenger or Driver. |
| L67 | `choose()` | `type: 'passenger' | 'driver'` | Selects a system role and navigates to the respective portal. |

## [bidirectionalAStar.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/bidirectionalAStar.ts)
`mobile/src/utils/bidirectionalAStar.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `hF()` | `id: string` | @file bidirectionalAStar.ts @description In-memory, high-performance Bidirectional A* Graph Routing Engine for Egypt. Evaluates paths simultaneously forward from start and backward from goal, cutting node expansions by 50-70% and computing turn-by-turn routes in single-digit milliseconds. / import { calculateDistanceKm } from './geoUtils'; export interface RouteCoord { lat: number; lng: number; } export interface GraphEdge { t: string; // target node id d: number; // distance in km s: number; // speed limit in km/h } export interface GraphNode { id: string; lat: number; lng: number; adj: GraphEdge[]; } export interface BidirectionalRouteResult { coordinates: [number, number][]; distanceKm: number; durationMin: number; isFallback: boolean; } /** Min-Heap priority queue for fast O(log N) node extraction. / class PriorityQueue<T> { private heap: Array<{ item: T; priority: number }> = []; push(item: T, priority: number): void { this.heap.push({ item, priority }); this.bubbleUp(this.heap.length - 1); } pop(): T | undefined { if (this.heap.length === 0) return undefined; const top = this.heap[0].item; const bottom = this.heap.pop(); if (this.heap.length > 0 && bottom !== undefined) { this.heap[0] = bottom; this.bubbleDown(0); } return top; } isEmpty(): boolean { return this.heap.length === 0; } peekPriority(): number { return this.heap.length > 0 ? this.heap[0].priority : Infinity; } private bubbleUp(idx: number): void { while (idx > 0) { const parentIdx = Math.floor((idx - 1) / 2); if (this.heap[idx].priority >= this.heap[parentIdx].priority) break; const tmp = this.heap[idx]; this.heap[idx] = this.heap[parentIdx]; this.heap[parentIdx] = tmp; idx = parentIdx; } } private bubbleDown(idx: number): void { const length = this.heap.length; while (true) { let left = 2 * idx + 1; let right = 2 * idx + 2; let smallest = idx; if (left < length && this.heap[left].priority < this.heap[smallest].priority) { smallest = left; } if (right < length && this.heap[right].priority < this.heap[smallest].priority) { smallest = right; } if (smallest === idx) break; const tmp = this.heap[idx]; this.heap[idx] = this.heap[smallest]; this.heap[smallest] = tmp; idx = smallest; } } } /** High-performance Bidirectional A* Router. / export class BidirectionalAStarRouter { private nodesMap = new Map<string, GraphNode>(); private isLoaded = false; constructor(initialNodes?: GraphNode[]) { if (initialNodes && initialNodes.length > 0) { this.loadNodes(initialNodes); } } /** Populate graph with nodes and adjacency lists. / loadNodes(nodes: GraphNode[]): void { this.nodesMap.clear(); for (const n of nodes) { this.nodesMap.set(n.id, n); } this.isLoaded = true; } /** Find nearest graph node to given coordinates. / findNearestNode(coord: RouteCoord): GraphNode | null { let bestDist = Infinity; let bestNode: GraphNode | null = null; for (const node of this.nodesMap.values()) { const d = calculateDistanceKm(coord.lat, coord.lng, node.lat, node.lng); if (d < bestDist) { bestDist = d; bestNode = node; if (d < 0.05) break; // < 50m is an exact snap } } return bestNode; } /** Executes Bidirectional A* search from start to goal. / findPath(startCoord: RouteCoord, goalCoord: RouteCoord): BidirectionalRouteResult { const directDist = calculateDistanceKm(startCoord.lat, startCoord.lng, goalCoord.lat, goalCoord.lng); If start & goal are very close or graph is empty, return direct line if (directDist < 0.2 || this.nodesMap.size === 0) { return this.buildDirectRoute(startCoord, goalCoord, directDist); } const startNode = this.findNearestNode(startCoord); const goalNode = this.findNearestNode(goalCoord); if (!startNode || !goalNode || startNode.id === goalNode.id) { return this.buildDirectRoute(startCoord, goalCoord, directDist); } Initialize Bidirectional A* structures const forwardPQ = new PriorityQueue<string>(); const backwardPQ = new PriorityQueue<string>(); const distF = new Map<string, number>(); const distB = new Map<string, number>(); const parentF = new Map<string, string>(); const parentB = new Map<string, string>(); const settledF = new Set<string>(); const settledB = new Set<string>(); distF.set(startNode.id, 0); distB.set(goalNode.id, 0); /** Forward Euclidean distance heuristic to goal. |
| L179 | `hB()` | `id: string` | Backward Euclidean distance heuristic to start. |

## [driverSafetyStream.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/driverSafetyStream.ts)
`mobile/src/utils/driverSafetyStream.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `useDriverSafetyStream()` | `{   user,   driverName = 'Driver',   cameraRef,   isRTL = false,   onSessionStart,   onSessionEnd, }: UseDriverSafetyStreamOptions` | Wasalt SafeTrip™ - Driver Safety Stream Controller & Hook Standalone service managing WebRTC P2P 30 FPS video & audio signaling, remote admin consent inspection, and zero-cost Firebase RTDB token exchange. / import { useEffect, useRef, useState, useCallback } from 'react'; import { Alert } from 'react-native'; import { ref, set, onValue, off, remove } from 'firebase/database'; import { database } from '../config/firebase'; import { getWebRtcBroadcasterHtml } from './webrtcBroadcasterHtml'; export type MediaRequestKind = 'audio' | 'video' | 'both'; export type MediaRequestStatus = 'pending' | 'accepted' | 'declined' | 'closed'; export interface DriverMediaRequestData { kind: MediaRequestKind; status: MediaRequestStatus; requestedAt: string; requestedBy: string; respondedAt?: string; driverUid?: string; } export interface UseDriverSafetyStreamOptions { user: { uid: string; email?: string | null; displayName?: string | null } | null; driverName?: string; cameraRef?: React.RefObject<any>; isRTL?: boolean; onSessionStart?: () => void; onSessionEnd?: () => void; } export interface UseDriverSafetyStreamResult { pendingRequest: DriverMediaRequestData | null; isStreaming: boolean; activeSession: DriverMediaRequestData | null; acceptRequest: () => Promise<void>; declineRequest: () => Promise<void>; endStream: () => Promise<void>; webrtcHtml: string; webViewRef: React.RefObject<any>; onWebViewMessage: (event: any) => void; } /** React Hook for Driver Handsets: Manages SafeTrip consent requests and WebRTC P2P signaling via Firebase RTDB. |

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
| L2 | `computeLocalRoadRoute()` | `waypoints: RouteWaypoint[]` | @file localRoutingEngine.ts @description Embedded client-side transit routing engine for mobile commuter maps. Calculates turn-by-turn road curves, distances, and travel times offline with 0 cloud dependencies. / import { calculateDistanceKm } from './geoUtils'; export interface RouteWaypoint { lat: number; lng: number; name?: string; } export interface LocalRouteResult { coordinates: [number, number][]; distanceKm: number; durationMin: number; isFallback: boolean; } interface RoadNode { id: string; lat: number; lng: number; name: string; } const EGYPT_ARTERY_NODES: RoadNode[] = [ { id: 'rr_maadi', lat: 29.9744, lng: 31.2800, name: 'Ring Road / Autostrad Maadi' }, { id: 'rr_muneeb', lat: 29.9961, lng: 31.2183, name: 'Ring Road / Muneeb Giza' }, { id: 'rr_maryouteya', lat: 29.9889, lng: 31.1444, name: 'Ring Road / Maryouteya' }, { id: 'rr_wahat', lat: 29.9700, lng: 31.0200, name: 'Wahat Road / 6th Oct Junction' }, { id: 'rr_mehwar_26', lat: 30.0478, lng: 31.1456, name: '26th July Corridor / Ring Rd' }, { id: 'rr_waraq', lat: 30.0989, lng: 31.2056, name: 'Ring Road / Waraq Bridge' }, { id: 'rr_qalyoub', lat: 30.1417, lng: 31.2472, name: 'Ring Road / Alex Agricultural' }, { id: 'rr_musturad', lat: 30.1361, lng: 31.3028, name: 'Ring Road / Musturad' }, { id: 'rr_salam', lat: 30.1633, lng: 31.4328, name: 'Ring Road / El Salam & Ismailia' }, { id: 'rr_suez', lat: 30.0767, lng: 31.4367, name: 'Ring Road / Cairo-Suez Highway' }, { id: 'rr_new_cairo', lat: 30.0150, lng: 31.4389, name: 'Ring Road / 90th St Axis' }, { id: 'rr_katameya', lat: 29.9889, lng: 31.3650, name: 'Ring Road / Ain Sokhna Axis' }, { id: 'tahrir_hub', lat: 30.0444, lng: 31.2357, name: 'Tahrir Square' }, { id: 'ramses_hub', lat: 30.0626, lng: 31.2469, name: 'Ramses Square' }, { id: 'giza_sq', lat: 30.0131, lng: 31.2089, name: 'Giza Square' }, { id: 'lebanon_sq', lat: 30.0610, lng: 31.2017, name: 'Lebanon Square' }, { id: 'abbasiya_sq', lat: 30.0667, lng: 31.2833, name: 'Abbasiya Square' }, { id: 'nasr_city_makram', lat: 30.0561, lng: 31.3300, name: 'Makram Ebeid Nasr City' }, { id: 'nasr_city_ecu', lat: 30.0345, lng: 31.3588, name: 'ECU Campus Nasr City' }, { id: 'heliopolis_korba', lat: 30.0906, lng: 31.3258, name: 'Korba Heliopolis' }, { id: 'new_cairo_90th', lat: 30.0247, lng: 31.4361, name: '90th Street New Cairo' }, { id: 'new_cairo_auc', lat: 30.0194, lng: 31.4994, name: 'AUC New Cairo' }, { id: 'oct_hosary', lat: 29.9739, lng: 30.9525, name: 'Hosary Mosque 6th Oct' }, { id: 'zayed_hyper', lat: 30.0433, lng: 31.0261, name: 'Hyper One Sheikh Zayed' }, { id: 'smart_village', lat: 30.0744, lng: 31.0189, name: 'Smart Village' } ]; function findNearestArteryNode(lat: number, lng: number): RoadNode { let closest = EGYPT_ARTERY_NODES[0]; let minDist = calculateDistanceKm(lat, lng, closest.lat, closest.lng); for (let i = 1; i < EGYPT_ARTERY_NODES.length; i++) { const node = EGYPT_ARTERY_NODES[i]; const dist = calculateDistanceKm(lat, lng, node.lat, node.lng); if (dist < minDist) { minDist = dist; closest = node; } } return closest; } function interpolateRoadCurve( p0: [number, number], p1: [number, number], p2: [number, number], p3: [number, number], steps: number = 6 ): [number, number][] { const points: [number, number][] = []; for (let t = 0; t <= 1; t += 1 / steps) { const t2 = t * t; const t3 = t2 * t; const lat = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3); const lng = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3); points.push([lat, lng]); } return points; } /** Computes an offline, road-following transit polyline, distance, and duration across arbitrary waypoints. @param waypoints - Sequence of GPS waypoints along the route. @returns Local route result with polyline geometry, distance in km, and duration in minutes. |

## [mapBridgeUtils.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/mapBridgeUtils.ts)
`mobile/src/utils/mapBridgeUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `injectBusLocations()` | `webViewRef: React.RefObject<WebView | null>,   locations: BusLocation[]` | @file mapBridgeUtils.ts @description Injects real-time vehicle telemetry, user GPS coordinates, and full multi-stop route geometries into the Leaflet WebView instance. / import React from 'react'; import { WebView } from 'react-native-webview'; import { BusLocation } from '../components/map/BusDetailsSheet'; /** Injects updated active vehicle locations into the Leaflet map runtime. @param webViewRef - Reference to the active WebView component. @param locations - Array of active bus location telemetry points. |
| L31 | `injectUserLocation()` | `webViewRef: React.RefObject<WebView | null>,   latitude: number,   longitude: number` | Injects current user GPS position into the Leaflet map runtime. @param webViewRef - Reference to the active WebView component. @param latitude - User latitude. @param longitude - User longitude. |
| L53 | `injectUserToBusRoute()` | `webViewRef: React.RefObject<WebView | null>,   userLat: number,   userLng: number,   busLat: number,   busLng: number` | Injects direct transit polyline between commuter location and selected vehicle. @param webViewRef - Reference to the active WebView component. @param userLat - User latitude. @param userLng - User longitude. @param busLat - Vehicle latitude. @param busLng - Vehicle longitude. |
| L79 | `injectFullRouteWithStops()` | `webViewRef: React.RefObject<WebView | null>,   routeDef: any,   activeBus?: any` | Injects full route road geometry and intermediate mandatory stop waypoints. @param webViewRef - Reference to the active WebView component. @param routeDef - Route definition containing start, end, and stops. @param activeBus - Optional active vehicle to anchor Point A dynamically. |

## [webrtcBroadcasterHtml.ts](file:////home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/utils/webrtcBroadcasterHtml.ts)
`mobile/src/utils/webrtcBroadcasterHtml.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `getWebRtcBroadcasterHtml()` | *none* | Wasalt SafeTrip™ - WebRTC Broadcaster HTML Engine Embedded into React Native WebView for hardware-accelerated 30 FPS video and low-latency Opus audio streaming with zero custom native compilation. |
| L56 | `sendToNative()` | `data` | Sends WebRTC signaling messages from WebView to native React Native layer. |
| L65 | `updateStatus()` | `text, color, isError` | Updates status display banner in the WebRTC stream monitor. |
| L78 | `initWebRtc()` | *none* | Initializes WebRTC peer connection and media stream acquisition. |
| L165 | `handleAdminMessage()` | `event` | Processes incoming signaling data messages from dispatch admin. |

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
