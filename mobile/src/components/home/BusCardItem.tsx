/**
 * @file BusCardItem.tsx
 * @description Catalog route line card rendering active bus status,
 * GPS distance badge, estimated travel duration, and bookmark triggers.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';
import { Card } from '../ui/Card';
import { styles } from '../../styles/homeStyles';
import { Bus } from '../../hooks/useHomeBuses';

interface BusCardItemProps {
  item: Bus;
  index: number;
  isFavorite: boolean;
  isAuthenticated: boolean;
  onPress: (bus: Bus) => void;
  onToggleFavorite: (lineName: string) => void;
  onSaveBookmark: (bus: Bus) => void;
}

/**
 * Individual route line item card in the catalog listing.
 *
 * @param props - Card data, index, and callback handlers.
 * @returns JSX Element.
 */
export const BusCardItem: React.FC<BusCardItemProps> = ({
  item,
  index,
  isFavorite,
  isAuthenticated,
  onPress,
  onToggleFavorite,
  onSaveBookmark,
}) => {
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();

  const isSpecial =
    item.id === 'mock-bus' ||
    item.companyName === 'Demo Company' ||
    String(item.id).startsWith('fav-');

  return (
    <Card animated delay={index * 40} style={styles.busCard}>
      <TouchableOpacity
        style={[styles.busCardInner, isRTL && styles.rowReverse]}
        onPress={() => onPress(item)}
        disabled={item.activeBusCount === 0}
        activeOpacity={0.7}
      >
        <View style={styles.busInfo}>
          <View style={[styles.busHeader, isRTL && styles.rowReverse]}>
            <Text
              style={[
                styles.busLineName,
                { color: theme.colors.textPrimary },
                isRTL && styles.textRight,
              ]}
            >
              {item.lineName}
            </Text>

            {isAuthenticated && (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => onSaveBookmark(item)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="bookmark-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            )}

            {isAuthenticated && !isSpecial && (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => onToggleFavorite(item.lineName)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isFavorite ? 'star' : 'star-outline'}
                  size={20}
                  color={isFavorite ? '#FFCC00' : theme.colors.muted}
                />
              </TouchableOpacity>
            )}

            {item.distance !== undefined && (
              <View
                style={[
                  styles.distanceBadge,
                  { backgroundColor: `${theme.colors.primary}18` },
                ]}
              >
                <Text
                  style={[
                    styles.distanceBadgeText,
                    { color: theme.colors.primary },
                  ]}
                >
                  {item.distance < 1
                    ? `${Math.round(item.distance * 1000)}m`
                    : `${item.distance.toFixed(1)}km`}
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.companyName,
              { color: theme.colors.muted },
              isRTL && styles.textRight,
            ]}
          >
            {item.companyName}
          </Text>

          <Text
            style={[
              styles.busStatus,
              item.activeBusCount > 0
                ? { color: theme.colors.success }
                : { color: theme.colors.danger },
              isRTL && styles.textRight,
            ]}
          >
            {item.activeBusCount > 0
              ? `${item.activeBusCount} ${
                  isRTL
                    ? t('busesActive')
                    : item.activeBusCount > 1
                    ? 'active buses'
                    : 'active bus'
                }`
              : t('noBuses')}
          </Text>

          {item.distance !== undefined && item.direction && item.timeToArrival && (
            <View
              style={[
                styles.locationInfoContainer,
                { borderTopColor: theme.colors.border },
              ]}
            >
              <View style={[styles.locationRow, isRTL && styles.rowReverse]}>
                <Ionicons name="location" size={14} color={theme.colors.primary} />
                <Text
                  style={[
                    styles.locationText,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {item.distance < 1
                    ? `${Math.round(item.distance * 1000)}m ${item.direction}`
                    : `${item.distance.toFixed(1)}km ${item.direction}`}
                </Text>
              </View>

              <View style={[styles.locationRow, isRTL && styles.rowReverse]}>
                <Ionicons name="time" size={14} color={theme.colors.success} />
                <Text
                  style={[
                    styles.locationText,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {item.timeToArrival} {t('away')}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.chevronContainer}>
          <Ionicons
            name={isRTL ? 'chevron-back' : 'chevron-forward'}
            size={20}
            color={
              item.activeBusCount > 0
                ? theme.colors.primary
                : theme.colors.muted
            }
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
};
