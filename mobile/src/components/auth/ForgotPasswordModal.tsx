/**
 * @file ForgotPasswordModal.tsx
 * @description Modal dialog allowing users to request a password reset email link.
 */

import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { styles } from "../../styles/loginStyles";
import { useTheme } from "../../contexts/ThemeContext";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export interface ForgotPasswordModalProps {
  visible: boolean;
  email: string;
  loading: boolean;
  isRTL: boolean;
  onChangeEmail: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

/**
 * Modal dialog for password reset requests.
 *
 * @param props - Visibility, email input state, loading flag, and submission handlers.
 */
export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  email,
  loading,
  isRTL,
  onChangeEmail,
  onClose,
  onSubmit,
}) => {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <Animated.View entering={FadeInUp.springify()} style={styles.modalContent}>
        <View style={[styles.modalIconWrapper, { backgroundColor: `${theme.colors.primary}1F` }]}>
          <Ionicons name="key-outline" size={32} color={theme.colors.primary} />
        </View>
        <Text style={styles.modalTitle}>
          {isRTL ? "استعادة كلمة المرور" : "Reset Password"}
        </Text>
        <Text style={styles.modalText}>
          {isRTL
            ? "أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور."
            : "Enter your email address to receive a password reset link."}
        </Text>

        <Input
          placeholder={isRTL ? "البريد الإلكتروني" : "Email Address"}
          iconName="mail-outline"
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.modalButtons}>
          <Button
            title={isRTL ? "إلغاء" : "Cancel"}
            onPress={onClose}
            variant="secondary"
            style={{ flex: 1, marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}
            disabled={loading}
          />
          <Button
            title={isRTL ? "إرسال الرابط" : "Send Link"}
            onPress={onSubmit}
            loading={loading}
            style={{ flex: 1, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}
          />
        </View>
      </Animated.View>
    </View>
  );
};
