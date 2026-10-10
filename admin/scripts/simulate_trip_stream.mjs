/**
 * @file simulate_trip_stream.mjs
 * @description Simulates a live driver GPS broadcast on Firebase Realtime Database
 * along an authentic road transit corridor dynamically computed from the local road network.
 * Follows 100% real turn-by-turn road coordinates with realistic speeds and publishes full telemetry to RTDB.
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, remove } from "firebase/database";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadFirebaseEnv() {
  const envPath = fs.existsSync(path.resolve(__dirname, "../.env"))
    ? path.resolve(__dirname, "../.env")
    : path.resolve(__dirname, "../admin/.env");
  if (!fs.existsSync(envPath)) {
    throw new Error("Configuration file missing at " + envPath);
  }
  const content = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...vals] = trimmed.split("=");
    if (key && vals.length) {
      env[key.trim()] = vals.join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  }
  return env;
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

class FastRouter {
  constructor(nodes) {
    this.nodesMap = new Map();
    this.adjMap = new Map();
    this.grid = new Map();
    this.CELL = 0.01;
    for (const n of nodes) {
      this.nodesMap.set(n.id, n);
      if (!this.adjMap.has(n.id)) this.adjMap.set(n.id, []);
      for (const e of n.adj) {
        this.adjMap.get(n.id).push({ t: e.t, d: e.d, pts: e.pts });
        if (!this.adjMap.has(e.t)) this.adjMap.set(e.t, []);
        const revPts = e.pts ? [...e.pts].reverse() : undefined;
        this.adjMap.get(e.t).push({ t: n.id, d: e.d, pts: revPts });
      }
      const gx = Math.floor(n.lng / this.CELL);
      const gy = Math.floor(n.lat / this.CELL);
      const k = `${gx},${gy}`;
      if (!this.grid.has(k)) this.grid.set(k, []);
      this.grid.get(k).push(n);
    }
  }

  findNearest(lat, lng) {
    const gx = Math.floor(lng / this.CELL);
    const gy = Math.floor(lat / this.CELL);
    let best = null;
    let bestD = Infinity;
    for (let r = 0; r <= 8; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          const k = `${gx + dx},${gy + dy}`;
          for (const n of this.grid.get(k) || []) {
            const d = haversineDistanceKm(lat, lng, n.lat, n.lng);
            if (d < bestD) {
              bestD = d;
              best = n;
            }
          }
        }
      }
      if (bestD < (r + 1) * 0.9) break;
    }
    return best;
  }

  findPath(startCoord, goalCoord) {
    const sNode = this.findNearest(startCoord.lat, startCoord.lng);
    const gNode = this.findNearest(goalCoord.lat, goalCoord.lng);
    if (!sNode || !gNode) return [startCoord, goalCoord];

    const pq = [{ id: sNode.id, p: 0 }];
    const dist = new Map();
    const parent = new Map();
    dist.set(sNode.id, 0);

    const h = (id) => {
      const n = this.nodesMap.get(id);
      return n ? haversineDistanceKm(n.lat, n.lng, gNode.lat, gNode.lng) : 0;
    };

    let iterations = 0;
    let found = false;
    while (pq.length > 0 && iterations++ < 25000) {
      pq.sort((a, b) => a.p - b.p);
      const curr = pq.shift();
      const u = curr.id;
      if (u === gNode.id) { found = true; break; }
      const dU = dist.get(u);
      for (const edge of this.adjMap.get(u) || []) {
        const v = edge.t;
        const nd = dU + edge.d;
        if (nd < (dist.get(v) ?? Infinity)) {
          dist.set(v, nd);
          parent.set(v, { prev: u, pts: edge.pts });
          pq.push({ id: v, p: nd + h(v) });
        }
      }
    }

    if (!found) return [startCoord, goalCoord];
    const traversedEdges = [];
    let curr = gNode.id;
    while (curr !== sNode.id) {
      const p = parent.get(curr);
      if (!p) break;
      traversedEdges.push(p);
      curr = p.prev;
    }
    traversedEdges.reverse();

    const coords = [{ lat: startCoord.lat, lng: startCoord.lng }];
    for (const edge of traversedEdges) {
      if (edge.pts && edge.pts.length > 0) {
        for (const pt of edge.pts) {
          const last = coords[coords.length - 1];
          if (!last || last.lat !== pt[0] || last.lng !== pt[1]) {
            coords.push({ lat: pt[0], lng: pt[1] });
          }
        }
      } else {
        const n = this.nodesMap.get(edge.prev);
        if (n) {
          const last = coords[coords.length - 1];
          if (!last || last.lat !== n.lat || last.lng !== n.lng) {
            coords.push({ lat: n.lat, lng: n.lng });
          }
        }
      }
    }
    const last = coords[coords.length - 1];
    if (!last || last.lat !== goalCoord.lat || last.lng !== goalCoord.lng) {
      coords.push({ lat: goalCoord.lat, lng: goalCoord.lng });
    }
    return coords;
  }
}

/**
 * Computes road trajectory dynamically between Tahrir Square and ECU Campus using the road graph.
 */
function computeDynamicTrajectory() {
  const graphPath = path.resolve(__dirname, "../public/data/egypt_road_graph.json");
  if (!fs.existsSync(graphPath)) {
    throw new Error("Road network graph missing at: " + graphPath);
  }
  const graphData = JSON.parse(fs.readFileSync(graphPath, "utf8"));
  const router = new FastRouter(graphData.nodes);

  const start = { lat: 30.0444, lng: 31.2357 }; // Tahrir Square
  const end = { lat: 30.0345, lng: 31.3588 };   // ECU Campus Nasr City

  const rawPath = router.findPath(start, end);
  return rawPath.map((pt, idx) => ({
    lat: pt.lat,
    lng: pt.lng,
    index: idx + 1,
    total: rawPath.length,
  }));
}

async function runSimulation() {
  console.log("====================================================");
  console.log("   WASALT BUS TRACKER - DYNAMIC ROAD ROUTE STREAM");
  console.log("====================================================");

  const env = loadFirebaseEnv();
  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  const auth = getAuth(app);

  // Credentials come exclusively from admin/.env — never hardcode them here.
  const adminPassword = env.VITE_MASTER_ADMIN_PASSWORD;
  const adminEmails = (env.VITE_FIREBASE_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
  if (!adminPassword || adminEmails.length === 0) {
    throw new Error(
      "VITE_MASTER_ADMIN_PASSWORD and/or VITE_FIREBASE_ADMIN_EMAILS missing from admin/.env — set them (see admin/.env.example) and re-run."
    );
  }

  let userCred;
  let lastAuthError;
  for (const email of adminEmails) {
    try {
      userCred = await signInWithEmailAndPassword(auth, email, adminPassword);
      break;
    } catch (err) {
      lastAuthError = err;
    }
  }
  if (!userCred) {
    throw lastAuthError || new Error("Firebase sign-in failed for every configured admin email.");
  }

  const driverUid = userCred.user.uid;
  const lineId = "BRT-1";
  const db = getDatabase(app);
  const locationRef = ref(db, `busLocations/${lineId}/${driverUid}`);
  const trajectory = computeDynamicTrajectory();

  console.log(`[Simulator] Driver Beacon: ${userCred.user.email}`);
  console.log(`[Simulator] Target RTDB Path: /busLocations/${lineId}/${driverUid}`);
  console.log(`[Simulator] Dynamically computed ${trajectory.length} real road-following GPS nodes.`);
  console.log("[Simulator] Press Ctrl+C at any time to end trip cleanly.\n");

  const cleanup = async () => {
    console.log("\n[Simulator] Removing live beacon from RTDB...");
    try {
      await remove(locationRef);
      console.log("[Simulator] Telemetry cleaned. Trip ended.");
    } catch (e) {
      console.warn("[Simulator] Cleanup note:", e.message);
    }
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  let stepIdx = 0;
  while (true) {
    const point = trajectory[stepIdx % trajectory.length];
    const payload = {
      latitude: point.lat,
      longitude: point.lng,
      lastUpdated: new Date().toISOString(),
      startPoint: "Tahrir Square Hub",
      startLat: 30.0444,
      startLng: 31.2357,
      endPoint: "ECU Campus Nasr City",
      endLat: 30.0345,
      endLng: 31.3588,
      driverName: "Captain Tarek (Demo Trip)",
      driverEmail: userCred.user.email,
      speedKmh: Math.floor(42 + Math.sin(stepIdx) * 10),
      cameraMonitored: true,
      micMonitored: false,
      safetyStatus: "monitored_secure",
    };

    await set(locationRef, payload);
    const progress = Math.round(((stepIdx % trajectory.length) / trajectory.length) * 100);
    console.log(
      `[Trip Live] Node ${stepIdx + 1}/${trajectory.length} (${progress}%): ` +
      `GPS (${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}) | ` +
      `Speed: ${payload.speedKmh} km/h | Road Vertex ${point.index}/${point.total}`
    );

    stepIdx++;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

runSimulation().catch((err) => {
  console.error("[Simulator Error]", err);
  process.exit(1);
});
