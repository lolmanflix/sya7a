# Wasalt Transit Operations Command — Admin Portal User Guide

Welcome to the **Wasalt Bus Tracker Admin Web Portal** (`wasalt`). This administrative command console provides real-time fleet oversight, visual route editing, multi-operator line management, driver dispatching, and user directory management directly connected to the production Firebase Realtime Database.

---

## 📑 Table of Contents
1. [Quick Start & Local Bootstrap](#1-quick-start--local-bootstrap)
2. [Master Admin Login & 2FA Configuration](#2-master-admin-login--2fa-configuration)
3. [Operator Dispatcher Login](#3-operator-dispatcher-login)
4. [Comprehensive Feature Guide](#4-comprehensive-feature-guide)
   - [Live Telemetry & Interactive Map](#feature-1-live-telemetry--interactive-map)
   - [Companies & Bus Lines Manager](#feature-2-companies--bus-lines-manager)
   - [Bus Fleet & Visual Route Builder](#feature-3-bus-fleet--visual-route-builder)
   - [Drivers Directory & Dispatch Board](#feature-4-drivers-directory--dispatch-board)
   - [Users & Commuters Directory](#feature-5-users--commuters-directory)
   - [Security & Database Hygiene](#feature-6-security--database-hygiene)
5. [Troubleshooting & FAQs](#5-troubleshooting--faqs)

---

## 1. Quick Start & Local Bootstrap

We provide automated bootstrap scripts that verify requirements, install all dependencies, configure environment variables, and launch the application locally with a single click.

### Option A: Windows Double-Click (Recommended)
1. In File Explorer, navigate to the project root directory:
   `bus tracker sya7a version/`
2. Double-click **`bootstrap.bat`**.
3. Select your launch mode:
   - `[1]` Wasalt Admin Portal (Web Dashboard) [Default]
   - `[2]` Wasalt Mobile App (Expo Driver & Passenger)
   - `[3]` Both (Admin Portal + Mobile App)

### Option B: macOS (MacBook) & Linux Terminal
Run the cross-platform start script from the root directory:
```bash
chmod +x start.sh
./start.sh
```
Or launch directly with flags:
- `./start.sh` (Interactive prompt, default Admin Portal)
- `./start.sh --mobile` (Launch Expo Driver & Passenger App)
- `./start.sh --both` (Launch Admin Portal in background and Expo Mobile App in terminal)

### Option C: Windows PowerShell
Run the following command from the workspace root:
```powershell
.\bootstrap.ps1
```

### Option D: Manual Terminal Launch
```bash
cd admin
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
Open **`http://127.0.0.1:5173/`** in your browser.

---

## 2. Master Admin Login & 2FA Configuration

The login portal features a hardened **Two-Factor Authentication (2FA)** gate powered by standard **RFC 6238 Time-based One-Time Passwords (TOTP)**.

### Master Admin Login Fields

| Field Name | What to Enter | Description |
| :--- | :--- | :--- |
| **Login Gateway Tab** | Select **Master Admin (2FA)** | Must use the shield tab on the left of the login card. |
| **Master Admin Username** | `masteradmin` | Primary administrative username (case-insensitive). |
| **Master Admin Password** | `adminPassword2026!` | Central administration passphrase. |
| **6-Digit Authenticator OTP** | `XXXXXX` (e.g. `849201`) | Dynamic 6-digit code from your phone's Authenticator app. |
| **Stay logged in on this device** | `[✓]` (Checked) or `[ ]` | **Checked:** Persists session in `localStorage` across restarts.<br>**Unchecked:** Stores session in `sessionStorage` (purged upon closing tab). |

---

### Step-by-Step: How to Configure Your Authenticator App

You can use **Google Authenticator**, **Microsoft Authenticator**, **Authy**, or **1Password** on iOS or Android.

1. Open your authenticator app on your smartphone.
2. Tap the **+** (Add Account) button.
3. Choose **Enter a setup key** (or **Manual entry**).
4. Fill in the three fields:
   - **Account Name:** `Wasalt Master Admin`
   - **Your Key / Secret:** `WASALTADMINSEC2026`
   - **Key Type:** `Time-based` (or `TOTP`, 30 seconds interval)
5. Tap **Add** / **Save**.
6. Your app will now display a 6-digit passcode that refreshes every 30 seconds.
7. Enter that current 6-digit code into the **6-Digit Authenticator OTP** field on the web page and click **Authenticate as Master Admin**.

> **Note on Firebase RTDB Connection:** Logging in as Master Admin automatically authenticates the backend token with Firebase Auth (`admin@wasalt.eg`), giving the web client full read/write access to `/drivers`, `/users`, `/companies`, and `/busLocations`.

---

## 3. Operator Dispatcher Login

For transit operators who only manage their own company fleet (e.g., CTA, BRT):
1. On the login page, switch to the **Company Dispatcher (Firebase Auth)** tab.
2. Enter the operator dispatch email (e.g. `admin@cta.eg`, `admin@brt.eg`) and password.
3. The dashboard automatically isolates the viewport to that operator's routes and drivers.

---

## 4. Comprehensive Feature Guide

### Feature 1: Live Telemetry & Interactive Map (`/` Dashboard)
- **Zero-API OpenStreetMap Layer:** Uses the identical OpenStreetMap tile layer used by the mobile app (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`), eliminating third-party API key limits.
- **Active Bus Pulse Markers:** Vehicles streaming GPS telemetry are plotted with glowing live pulse markers showing direction, driver name, and current coordinates.
- **Terminal Badges:** Clearly demarcates Start (A) and Destination (B) stations with custom icons.
- **Real-Time Counters:** Displays active road vehicles, registered transit authorities, total fleet routes, and assigned drivers.
- **Live Dispatch Stream:** Event feed detailing recent vehicle updates with a one-click **Emergency Broadcast Cutoff** button to stop compromised telemetry streams.

### Feature 2: Companies & Bus Lines Manager (`/companies`)
- **Operator Directory:** View all transit companies (`CTA`, `BRT`, `Mwaslat Misr`, `Go Bus`, `Super Jet`, `White Bus`).
- **Create New Operator:** Register a new transit company with its official email domain.
- **Line Management (`Manage Lines`):** Add new transit lines or remove existing ones.
- **Cascading Line Renaming:** Renaming a line automatically cascades across all assigned buses under `/companies/<companyId>/buses/<busId>/lineId` in Realtime Database.
- **Delete Company:** Permanently remove an operator and all associated lines.

### Feature 3: Bus Fleet & Visual Route Builder (`/fleet`)
- **Interactive Route Builder (`Add Bus Route`):** Non-technical dispatchers can visually place Start (A) and Destination (B) pins on the map.
- **Offline Landmark Gazetteer:** Choose from instant Egyptian landmark presets (ECU Nasr City, Tahrir Square, Ramses Station, Lebanon Square, Cairo Festival City, Giza Pyramids) with zero geocoding network calls.
- **Operational Toggle:** One-click Active/Idle switch with real-time Firebase persistence.
- **Route Editor & Deletion:** Modify terminal names and delete bus records from Firebase with confirmation dialogs.

### Feature 4: Drivers Directory & Dispatch Board (`/drivers`)
- **Driver Directory:** Displays all 10 registered drivers across all companies.
- **Multi-Field Real-Time Search:** Search instantly by **Driver Name**, **Email**, **Assigned Bus Line**, **Company**, or **UID**.
- **Operator Filter:** Filter drivers by transit authority (`All Operators`, `CTA`, `BRT`, etc.).
- **One-Click UID Copy:** Quickly copy any driver's Firebase UID for debugging or auth queries.
- **Line Assignment Modal:** Manage route permissions with multi-select checkboxes.
- **Register & Remove Drivers:** Provision new driver profiles directly into `/drivers` or delete existing records.

### Feature 5: Users & Commuters Directory (`/users`)
- **61 Synchronized Accounts:** Comprehensive index of all mobile app users, accounts, and drivers.
- **Instant Search:** Search across all users by **Display Name**, **Email**, or **UID**.
- **Role Filters:**
  - `All (61)`: View all registered accounts.
  - `Passengers`: Filter exclusively to commuter accounts.
  - `Drivers`: Filter to accounts flagged as drivers.
  - `Active Trips`: Filter to accounts with recorded trip histories.
- **Account & Ridership Inspector:** Click any user to inspect their account details, registration date, and ride history timeline.
- **History Management:** Clear trip logs for a user or remove user records from the database.

### Feature 6: Security & Database Hygiene (`/security`)
- **Role-Based Access Control (RBAC):** Super Admin (unrestricted) vs Company Dispatcher (tenant-isolated).
- **Data Hygiene Scanner:** Automatically detects corrupt or duplicate database nodes (e.g., redundant lowercase `brt` vs uppercase `BRT`).
- **One-Click Cleanup:** Safely cleans corrupted nodes from Realtime Database.

---

## 5. Troubleshooting & FAQs

#### Q: The login screen says "Invalid or expired 6-digit Authenticator OTP code".
- **A:** TOTP codes depend on accurate time. Ensure that the clock on your mobile phone is set to **Automatic (Network Time)**. The server accepts codes within a $\pm 30$-second window.

#### Q: How do I regenerate or change the Master Admin credentials?
- **A:** Open `admin/.env` and update:
  - `VITE_MASTER_ADMIN_USERNAME`
  - `VITE_MASTER_ADMIN_PASSWORD`
  - `VITE_MASTER_ADMIN_TOTP_SECRET` (Must be standard Base32: uppercase letters A–Z and digits 2–7).
  Restart the dev server after editing `.env`.

#### Q: "Port 5173 is already in use" error when starting.
- **A:** Another process is using port 5173. Either stop that process or launch with a custom port:
  ```bash
  cd admin
  npm run dev -- --port 5174
  ```

#### Q: Are private credentials safe from being pushed to git?
- **A:** Yes. The root `.gitignore` explicitly ignores `serviceAccountKey.json`, `*.json` service keys, `.env`, and local caches.
