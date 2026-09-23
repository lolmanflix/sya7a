/**
 * @file DriverSafetyOverlay.tsx
 * @description SafeTrip™ Remote Hardware Safety Monitoring component.
 * Embeds CameraView for driver cab monitoring, audio stream indicator,
 * permission request prompt, and WebRTC peer streaming bridge.
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { WebView } from "react-native-webview";
import { styles } from "../../styles/driverSafetyStyles";

export interface DriverSafetyOverlayProps {
  cameraPermissionGranted: boolean;
  micPermissionGranted: boolean;
  cameraFacing: "front" | "back";
  cameraPreviewOpen: boolean;
  cameraRef: React.RefObject<any>;
  isSafetyStreaming: boolean;
  webrtcHtml: string;
  webViewRef: React.RefObject<any>;
  isRTL: boolean;
  isDark: boolean;
  onFlipCamera: () => void;
  onTogglePreview: () => void;
  onRequestPermissions: () => void;
  onWebViewMessage: (event: any) => void;
}

/**
 * SafeTrip remote cabin safety camera monitoring overlay and WebRTC P2P streaming bridge.
 *
 * @param props - Hardware camera permissions, facing toggle, stream state, and signaling callbacks.
 */
export const DriverSafetyOverlay: React.FC<DriverSafetyOverlayProps> = ({
  cameraPermissionGranted,
  micPermissionGranted,
  cameraFacing,
  cameraPreviewOpen,
  cameraRef,
  isSafetyStreaming,
  webrtcHtml,
  webViewRef,
  isRTL,
  isDark,
  onFlipCamera,
  onTogglePreview,
  onRequestPermissions,
  onWebViewMessage,
}) => {
  const allGranted = cameraPermissionGranted && micPermissionGranted;

  return (
    <View
      style={[
        styles.safetyCard,
        isDark && { backgroundColor: "#111827", borderColor: "#1F2937" },
      ]}
    >
      {/* ── SAFETY CARD HEADER ── */}
      <View style={styles.safetyCardHeader}>
        <View style={styles.safetyTitleRow}>
          <View style={styles.shieldPill}>
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
          </View>
          <View>
            <Text style={[styles.safetyTitle, isDark && { color: "#F9FAFB" }]}>
              {isRTL ? "منظومة الأمان SafeTrip™" : "SafeTrip™ Remote Safety"}
            </Text>
            <Text style={styles.safetySub}>
              {isRTL
                ? "بث مباشر للكابينة عند الطوارئ عبر WebRTC"
                : "Live cabin telemetry & video dispatch"}
            </Text>
          </View>
        </View>

        {/* Hardware Status Sensors */}
        <View style={styles.sensorRow}>
          <View
            style={[
              styles.sensorPill,
              cameraPermissionGranted ? styles.sensorOn : styles.sensorOff,
            ]}
          >
            <View
              style={[
                styles.sensorDot,
                { backgroundColor: cameraPermissionGranted ? "#10B981" : "#94A3B8" },
              ]}
            />
            <Text
              style={[
                styles.sensorText,
                { color: cameraPermissionGranted ? "#065F46" : "#64748B" },
              ]}
            >
              CAM
            </Text>
          </View>

          <View
            style={[
              styles.sensorPill,
              micPermissionGranted ? styles.sensorOn : styles.sensorOff,
            ]}
          >
            <View
              style={[
                styles.sensorDot,
                { backgroundColor: micPermissionGranted ? "#10B981" : "#94A3B8" },
              ]}
            />
            <Text
              style={[
                styles.sensorText,
                { color: micPermissionGranted ? "#065F46" : "#64748B" },
              ]}
            >
              MIC
            </Text>
          </View>
        </View>
      </View>

      {/* ── PERMISSION REQUEST PROMPT IF NOT GRANTED ── */}
      {!allGranted && (
        <View style={styles.permPrompt}>
          <View style={styles.permIconRing}>
            <Ionicons name="videocam-outline" size={20} color="#F59E0B" />
          </View>
          <Text style={[styles.permTitle, isDark && { color: "#F9FAFB" }]}>
            {isRTL ? "إذن الكاميرا والميكروفون مطلوب" : "Camera & Microphone Required"}
          </Text>
          <Text style={styles.permDesc}>
            {isRTL
              ? "لتفعيل خاصية المتابعة الأمنية والتحقق البصري المباشر لسلامة الحافلة والركاب."
              : "Enable cabin safety inspection and emergency live streaming for passenger safety."}
          </Text>
          <TouchableOpacity
            style={styles.grantBtn}
            onPress={onRequestPermissions}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color="#FFFFFF" />
            <Text style={styles.grantBtnText}>
              {isRTL ? "تفعيل صلاحيات الأمان" : "Grant Safety Permissions"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── CAMERA PREVIEW & WEBRTC CONTROLS ── */}
      {allGranted && (
        <View style={styles.camWrapper}>
          {cameraPreviewOpen ? (
            <View style={styles.camFrame}>
              <CameraView
                ref={cameraRef}
                style={styles.camView}
                facing={cameraFacing}
              >
                {/* HUD Top Bar */}
                <View style={styles.camTopHUD}>
                  <View style={styles.recBadge}>
                    <View style={styles.recDot} />
                    <Text style={styles.recText}>
                      {isSafetyStreaming ? "WEBRTC STREAMING" : "STANDBY MONITOR"}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.flipBtn}
                    onPress={onFlipCamera}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="camera-reverse" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* HUD Corner Reticles */}
                <View style={[styles.corner, styles.cTL]} />
                <View style={[styles.corner, styles.cTR]} />
                <View style={[styles.corner, styles.cBL]} />
                <View style={[styles.corner, styles.cBR]} />

                {/* HUD Bottom Audio Level Bar */}
                <View style={styles.camBottomHUD}>
                  <Ionicons name="mic" size={13} color="#10B981" />
                  <Text style={styles.audioText}>
                    {isRTL ? "الميكروفون متصل" : "Cab Microphone Active"}
                  </Text>
                  <View style={styles.waves}>
                    <View style={[styles.wave, { height: 8 }]} />
                    <View style={[styles.wave, { height: 14 }]} />
                    <View style={[styles.wave, { height: 10 }]} />
                    <View style={[styles.wave, { height: 6 }]} />
                  </View>
                </View>
              </CameraView>
            </View>
          ) : (
            <View
              style={[
                styles.camMini,
                isDark && { backgroundColor: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.3)" },
              ]}
            >
              <View style={styles.camMiniLeft}>
                <View style={styles.camMiniIcon}>
                  <Ionicons name="videocam" size={16} color="#059669" />
                </View>
                <Text style={styles.camMiniText}>
                  {isRTL ? "مراقبة الكابينة نشطة في الخلفية" : "Safety Feed Active (Minimized)"}
                </Text>
              </View>
              <View style={styles.livePill}>
                <View style={styles.recDotSmall} />
                <Text style={styles.livePillText}>SECURE</Text>
              </View>
            </View>
          )}

          {/* Expand / Minimize Preview Toggle */}
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={onTogglePreview}
            activeOpacity={0.7}
          >
            <Ionicons
              name={cameraPreviewOpen ? "eye-off-outline" : "eye-outline"}
              size={15}
              color="#64748B"
            />
            <Text style={styles.toggleText}>
              {cameraPreviewOpen
                ? isRTL
                  ? "تصغير معاينة الكاميرا"
                  : "Minimize Camera Preview"
                : isRTL
                ? "عرض معاينة الكاميرا المباشرة"
                : "Expand Camera Preview"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Hidden WebView Bridge for WebRTC P2P Handshake */}
      {webrtcHtml ? (
        <View style={{ width: 0, height: 0, opacity: 0, position: "absolute" }}>
          <WebView
            ref={webViewRef}
            source={{ html: webrtcHtml }}
            onMessage={onWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback
          />
        </View>
      ) : null}
    </View>
  );
};
