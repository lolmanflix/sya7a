# Wasalt — SaaS Platform Project Plan

## 1. Product Vision
**Wasalt** is a premium multi-tenant SaaS platform where businesses create their own branded company workspace, manage their teams and operations, and access the platform through both Web and Electron desktop applications.

**Core Value:** One Admin account → Multiple Companies. One Company → Multiple Admins. Full data isolation per company with dynamic branding.

---

## 2. User Personas

### Persona A — Business Owner (Primary)
- Wants to manage their business operations centrally
- Creates a company workspace, invites team admins
- Expects their brand colors and logo in the dashboard

### Persona B — Company Admin
- Invited to manage one or more company workspaces
- Manages team members, settings, and analytics
- May have Owner, Admin, or Manager role per company

### Persona C — Enterprise Client
- Multiple departments / subsidiaries as separate companies
- Needs multi-company switching
- Requires subscription management per company

---

## 3. Functional Requirements

### Authentication
- [x] Email/password sign-up and login
- [x] Password reset via email
- [x] Session persistence
- [x] Protected routes
- [x] Loading / unauthorized states

### Admin Account
- [x] Global Admin identity (name, email, profile)
- [x] One Admin → many Companies via AdminCompanyMembership
- [x] Admin profile management

### Company
- [x] Company creation (name, logo, description, industry, website)
- [x] Company-scoped data isolation
- [x] Company theme (logo-extracted or manual)
- [x] Company settings management

### AdminCompanyMembership (Many-to-Many)
- [x] Roles: Owner, Admin, Manager
- [x] Permissions per membership
- [x] Admin can have different roles in different companies
- [x] Add/remove/change role operations

### Multi-Company Switching
- [x] Company selector after login
- [x] Active company context drives all data, theme, permissions
- [x] Create new company from dashboard

### Theme System
- [x] Logo upload → color extraction → palette generation → contrast validation → theme
- [x] Manual: 3 predefined theme choices with live preview
- [x] CSS custom property injection per company
- [x] Tokens: primary, secondary, accent, background, surface, text, border, success, warning, error

### Onboarding Flow
- [x] Step 1: Admin account creation
- [x] Step 2: Company information
- [x] Step 3: Logo upload OR manual theme selection
- [x] Step 4: Workspace confirmation → enter dashboard

### Marketing Website
- [x] Hero with CTA
- [x] Problem section
- [x] Features (data-driven)
- [x] How it works (4-step)
- [x] Product preview
- [x] Benefits
- [x] Pricing (centralized config)
- [x] Testimonials (placeholder)
- [x] FAQ (data-driven)
- [x] Final CTA
- [x] Footer

### Web Application Dashboard
- [x] Sidebar navigation
- [x] Dashboard overview
- [x] Company settings
- [x] Team / admin management
- [x] Analytics (placeholder)
- [x] Billing
- [x] Help

### Subscription & Billing
- [ ] Plan selection during onboarding
- [ ] Payment provider integration (Stripe)
- [ ] Subscription status per company
- [ ] Billing management page

### Electron Desktop Application
- [ ] Electron + Vite + React scaffold
- [ ] Shared backend / auth / companies / billing
- [ ] Context isolation, secure IPC, preload
- [ ] Windows / macOS / Linux targets

---

## 4. Non-Functional Requirements
- Every file < 400 lines of code
- Zero hardcoded credentials, colors, or business logic in UI
- WCAG AA accessible contrast in all generated themes
- Fully responsive: Desktop, Tablet (768px), Mobile (375px)
- Firebase Firestore tenant isolation enforced server-side
- No raw passwords stored
- Structured logging for all critical backend operations
- SEO: title, meta description, Open Graph, semantic HTML

---

## 5. Architecture

### Ecosystem Structure
```
sya7a-main/
├── admin/           ← Transit Ops Admin Portal (existing, unchanged)
├── mobile/          ← Expo React Native Mobile App (existing, unchanged)
├── wasalt/          ← NEW: Wasalt SaaS Platform (monorepo)
│   ├── apps/
│   │   ├── marketing/   ← Vite + React marketing website
│   │   ├── web/         ← Vite + React SaaS web application
│   │   └── desktop/     ← Electron desktop app (scaffold)
│   └── packages/
│       ├── types/       ← Shared TypeScript types
│       ├── config/      ← Branding, pricing, features, FAQs
│       ├── theme/       ← Theme system (tokens, generation, contrast)
│       └── validation/  ← Zod schemas shared across apps
├── project_plan.md
├── dev_rules.md
├── code_wiki.md
├── manual_tests.csv
├── mistakes.md
└── user.md
```

### Database Architecture (Firebase Firestore)
```
Firestore (tracking-72393 — existing Firebase project)
├── admins/{adminId}
│   ├── id: string (= Firebase Auth UID)
│   ├── name: string
│   ├── email: string
│   ├── phone?: string
│   ├── avatarUrl?: string
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
├── companies/{companyId}
│   ├── id: string
│   ├── name: string
│   ├── logoUrl?: string
│   ├── description?: string
│   ├── industry?: string
│   ├── website?: string
│   ├── theme: CompanyTheme
│   ├── subscriptionId?: string
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
├── adminCompanyMemberships/{membershipId}
│   ├── adminId: string
│   ├── companyId: string
│   ├── role: 'owner' | 'admin' | 'manager'
│   ├── permissions: string[]
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
└── subscriptions/{subscriptionId}
    ├── companyId: string
    ├── plan: 'free' | 'pro' | 'business' | 'enterprise'
    ├── status: 'active' | 'trialing' | 'past_due' | 'canceled'
    ├── currentPeriodEnd: Timestamp
    └── paymentProvider: 'stripe'
```

### Authentication Architecture
- Firebase Authentication (email/password)
- After sign-up: create `admins/{uid}` document in Firestore
- Session: Firebase Auth built-in persistence
- Protected routes: check `auth.currentUser` + Firestore admin doc
- Authorization: check `adminCompanyMemberships` for every company operation

### Theme Architecture
```
company.theme = {
  source: 'logo' | 'manual',
  primary: '#hex',
  secondary: '#hex',
  accent: '#hex',
  background: '#hex',
  surface: '#hex',
  text: '#hex',
  border: '#hex',
  success: '#hex',
  warning: '#hex',
  error: '#hex'
}
```
Applied via CSS custom properties on `:root` within CompanyContext.

---

## 6. Technology Stack

| Layer | Technology |
|-------|-----------|
| Web Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Routing | React Router v6 |
| Auth + DB | Firebase Auth + Cloud Firestore |
| Storage | Firebase Storage (logos) |
| Notifications | Sonner |
| Color Extraction | Canvas API (client-side, zero deps) |
| Validation | Zod |
| Utilities | clsx, tailwind-merge, date-fns |
| Desktop | Electron + Vite (future) |
| Monorepo | npm workspaces |

---

## 7. Development Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Architecture & Documentation | ✅ Done |
| 2 | Project Scaffold + Shared Packages | 🔄 In Progress |
| 3 | Multi-Tenant Backend (Firestore services) | 🔄 In Progress |
| 4 | Authentication (sign-up, login, sessions) | 🔄 In Progress |
| 5 | Company Onboarding + Theme System | 🔄 In Progress |
| 6 | Billing Architecture | ⏳ Pending |
| 7 | Web Application Dashboard | 🔄 In Progress |
| 8 | Marketing Website | 🔄 In Progress |
| 9 | Electron Foundation | ⏳ Pending |
| 10 | QA + Testing | ⏳ Pending |

---

## 8. Roadmap

### v0.1.0 — Foundation
- Project scaffold, shared packages, auth, Firestore schema

### v0.2.0 — Core SaaS
- Admin account, company creation, AdminCompanyMembership, roles

### v0.3.0 — Theme System
- Logo upload, color extraction, manual themes, live preview

### v0.4.0 — Web Application
- Dashboard, company switching, settings, admin management

### v0.5.0 — Marketing Website
- Full landing page with all sections, SEO, responsive

### v0.6.0 — Billing
- Stripe integration, subscription plans, checkout flow

### v1.0.0 — Production
- Electron desktop, full QA, security audit, performance optimization
