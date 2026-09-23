/**
 * @file DriverRouteTimeline.tsx
 * @description Renders the route line selector and multi-stop itinerary timeline,
 * visualizing intermediate stops, landmarks, and dynamic Point A location.
 */

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/driverRouteStyles";
import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig";
import { DriverLocationPoint } from "../../hooks/useDriverTripState";

export interface DriverRouteTimelineProps {
  busLines: string[];
  selectedBusLine: string | null;
  activeRoute: any;
  driverLocation: DriverLocationPoint | null;
  isRTL: boolean;
  isDark: boolean;
  vocabulary: TenantVocabulary;
  branding: TenantBranding;
  onSelectLine: (lineId: string) => void;
}

/**
 * Route selector and multi-stop itinerary timeline visualizing sequential transit stops, landmarks, and Point A.
 *
 * @param props - Available lines, selected line, route stop sequence, and line selection callback.
 */
export const DriverRouteTimeline: React.FC<DriverRouteTimelineProps> = ({
  busLines,
  selectedBusLine,
  activeRoute,
  driverLocation,
  isRTL,
  isDark,
  vocabulary,
  branding,
  onSelectLine,
}) => {
  const stops: any[] = Array.isArray(activeRoute?.stops) ? activeRoute.stops : [];
  const startPointName = driverLocation?.name || (isRTL ? "موقع السائق الحالي (GPS)" : "Driver GPS Location");
  const endPointName = activeRoute?.endPoint || selectedBusLine || vocabulary.endPointLabel;

  return (
    <View
      style={[
        styles.configCard,
        isDark && { backgroundColor: "#111827", borderColor: "#1F2937" },
      ]}
    >
      {/* ── CARD HEADER ── */}
      <View style={styles.configCardHead}>
        <View style={styles.configTitleRow}>
          <View style={[styles.configIcon, { backgroundColor: branding.accentColor || "#EFF6FF" }]}>
            <Ionicons name="git-branch" size={16} color={branding.primaryColor || "#2563EB"} />
          </View>
          <View>
            <Text style={[styles.configTitle, isDark && { color: "#F9FAFB" }]}>
              {vocabulary.routeLabel}
            </Text>
            <Text style={styles.configSub}>
              {isRTL
                ? "اختر المسار لتحديد محطات الوقوف والمقصد"
                : "Select active line for stop sequence & destination"}
            </Text>
          </View>
        </View>
      </View>

      {/* ── ROUTE LINE HORIZONTAL SELECTOR CHIPS ── */}
      {busLines.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          {busLines.map((line) => {
            const isSel = selectedBusLine === line;
            return (
              <TouchableOpacity
                key={line}
                style={[
                  styles.busChip,
                  isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
                  isSel && [
                    styles.busChipSel,
                    { backgroundColor: branding.primaryColor, borderColor: branding.primaryColor },
                  ],
                ]}
                onPress={() => onSelectLine(line)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="bus"
                  size={14}
                  color={isSel ? "#FFFFFF" : isDark ? "#9CA3AF" : "#64748B"}
                />
                <Text
                  style={[
                    styles.busChipText,
                    isDark && { color: "#CBD5E1" },
                    isSel && styles.busChipTextSel,
                  ]}
                >
                  {line}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyRouteBox}>
          <Text style={styles.emptyRouteText}>
            {isRTL
              ? "لا توجد خطوط مسجلة لهذه الشركة حالياً"
              : "No lines registered for this company"}
          </Text>
        </View>
      )}

      {/* ── SELECTED ROUTE BANNER ── */}
      {selectedBusLine && (
        <View
          style={[
            styles.selLineBanner,
            isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7, flex: 1 }}>
            <Ionicons name="navigate-circle" size={18} color={branding.primaryColor} />
            <Text
              style={[
                styles.selLineBannerText,
                { color: isDark ? "#93C5FD" : branding.primaryColor },
              ]}
              numberOfLines={1}
            >
              {selectedBusLine}: {endPointName}
            </Text>
          </View>

          {stops.length > 0 && (
            <View
              style={[
                styles.stopsCountBadge,
                { backgroundColor: isDark ? "#374151" : "#DBEAFE" },
              ]}
            >
              <Text
                style={[
                  styles.stopsCountText,
                  { color: isDark ? "#93C5FD" : "#1D4ED8" },
                ]}
              >
                {stops.length} {vocabulary.stopLabel}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* ── MULTI-STOP ITINERARY TIMELINE ── */}
      {selectedBusLine && (
        <View
          style={[
            styles.itineraryBox,
            isDark && { backgroundColor: "#0F172A", borderColor: "#1E293B" },
          ]}
        >
          {/* Point A: Starting Location */}
          <View style={styles.itineraryRow}>
            <View style={styles.terminalIndicator}>
              <View style={[styles.terminalDot, { backgroundColor: "#10B981" }]} />
              <View style={styles.timelineTrack} />
            </View>
            <View style={styles.itineraryInfo}>
              <Text style={[styles.itineraryRole, { color: "#10B981" }]}>
                {vocabulary.startPointLabel} (Point A)
              </Text>
              <Text
                style={[
                  styles.itineraryName,
                  isDark && { color: "#F3F4F6" },
                ]}
                numberOfLines={1}
              >
                {startPointName}
              </Text>
            </View>
          </View>

          {/* Intermediate Stops */}
          {stops.map((stop, idx) => (
            <View key={stop.id || idx} style={styles.itineraryRow}>
              <View style={styles.terminalIndicator}>
                <View
                  style={[
                    styles.stopNumberCircle,
                    isDark && { backgroundColor: "#334155" },
                  ]}
                >
                  <Text style={styles.stopNumberText}>{idx + 1}</Text>
                </View>
                <View style={styles.timelineTrack} />
              </View>
              <View style={styles.itineraryInfo}>
                <Text style={styles.itineraryRole}>
                  {vocabulary.stopLabel} #{idx + 1}
                </Text>
                <Text
                  style={[
                    styles.itineraryName,
                    isDark && { color: "#F3F4F6" },
                  ]}
                  numberOfLines={1}
                >
                  {stop.name || `${vocabulary.stopLabel} ${idx + 1}`}
                </Text>
              </View>
            </View>
          ))}

          {/* Point B: Destination Terminal */}
          <View style={styles.itineraryRow}>
            <View style={styles.terminalIndicator}>
              <View style={[styles.terminalDot, { backgroundColor: "#EF4444" }]} />
            </View>
            <View style={styles.itineraryInfo}>
              <Text style={[styles.itineraryRole, { color: "#EF4444" }]}>
                {vocabulary.terminalLabel} (Point B)
              </Text>
              <Text
                style={[
                  styles.itineraryName,
                  isDark && { color: "#F3F4F6" },
                ]}
                numberOfLines={1}
              >
                {endPointName}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
