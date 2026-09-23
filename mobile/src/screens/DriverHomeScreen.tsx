/**
 * @file DriverHomeScreen.tsx
 * @description Driver operations dashboard coordinator screen.
 * Orchestrates live GPS telemetry broadcasting, cockpit speed metrics,
 * multi-stop itinerary timeline, SafeTrip WebRTC emergency camera monitoring,
 * and white-label multi-tenant institution customization.
 */

import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";

import { useTheme } from "../contexts/ThemeContext";
import { useI18n } from "../contexts/I18nContext";
import { useAuth } from "../contexts/AuthContext";
import { clearDriverSession } from "../utils/driverStorage";
import { useDriverSafetyStream } from "../utils/driverSafetyStream";
import { getTenantBranding, getTenantVocabulary, ACTIVE_TENANT } from "../config/tenantConfig";

// Modular Hooks
import { useDriverProfile } from "../hooks/useDriverProfile";
import { useDriverTripState } from "../hooks/useDriverTripState";

// Modular Presentation Components
import { DriverHeader } from "../components/driver/DriverHeader";
import { DriverTripCard } from "../components/driver/DriverTripCard";
import { DriverSafetyOverlay } from "../components/driver/DriverSafetyOverlay";
import { DriverRouteTimeline } from "../components/driver/DriverRouteTimeline";
import { CompanyPickerModal } from "../components/driver/DriverModals";
import SettingsModal from "../components/SettingsModal";

// Modular Layout Styles
import { layoutStyles } from "../styles/driverHomeStyles";

/**
 * Main Driver Portal Screen Component.
 */
export default function DriverHomeScreen() {
  const { theme } = useTheme();
  const { isRTL } = useI18n();
  const { user, logout } = useAuth();
  const isDark = theme.mode === "dark";

  // Data-driven white-label institutional vocabulary & branding
  const vocabulary = getTenantVocabulary(isRTL, ACTIVE_TENANT);
  const branding = getTenantBranding(ACTIVE_TENANT);

  // Camera & Mic hardware permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [cameraFacing, setCameraFacing] = useState<"front" | "back">("front");
  const [cameraPreviewOpen, setCameraPreviewOpen] = useState(true);
  const cameraRef = useRef<any>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Driver Profile & Route Line Catalog State Hook
  const {
    companyId,
    availableCompanies,
    busLines,
    selectedBusLine,
    setSelectedBusLine,
    activeRoute,
    driverInitials,
    driverName,
    companyPickerVisible,
    setCompanyPickerVisible,
    handleSelectCompany,
  } = useDriverProfile(user);

  /** Checks and requests camera & mic permissions */
  const ensureSafetyPermissions = async (): Promise<boolean> => {
    try {
      let camGranted = cameraPermission?.granted;
      if (!camGranted) {
        const res = await requestCameraPermission();
        camGranted = res.granted;
      }
      let micGranted = micPermission?.granted;
      if (!micGranted) {
        const res = await requestMicPermission();
        micGranted = res.granted;
      }
      return !!(camGranted && micGranted);
    } catch {
      return false;
    }
  };

  // SafeTrip WebRTC Remote Streaming Bridge
  const {
    isStreaming: isSafetyStreaming,
    webrtcHtml,
    webViewRef,
    onWebViewMessage,
  } = useDriverSafetyStream({
    user,
    driverName,
    cameraRef,
    isRTL,
    onSessionStart: () => setCameraPreviewOpen(true),
  });

  // Driver Live Telemetry & GPS Tracking State Hook
  const {
    sharing,
    currentSpeed,
    tripSeconds,
    driverLocation,
    startSharing,
    stopSharing,
    handleSendSOS,
  } = useDriverTripState({
    user,
    driverName,
    selectedBusLine,
    activeRoute,
    isRTL,
    cameraGranted: !!cameraPermission?.granted,
    micGranted: !!micPermission?.granted,
    onEnsurePermissions: ensureSafetyPermissions,
  });

  /** Handles safe session logout */
  const handleLogout = async () => {
    if (sharing) {
      Alert.alert(
        isRTL ? "أوقف الرحلة أولاً" : "Stop Trip First",
        isRTL ? "يجب إنهاء الرحلة قبل تسجيل الخروج." : "Please end your live trip before logging out."
      );
      return;
    }
    try {
      await clearDriverSession();
      await logout();
    } catch (err: any) {
      console.warn("[DriverAuth] Logout error:", err?.message || err);
    }
  };

  return (
    <SafeAreaView
      style={[
        layoutStyles.safeArea,
        { backgroundColor: isDark ? "#0A0E1A" : "#F0F4FF" },
      ]}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={layoutStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Driver Top Header Bar */}
          <DriverHeader
            driverInitials={driverInitials}
            driverName={driverName}
            companyId={companyId}
            sharing={sharing}
            isRTL={isRTL}
            isDark={isDark}
            vocabulary={vocabulary}
            branding={branding}
            onOpenCompanyPicker={() => setCompanyPickerVisible(true)}
            onOpenSettings={() => setSettingsVisible(true)}
            onLogout={handleLogout}
          />

          {/* 2. Cockpit Live Telemetry Card & Broadcast Controls */}
          <DriverTripCard
            sharing={sharing}
            currentSpeed={currentSpeed}
            tripSeconds={tripSeconds}
            selectedBusLine={selectedBusLine}
            activeRoute={activeRoute}
            driverLocation={driverLocation}
            isRTL={isRTL}
            isDark={isDark}
            vocabulary={vocabulary}
            branding={branding}
            onStartSharing={startSharing}
            onStopSharing={stopSharing}
            onSendSOS={handleSendSOS}
          />

          {/* 3. SafeTrip Remote Safety Camera Overlay & WebRTC Bridge */}
          <DriverSafetyOverlay
            cameraPermissionGranted={!!cameraPermission?.granted}
            micPermissionGranted={!!micPermission?.granted}
            cameraFacing={cameraFacing}
            cameraPreviewOpen={cameraPreviewOpen}
            cameraRef={cameraRef}
            isSafetyStreaming={isSafetyStreaming}
            webrtcHtml={webrtcHtml}
            webViewRef={webViewRef}
            isRTL={isRTL}
            isDark={isDark}
            onFlipCamera={() => setCameraFacing((prev) => (prev === "front" ? "back" : "front"))}
            onTogglePreview={() => setCameraPreviewOpen((prev) => !prev)}
            onRequestPermissions={ensureSafetyPermissions}
            onWebViewMessage={onWebViewMessage}
          />

          {/* 4. Multi-Stop Itinerary Timeline & Route Line Selector */}
          <DriverRouteTimeline
            busLines={busLines}
            selectedBusLine={selectedBusLine}
            activeRoute={activeRoute}
            driverLocation={driverLocation}
            isRTL={isRTL}
            isDark={isDark}
            vocabulary={vocabulary}
            branding={branding}
            onSelectLine={(line) => setSelectedBusLine(line)}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Company / Institution Selection Modal */}
      <CompanyPickerModal
        visible={companyPickerVisible}
        companies={availableCompanies}
        currentCompanyId={companyId}
        isRTL={isRTL}
        isDark={isDark}
        vocabulary={vocabulary}
        branding={branding}
        onClose={() => setCompanyPickerVisible(false)}
        onSelectCompany={handleSelectCompany}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </SafeAreaView>
  );
}
