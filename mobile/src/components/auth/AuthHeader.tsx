/**
 * @file AuthHeader.tsx
 * @description Authentication screen header displaying dynamic branding icon,
 * institutional application title, and welcoming subtitle.
 */

import React from "react";
import { View, Text, Image } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { styles } from "../../styles/loginStyles";
import { TenantBranding } from "../../config/tenantConfig";

export interface AuthHeaderProps {
  isSignUp: boolean;
  isRTL: boolean;
  branding: TenantBranding;
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
}) => {
  return (
    <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.header}>
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: branding.accentColor || "rgba(37, 99, 235, 0.1)" },
        ]}
      >
        {branding.logoUrl ? (
          <Image
            source={{ uri: branding.logoUrl }}
            style={styles.logoImage}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logoImage}
            resizeMode="cover"
          />
        )}
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
