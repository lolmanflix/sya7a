/**
 * @file AuthHeader.tsx
 * @description Authentication screen header displaying dynamic branding icon,
 * institutional application title, and welcoming subtitle.
 */

import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { styles } from "../../styles/loginStyles";
import { TenantBranding, TenantVocabulary } from "../../config/tenantConfig";

export interface AuthHeaderProps {
  isSignUp: boolean;
  isRTL: boolean;
  branding: TenantBranding;
  vocabulary: TenantVocabulary;
}

/**
 * Renders the top branding and titles for the login screen.
 *
 * @param props - Header configuration including sign up mode and tenant branding.
 */
export const AuthHeader: React.FC<AuthHeaderProps> = ({
  isSignUp,
  isRTL,
  branding,
  vocabulary,
}) => {
  return (
    <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.header}>
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: branding.accentColor || "rgba(37, 99, 235, 0.1)" },
        ]}
      >
        <Ionicons
          name="bus"
          size={40}
          color={branding.primaryColor || "#2563EB"}
        />
      </View>
      <Text style={styles.title}>
        {isRTL ? branding.appNameAr : branding.appName.toUpperCase()}
      </Text>
      <Text style={styles.subtitle}>
        {isSignUp
          ? isRTL
            ? "إنشاء حساب جديد"
            : "Create your account"
          : isRTL
          ? "مرحباً بك مجدداً!"
          : "Welcome back!"}
      </Text>
    </Animated.View>
  );
};
