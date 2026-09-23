/**
 * @file HomeHeader.tsx
 * @description Navigation bar for HomeScreen incorporating multi-tenant
 * white-label branding, sidebar drawer trigger, and settings launcher.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';
import { getTenantBranding, getTenantVocabulary, ACTIVE_TENANT } from '../../config/tenantConfig';
import { styles } from '../../styles/homeStyles';

interface HomeHeaderProps {
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
}

/**
 * Top header component rendering institutional tenant identity and actions.
 *
 * @param props - Navigation callback handlers.
 * @returns JSX Element.
 */
export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onOpenSidebar,
  onOpenSettings,
}) => {
  const { theme } = useTheme();
  const { isRTL } = useI18n();
  const branding = getTenantBranding(ACTIVE_TENANT);
  const vocabulary = getTenantVocabulary(isRTL, ACTIVE_TENANT);

  return (
    <View
      style={[
        styles.header,
        {
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.card,
        },
        isRTL && styles.rowReverse,
      ]}
    >
      <View style={[styles.headerLeft, isRTL && styles.rowReverse]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onOpenSidebar}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={26} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text
            style={[
              styles.headerTitle,
              { color: branding.primaryColor || theme.colors.primary },
              isRTL && styles.textRight,
            ]}
          >
            {branding.appName}
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: theme.colors.muted },
              isRTL && styles.textRight,
            ]}
          >
            {branding.tagline || vocabulary.routeLabel}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.headerButton}
        onPress={onOpenSettings}
        activeOpacity={0.7}
      >
        <Ionicons
          name="settings-outline"
          size={24}
          color={theme.colors.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );
};
