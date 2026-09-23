# Development Rules & Architectural Baseline

These development rules govern the design, implementation, and maintenance of the **Wasalt Bus Tracker Platform & Admin Portal**. All contributors and AI agents must strictly comply with these rules.

---

## 1. Safety & Modular Architecture Baseline

1. **File Size Limit (Strictly Under 400 Lines per File):**
   - Code files must be modular, highly focused, and strictly under 400 lines of code.
   - If a component or module approaches this limit, break it into smaller sub-components, custom hooks, or utility services.

2. **Strict Modularity & Layer Separation:**
   - **Presentation Layer (UI/Components):** Decoupled from Firebase and business logic. UI components receive data and handlers via props or custom hooks.
   - **Service Layer (Firebase Services):** Centralized in `src/services/` for Realtime Database queries, Auth handling, and Admin SDK operations.
   - **State / Context Layer:** State stores or React Contexts manage global session, permissions, and cached data.

3. **Data-Driven Configuration & Secret Protection:**
   - **Zero Hardcoding:** Never hardcode credentials, Firebase keys, URLs, or API tokens in source files.
   - Environment variables must reside in `.env` (guarded by `.gitignore`) and accessed programmatically.
   - Service account keys must NEVER be committed to version control.

4. **Comprehensive Error Handling & Logging:**
   - Every Firebase call and user-triggered mutation must include structured try/catch blocks.
   - Graceful degradation: If a network blip or permission error occurs, the UI must display clear, non-technical, actionable error notifications rather than crashing.

5. **Non-Technical User Friendly Design (Human-Centric UX):**
   - The admin dashboard must be intuitive, self-explanatory, and usable by non-technical dispatchers.
   - Use clear visual statuses (badges, colors, readable labels), friendly confirmation dialogs for destructive actions, and responsive layout.

6. **High-Grade Security Protocol:**
   - Strict role-based boundaries: Super Admin vs Company-level Admin.
   - Input sanitization and validation before database persistence.
   - Defensive validation for coordinates, route definitions, and driver assignments.

7. **Leverage Proven Open-Source Packages & Libraries:**
   - Prioritize mature, battle-tested open-source libraries, component primitives, and community tooling to accelerate development and eliminate reinventing the wheel.
   - Use proven solutions for maps (Leaflet / React-Leaflet), icons (Lucide React), utilities (clsx, tailwind-merge, date-fns), and UI primitives rather than custom ad-hoc re-implementations.
8. **Data-Driven White-Labeling & Multi-Tenant Institutional Adaptability:**
   - **Universal Institutional Fleet Support:** The platform is architected to seamlessly serve any organization operating bus fleets—including private schools, universities, corporate call center shuttles, and public transit.
   - **Zero Hardcoded Branding in UI:** Logos, company display names, header titles, terminology ("Bus Line" vs "School Route" vs "Shift Shuttle", "Passenger" vs "Student" vs "Employee"), and brand accent palettes must NEVER be hardcoded inside components.
   - **Centralized Data-Driven Configuration:** All branding, terminology, and visual themes must be powered by a centralized configuration file (`tenantConfig.ts`) and dynamic database properties. Re-theming or onboarding a new client institution must require updating only configuration, requiring zero component recoding.
9. **Autonomous Agent Command Safety Guardrails (Zero Unapproved Destructive Actions):**
   - **Autonomous Development Operations:** Routine development commands (`npm`, `npx`, `tsc`, `git`, `python3`, `cat`, `ls`, `grep`, etc.) execute autonomously to ensure seamless, uninterrupted productivity.
   - **Strict Confirmation for Destructive Actions:** The AI agent is strictly prohibited from executing destructive or elevated commands (`rm`, `rm -rf`, `sudo`, `dd`, `killall`, `mkfs`, `chmod -R`, `chown -R`, etc.) without stopping, stating the proposed command in chat, and obtaining explicit confirmation from the user first.
   - **Archival Over Destruction:** When reorganizing or deprecating code, files must be relocated to the `archive/` directory to preserve project history and prevent irreversible data loss.
10. **Deterministic Compliance Verification Suite (`npm run test:rules`):**
    - The project includes an automated, deterministic verification engine at `scripts/test_dev_rules.py`.
    - Automatically checks and enforces:
      1. **File Size Ceiling:** Every active source file must remain <= 400 lines of code.
      2. **Layer Separation:** UI presentation components are decoupled from direct `firebase/database` calls.
      3. **Secret Protection:** Guarantees zero committed `.env` files or credentials in the Git index.
      4. **Multi-Tenant White-Labeling:** Verifies `tenantConfig.ts` presets across all institutional archetypes.
      5. **Documentation Integrity:** Verifies `functions.md`, `code_wiki.md`, and `dev_rules.md` exist and stay updated.
    - Run anytime via `npm run test:rules` in `mobile/` or `admin/`, or directly with `python3 scripts/test_dev_rules.py`.

11. **Single Responsibility Principle (SRP) — Single-Purpose Functions:**
    - **One Function, One Job:** Every function must have exactly one well-defined responsibility. A function should execute only one discrete logical task (e.g. compute a value, persist a record, or render a specific UI component).
    - **No Mixed Concerns:** Never combine unrelated responsibilities in a single omnibus function (such as validating user input, performing network I/O, writing to local storage, and dispatching UI alerts all within one function body).
    - **Decomposition & Composability:** Multi-step business workflows must be decomposed into focused, reusable helper functions coordinated by a high-level orchestrator. This guarantees predictable debugging, straightforward unit testing, and effortless maintainability.
