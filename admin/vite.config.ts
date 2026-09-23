import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'

/**
 * In-process Vite plugin to serve local OpenStreetMap vector tiles directly
 * from /home/kimo/Storage/datasets/map.mbtiles on the same server port.
 */
function localMBTilesPlugin(): Plugin {
  const MBTILES_PATH = '/home/kimo/Storage/datasets/map.mbtiles';
  let db: DatabaseSync | null = null;
  if (fs.existsSync(MBTILES_PATH)) {
    try {
      db = new DatabaseSync(MBTILES_PATH, { open: true, readOnly: true });
    } catch (e) {
      console.warn('[LocalMap] Could not open MBTiles:', e);
    }
  }

  return {
    name: 'local-mbtiles-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/local-tiles/')) {
          return next();
        }
        const match = req.url.match(/\/local-tiles\/(\d+)\/(\d+)\/(\d+)/);
        if (!match || !db) {
          res.statusCode = 404;
          return res.end();
        }
        const z = parseInt(match[1], 10);
        const x = parseInt(match[2], 10);
        const y_xyz = parseInt(match[3], 10);
        const y_tms = (1 << z) - 1 - y_xyz;

        try {
          const stmt = db.prepare('SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?');
          const row = stmt.get(z, x, y_tms) as { tile_data: Uint8Array } | undefined;
          if (row && row.tile_data) {
            res.setHeader('Content-Type', 'application/x-protobuf');
            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.end(row.tile_data);
          }
        } catch (err) {
          console.error('[LocalMap] Tile read error:', err);
        }
        res.statusCode = 204;
        return res.end();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localMBTilesPlugin()],
})
