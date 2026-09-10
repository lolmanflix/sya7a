# Project Plan: Wasalt Bus Tracker Platform & Admin Portal

## 1. Executive Summary & Goal
The **Wasalt Bus Tracker Platform & Admin Portal** is a secure, responsive, modern web application designed for transit dispatchers and system administrators to oversee and manage the bus tracking ecosystem. It connects directly to the production Firebase Realtime Database and Firebase Authentication backend to provide full real-time visibility, fleet control, route configuration, and driver dispatching.

---

## 2. Technical Architecture & Tech Stack
- **Frontend Framework:** React (Vite)
- **Styling & UI:** Tailwind CSS (Modern, premium styling, dark/light mode support)
- **Backend & Database:**
  - Firebase Realtime Database (`tracking-72393-default-rtdb.firebaseio.com/`)
  - Firebase Authentication (59+ registered users/drivers/admins)
  - Firebase Admin SDK (Node/Express or serverless API layer for elevated admin operations like user provisioning and claim management)
- **Map & Geolocation:** Leaflet / OpenStreetMap for interactive bus visualization and route endpoint mapping.
- **Language:** TypeScript / JavaScript with strict typing and schema validation.

---

## 3. Core Functional Pillars

### Phase 1: Real-time Database Diagnostics & Architecture Mapping (Complete)
- [x] Secure service account credentials via `.gitignore`.
- [x] Query and map live Firebase Realtime Database nodes (`/companies`, `/drivers`, `/users`).
- [x] Audit Firebase Authentication accounts and role distribution.
- [x] Confirm Cloud Firestore vs Realtime Database usage (Firestore is empty; RTDB is the active engine).

### Phase 2: Project Anchor Initialization & Development Baseline
- [x] `dev_rules.md`: Architectural rules, under 400 lines limit, security and non-technical UX standards.
- [x] `project_plan.md`: Scope, architecture, and phased roadmap.
- [ ] Automated `functions.md` parser script (`scripts/generate_functions_doc.py`).
- [ ] High-Level Architecture Documentation (`code_wiki.md`).
- [ ] Quality Assurance Checklist (`manual_tests.csv`).

### Phase 3: Portal Foundation & Security Layer
- [ ] Initialize React + Tailwind application with centralized configuration (`.env`).
- [ ] Authentication & Role-Based Access Control (RBAC):
  - Super Admin Dashboard (all companies, drivers, users, system settings).
  - Company Admin View (scoped to specific company, e.g., CTA, BRT).
- [ ] Firebase Service Layer with multi-step error handling.

### Phase 4: Core Admin Modules & Feature Set
- [ ] **Live Telemetry & Fleet Map:**
  - Real-time map displaying all active buses and terminals.
  - Active trip counter, company breakdown, and live status toggle.
- [ ] **Company Management:**
  - Create, view, edit transit companies and official domains.
  - Manage company bus lines.
  - Data hygiene: Deduplicate duplicate company keys (e.g., `BRT` vs `brt`).
- [ ] **Fleet & Route Manager:**
  - Visual bus creator with interactive map coordinate picker.
  - Route line assignment and terminal addresses.
  - Bus status toggling (`isActive: true/false`).
- [ ] **Driver Dispatch & Assignment:**
  - Driver directory with assigned companies and lines.
  - Provision new driver accounts directly into Firebase Auth and RTDB.
  - Reassign lines and update driver credentials safely.
- [ ] **User & Passenger Analytics:**
  - View passenger directory and ride history logs.
  - Account status controls (enable/disable).

### Phase 5: Verification & Quality Assurance
- [ ] Execute automated tests and document manual test verifications in `manual_tests.csv`.
- [ ] Security audit: Validate input sanitization and verify no credentials leakage.
