# Wasalt SaaS Platform — Mistakes & Anti-Patterns Log (`mistakes.md`)

This living document records mistakes, pitfalls, anti-patterns, and architectural guardrails discovered during the design, development, and evolution of the **Wasalt SaaS Platform**.

---

## 1. File Size Ceiling Violations (Rule 1)
- **Mistake:** Allowing UI component files or service handlers to grow beyond 400 lines of code.
- **Root Cause:** Combining JSX presentation, complex local state, event handlers, validation logic, and styling in a single monolithic file.
- **Prevention:**
  - Strictly maintain modular sub-components (e.g. `StepIndicator.tsx`, `ThemePicker.tsx`, `CompanyCard.tsx`).
  - Extract reusable business logic into custom hooks (`useCompanyTheme.ts`, `useWorkspace.ts`, `useAuth.ts`).
  - Automated verification: `scripts/test_dev_rules.py` enforces <= 400 lines across every `.ts`/`.tsx` file.

---

## 2. Direct Backend Leakage in Presentation Layer (Rule 2)
- **Mistake:** Importing Firebase SDKs (`firebase/firestore`, `firebase/auth`, `firebase/database`) directly inside React presentation components.
- **Root Cause:** Quick prototyping without creating a dedicated service layer abstraction.
- **Prevention:**
  - All database reads, writes, and authentication calls must pass through `services/` (`companyService.ts`, `authService.ts`, `membershipService.ts`).
  - Components only consume services via React Context or hooks.
  - Presentation components must remain purely declarative and testable in isolation.

---

## 3. Hardcoded Branding & Terminology (Rule 8)
- **Mistake:** Hardcoding product name "Wasalt", company names, logos, colors, or taglines directly into JSX strings.
- **Root Cause:** Bypassing central configuration files for fast copy-pasting.
- **Prevention:**
  - Centralize product identity in `@wasalt/config` (`productConfig.ts`, `tenantConfig.ts`).
  - Use dynamic tokens and CSS custom properties for styling (`var(--wasalt-primary)`).
  - Centralize pricing, features, navigation items, and FAQ questions in configuration objects.

---

## 4. Inaccessible Dynamic Theme Contrast (WCAG AA)
- **Mistake:** Extracting arbitrary dominant colors from company logos and applying them directly as text or background colors without contrast checks.
- **Root Cause:** Some logos use low-contrast pastel yellow or light grey, resulting in unreadable white-on-yellow or black-on-dark-navy text.
- **Prevention:**
  - Calculate relative luminance and contrast ratios using the WCAG 2.1 formula ($L_1 + 0.05) / (L_2 + 0.05)$.
  - Automatically calculate contrasting surface, text, and border tokens.
  - Provide fallback colors if contrast is below 4.5:1 for body copy or 3:1 for large headlines.

---

## 5. Multi-Tenant Data Leakage
- **Mistake:** Performing Firestore or RTDB queries without explicit filtering by `companyId` / active tenant context.
- **Root Cause:** Assuming client-side routing handles data security.
- **Prevention:**
  - Every tenant-scoped collection must strictly require `companyId`.
  - Validate `AdminCompanyMembership` before permitting reads or updates on company documents.
  - Server-side security rules must enforce membership validation for multi-tenant isolation.

---

## 6. Unsanitized File Uploads (Logos & Assets)
- **Mistake:** Directly uploading user-submitted files without validating MIME types, file extensions, and file sizes.
- **Root Cause:** Relying only on frontend `<input type="file" accept="image/*" />`.
- **Prevention:**
  - Validate file size (< 2MB) and MIME type (`image/png`, `image/jpeg`, `image/svg+xml`, `image/webp`).
  - Process images via HTML5 Canvas or safe client-side utilities before uploading to Firebase Storage or encoding as data URLs.

---

## 7. Premature Destruction / Unapproved CLI Operations (Rule 9)
- **Mistake:** Running destructive terminal commands (`rm -rf`, `git reset --hard`) without explicit user consent.
- **Root Cause:** Autonomous agent cleanup attempting to wipe directories.
- **Prevention:**
  - Strictly adhere to Rule 9: Destructive commands must be confirmed by the user.
  - Prefer non-destructive refactoring, file movement, or archiving.
