/**
 * @file DriverCompanyPickerModal.tsx
 * @description Company and institution selector component and bottom sheet modal
 * utilized during driver authentication to assign the driver's operating entity.
 */

import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/loginStyles";
import { CompanyItem } from "../../hooks/useAuthForm";
import { TenantVocabulary, TenantBranding } from "../../config/tenantConfig";

export interface DriverCompanyPickerProps {
  companies: CompanyItem[];
  selectedCompany: string;
  selectedCompanyName: string;
  modalVisible: boolean;
  isRTL: boolean;
  vocabulary: TenantVocabulary;
  branding: TenantBranding;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onSelectCompany: (companyId: string) => void;
}

/**
 * Renders company dropdown trigger button and modal selection sheet for driver login.
 *
 * @param props - Companies catalog, selection state, and modal visibility handlers.
 */
export const DriverCompanyPicker: React.FC<DriverCompanyPickerProps> = ({
  companies,
  selectedCompany,
  selectedCompanyName,
  modalVisible,
  isRTL,
  vocabulary,
  branding,
  onOpenModal,
  onCloseModal,
  onSelectCompany,
}) => {
  return (
    <>
      {/* Dropdown Field Trigger */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>
          {isRTL ? "اختيار جهة العمل / المؤسسة" : "Select Organization / Company"}
        </Text>
        <TouchableOpacity
          style={styles.companySelectBtn}
          onPress={onOpenModal}
          activeOpacity={0.8}
        >
          <View style={styles.companySelectLeft}>
            <View
              style={[
                styles.companySelectIcon,
                { backgroundColor: branding.accentColor || "rgba(37, 99, 235, 0.1)" },
              ]}
            >
              <Ionicons
                name="business"
                size={18}
                color={branding.primaryColor || "#2563EB"}
              />
            </View>
            <Text style={styles.companySelectText} numberOfLines={1}>
              {selectedCompanyName}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Modal Bottom Sheet */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={onCloseModal}
      >
        <View style={styles.companyModalOverlay}>
          <View style={styles.companyModalContent}>
            {/* Modal Header */}
            <View style={styles.companyModalHeader}>
              <View style={styles.companyModalTitleRow}>
                <View
                  style={[
                    styles.companyModalHeaderIcon,
                    { backgroundColor: branding.accentColor || "rgba(37, 99, 235, 0.1)" },
                  ]}
                >
                  <Ionicons
                    name="business"
                    size={20}
                    color={branding.primaryColor || "#2563EB"}
                  />
                </View>
                <Text style={styles.companyModalTitle}>
                  {isRTL ? "اختيار المؤسسة المشغلة" : "Select Operating Organization"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onCloseModal}
                style={styles.companyModalCloseBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {/* List of Companies */}
            <ScrollView style={styles.companyListScroll}>
              {companies.map((c) => {
                const isSelected = c.id.toLowerCase() === selectedCompany?.toLowerCase();
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.companyOptionRow,
                      isSelected && styles.companyOptionRowSelected,
                    ]}
                    onPress={() => {
                      onSelectCompany(c.id);
                      onCloseModal();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.companyOptionLeft}>
                      <View
                        style={[
                          styles.companyOptionBullet,
                          isSelected && [
                            styles.companyOptionBulletSelected,
                            { backgroundColor: branding.primaryColor || "#2563EB" },
                          ],
                        ]}
                      >
                        <Ionicons
                          name="bus"
                          size={16}
                          color={isSelected ? "#FFFFFF" : branding.primaryColor || "#2563EB"}
                        />
                      </View>
                      <Text
                        style={[
                          styles.companyOptionText,
                          isSelected && [
                            styles.companyOptionTextSelected,
                            { color: branding.primaryColor || "#2563EB" },
                          ],
                        ]}
                      >
                        {c.name}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={branding.primaryColor || "#2563EB"}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};
