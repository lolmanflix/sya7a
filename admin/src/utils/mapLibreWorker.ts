/**
 * @file mapLibreWorker.ts
 * @description One-time MapLibre GL worker URL wiring for Vite.
 *
 * MapLibre resolves its default worker relative to `import.meta.url`, which 404s under
 * Vite dev pre-bundling (`.vite/deps/maplibre-gl-worker.mjs` does not exist) and in the
 * production bundle. Pointing `setWorkerUrl` at Vite's `?worker&url` asset makes the
 * worker load in both dev and build (relative-base safe via `import.meta.url`).
 */
import { setWorkerUrl } from 'maplibre-gl';
import workerAssetUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

let configured = false;

/**
 * Registers the bundled MapLibre worker URL exactly once. Idempotent and failure-tolerant:
 * on failure MapLibre falls back to its own default worker resolution.
 */
export function ensureMapLibreWorker(): void {
  if (configured) return;
  configured = true;
  try {
    if (workerAssetUrl) {
      setWorkerUrl(workerAssetUrl);
    }
  } catch (err) {
    console.warn('[MapLibre] Worker URL setup failed, using default worker resolution:', err);
  }
}
