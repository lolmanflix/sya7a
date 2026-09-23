/**
 * @file driverTripHelpers.ts
 * @description Single-responsibility helper functions for driver trip initiation,
 * permission verification, GPS payload construction, and velocity calculation.
 */

import { Alert } from "react-native";
import * as Location from "expo-location";
import { ref, set } from "firebase/database";
import { database } from "../config/firebase";
import { setDriverBusLine } from "./driverStorage";
import { haversineMeters } from "./geoUtils";

export interface InitialTripPayloadOptions {
  latitude: number;
  longitude: number;
  startPoint: string;
  endPoint: string;
  endLat: number | null;
  endLng: number | null;
  stops: any[] | null;
  driverName: string;
  driverEmail: string | null;
  cameraMonitored: boolean;
  micMonitored: boolean;
}

/**
 * Validates pre-conditions required to begin active trip sharing.
 * @returns Error alert details if invalid, or null if valid.
 */
export function validateTripPrerequisites(
  user: any,
  selectedBusLine: string | null,
  isRTL: boolean
): { title: string; message: string } | null {
  if (!user) {
    return {
      title: isRTL ? "تسجيل الدخول مطلوب" : "Authentication Required",
      message: isRTL ? "يرجى تسجيل الدخول لبدء مشاركة الموقع." : "Please sign in to begin trip sharing.",
    };
  }
  if (!selectedBusLine) {
    return {
      title: isRTL ? "اختر خط المسار" : "Select Route Line",
      message: isRTL ? "يرجى اختيار خط المسار لبدء الرحلة." : "Please choose a route line to start your trip.",
    };
  }
  return null;
}

/**
 * Verifies that device location services are enabled and foreground permissions are granted.
 * @returns True if permissions and services are active.
 */
export async function verifyLocationPermissions(isRTL: boolean): Promise<boolean> {
  const hasServices = await Location.hasServicesEnabledAsync();
  if (!hasServices) {
    Alert.alert(
      isRTL ? "تحديد الموقع معطل" : "Location Services Disabled",
      isRTL ? "يرجى تفعيل خدمات الموقع في جهازك." : "Please enable location services on your device."
    );
    return false;
  }
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      isRTL ? "إذن الموقع مطلوب" : "Permission Required",
      isRTL ? "امنح إذن الموقع لمشاركة مسار الرحلة." : "Grant location permission to start live sharing."
    );
    return false;
  }
  return true;
}

/**
 * Constructs the canonical initial telemetry payload for Realtime Database.
 */
export function buildInitialTripPayload(opts: InitialTripPayloadOptions) {
  return {
    latitude: opts.latitude,
    longitude: opts.longitude,
    lastUpdated: new Date().toISOString(),
    startPoint: opts.startPoint,
    startLat: opts.latitude,
    startLng: opts.longitude,
    endPoint: opts.endPoint,
    endLat: opts.endLat,
    endLng: opts.endLng,
    stops: opts.stops,
    driverName: opts.driverName,
    driverEmail: opts.driverEmail,
    speedKmh: 0,
    cameraMonitored: opts.cameraMonitored,
    micMonitored: opts.micMonitored,
    safetyStatus: "monitored_secure",
  };
}

/**
 * Persists the initial trip state to Firebase Realtime Database and device storage.
 */
export async function persistInitialTrip(
  safeLineKey: string,
  driverUid: string,
  payload: any,
  selectedBusLine: string
): Promise<void> {
  await set(ref(database, `busLocations/${safeLineKey}/${driverUid}`), payload);
  await setDriverBusLine(selectedBusLine);
}

/**
 * Calculates smoothed instantaneous velocity between consecutive GPS updates.
 */
export function calculateInstantVelocity(
  prevLat: number,
  prevLng: number,
  currLat: number,
  currLng: number,
  dtSeconds: number,
  rawSpeed: number | null
): number {
  let instVel = 0;
  if (dtSeconds > 0.2) {
    const dist = haversineMeters(prevLat, prevLng, currLat, currLng);
    instVel = (dist / dtSeconds) * 3.6;
  }
  if (rawSpeed !== null && rawSpeed >= 0) {
    instVel = rawSpeed * 3.6;
  }
  return instVel;
}
