import { validateTripPrerequisites, verifyLocationPermissions, buildInitialTripPayload, persistInitialTrip, calculateInstantVelocity } from "../utils/driverTripHelpers";
/**
 * @file useDriverTripState.ts
 * @description Custom hook encapsulating live GPS telemetry tracking, speed calculation,
 * trip duration timer, emergency SOS signaling, and Firebase Realtime Database telemetry sync.
 */

import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import { ref, set, remove } from "firebase/database";
import { auth, database } from "../config/firebase";
import { setDriverBusLine } from "../utils/driverStorage";



/** Formats total trip elapsed seconds into HH:MM:SS or MM:SS */
import {
  haversineMeters,
  formatTimer,
  isValidCoordinate,
  sanitizePathKey,
} from "../utils/geoUtils";

export { haversineMeters, formatTimer, isValidCoordinate, sanitizePathKey };

export interface DriverLocationPoint {
  lat: number;
  lng: number;
  name: string;
}

export interface UseDriverTripStateProps {
  user: any;
  driverName: string;
  selectedBusLine: string | null;
  activeRoute: any;
  isRTL: boolean;
  cameraGranted: boolean;
  micGranted: boolean;
  onEnsurePermissions: () => Promise<boolean>;
}

/**
 * Core driver trip state hook managing live GPS tracking loop, velocity smoothing,
 * duration timer, dynamic Point A reverse geocoding, and RTDB telemetry sync.
 *
 * @param props - Hook configuration including user auth, route metadata, and permission triggers.
 * @returns State properties and actions (startSharing, stopSharing, sendSOS, currentSpeed).
 */
export function useDriverTripState({
  user,
  driverName,
  selectedBusLine,
  activeRoute,
  isRTL,
  cameraGranted,
  micGranted,
  onEnsurePermissions,
}: UseDriverTripStateProps) {
  const [sharing, setSharing] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [tripSeconds, setTripSeconds] = useState<number>(0);
  const [driverLocation, setDriverLocation] = useState<DriverLocationPoint | null>(null);

  const locationSubRef = useRef<Location.LocationSubscription | null>(null);

  // Initial Point A capture on screen mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (!isMounted) return;
          let placeName = "";
          try {
            const [geo] = await Location.reverseGeocodeAsync({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            if (geo) {
              placeName = [geo.name || geo.street, geo.district, geo.city].filter(Boolean).join(", ");
            }
          } catch {}
          setDriverLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: placeName || (isRTL ? "موقعك الحالي (GPS)" : "Current Driver GPS Location"),
          });
        }
      } catch (err) {
        console.warn("[DriverGPS] Initial Point A location fetch error:", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [isRTL]);

  // Trip duration second ticker
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (sharing) {
      timer = setInterval(() => {
        setTripSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setTripSeconds(0);
      setCurrentSpeed(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sharing]);

  // Cleanup GPS subscription on unmount
  useEffect(() => {
    return () => {
      if (locationSubRef.current) {
        locationSubRef.current.remove();
        locationSubRef.current = null;
      }
    };
  }, []);

  /**
   * Starts high-frequency GPS tracking and RTDB telemetry sync.
   */
  /**
   * Coordinates driver trip initiation, hardware GPS acquisition, initial RTDB sync, and location stream subscription.
   */
  const startSharing = async () => {
    const prereqError = validateTripPrerequisites(user, selectedBusLine, isRTL);
    if (prereqError) {
      Alert.alert(prereqError.title, prereqError.message);
      return;
    }

    const permissionsGranted = await verifyLocationPermissions(isRTL);
    if (!permissionsGranted) return;

    await onEnsurePermissions();

    const activeUser = auth.currentUser || user;
    if (!activeUser?.uid) {
      Alert.alert(
        isRTL ? "تسجيل الدخول مطلوب" : "Authentication Required",
        isRTL ? "يرجى تسجيل الدخول مرة أخرى لبدء مشاركة الموقع." : "Your session has expired. Please log in again."
      );
      return;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      if (!isValidCoordinate(loc.coords.latitude, loc.coords.longitude)) {
        throw new Error("Invalid GPS coordinates received from device sensors.");
      }

      const safeLineKey = sanitizePathKey(selectedBusLine!);
      const startPointA = driverLocation?.name || (isRTL ? "موقع السائق الحالي" : "Driver's Current Location");
      const routeEnd = activeRoute?.endPoint || selectedBusLine!;
      const routeEndLat = activeRoute?.endLat ?? null;
      const routeEndLng = activeRoute?.endLng ?? null;
      const routeStops = activeRoute?.stops || null;

      const initialPayload = buildInitialTripPayload({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        startPoint: startPointA,
        endPoint: routeEnd,
        endLat: routeEndLat,
        endLng: routeEndLng,
        stops: routeStops,
        driverName,
        driverEmail: activeUser.email || null,
        cameraMonitored: cameraGranted,
        micMonitored: micGranted,
      });

      await persistInitialTrip(safeLineKey, activeUser.uid, initialPayload, selectedBusLine!);

      let prevLat = loc.coords.latitude;
      let prevLng = loc.coords.longitude;
      let prevTime = Date.now();
      let smoothVel = 0;

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        async (position) => {
          try {
            const now = Date.now();
            const dt = (now - prevTime) / 1000;
            const instVel = calculateInstantVelocity(
              prevLat,
              prevLng,
              position.coords.latitude,
              position.coords.longitude,
              dt,
              position.coords.speed
            );
            prevLat = position.coords.latitude;
            prevLng = position.coords.longitude;
            prevTime = now;
            smoothVel = smoothVel * 0.4 + instVel * 0.6;
            setCurrentSpeed(Math.round(smoothVel));

            const currentUid = auth.currentUser?.uid || user?.uid;
            if (!currentUid || !selectedBusLine) return;

            await set(ref(database, `busLocations/${safeLineKey}/${currentUid}`), {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              lastUpdated: new Date().toISOString(),
              startPoint: startPointA,
              startLat: position.coords.latitude,
              startLng: position.coords.longitude,
              endPoint: routeEnd,
              endLat: routeEndLat,
              endLng: routeEndLng,
              stops: routeStops,
              driverName,
              driverEmail: auth.currentUser?.email || user?.email || null,
              speedKmh: Math.round(smoothVel),
              cameraMonitored: cameraGranted,
              micMonitored: micGranted,
              safetyStatus: "monitored_secure",
            });
          } catch (syncErr: any) {
            console.warn("[DriverGPS] Telemetry push warning:", syncErr?.message || syncErr);
          }
        }
      );

      locationSubRef.current = sub;
      setSharing(true);
    } catch (err: any) {
      console.error("[DriverGPS] Start trip error:", err);
      const isPermissionDenied = err?.message?.includes("PERMISSION_DENIED") || err?.code === "PERMISSION_DENIED";
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isPermissionDenied
          ? (isRTL ? "تم رفض الإذن. يرجى تسجيل الخروج وتسجيل الدخول مجدداً لتحديث الجلسة." : "Session expired or database permission denied. Please log back in.")
          : (err?.message || "Failed to start trip.")
      );
    }
  };

  /**
   * Prompts driver to end trip, detaches GPS watcher, and removes ephemeral RTDB telematics.
   */
  const stopSharing = async () => {
    Alert.alert(
      isRTL ? "إنهاء الرحلة" : "End Trip",
      isRTL ? "هل أنت متأكد من إنهاء الرحلة وإيقاف مشاركة الموقع؟" : "Are you sure you want to end this trip and stop broadcasting?",
      [
        { text: isRTL ? "إلغاء" : "Cancel", style: "cancel" },
        {
          text: isRTL ? "إنهاء الرحلة" : "End Trip",
          style: "destructive",
          onPress: async () => {
            if (locationSubRef.current) {
              locationSubRef.current.remove();
              locationSubRef.current = null;
            }
            if (user && selectedBusLine) {
              const safeLineKey = sanitizePathKey(selectedBusLine);
            await remove(ref(database, `busLocations/${safeLineKey}/${user.uid}`)).catch((remErr) => {
              console.warn("[DriverGPS] RTDB cleanup warning on trip end:", remErr?.message || remErr);
            });
            }
            setSharing(false);
            setCurrentSpeed(0);
          },
        },
      ]
    );
  };

  /**
   * Dispatches instant distress beacon to operations command.
   */
  const handleSendSOS = async () => {
    if (!user) return;
    Alert.alert(
      isRTL ? "تنبيه طوارئ SOS" : "Emergency SOS Alert",
      isRTL ? "هل تريد إرسال نداء استغاثة فوري لمركز التحكم؟" : "Broadcast immediate distress signal to operations control?",
      [
        { text: isRTL ? "إلغاء" : "Cancel", style: "cancel" },
        {
          text: isRTL ? "إرسال SOS" : "Send SOS Alert",
          style: "destructive",
          onPress: async () => {
            try {
              await set(ref(database, `driverControls/${user.uid}/sosAlert`), {
                triggeredAt: new Date().toISOString(),
                driverName,
                driverEmail: user.email,
                busLine: selectedBusLine,
                endPoint: activeRoute?.endPoint || selectedBusLine || "N/A",
                status: "critical_sos",
              });
              Alert.alert(
                isRTL ? "تم إرسال الاستغاثة" : "SOS Sent",
                isRTL ? "تم إخطار مركز العمليات بموقعك فورياً." : "Operations dispatch has been alerted with your live location."
              );
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );
  };

  return {
    sharing,
    currentSpeed,
    tripSeconds,
    driverLocation,
    startSharing,
    stopSharing,
    handleSendSOS,
  };
}
