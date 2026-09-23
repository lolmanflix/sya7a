/**
 * @file simulate_trip_stream.mjs
 * @description Simulates a live driver GPS broadcast on Firebase Realtime Database
 * along an arterial Cairo transit corridor (Tahrir -> Ramses -> Abbasiya -> Nasr City -> ECU).
 * Enables real-time verification of the offline vector map and road routing engine in the Admin Console.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, remove } from 'firebase/database';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadFirebaseEnv() {
  const envPath = path.resolve(__dirname, '../admin/.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('Configuration file missing at ' + envPath);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...vals] = trimmed.split('=');
    if (key && vals.length) {
      env[key.trim()] = vals.join('=').trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return env;
}

function generateTrajectory() {
  const keyNodes = [
    { name: 'Tahrir Square Hub', lat: 30.0444, lng: 31.2357 },
    { name: 'Ramses Transit Hub', lat: 30.0626, lng: 31.2469 },
    { name: 'Abbasiya Square', lat: 30.0667, lng: 31.2833 },
    { name: 'Nasr City - Makram Ebeid', lat: 30.0561, lng: 31.3300 },
    { name: 'ECU Campus - Final Terminal', lat: 30.0345, lng: 31.3588 },
  ];

  const stepsPerSegment = 5;
  const trajectory = [];

  for (let i = 0; i < keyNodes.length - 1; i++) {
    const from = keyNodes[i];
    const to = keyNodes[i + 1];
    for (let s = 0; s < stepsPerSegment; s++) {
      const ratio = s / stepsPerSegment;
      trajectory.push({
        lat: from.lat + (to.lat - from.lat) * ratio,
        lng: from.lng + (to.lng - from.lng) * ratio,
        segment: from.name + ' -> ' + to.name,
      });
    }
  }
  trajectory.push({
    lat: keyNodes[keyNodes.length - 1].lat,
    lng: keyNodes[keyNodes.length - 1].lng,
    segment: 'Arrived at ECU Campus Terminal',
  });

  return trajectory;
}

async function runSimulation() {
  console.log('====================================================');
  console.log('   WASALT BUS TRACKER - DEMO TRIP TELEMETRY SIMULATOR');
  console.log('====================================================');

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
    userCred = await signInWithEmailAndPassword(auth, 'admin@sya7a.eg', 'adminPassword2026!');
  } catch (err) {
    userCred = await signInWithEmailAndPassword(auth, 'admin@wasalt.eg', 'adminPassword2026!');
  }

  const driverUid = userCred.user.uid;
  const lineId = 'BRT-1';
  const db = getDatabase(app);
  const locationRef = ref(db, 'busLocations/' + lineId + '/' + driverUid);
  const trajectory = generateTrajectory();

  console.log('[Simulator] Authenticated as driver beacon: ' + userCred.user.email);
  console.log('[Simulator] Broadcasting to /busLocations/' + lineId + '/' + driverUid);
  console.log('[Simulator] Total trajectory waypoints: ' + trajectory.length);
  console.log('[Simulator] Press Ctrl+C at any time to end trip and clean up RTDB.\n');

  const cleanup = async () => {
    console.log('\n[Simulator] Detaching beacon and cleaning up RTDB...');
    try {
      await remove(locationRef);
      console.log('[Simulator] Telemetry node cleaned. Trip ended safely.');
    } catch (e) {
      console.warn('[Simulator] Cleanup warning:', e.message);
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  let step = 0;
  while (true) {
    const point = trajectory[step % trajectory.length];
    const payload = {
      latitude: point.lat,
      longitude: point.lng,
      lastUpdated: new Date().toISOString(),
      startPoint: 'Tahrir Square Hub',
      startLat: 30.0444,
      startLng: 31.2357,
      endPoint: 'ECU Campus Nasr City',
      endLat: 30.0345,
      endLng: 31.3588,
      driverName: 'Captain Tarek (Demo Trip)',
      driverEmail: userCred.user.email,
      speedKmh: Math.floor(35 + Math.random() * 20),
      cameraMonitored: true,
      micMonitored: false,
      safetyStatus: 'monitored_secure',
    };

    await set(locationRef, payload);
    const progress = Math.round(((step % trajectory.length) / trajectory.length) * 100);
    console.log(
      '[Trip Live] Step ' + (step + 1) + ' (' + progress + '%): ' +
      'GPS (' + point.lat.toFixed(4) + ', ' + point.lng.toFixed(4) + ') | ' +
      'Speed: ' + payload.speedKmh + ' km/h | ' + point.segment
    );

    step++;
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }
}

runSimulation().catch((err) => {
  console.error('[Simulator Error]', err);
  process.exit(1);
});
