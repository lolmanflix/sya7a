/**
 * @file MapFloatingHeader.tsx
 * @description Floating glassmorphic top navigation bar on the MapScreen,
 * displaying transit line identity, active fleet count, and bookmark actions.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';
import { getTenantVocabulary, ACTIVE_TENANT } from '../../config/tenantConfig';
import { styles } from '../../styles/mapStyles';

interface MapFloatingHeaderProps {
  busLine: string;
  activeBusCount: number;
  onBack: () => void;
  onSaveRoute: () => void;
  onOpenSettings: () => void;
}

/**
 * Top floating header bar component providing route metadata and quick actions.
 *
 * @param props - Header route data and action callbacks.
 * @returns JSX Element.
 */
export const MapFloatingHeader: React.FC<MapFloatingHeaderProps> = ({
  busLine,
  activeBusCount,
  onBack,
  onSaveRoute,
  onOpenSettings,
}) => {
  const { theme, mode } = useTheme();
  const { t, isRTL } = useI18n();
  const vocabulary = getTenantVocabulary(isRTL, ACTIVE_TENANT);

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      style={[
        styles.floatingHeader,
        {
          backgroundColor:
            mode === 'dark' ? 'rgba(18,18,18,0.92)' : 'rgba(255,255,255,0.92)',
          borderColor: theme.colors.border,
        },
        isRTL && styles.rowReverse,
      ]}
    >
      <TouchableOpacity
        style={[styles.iconButton, { backgroundColor: theme.colors.searchBg }]}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isRTL ? 'arrow-forward' : 'arrow-back'}
          size={22}
          color={theme.colors.textPrimary}
        />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text
          style={[styles.headerTitle, { color: theme.colors.textPrimary }]}
          numberOfLines={1}
        >
          {vocabulary.routeLabel} {busLine}
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            {
              color:
                activeBusCount > 0
                  ? theme.colors.success
                  : theme.colors.muted,
            },
          ]}
        >
          {activeBusCount > 0
            ? `${activeBusCount} ${
                isRTL ? t('busesActive') : 'buses active'
              }`
            : isRTL
            ? 'لا توجد حافلات نشطة حالياً'
            : 'No active buses right now'}
        </Text>
      </View>

      <View style={[styles.headerActions, isRTL && styles.rowReverse]}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.colors.searchBg }]}
          onPress={onSaveRoute}
          activeOpacity={0.7}
        >
          <Ionicons
            name="bookmark-outline"
            size={20}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.colors.searchBg }]}
          onPress={onOpenSettings}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
