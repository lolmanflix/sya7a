/**
 * @file DriverHeader.tsx
 * @description Driver profile header component displaying avatar, name,
 * dynamic company/tenant badge, operational status chip, and settings/logout action buttons.
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/driverHeaderStyles";
import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig";

export interface DriverHeaderProps {
  driverInitials: string;
  driverName: string;
  companyId: string | null;
  sharing: boolean;
  isRTL: boolean;
  isDark: boolean;
  vocabulary: TenantVocabulary;
  branding: TenantBranding;
  onOpenCompanyPicker: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

/**
 * Driver top navigation header bar displaying profile avatar, operational status, dynamic company badge, and action buttons.
 *
 * @param props - Driver header properties including avatar initials and modal triggers.
 */
export const DriverHeader: React.FC<DriverHeaderProps> = ({
  driverInitials,
  driverName,
  companyId,
  sharing,
  isRTL,
  isDark,
  vocabulary,
  branding,
  onOpenCompanyPicker,
  onOpenSettings,
  onLogout,
}) => {
  return (
    <View
      style={[
        styles.topBar,
        isDark && { backgroundColor: "#111827", borderColor: "#1F2937" },
      ]}
    >
      <View style={styles.driverInfoLeft}>
        {/* Driver Profile Avatar Ring */}
        <View style={styles.driverAvatarWrap}>
          <View
            style={[
              styles.driverAvatarRing,
              {
                borderColor: sharing
                  ? "#10B981"
                  : isDark
                  ? "#374151"
                  : branding.primaryColor || "#3B82F6",
              },
            ]}
          >
            <View
              style={[
                styles.driverAvatar,
                isDark && { backgroundColor: "#1E293B" },
              ]}
            >
              <Text
                style={[
                  styles.avatarInitials,
                  { color: isDark ? "#60A5FA" : branding.primaryColor },
                ]}
              >
                {driverInitials}
              </Text>
            </View>
          </View>
          {/* Status Indicator Dot */}
          <View
            style={[
              styles.statusDot,
              { backgroundColor: sharing ? "#10B981" : "#94A3B8" },
              isDark && { borderColor: "#111827" },
            ]}
          />
        </View>

        {/* Name & Dynamic Tenant Badge */}
        <View style={styles.driverTextCol}>
          <Text
            style={[
              styles.driverNameText,
              isDark && { color: "#F9FAFB" },
            ]}
            numberOfLines={1}
          >
            {driverName}
          </Text>
          <View style={styles.driverSubRow}>
            {/* Dynamic Company / Institution Badge */}
            <TouchableOpacity
              onPress={onOpenCompanyPicker}
              activeOpacity={0.7}
              style={[
                styles.companyBadge,
                isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
              ]}
            >
              <Ionicons
                name="business"
                size={11}
                color={isDark ? "#60A5FA" : branding.primaryColor}
              />
              <Text
                style={[
                  styles.companyBadgeText,
                  { color: isDark ? "#60A5FA" : branding.primaryColor },
                ]}
              >
                {companyId ? companyId.toUpperCase() : vocabulary.terminalLabel}
              </Text>
              <Ionicons
                name="chevron-down"
                size={10}
                color={isDark ? "#60A5FA" : branding.primaryColor}
              />
            </TouchableOpacity>

            {/* Live Telemetry Status Chip */}
            <View
              style={[
                styles.statusChip,
                {
                  backgroundColor: sharing
                    ? isDark
                      ? "rgba(16,185,129,0.15)"
                      : "#DCFCE7"
                    : isDark
                    ? "#1E293B"
                    : "#F1F5F9",
                },
              ]}
            >
              <View
                style={[
                  styles.statusChipDot,
                  { backgroundColor: sharing ? "#10B981" : "#94A3B8" },
                ]}
              />
              <Text
                style={[
                  styles.statusChipText,
                  {
                    color: sharing
                      ? "#10B981"
                      : isDark
                      ? "#94A3B8"
                      : "#64748B",
                  },
                ]}
              >
                {sharing
                  ? isRTL
                    ? "مباشر على الخريطة"
                    : "LIVE ON AIR"
                  : isRTL
                  ? "غير نشط"
                  : "OFFLINE"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons: Settings & Logout */}
      <View style={styles.topBarActions}>
        <TouchableOpacity
          onPress={onOpenSettings}
          style={[
            styles.iconBtn,
            isDark && { backgroundColor: "#1F2937" },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="settings-outline"
            size={18}
            color={isDark ? "#9CA3AF" : "#475569"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onLogout}
          style={[
            styles.logoutIconBtn,
            isDark && { backgroundColor: "rgba(239,68,68,0.12)" },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
