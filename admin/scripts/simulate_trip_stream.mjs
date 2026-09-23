/**
 * @file simulate_trip_stream.mjs
 * @description Simulates a live driver GPS broadcast on Firebase Realtime Database
 * along an authentic Cairo arterial road transit corridor (Tahrir -> Ramses -> Abbasiya -> Nasr City -> ECU).
 * Follows road curves with realistic speeds and publishes full telemetry to RTDB.
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

/**
 * Natural Catmull-Rom spline interpolation between control coordinates.
 */
function interpolateRoadCurve(p0, p1, p2, p3, steps = 5) {
  const points = [];
  for (let t = 0; t <= 1; t += 1 / steps) {
    const t2 = t * t;
    const t3 = t2 * t;
    const lat =
      0.5 *
      (2 * p1[0] +
        (-p0[0] + p2[0]) * t +
        (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
        (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
    const lng =
      0.5 *
      (2 * p1[1] +
        (-p0[1] + p2[1]) * t +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
    points.push([lat, lng]);
  }
  return points;
}

/**
 * Generates turn-by-turn road coordinates along the real arterial corridor.
 */
function generateRoadTrajectory() {
  const waypoints = [
    { name: "Tahrir Square Hub", lat: 30.0444, lng: 31.2357 },
    { name: "Galaa St / Ramses Approach", lat: 30.0520, lng: 31.2410 },
    { name: "Ramses Square Transit Hub", lat: 30.0626, lng: 31.2469 },
    { name: "Ghamra Corridor", lat: 30.0680, lng: 31.2680 },
    { name: "Abbasiya Square", lat: 30.0667, lng: 31.2833 },
    { name: "Salah Salem / Qobba Axis", lat: 30.0710, lng: 31.3050 },
    { name: "Salah Salem / Panorama", lat: 30.0670, lng: 31.3180 },
    { name: "Tayaran St / Nasr City Entrance", lat: 30.0610, lng: 31.3250 },
    { name: "Makram Ebeid Intersection", lat: 30.0561, lng: 31.3300 },
    { name: "Mostafa El-Nahas Corridor", lat: 30.0450, lng: 31.3450 },
    { name: "Hassan Maamoun St", lat: 30.0380, lng: 31.3530 },
    { name: "ECU Campus Final Terminal", lat: 30.0345, lng: 31.3588 },
  ];

  const coords = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p0 = i > 0 ? [waypoints[i - 1].lat, waypoints[i - 1].lng] : [waypoints[i].lat, waypoints[i].lng];
    const p1 = [waypoints[i].lat, waypoints[i].lng];
    const p2 = [waypoints[i + 1].lat, waypoints[i + 1].lng];
    const p3 = i < waypoints.length - 2 ? [waypoints[i + 2].lat, waypoints[i + 2].lng] : p2;

    const segmentPoints = interpolateRoadCurve(p0, p1, p2, p3, 5);
    for (const pt of segmentPoints) {
      coords.push({
        lat: pt[0],
        lng: pt[1],
        segment: `${waypoints[i].name} -> ${waypoints[i + 1].name}`,
      });
    }
  }

  return coords;
}

async function runSimulation() {
  console.log("====================================================");
  console.log("   WASALT BUS TRACKER - ROAD-FOLLOWING TELEMETRY");
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
  let userCred;
  try {
    userCred = await signInWithEmailAndPassword(auth, "admin@sya7a.eg", "adminPassword2026!");
  } catch (err) {
    userCred = await signInWithEmailAndPassword(auth, "admin@wasalt.eg", "adminPassword2026!");
  }

  const driverUid = userCred.user.uid;
  const lineId = "BRT-1";
  const db = getDatabase(app);
  const locationRef = ref(db, `busLocations/${lineId}/${driverUid}`);
  const trajectory = generateRoadTrajectory();

  console.log(`[Simulator] Driver Beacon: ${userCred.user.email}`);
  console.log(`[Simulator] Target RTDB Path: /busLocations/${lineId}/${driverUid}`);
  console.log(`[Simulator] Generated ${trajectory.length} turn-by-turn road waypoints.`);
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

  let step = 0;
  while (true) {
    const point = trajectory[step % trajectory.length];
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
      speedKmh: Math.floor(40 + Math.sin(step) * 12),
      cameraMonitored: true,
      micMonitored: false,
      safetyStatus: "monitored_secure",
    };

    await set(locationRef, payload);
    const progress = Math.round(((step % trajectory.length) / trajectory.length) * 100);
    console.log(
      `[Trip Live] Node ${step + 1}/${trajectory.length} (${progress}%): ` +
      `GPS (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}) | ` +
      `Speed: ${payload.speedKmh} km/h | ${point.segment}`
    );

    step++;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

runSimulation().catch((err) => {
  console.error("[Simulator Error]", err);
  process.exit(1);
});
