#!/usr/bin/env node

/**
 * Wasalt Admin Portal - Zero-Dependency Production Static Web Server
 * Runs on ANY OS (macOS, Windows, Linux) with standard Node.js (no npm install required).
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 5173;
const HOST = process.env.HOST || '127.0.0.1';
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.webp': 'image/webp',
};

if (!fs.existsSync(DIST_DIR)) {
  console.error('\n[ERROR] The "dist" production build directory was not found.');
  console.error('Please run "npm run build" first to compile the web assets.\n');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // Normalize and sanitize URL path to prevent directory traversal
  const urlPath = (req.url || '/').split('?')[0];
  const safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[\/\\])+/, '');
  
  let filePath = path.join(DIST_DIR, safePath);

  // Check if file exists; if directory, look for index.html
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        // SPA Fallback: Serve dist/index.html for client-side routing
        const indexPath = path.join(DIST_DIR, 'index.html');
        fs.readFile(indexPath, (indexErr, indexContent) => {
          if (indexErr) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexContent);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // Cache headers: assets get long cache, index.html is no-cache
      const headers = { 'Content-Type': contentType };
      if (ext === '.html') {
        headers['Cache-Control'] = 'no-cache';
      } else {
        headers['Cache-Control'] = 'public, max-age=31536000, immutable';
      }

      res.writeHead(200, headers);
      res.end(content);
    });
  });
});

server.listen(PORT, HOST, () => {
  const url = `http://${HOST}:${PORT}/`;
  console.log('\n========================================================');
  console.log('  WASALT TRANSIT OPERATIONS COMMAND - ADMIN PORTAL');
  console.log('========================================================');
  console.log(`[OK] Server running at: ${url}`);
  console.log('Press Ctrl+C to stop the server.\n');

  // Cross-platform browser auto-open
  const openCommands = {
    darwin: `open "${url}"`,
    win32: `start "" "${url}"`,
    linux: `xdg-open "${url}"`,
  };
  const cmd = openCommands[process.platform];
  if (cmd) {
    exec(cmd, () => {});
  }
});
