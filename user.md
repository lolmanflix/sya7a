# Wasalt SaaS Platform — User & Persona Context (`user.md`)

## 1. Project Overview & Stakeholder Intent
- **Stakeholder / Owner:** Kareem
- **Platform Name:** Wasalt (SaaS Platform)
- **Primary Objective:** Build a production-grade multi-tenant SaaS platform where businesses create their branded workspaces, manage team members, subscribe to tier plans, and operate both via Web and Electron desktop applications.
- **Reference Standard:** Inspired by the visual polish, structure, conversion focus, and seamless onboarding of modern SaaS leaders (such as bites.com), without copying proprietary assets or colors.

---

## 2. Core User Personas

### Persona 1: Enterprise & Business Owner (Primary Onboarding User)
- **Role:** Founder, VP of Operations, or General Manager.
- **Needs:**
  - Fast, self-serve sign-up and company workspace creation.
  - White-label branding (upload logo, automatic brand color palette generation, custom brand theme).
  - Ability to switch seamlessly between multiple companies or divisions under one master login.
  - Transparent pricing plans with self-service subscription management.
- **Friction Points to Avoid:**
  - Tedious multi-page forms without progress feedback.
  - Inaccessible or broken color contrast on custom themes.
  - Complex manual permission setups.

### Persona 2: Company Admin & Operations Manager
- **Role:** Operations Manager, Department Head, Dispatch Coordinator.
- **Needs:**
  - Clean, responsive dashboard with key performance indicators and operational metrics.
  - Team management: invite team members, assign granular roles (Owner, Admin, Manager), revoke access.
  - Workspace settings customization: logo, contact details, working hours, notifications.
- **Friction Points to Avoid:**
  - Cluttered interfaces with low information density.
  - Slow navigation or lack of breadcrumbs/context indicators.

### Persona 3: Platform Super Administrator (Master Admin)
- **Role:** Platform Operator / Wasalt System Admin.
- **Needs:**
  - Oversight of all registered tenants, subscription health, and system status.
  - Global security, audit logs, and compliance.

---

## 3. High-Priority Functional Deliverables
1. **Public Marketing Website:**
   - Conversion-focused landing page (Hero, Interactive Product Preview, Value Propositions, How It Works, Features Grid, Pricing Matrix, Testimonials, FAQ, Footer CTA).
2. **Onboarding & Registration Flow:**
   - 4-Step interactive onboarding wizard (Admin Account -> Company Details -> Logo & Dynamic Theme Extraction -> Confirmation & Dashboard Launch).
3. **Multi-Tenant Web Dashboard:**
   - Global workspace switcher (switch between assigned companies or create new ones).
   - Dynamic real-time theming injected via CSS variables per active company.
   - Team & member management with role badges and invite workflows.
   - Company branding settings with live theme previews.
   - Subscription & Billing management interface.
4. **Desktop Compatibility:**
   - Electron foundation with secure preload scripts and context isolation.
