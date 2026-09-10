# Automated Functions Catalog (`functions.md`)

> **Note:** This file is automatically compiled by `scripts/generate_functions_doc.py`.
> Do not manually edit this file. Keep inline docstrings updated in the source code.

**Total Documented Functions:** 283

---

## [App.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/App.tsx)
`admin/src/App.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L21 | `App()` | *none* | No description provided. |

## [Modal.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/components/common/Modal.tsx)
`admin/src/components/common/Modal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L22 | `handleKeyDown()` | `e: KeyboardEvent` | No description provided. |

## [AddBusLineModal.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/components/companies/AddBusLineModal.tsx)
`admin/src/components/companies/AddBusLineModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L29 | `handleSubmit()` | `e: React.FormEvent` | No description provided. |

## [LineManagerModal.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/components/companies/LineManagerModal.tsx)
`admin/src/components/companies/LineManagerModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L26 | `handleAddLine()` | `e: React.FormEvent` | No description provided. |
| L47 | `handleStartRename()` | `line: string` | No description provided. |
| L52 | `handleSaveRename()` | `oldLine: string` | No description provided. |
| L71 | `handleDeleteLine()` | `lineToDelete: string` | No description provided. |

## [DriverAssignModal.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/components/drivers/DriverAssignModal.tsx)
`admin/src/components/drivers/DriverAssignModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L31 | `handleToggleLine()` | `line: string` | No description provided. |
| L39 | `handleSave()` | *none* | No description provided. |

## [DriverTable.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/components/drivers/DriverTable.tsx)
`admin/src/components/drivers/DriverTable.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L24 | `handleCopy()` | `uid: string` | No description provided. |

## [BusEditorModal.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/components/fleet/BusEditorModal.tsx)
`admin/src/components/fleet/BusEditorModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L36 | `handlePointsSelected()` | `start: { lat: number; lng: number; address: string },     end: { lat: number; lng: number; address: string }` | No description provided. |
| L48 | `handleSubmit()` | `e: React.FormEvent` | No description provided. |

## [FleetMap.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/components/map/FleetMap.tsx)
`admin/src/components/map/FleetMap.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L265 | `handleResetView()` | *none* | No description provided. |
| L271 | `handleFitAll()` | *none* | No description provided. |

## [RoutePickerMap.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/components/map/RoutePickerMap.tsx)
`admin/src/components/map/RoutePickerMap.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L88 | `handleClick()` | `e: L.LeafletMouseEvent` | No description provided. |
| L113 | `applyPreset()` | `landmark: { name: string; lat: number; lng: number }` | No description provided. |

## [DriverSafetyMediaModal.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/components/modals/DriverSafetyMediaModal.tsx)
`admin/src/components/modals/DriverSafetyMediaModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L102 | `handleSendRequest()` | `kind: MediaRequestKind` | No description provided. |
| L115 | `handleEndSession()` | *none* | No description provided. |
| L127 | `handleSimulateConsent()` | `approved: boolean` | No description provided. |
| L136 | `formatTimer()` | `s: number` | No description provided. |
| L143 | `switchToActiveDriver()` | *none* | No description provided. |

## [DriverSafetyVideoViewport.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/components/modals/DriverSafetyVideoViewport.tsx)
`admin/src/components/modals/DriverSafetyVideoViewport.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L51 | `toggleLocalWebcam()` | *none* | No description provided. |

## [AuthContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/contexts/AuthContext.tsx)
`admin/src/contexts/AuthContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L28 | `resolveRole()` | `email: string` | No description provided. |
| L74 | `loginMasterAdmin()` | `username: string,     pass: string,     otpToken: string,     rememberMe: boolean` | Master Admin Login requiring Username, Password, and Authenticator App OTP. |
| L120 | `loginWithFirebase()` | `email: string, pass: string, rememberMe: boolean` | Company Dispatcher login via Firebase Auth. |
| L139 | `logout()` | *none* | No description provided. |
| L157 | `useAdminAuth()` | *none* | No description provided. |

## [CompaniesPage.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/pages/CompaniesPage.tsx)
`admin/src/pages/CompaniesPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L67 | `getBusCount()` | `companyId: string` | No description provided. |
| L71 | `handleCreateCompany()` | `e: React.FormEvent` | No description provided. |
| L97 | `handleDeleteCompany()` | `companyId: string` | No description provided. |
| L108 | `handleDeleteLine()` | `companyId: string, lineName: string` | No description provided. |
| L119 | `handleStartRename()` | `compKey: string, currentName: string` | No description provided. |
| L124 | `handleSaveRename()` | `companyId: string, oldName: string` | No description provided. |

## [DashboardPage.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/pages/DashboardPage.tsx)
`admin/src/pages/DashboardPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L28 | `handleForceStopSession()` | `lineId: string, driverUid: string` | No description provided. |

## [DriversPage.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/pages/DriversPage.tsx)
`admin/src/pages/DriversPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L32 | `handleSaveAssignments()` | `driverUid: string, companyId: string, lines: string[]` | No description provided. |
| L37 | `handleDeleteDriver()` | `driverUid: string, driverName: string` | No description provided. |
| L48 | `handleCreateDriver()` | `e: React.FormEvent` | No description provided. |

## [FleetPage.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/pages/FleetPage.tsx)
`admin/src/pages/FleetPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L21 | `handleToggle()` | `companyId: string, busId: string, currentActive: boolean` | No description provided. |
| L30 | `handleDelete()` | `companyId: string, busId: string` | No description provided. |
| L41 | `handleOpenNew()` | *none* | No description provided. |
| L46 | `handleOpenEdit()` | `bus: BusRouteDefinition` | No description provided. |

## [LoginPage.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/pages/LoginPage.tsx)
`admin/src/pages/LoginPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L21 | `handleCopySecret()` | *none* | No description provided. |
| L28 | `handleSubmit()` | `e: React.FormEvent` | No description provided. |

## [PassengersPage.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/pages/PassengersPage.tsx)
`admin/src/pages/PassengersPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L34 | `handleCopyUid()` | `uid: string` | No description provided. |
| L41 | `handleClearHistory()` | `uid: string` | No description provided. |
| L55 | `handleDeleteUser()` | `uid: string, name: string` | No description provided. |

## [SecurityPage.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/pages/SecurityPage.tsx)
`admin/src/pages/SecurityPage.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L15 | `handleCleanDuplicateBrt()` | *none* | No description provided. |

## [busesService.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/services/busesService.ts)
`admin/src/services/busesService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `subscribeAllBuses()` | `callback: (buses: BusRouteDefinition[]` | Subscribes to buses for all companies in the Realtime Database. |
| L51 | `saveBus()` | `companyId: string, bus: BusRouteDefinition` | Saves or updates a bus in /companies/<companyId>/buses/<busId>. Automatically ensures the assigned lineId is synchronized with the company's busLines list. |
| L84 | `toggleBusActive()` | `companyId: string, busId: string, isActive: boolean` | Toggles a bus operational active/idle flag. |
| L92 | `deleteBus()` | `companyId: string, busId: string` | Deletes a bus from /companies/<companyId>/buses/<busId>. |

## [companiesService.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/services/companiesService.ts)
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

## [driverMediaService.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/services/driverMediaService.ts)
`admin/src/services/driverMediaService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `requestDriverMedia()` | `driverUid: string,   kind: MediaRequestKind,   adminEmail: string` | Dispatches a remote camera/microphone safety check request to a driver's mobile device. Writes to /driverControls/<driverUid>/mediaRequest adhering to SafeTrip protocol. |
| L26 | `subscribeToDriverMediaRequest()` | `driverUid: string,   callback: (request: DriverMediaRequest | null` | Listens in real time to the driver's consent state and safety check stream status. |
| L64 | `subscribeToDriverMediaStream()` | `driverUid: string,   callback: (stream: DriverMediaStream | null` | Subscribes to the live incoming video/audio stream frames from the driver's mobile handset. Listens to /driverControls/<driverUid>/mediaStream. |
| L92 | `closeDriverMediaRequest()` | `driverUid: string` | Terminates an active or pending safety stream check session. |
| L103 | `simulateDriverResponse()` | `driverUid: string, approved: boolean` | Diagnostic/Simulation Helper: Simulates the mobile driver tapping 'Accept' or 'Decline' in the SafeTrip prompt. Enables live stream interface verification in offline testing environments. |

## [driversService.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/services/driversService.ts)
`admin/src/services/driversService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `subscribeDrivers()` | `callback: (drivers: DriverProfile[]` | Subscribes to driver directory in Realtime Database. |
| L36 | `updateDriverLines()` | `driverUid: string, lines: string[]` | Updates assigned bus lines for a specific driver. |
| L44 | `updateDriverCompany()` | `driverUid: string, companyId: string` | Updates assigned company for a driver. |
| L52 | `saveDriverProfile()` | `driver: DriverProfile` | Saves or provisions a driver profile in RTDB. |
| L65 | `removeDriverProfile()` | `driverUid: string` | Removes a driver record from RTDB. |

## [telemetryService.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/services/telemetryService.ts)
`admin/src/services/telemetryService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `subscribeLiveTelemetry()` | `callback: (locations: LiveBusLocation[]` | Subscribes to live high-frequency bus locations broadcasted by active drivers. |
| L55 | `terminateLiveSession()` | `lineId: string, driverUid: string` | Administrative override: Forcefully terminates a rogue or stranded driver session from /busLocations. |

## [usersService.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/services/usersService.ts)
`admin/src/services/usersService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L5 | `subscribePassengers()` | `callback: (passengers: PassengerRecord[]` | Subscribes to registered passengers and their ride history logs. |
| L62 | `clearPassengerHistory()` | `uid: string` | Clears passenger trip history logs from RTDB. |
| L70 | `deleteUserFromRTDB()` | `uid: string` | Removes a user record from RTDB. |

## [webrtcAdminService.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/services/webrtcAdminService.ts)
`admin/src/services/webrtcAdminService.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `subscribeToWebRtcStream()` | `driverUid: string,   onRemoteStream: (stream: MediaStream | null` | Wasalt SafeTrip™ - Browser WebRTC Receiver Service Handles P2P WebRTC session negotiation with the driver mobile app via Firebase RTDB, delivering 30 FPS hardware-accelerated video and live Opus audio. / import { ref, set, onValue, off, remove } from 'firebase/database'; import { database } from '../config/firebase'; export interface WebRtcCallStats { status: 'idle' | 'waiting-offer' | 'negotiating' | 'connected' | 'disconnected' | 'failed'; fps: number; bitrateKbps: number; resolution?: string; } const RTC_CONFIG: RTCConfiguration = { iceServers: [ { urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }, { urls: 'stun:stun2.l.google.com:19302' }, ], }; /** Initiates and manages a WebRTC P2P receiver connection for an active driver safety stream. |

## [cn.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/utils/cn.ts)
`admin/src/utils/cn.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L4 | `cn()` | `...inputs: ClassValue[]` | Combines conditional class names with Tailwind CSS conflicts resolved. |

## [totp.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/admin/src/utils/totp.ts)
`admin/src/utils/totp.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `base32ToBytes()` | `base32: string` | Standard RFC 6238 TOTP (Time-based One-Time Password) Verification Utility. Compatible with Google Authenticator, Microsoft Authenticator, Authy, and 1Password. Uses the Web Cryptography API (crypto.subtle) without external dependencies. / const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; /** Decodes a Base32 string into a Uint8Array. |
| L32 | `generateHOTP()` | `secretBytes: Uint8Array, counter: number` | Generates a 6-digit TOTP code for a given counter using HMAC-SHA1. |
| L63 | `verifyTOTP()` | `token: string, base32Secret: string, stepSeconds = 30` | Verifies a 6-digit TOTP token against a Base32 secret key. Allows a +/- 1 step (30-second) drift window to accommodate client clock differences. |
| L92 | `getTOTPUri()` | `accountName: string, issuer: string, base32Secret: string` | Generates an otpauth:// URI string for setting up Google Authenticator via QR code. |

## [generate_pitch_deck.py](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/scripts/generate_pitch_deck.py)
`scripts/generate_pitch_deck.py`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L34 | `create_deck()` | *none* | No description provided. |
| L41 | `set_slide_background()` | `slide` | No description provided. |
| L50 | `add_header()` | `slide, category, title, subtitle=None` | No description provided. |
| L83 | `add_footer()` | `slide, slide_num` | No description provided. |
| L106 | `add_card()` | `slide, left, top, width, height, title=None, border_color=COLOR_CARD_BORDER, bg_color=COLOR_CARD_BG` | No description provided. |

## [App.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/App.tsx)
`sya7a/App.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L31 | `MainTabs()` | *none* | No description provided. |
| L57 | `AppNavigator()` | *none* | No description provided. |
| L85 | `App()` | *none* | No description provided. |

## [SettingsModal.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/components/SettingsModal.tsx)
`sya7a/src/components/SettingsModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `SettingsModal()` | `{ visible, onClose, onLogout }: Props` | No description provided. |

## [SidebarMenu.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/components/SidebarMenu.tsx)
`sya7a/src/components/SidebarMenu.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L22 | `SidebarMenu()` | `{ visible, onClose }: SidebarMenuProps` | No description provided. |
| L36 | `closeWithAnimation()` | *none* | No description provided. |
| L42 | `handleLogout()` | *none* | No description provided. |
| L64 | `handleHistoryPress()` | *none* | No description provided. |
| L70 | `handleBusTrackerPress()` | *none* | No description provided. |

## [AuthContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/contexts/AuthContext.tsx)
`sya7a/src/contexts/AuthContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L30 | `useAuth()` | *none* | No description provided. |
| L38 | `AuthProvider()` | `{ children }: { children: React.ReactNode }` | No description provided. |
| L56 | `signIn()` | `email: string, password: string` | No description provided. |
| L64 | `signUp()` | `email: string, password: string, username: string` | No description provided. |
| L76 | `signInWithGoogle()` | *none* | No description provided. |
| L81 | `signInWithApple()` | *none* | No description provided. |
| L114 | `resetPassword()` | `email: string` | No description provided. |
| L122 | `logout()` | *none* | No description provided. |

## [I18nContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/contexts/I18nContext.tsx)
`sya7a/src/contexts/I18nContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L59 | `I18nProvider()` | `{ children }: { children: React.ReactNode }` | No description provided. |
| L88 | `useI18n()` | *none* | No description provided. |

## [LocationContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/contexts/LocationContext.tsx)
`sya7a/src/contexts/LocationContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `useLocation()` | *none* | No description provided. |
| L25 | `LocationProvider()` | `{ children }: { children: React.ReactNode }` | No description provided. |
| L43 | `requestLocationPermission()` | *none* | No description provided. |
| L89 | `getCurrentLocation()` | *none* | No description provided. |
| L117 | `startLocationUpdates()` | *none* | No description provided. |
| L159 | `stopLocationUpdates()` | *none* | No description provided. |

## [ThemeContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/contexts/ThemeContext.tsx)
`sya7a/src/contexts/ThemeContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L65 | `ThemeProvider()` | `{ children }: { children: React.ReactNode }` | No description provided. |
| L97 | `useTheme()` | *none* | No description provided. |

## [UserTypeContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/contexts/UserTypeContext.tsx)
`sya7a/src/contexts/UserTypeContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `UserTypeProvider()` | `{ children }: { children: React.ReactNode }` | No description provided. |
| L30 | `setUserType()` | `type: Exclude<UserType, null>` | No description provided. |
| L35 | `clearUserType()` | *none* | No description provided. |
| L49 | `useUserType()` | *none* | No description provided. |

## [CompaniesScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/screens/CompaniesScreen.tsx)
`sya7a/src/screens/CompaniesScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L55 | `CompaniesScreen()` | *none* | No description provided. |
| L80 | `handleCompanyPress()` | `company: Company` | No description provided. |
| L84 | `handleBusLinePress()` | `busLine: string` | No description provided. |
| L90 | `renderCompanyItem()` | `{ item }: { item: Company }` | No description provided. |
| L108 | `renderBusLineItem()` | `{ item }: { item: string }` | No description provided. |

## [DriverHomeScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/screens/DriverHomeScreen.tsx)
`sya7a/src/screens/DriverHomeScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `DriverHomeScreen()` | *none* | No description provided. |
| L93 | `startSharing()` | *none* | No description provided. |
| L145 | `stopSharing()` | *none* | No description provided. |
| L156 | `handleLogout()` | *none* | No description provided. |
| L169 | `runSearch()` | `q: string` | No description provided. |
| L190 | `lower()` | `s: string` | No description provided. |
| L233 | `searchPlaces()` | `q: string` | No description provided. |
| L374 | `setPin()` | `lat, lng` | No description provided. |

## [HistoryScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/screens/HistoryScreen.tsx)
`sya7a/src/screens/HistoryScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L23 | `HistoryScreen()` | *none* | No description provided. |
| L49 | `handleHistoryItemPress()` | `item: HistoryItem` | No description provided. |
| L53 | `handleClearHistory()` | *none* | No description provided. |
| L78 | `renderHistoryItem()` | `{ item }: { item: HistoryItem }` | No description provided. |
| L94 | `renderEmptyState()` | *none* | No description provided. |

## [HomeScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/screens/HomeScreen.tsx)
`sya7a/src/screens/HomeScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L50 | `HomeScreen()` | *none* | No description provided. |
| L68 | `calculateDistance()` | `lat1: number, lon1: number, lat2: number, lon2: number` | No description provided. |
| L82 | `calculateBearing()` | `lat1: number, lon1: number, lat2: number, lon2: number` | No description provided. |
| L95 | `getDirectionName()` | `bearing: number` | No description provided. |
| L102 | `calculateTimeToArrival()` | `distance: number` | No description provided. |
| L268 | `onRefresh()` | *none* | No description provided. |
| L274 | `handleBusPress()` | `bus: Bus` | No description provided. |
| L286 | `renderBusItem()` | `{ item }: { item: Bus }` | No description provided. |
| L355 | `renderActiveBusItem()` | `{ item }: { item: ActiveBus }` | No description provided. |

## [LoginScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/screens/LoginScreen.tsx)
`sya7a/src/screens/LoginScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L22 | `LoginScreen()` | *none* | No description provided. |
| L36 | `handleAuth()` | *none* | No description provided. |
| L109 | `handleAppleSignIn()` | *none* | No description provided. |
| L151 | `handlePasswordReset()` | *none* | No description provided. |

## [MapScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/screens/MapScreen.tsx)
`sya7a/src/screens/MapScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L37 | `getMapHTML()` | *none* | No description provided. |
| L89 | `updateBusLocations()` | `busLocations` | No description provided. |
| L201 | `MapScreen()` | *none* | No description provided. |
| L215 | `calculateDistance()` | `lat1: number, lon1: number, lat2: number, lon2: number` | No description provided. |
| L229 | `calculateBearing()` | `lat1: number, lon1: number, lat2: number, lon2: number` | No description provided. |
| L242 | `getDirectionName()` | `bearing: number` | No description provided. |
| L249 | `calculateTimeToArrival()` | `distance: number` | No description provided. |
| L399 | `initializeMapLocation()` | *none* | No description provided. |
| L429 | `handleMarkerPress()` | `bus: BusLocation` | No description provided. |
| L433 | `handleSaveBus()` | *none* | No description provided. |
| L440 | `renderBusDetails()` | *none* | No description provided. |

## [RoleSelectionScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/screens/RoleSelectionScreen.tsx)
`sya7a/src/screens/RoleSelectionScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L9 | `RoleSelectionScreen()` | *none* | No description provided. |
| L15 | `choose()` | `type: 'passenger' | 'driver'` | No description provided. |

## [driverStorage.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/utils/driverStorage.ts)
`sya7a/src/utils/driverStorage.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L6 | `setDriverCompanyId()` | `companyId: string` | No description provided. |
| L10 | `getDriverCompanyId()` | *none* | No description provided. |
| L14 | `setDriverBusLine()` | `busLine: string` | No description provided. |
| L18 | `getDriverBusLine()` | *none* | No description provided. |
| L22 | `clearDriverSession()` | *none* | No description provided. |

## [favoritesUtils.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/utils/favoritesUtils.ts)
`sya7a/src/utils/favoritesUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L6 | `listenToFavorites()` | `userId: string, onChange: (lines: Set<string>` | No description provided. |
| L21 | `addFavorite()` | `userId: string, lineName: string` | No description provided. |
| L25 | `removeFavorite()` | `userId: string, lineName: string` | No description provided. |
| L29 | `toggleFavorite()` | `userId: string, lineName: string, isFavorite: boolean` | No description provided. |

## [historyUtils.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a/src/utils/historyUtils.ts)
`sya7a/src/utils/historyUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L11 | `saveToHistory()` | `userId: string, busLine: string, companyName: string` | No description provided. |

## [App.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/App.tsx)
`sya7a new/App.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L32 | `AnimatedTabButton()` | `{ children, onPress, accessibilityState }: any` | No description provided. |
| L40 | `handlePress()` | *none* | No description provided. |
| L60 | `MainTabs()` | *none* | No description provided. |
| L108 | `AppNavigator()` | *none* | No description provided. |
| L141 | `App()` | *none* | No description provided. |

## [SettingsModal.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/components/SettingsModal.tsx)
`sya7a new/src/components/SettingsModal.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L12 | `SettingsModal()` | `{ visible, onClose, onLogout }: Props` | No description provided. |

## [SidebarMenu.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/components/SidebarMenu.tsx)
`sya7a new/src/components/SidebarMenu.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L22 | `SidebarMenu()` | `{ visible, onClose }: SidebarMenuProps` | No description provided. |
| L36 | `closeWithAnimation()` | *none* | No description provided. |
| L42 | `handleLogout()` | *none* | No description provided. |
| L64 | `handleHistoryPress()` | *none* | No description provided. |
| L70 | `handleBusTrackerPress()` | *none* | No description provided. |

## [Button.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/components/ui/Button.tsx)
`sya7a new/src/components/ui/Button.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L45 | `handlePressIn()` | *none* | No description provided. |
| L50 | `handlePressOut()` | *none* | No description provided. |
| L60 | `getVariantStyles()` | *none* | No description provided. |
| L74 | `getTextStyles()` | *none* | No description provided. |
| L88 | `getSizeStyles()` | *none* | No description provided. |

## [Input.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/components/ui/Input.tsx)
`sya7a new/src/components/ui/Input.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L41 | `handleFocus()` | `e: any` | No description provided. |
| L47 | `handleBlur()` | `e: any` | No description provided. |

## [AuthContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/contexts/AuthContext.tsx)
`sya7a new/src/contexts/AuthContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L30 | `useAuth()` | *none* | No description provided. |
| L38 | `AuthProvider()` | `{ children }: { children: React.ReactNode }` | No description provided. |
| L56 | `signIn()` | `email: string, password: string` | No description provided. |
| L79 | `signUp()` | `email: string, password: string, username: string` | No description provided. |
| L91 | `signInWithGoogle()` | *none* | No description provided. |
| L96 | `signInWithApple()` | *none* | No description provided. |
| L129 | `resetPassword()` | `email: string` | No description provided. |
| L137 | `logout()` | *none* | No description provided. |

## [I18nContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/contexts/I18nContext.tsx)
`sya7a new/src/contexts/I18nContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L114 | `I18nProvider()` | `{ children }: { children: React.ReactNode }` | No description provided. |
| L144 | `useI18n()` | *none* | No description provided. |

## [LocationContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/contexts/LocationContext.tsx)
`sya7a new/src/contexts/LocationContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L17 | `useLocation()` | *none* | No description provided. |
| L25 | `LocationProvider()` | `{ children }: { children: React.ReactNode }` | No description provided. |
| L43 | `requestLocationPermission()` | *none* | No description provided. |
| L89 | `getCurrentLocation()` | *none* | No description provided. |
| L117 | `startLocationUpdates()` | *none* | No description provided. |
| L159 | `stopLocationUpdates()` | *none* | No description provided. |

## [ThemeContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/contexts/ThemeContext.tsx)
`sya7a new/src/contexts/ThemeContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L65 | `ThemeProvider()` | `{ children }: { children: React.ReactNode }` | No description provided. |
| L97 | `useTheme()` | *none* | No description provided. |

## [UserTypeContext.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/contexts/UserTypeContext.tsx)
`sya7a new/src/contexts/UserTypeContext.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L16 | `UserTypeProvider()` | `{ children }: { children: React.ReactNode }` | No description provided. |
| L30 | `setUserType()` | `type: Exclude<UserType, null>` | No description provided. |
| L35 | `clearUserType()` | *none* | No description provided. |
| L49 | `useUserType()` | *none* | No description provided. |

## [AdminDashboardScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/screens/AdminDashboardScreen.tsx)
`sya7a new/src/screens/AdminDashboardScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L34 | `formatUpdated()` | `value?: string` | No description provided. |
| L40 | `AdminDashboardScreen()` | *none* | No description provided. |
| L131 | `saveBus()` | *none* | No description provided. |
| L148 | `confirmDeleteBus()` | `bus: Bus` | No description provided. |
| L161 | `saveRoute()` | *none* | No description provided. |
| L175 | `confirmDeleteRoute()` | `targetRoute: string` | No description provided. |
| L193 | `requestMediaCheck()` | `kind: 'audio' | 'video'` | No description provided. |
| L207 | `openMap()` | `bus: LiveBus` | No description provided. |
| L214 | `renderNavTabs()` | *none* | No description provided. |

## [CompaniesScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/screens/CompaniesScreen.tsx)
`sya7a new/src/screens/CompaniesScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L58 | `CompaniesScreen()` | *none* | No description provided. |
| L82 | `handleCompanyPress()` | `company: Company` | No description provided. |
| L86 | `handleBusLinePress()` | `busLine: string` | No description provided. |
| L92 | `renderCompanyItem()` | `{ item, index }: { item: Company; index: number }` | No description provided. |
| L116 | `renderBusLineItem()` | `{ item, index }: { item: string; index: number }` | No description provided. |

## [DriverHomeScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/screens/DriverHomeScreen.tsx)
`sya7a new/src/screens/DriverHomeScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L43 | `haversineMeters()` | `lat1: number, lon1: number, lat2: number, lon2: number` | No description provided. |
| L56 | `formatTimer()` | `totalSeconds: number` | No description provided. |
| L66 | `DriverHomeScreen()` | *none* | No description provided. |
| L170 | `ensureSafetyPermissions()` | *none* | No description provided. |
| L211 | `handleSelectQuickDest()` | `item: { name: string; lat: number; lon: number }` | No description provided. |
| L218 | `startSharing()` | *none* | No description provided. |
| L372 | `stopSharing()` | *none* | No description provided. |
| L397 | `handleSendSOS()` | *none* | No description provided. |
| L430 | `handleLogout()` | *none* | No description provided. |
| L895 | `setPin()` | `lat, lng` | No description provided. |

## [HistoryScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/screens/HistoryScreen.tsx)
`sya7a new/src/screens/HistoryScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L27 | `HistoryScreen()` | *none* | No description provided. |
| L54 | `handleHistoryItemPress()` | `item: HistoryItem` | No description provided. |
| L58 | `handleClearHistory()` | *none* | No description provided. |
| L83 | `renderHistoryItem()` | `{ item, index }: { item: HistoryItem; index: number }` | No description provided. |
| L109 | `renderEmptyState()` | *none* | No description provided. |

## [HomeScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/screens/HomeScreen.tsx)
`sya7a new/src/screens/HomeScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L53 | `HomeScreen()` | *none* | No description provided. |
| L70 | `calculateDistance()` | `lat1: number, lon1: number, lat2: number, lon2: number` | No description provided. |
| L82 | `calculateBearing()` | `lat1: number, lon1: number, lat2: number, lon2: number` | No description provided. |
| L92 | `getDirectionName()` | `bearing: number` | No description provided. |
| L98 | `calculateTimeToArrival()` | `distanceKm: number` | No description provided. |
| L225 | `onRefresh()` | *none* | No description provided. |
| L230 | `handleBusPress()` | `bus: Bus` | No description provided. |
| L239 | `renderBusItem()` | `{ item, index }: { item: Bus, index: number }` | No description provided. |
| L303 | `renderActiveBusItem()` | `{ item, index }: { item: ActiveBus, index: number }` | No description provided. |

## [LoginScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/screens/LoginScreen.tsx)
`sya7a new/src/screens/LoginScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L27 | `LoginScreen()` | *none* | No description provided. |
| L47 | `handleAuth()` | *none* | No description provided. |
| L131 | `handleAppleSignIn()` | *none* | No description provided. |
| L171 | `handlePasswordReset()` | *none* | No description provided. |

## [MapScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/screens/MapScreen.tsx)
`sya7a new/src/screens/MapScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L39 | `haversineKm()` | `lat1: number, lon1: number, lat2: number, lon2: number` | No description provided. |
| L50 | `getMapHTML()` | `isDark: boolean` | No description provided. |
| L87 | `calcDistKm()` | `lat1, lng1, lat2, lng2` | No description provided. |
| L98 | `drawRouteOSRM()` | `startLat, startLng, endLat, endLng, currentLat, currentLng, isInitialDraw` | No description provided. |
| L133 | `updateBusMarkers()` | `busLocations` | No description provided. |
| L265 | `MapScreen()` | *none* | No description provided. |
| L278 | `calculateDistance()` | `lat1: number, lon1: number, lat2: number, lon2: number` | No description provided. |
| L281 | `calculateBearing()` | `lat1: number, lon1: number, lat2: number, lon2: number` | No description provided. |
| L290 | `getDirectionName()` | `bearing: number` | No description provided. |
| L295 | `calculateTimeToArrival()` | `distanceKm: number` | No description provided. |
| L305 | `pushBusUpdate()` | `locations: BusLocation[]` | No description provided. |
| L317 | `pushUserLocation()` | *none* | No description provided. |
| L331 | `pushUserToBusRoute()` | `bus: BusLocation` | No description provided. |

## [RoleSelectionScreen.tsx](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/screens/RoleSelectionScreen.tsx)
`sya7a new/src/screens/RoleSelectionScreen.tsx`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L14 | `RoleCard()` | `{    title,    iconName,    onPress,    delay,   theme  }: {    title: string;    iconName: keyof typeof Ionicons.glyphMap;    onPress: (` | No description provided. |
| L55 | `RoleSelectionScreen()` | *none* | No description provided. |
| L61 | `choose()` | `type: 'passenger' | 'driver' | 'admin'` | No description provided. |

## [driverSafetyStream.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/utils/driverSafetyStream.ts)
`sya7a new/src/utils/driverSafetyStream.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `useDriverSafetyStream()` | `{   user,   driverName = 'Driver',   cameraRef,   isRTL = false,   onSessionStart,   onSessionEnd, }: UseDriverSafetyStreamOptions` | Wasalt SafeTrip™ - Driver Safety Stream Controller & Hook Standalone service managing WebRTC P2P 30 FPS video & audio signaling, remote admin consent inspection, and zero-cost Firebase RTDB token exchange. / import { useEffect, useRef, useState, useCallback } from 'react'; import { Alert } from 'react-native'; import { ref, set, onValue, off, remove } from 'firebase/database'; import { database } from '../config/firebase'; import { getWebRtcBroadcasterHtml } from './webrtcBroadcasterHtml'; export type MediaRequestKind = 'audio' | 'video' | 'both'; export type MediaRequestStatus = 'pending' | 'accepted' | 'declined' | 'closed'; export interface DriverMediaRequestData { kind: MediaRequestKind; status: MediaRequestStatus; requestedAt: string; requestedBy: string; respondedAt?: string; driverUid?: string; } export interface UseDriverSafetyStreamOptions { user: { uid: string; email?: string | null; displayName?: string | null } | null; driverName?: string; cameraRef?: React.RefObject<any>; isRTL?: boolean; onSessionStart?: () => void; onSessionEnd?: () => void; } export interface UseDriverSafetyStreamResult { pendingRequest: DriverMediaRequestData | null; isStreaming: boolean; activeSession: DriverMediaRequestData | null; acceptRequest: () => Promise<void>; declineRequest: () => Promise<void>; endStream: () => Promise<void>; webrtcHtml: string; webViewRef: React.RefObject<any>; onWebViewMessage: (event: any) => void; } /** React Hook for Driver Handsets: Manages SafeTrip consent requests and WebRTC P2P signaling via Firebase RTDB. |

## [driverStorage.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/utils/driverStorage.ts)
`sya7a new/src/utils/driverStorage.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L6 | `setDriverCompanyId()` | `companyId: string` | No description provided. |
| L10 | `getDriverCompanyId()` | *none* | No description provided. |
| L14 | `setDriverBusLine()` | `busLine: string` | No description provided. |
| L18 | `getDriverBusLine()` | *none* | No description provided. |
| L22 | `clearDriverSession()` | *none* | No description provided. |

## [favoritesUtils.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/utils/favoritesUtils.ts)
`sya7a new/src/utils/favoritesUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L6 | `listenToFavorites()` | `userId: string, onChange: (lines: Set<string>` | No description provided. |
| L21 | `addFavorite()` | `userId: string, lineName: string` | No description provided. |
| L25 | `removeFavorite()` | `userId: string, lineName: string` | No description provided. |
| L29 | `toggleFavorite()` | `userId: string, lineName: string, isFavorite: boolean` | No description provided. |

## [historyUtils.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/utils/historyUtils.ts)
`sya7a new/src/utils/historyUtils.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L11 | `saveToHistory()` | `userId: string, busLine: string, companyName: string` | No description provided. |

## [webrtcBroadcasterHtml.ts](file:///C:/Users/karee/OneDrive/Desktop/random projects/bus tracker sya7a version/sya7a new/src/utils/webrtcBroadcasterHtml.ts)
`sya7a new/src/utils/webrtcBroadcasterHtml.ts`

| Line | Function Name | Arguments | Description |
| :--- | :--- | :--- | :--- |
| L1 | `getWebRtcBroadcasterHtml()` | *none* | Wasalt SafeTrip™ - WebRTC Broadcaster HTML Engine Embedded into React Native WebView for hardware-accelerated 30 FPS video and low-latency Opus audio streaming with zero custom native compilation. |
| L56 | `sendToNative()` | `data` | No description provided. |
| L62 | `updateStatus()` | `text, color, isError` | No description provided. |
| L72 | `initWebRtc()` | *none* | No description provided. |
| L156 | `handleAdminMessage()` | `event` | No description provided. |
