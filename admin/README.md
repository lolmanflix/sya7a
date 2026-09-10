# Wasalt Admin Portal — Standalone Deployment Package

Welcome to the **Wasalt Transit Operations Command Admin Portal**. This package is fully self-contained and pre-configured to run on any computer (Windows, macOS / MacBook, Linux).

---

## 🚀 Quick Start Instructions

### 🍎 On macOS (MacBook) & Linux
1. Open **Terminal**, navigate to this extracted folder:
   ```bash
   cd path/to/extracted/folder
   ```
2. Run:
   ```bash
   chmod +x start_mac.sh
   ./start_mac.sh
   ```
   *Your default browser will automatically open to `http://127.0.0.1:5173/`.*

---

### 🪟 On Windows
1. Double-click **`start_windows.bat`**.
   *Or open PowerShell / Command Prompt and run:*
   ```cmd
   node serve.js
   ```

---

## 🔑 Administrator Credentials

The portal is secured with standard Two-Factor Authentication (2FA):

| Field | Value |
| :--- | :--- |
| **Username** | `masteradmin` |
| **Password** | `adminPassword2026!` |
| **2FA Secret Key** | `WASALTADMINSECRET` |
| **TOTP Authenticator App** | Google Authenticator / 1Password / Any 2FA app (enter key: `WASALTADMINSECRET`) |

---

## 🛠️ Developer Mode (Source Code Editing)
If you wish to edit source code and run the live Vite development server with Hot Module Replacement (HMR):
```bash
npm install
npm run dev
```

---

## 📋 What's Included
- `dist/` — Pre-compiled, minified production web bundle (zero build delay, runs immediately).
- `serve.js` — Zero-dependency HTTP static server that serves the production app across all platforms.
- `src/` — Complete TypeScript / React / TailwindCSS source code.
- `.env` — Pre-configured production Firebase Realtime Database & Auth credentials.
- `start_windows.bat` — 1-click launcher for Windows.
- `start_mac.sh` — 1-click launcher for macOS / Linux.
