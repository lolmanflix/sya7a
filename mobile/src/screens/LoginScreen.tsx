/**
 * @file LoginScreen.tsx
 * @description Primary authentication screen coordinator.
 * Orchestrates commuter & driver login, registration, Apple SSO,
 * password recovery, dynamic company assignment, and institutional white-labeling.
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useI18n } from "../contexts/I18nContext";
import { useTheme } from "../contexts/ThemeContext";
import { getTenantBranding, getTenantVocabulary } from "../config/tenantConfig";
import { useTenantArchetype } from "../hooks/useTenantArchetype";

// Modular Hook & Components
import { useAuthForm } from "../hooks/useAuthForm";
import { AuthHeader } from "../components/auth/AuthHeader";
import { UserTypeToggle } from "../components/auth/UserTypeToggle";
import { DriverCompanyPicker } from "../components/auth/DriverCompanyPickerModal";
import { ForgotPasswordModal } from "../components/auth/ForgotPasswordModal";
import SignedInAccountsChooser from "../components/auth/SignedInAccountsChooser";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

// Styles
import { styles } from "../styles/loginStyles";

/**
 * Main User & Driver Authentication Screen.
 */
export default function LoginScreen() {
  const { isRTL } = useI18n();
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const insets = useSafeAreaInsets();

  // Data-driven white-label institutional vocabulary & branding
  const archetype = useTenantArchetype();
  const vocabulary = getTenantVocabulary(isRTL, archetype);
  const branding = getTenantBranding(archetype);

  // Authentication Form Custom Hook
  const {
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    isSignUp,
    setIsSignUp,
    loading,
    userType,
    setUserType,
    companies,
    selectedCompany,
    setSelectedCompany,
    selectedCompanyName,
    companyModalVisible,
    setCompanyModalVisible,
    showForgotPassword,
    setShowForgotPassword,
    handleAuth,
    handleAppleSignIn,
    handlePasswordReset,
  } = useAuthForm();

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        isDark && { backgroundColor: "#0A0E1A" },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: 40 + insets.top, paddingBottom: 40 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Dynamic Branding Header */}
        <AuthHeader
          isSignUp={isSignUp}
          isRTL={isRTL}
          branding={branding}
        />

        {/* 2. Persona Role Selector Toggle (Passenger vs Driver) */}
        <UserTypeToggle
          userType={userType}
          vocabulary={vocabulary}
          branding={branding}
          onSelectUserType={(type) => setUserType(type)}
        />

        {/* 3. Previously added accounts — silent switch (no password re-entry) */}
        <SignedInAccountsChooser />

        {/* 4. Credentials & Registration Form */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.form}
        >
          {/* Driver Company / Organization Selector */}
          {userType === "driver" && (
            <DriverCompanyPicker
              companies={companies}
              selectedCompany={selectedCompany}
              selectedCompanyName={selectedCompanyName}
              modalVisible={companyModalVisible}
              isRTL={isRTL}
              vocabulary={vocabulary}
              branding={branding}
              onOpenModal={() => setCompanyModalVisible(true)}
              onCloseModal={() => setCompanyModalVisible(false)}
              onSelectCompany={(cid) => setSelectedCompany(cid)}
            />
          )}

          {/* Username (Sign-Up only) */}
          {isSignUp && (
            <Input
              label={isRTL ? "اسم المستخدم" : "Username"}
              iconName="person-outline"
              placeholder={isRTL ? "أدخل اسم المستخدم" : "Enter your username"}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}

          {/* Email Address */}
          <Input
            label={isRTL ? "البريد الإلكتروني" : "Email Address"}
            iconName="mail-outline"
            placeholder={isRTL ? "أدخل البريد الإلكتروني" : "Enter your email"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password */}
          <Input
            label={isRTL ? "كلمة المرور" : "Password"}
            iconName="lock-closed-outline"
            placeholder={isRTL ? "أدخل كلمة المرور" : "Enter your password"}
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          {/* Forgot Password Trigger */}
          {!isSignUp && (
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => setShowForgotPassword(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 14, bottom: 14, left: 0, right: 0 }}
            >
              <Text
                style={[
                  styles.forgotPasswordText,
                  { color: branding.primaryColor || "#2563EB" },
                ]}
              >
                {isRTL ? "نسيت كلمة المرور؟" : "Forgot Password?"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Primary Action Button */}
          <Button
            title={
              isSignUp
                ? isRTL
                  ? "إنشاء حساب جديد"
                  : "Sign Up"
                : isRTL
                ? "تسجيل الدخول"
                : "Login"
            }
            onPress={handleAuth}
            loading={loading}
            style={{
              ...styles.mainButton,
              backgroundColor: branding.primaryColor || "#2563EB",
            }}
            size="large"
          />

          {/* Sign Up / Login Switcher */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setUsername("");
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 14, bottom: 14, left: 0, right: 0 }}
          >
            <Text style={styles.toggleTextPrimary}>
              {isSignUp
                ? isRTL
                  ? "لديك حساب بالفعل؟ "
                  : "Already have an account? "
                : isRTL
                ? "ليس لديك حساب؟ "
                : "Don't have an account? "}
              <Text
                style={[
                  styles.toggleTextSecondary,
                  { color: branding.primaryColor || "#2563EB" },
                ]}
              >
                {isSignUp
                  ? isRTL
                    ? "تسجيل الدخول"
                    : "Login"
                  : isRTL
                  ? "إنشاء حساب"
                  : "Create account"}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Apple Sign-In Divider (Passengers only) */}
          {userType !== "driver" && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{isRTL ? "أو" : "OR"}</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title={isRTL ? "تسجيل الدخول عبر Apple" : "Sign in with Apple"}
                onPress={handleAppleSignIn}
                variant="secondary"
                icon={
                  <Ionicons
                    name="logo-apple"
                    size={20}
                    color={theme.colors.textPrimary}
                  />
                }
                disabled={loading}
                size="large"
              />
            </>
          )}
        </Animated.View>
      </ScrollView>

      {/* 5. Password Recovery Dialog Modal (outside the scroll area so the
          keyboard-avoiding viewport keeps it clear of the keyboard) */}
      <ForgotPasswordModal
        visible={showForgotPassword}
        email={email}
        loading={loading}
        isRTL={isRTL}
        onChangeEmail={setEmail}
        onClose={() => setShowForgotPassword(false)}
        onSubmit={handlePasswordReset}
      />
    </KeyboardAvoidingView>
  );
}
