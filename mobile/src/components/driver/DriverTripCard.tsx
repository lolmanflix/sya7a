/**
 * @file DriverTripCard.tsx
 * @description Cockpit telemetry card rendering live speedometer, trip duration counter,
 * dynamic Point A to Point B terminals, emergency SOS beacon, and start/stop broadcast actions.
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/driverTripStyles";
import { formatTimer, DriverLocationPoint } from "../../hooks/useDriverTripState";
import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig";

export interface DriverTripCardProps {
  sharing: boolean;
  currentSpeed: number;
  tripSeconds: number;
  selectedBusLine: string | null;
  activeRoute: any;
  driverLocation: DriverLocationPoint | null;
  isRTL: boolean;
  isDark: boolean;
  vocabulary: TenantVocabulary;
  branding: TenantBranding;
  onStartSharing: () => void;
  onStopSharing: () => void;
  onSendSOS: () => void;
}

/**
 * Cockpit telemetry card rendering live speedometer gauge, trip duration timer, route endpoints, and broadcast actions.
 *
 * @param props - Speed metrics, timer, route metadata, and start/stop broadcast handlers.
 */
export const DriverTripCard: React.FC<DriverTripCardProps> = ({
  sharing,
  currentSpeed,
  tripSeconds,
  selectedBusLine,
  activeRoute,
  driverLocation,
  isRTL,
  isDark,
  vocabulary,
  branding,
  onStartSharing,
  onStopSharing,
  onSendSOS,
}) => {
  const routeEnd = activeRoute?.endPoint || selectedBusLine || vocabulary.endPointLabel;
  const routeStart = driverLocation?.name || (isRTL ? "موقع السائق الحالي" : "Current Driver Location");

  return (
    <View
      style={[
        styles.cockpitCard,
        isDark && { backgroundColor: "#111827", borderColor: "#1F2937" },
      ]}
    >
      {/* ── COCKPIT TOP ROW: Live Tag & Digital Timer ── */}
      <View style={styles.cockpitTopRow}>
        <View
          style={[
            styles.liveTag,
            {
              backgroundColor: sharing
                ? isDark
                  ? "rgba(16,185,129,0.18)"
                  : "#DCFCE7"
                : isDark
                ? "#1E293B"
                : "#F1F5F9",
            },
          ]}
        >
          <View
            style={[
              styles.pulsingDot,
              { backgroundColor: sharing ? "#10B981" : "#94A3B8" },
            ]}
          />
          <Text
            style={[
              styles.liveTagText,
              { color: sharing ? "#10B981" : isDark ? "#94A3B8" : "#64748B" },
            ]}
          >
            {sharing
              ? isRTL
                ? "بث مباشر عبر GPS"
                : "TRANSMITTING LIVE"
              : isRTL
              ? "جاهز للانطلاق"
              : "READY TO BROADCAST"}
          </Text>
        </View>

        {/* Digital Trip Timer */}
        <Text
          style={[
            styles.timerText,
            isDark && { color: "#F3F4F6" },
          ]}
        >
          {formatTimer(tripSeconds)}
        </Text>
      </View>

      {/* ── SPEEDOMETER & ROUTE SUMMARY ROW ── */}
      <View style={styles.speedRow}>
        {/* Speedometer Digital Gauge */}
        <View
          style={[
            styles.speedBox,
            isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
          ]}
        >
          <Text
            style={[
              styles.speedNum,
              { color: sharing ? (isDark ? "#34D399" : "#059669") : isDark ? "#94A3B8" : "#475569" },
            ]}
          >
            {currentSpeed}
          </Text>
          <Text
            style={[
              styles.speedUnit,
              isDark && { color: "#64748B" },
            ]}
          >
            {isRTL ? "كم/س" : "KM/H"}
          </Text>
        </View>

        {/* Route Details: Line & Destination */}
        <View style={styles.routeCol}>
          <Text style={[styles.routeLabel, isDark && { color: "#9CA3AF" }]}>
            {vocabulary.routeLabel}
          </Text>
          <Text
            style={[
              styles.routeVal,
              { color: isDark ? "#60A5FA" : branding.primaryColor },
            ]}
            numberOfLines={1}
          >
            {selectedBusLine || (isRTL ? "لم يتم تحديد خط" : "No Route Selected")}
          </Text>
          <Text
            style={[
              styles.routeDest,
              isDark && { color: "#D1D5DB" },
            ]}
            numberOfLines={1}
          >
            {routeEnd}
          </Text>
        </View>

        {/* Emergency SOS Button */}
        <TouchableOpacity
          style={styles.sosBtn}
          onPress={onSendSOS}
          activeOpacity={0.8}
        >
          <Ionicons name="warning" size={16} color="#FFFFFF" />
          <Text style={styles.sosBtnText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* ── BROADCAST ACTION CONTROLS ── */}
      {!sharing ? (
        <TouchableOpacity
          style={[
            styles.startBtn,
            { backgroundColor: branding.primaryColor || "#2563EB" },
          ]}
          onPress={onStartSharing}
          activeOpacity={0.85}
        >
          <View style={styles.startBtnIcon}>
            <Ionicons name="radio" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.startBtnText}>
            <Text style={styles.startBtnLabel}>
              {isRTL ? "بدء بث الرحلة ومشاركة الموقع" : "Start Live Broadcast"}
            </Text>
            <Text style={styles.startBtnSub}>
              {isRTL
                ? "مشاركة السرعة والمسار للركاب ومركز التحكم"
                : "Transmit live speed & coordinates to commuters"}
            </Text>
          </View>
          <Ionicons
            name={isRTL ? "arrow-back" : "arrow-forward"}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      ) : (
        <View style={{ gap: 10 }}>
          <View
            style={[
              styles.gpsPulsePill,
              isDark && { backgroundColor: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.3)" },
            ]}
          >
            <View style={styles.gpsPulseDot} />
            <Text style={styles.gpsPulseText}>
              {isRTL
                ? "نظام التتبع يبث إحداثيات GPS بدقة عالية..."
                : "GPS active: transmitting high-frequency telemetry..."}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.stopBtn}
            onPress={onStopSharing}
            activeOpacity={0.85}
          >
            <Ionicons name="stop-circle" size={20} color="#FFFFFF" />
            <Text style={styles.stopBtnText}>
              {isRTL ? "إنهاء الرحلة وإيقاف البث" : "End Trip & Stop Broadcast"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
