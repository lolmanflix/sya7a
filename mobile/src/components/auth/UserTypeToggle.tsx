/**
 * @file UserTypeToggle.tsx
 * @description Segmented role toggle component allowing users to switch between
 * Passenger (Commuter/Student/Employee) and Driver modes.
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/loginStyles";
import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig";

export interface UserTypeToggleProps {
  userType: "passenger" | "driver" | null;
  vocabulary: TenantVocabulary;
  branding: TenantBranding;
  onSelectUserType: (type: "passenger" | "driver") => void;
}

/**
 * Segmented control component for selecting user persona.
 *
 * @param props - Current user type and selection handler.
 */
export const UserTypeToggle: React.FC<UserTypeToggleProps> = ({
  userType,
  vocabulary,
  branding,
  onSelectUserType,
}) => {
  const isDriver = userType === "driver";

  return (
    <View style={styles.roleToggleContainer}>
      <TouchableOpacity
        style={[styles.roleTab, !isDriver && styles.roleTabActive]}
        onPress={() => onSelectUserType("passenger")}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons
            name="person"
            size={16}
            color={!isDriver ? branding.primaryColor : "#8E8E93"}
          />
          <Text
            style={[
              styles.roleTabText,
              !isDriver && [styles.roleTabTextActive, { color: branding.primaryColor }],
            ]}
          >
            {vocabulary.passengerLabel}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleTab, isDriver && styles.roleTabActive]}
        onPress={() => onSelectUserType("driver")}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons
            name="bus"
            size={16}
            color={isDriver ? branding.primaryColor : "#8E8E93"}
          />
          <Text
            style={[
              styles.roleTabText,
              isDriver && [styles.roleTabTextActive, { color: branding.primaryColor }],
            ]}
          >
            {vocabulary.driverTitle}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
