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

