/**
 * @file DriverModals.tsx
 * @description Modal dialogs for the driver portal, including the Company/Institution Picker Modal.
 */

import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/driverModalStyles";
import { CompanyOption } from "../../hooks/useDriverProfile";
import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig";

export interface CompanyPickerModalProps {
  visible: boolean;
  companies: CompanyOption[];
  currentCompanyId: string | null;
  isRTL: boolean;
  isDark: boolean;
  vocabulary: TenantVocabulary;
  branding: TenantBranding;
  onClose: () => void;
  onSelectCompany: (companyId: string) => void;
}

/**
 * Company and transit institution selection modal allowing drivers to switch active operating company.
 *
 * @param props - Modal visibility, company options list, and selection callback.
 */
export const CompanyPickerModal: React.FC<CompanyPickerModalProps> = ({
  visible,
  companies,
  currentCompanyId,
  isRTL,
  isDark,
  vocabulary,
  branding,
  onClose,
  onSelectCompany,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.companyModalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.companyModalContent,
            isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
          ]}
        >
          {/* Header */}
          <View style={styles.companyModalHeader}>
            <View style={styles.companyModalTitleRow}>
              <Ionicons name="business" size={18} color={branding.primaryColor || "#2563EB"} />
              <Text
                style={[
                  styles.companyModalTitle,
                  isDark && { color: "#F9FAFB" },
                ]}
              >
                {isRTL ? "اختيار الشركة / المؤسسة" : "Select Organization"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.companyModalCloseBtn,
                isDark && { backgroundColor: "#334155" },
              ]}
            >
              <Ionicons name="close" size={18} color={isDark ? "#94A3B8" : "#64748B"} />
            </TouchableOpacity>
          </View>

          {/* Company Options List */}
          <ScrollView style={{ maxHeight: 320 }}>
            {companies.map((comp) => {
              const isSelected = comp.id.toLowerCase() === currentCompanyId?.toLowerCase();
              return (
                <TouchableOpacity
                  key={comp.id}
                  style={[
                    styles.companyOptionRow,
                    isDark && { backgroundColor: "#0F172A" },
                    isSelected && {
                      backgroundColor: isDark ? "rgba(37,99,235,0.2)" : "#EFF6FF",
                      borderColor: branding.primaryColor,
                    },
                  ]}
                  onPress={() => onSelectCompany(comp.id)}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons
                      name="business-outline"
                      size={18}
                      color={isSelected ? branding.primaryColor : isDark ? "#94A3B8" : "#64748B"}
                    />
                    <Text
                      style={[
                        styles.companyOptionText,
                        isDark && { color: "#F1F5F9" },
                        isSelected && { color: branding.primaryColor, fontWeight: "800" },
                      ]}
                    >
                      {comp.name}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={branding.primaryColor} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
