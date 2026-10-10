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

The portal is secured with standard Two-Factor Authentication (2FA).

**No credentials are stored in this repository or shipped in the app bundle.**
They are injected at build time from `admin/.env` (gitignored):

| Env key (`admin/.env`) | Purpose |
| :--- | :--- |
| `VITE_MASTER_ADMIN_USERNAME` | Master admin login username |
| `VITE_MASTER_ADMIN_PASSWORD` | Master admin password (also the Firebase service password) |
| `VITE_MASTER_ADMIN_TOTP_SECRET` | Base32 TOTP seed for your authenticator app |
| `VITE_FIREBASE_ADMIN_EMAILS` | Comma-separated Firebase service identities for RTDB auth (first = primary), e.g. `admin@wasalt.eg,admin@sya7a.eg` |
| `VITE_SUPER_ADMIN_EMAILS` | Comma-separated dispatcher emails granted SUPER_ADMIN (optional; others fall back to COMPANY_ADMIN) |
| `VITE_DEMO_DRIVER_UID` / `VITE_DEMO_DRIVER_NAME` | Optional SafeTrip demo-driver switch target (control hidden when unset) |

Setup:
1. `cp .env.example .env` and replace every placeholder with your own secret.
2. Copy the `VITE_MASTER_ADMIN_TOTP_SECRET` value from `admin/.env` into
   Google Authenticator / 1Password / Authy (key type: Time-based).
   The seed is intentionally never displayed in the UI — it exists only in
   `admin/.env` and these documentation steps.
3. Restart the dev server after any `.env` change.

If these keys are missing, the login screen shows a configuration warning and
refuses authentication instead of falling back to a default credential.

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
