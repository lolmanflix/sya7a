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

---

## 8. False-Negative Verification Pipeline & Incomplete Secret Redaction
- **Mistake:** Verifying a credential purge with `grep -rc ... | paste -sd+ | bc || echo 0`. `bc` choked on `grep`'s `filename:count` output, exited non-zero, and the `|| echo 0` fallback printed a confident **false "0 matches"** — while the bundle actually still contained the inlined credential. A follow-up redaction helper only stripped `'...'`/`"..."`, so minified **backtick** template literals (`var Wm=\`...\``) printed credential values into the transcript.
- **Root Cause:** (a) Shell pipelines where the failure path returns a plausible-looking success value; (b) redaction rules written for one quoting style while build output uses another.
- **Prevention:**
  - Probe with a single self-contained tool (e.g. Node `String.includes`) and **assert the probe itself works** using a known-present sentinel before trusting any `false`/`0`.
  - Never chain `|| echo <safe-value>` for evidence — an empty/failed intermediate must surface as an error, not a green result.
  - Redact **all** literal forms (`'...'`, `"..."`, backticks) before printing any code excerpt; prefer printing only booleans/counts for secret-adjacent diagnostics.

---

## 9. E2E-Caught Multi-Account Defects & Invalid MCP Registration
- **Mistake:** (a) `commitActive()` updated React state but never called `setActiveId()` — sessions didn't survive reload and sign-out couldn't locate the active record. (b) Master login awaited `establishFirebaseIdentity()` before registering the account, so the `onAuthStateChanged` observer adopted the service identity as a phantom `company:` dispatcher record. (c) `logout()` always called `signOut(auth)`, revoking the shared RTDB identity while other accounts remained active (`permission_denied at /drivers`). (d) Firebase MCP registered with a non-existent `mcp --project` flag (server crashed on boot) and a wrong feature slug (`realtimedatabase` yields zero tools; correct slug: `database`). (e) `pkill -f 'port 5179'` matched the invoking shell's own command line and killed it; `>> admin/.env` executed from inside `admin/` wrote to a wrong path (caught by `&&` chaining).
- **Root Cause:** (a) state/persistence split-brain — one of two storage layers forgotten inside a helper; (b) observer side-effect racing across an `await` boundary; (c) sign-out semantics not modeled against "what else still needs access?"; (d) CLI/MCP flags guessed from research instead of verified against `--help` + a live handshake probe.
- **Prevention:**
  - Mirror every in-memory state update with its persistence write in the same helper (single write path), and prove it with a reload assertion in the e2e suite.
  - Guard observer side-effects with an in-flight flag during programmatic auth flows.
  - Model sign-out as "remove this account; drop the shared identity only when the registry is empty".
  - Verify every CLI/MCP invocation against `--help` output with a stdio handshake probe before shipping config; prefer port-based (`fuser`) process control over cmdline `pkill` patterns that can self-match.
- **Mistake (f) — blind e2e assertions:** (1) `page.evaluate` referenced a Node-side constant (`TOTP_SEED`) → ReferenceError in the browser context; (2) error-toast capture read the DOM after sonner's ~4 s auto-dismiss, so real failure messages ("Invalid ... OTP code") were invisible and debugging started from the wrong hypothesis; (3) hardcoding a credential from chat instead of resolving it the way the app does produced false logins.
- **Prevention (f):** pass all values into `evaluate` as arguments; assert toasts within their visible window (≤2 s) using sonner's `[data-sonner-toast]`/`li` selectors; source secrets for tests from the app's own module resolution (dynamic `import()` of the config module in-page) — never from chat-transcribed values; keep harnesses out of kill-range side effects (a session self-kill wiped `/tmp/opencode` mid-run).
