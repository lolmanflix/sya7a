/**
 * @file ActiveBusCardItem.tsx
 * @description Card component rendering a live active vehicle with animated
 * status beacon, driver badge, real-time timestamp, and selection handler.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';
import { Card } from '../ui/Card';
import { styles } from '../../styles/homeStyles';
import { ActiveBus } from '../../hooks/useHomeBuses';

interface ActiveBusCardItemProps {
  item: ActiveBus;
  index: number;
  onSelect: (item: ActiveBus) => void;
}

/**
 * Live active vehicle card item component.
 *
 * @param props - Active vehicle data and selection handler.
 * @returns JSX Element.
 */
export const ActiveBusCardItem: React.FC<ActiveBusCardItemProps> = ({
  item,
  index,
  onSelect,
}) => {
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();

  return (
    <Card animated delay={index * 40} style={styles.busCard}>
      <TouchableOpacity
        style={[styles.busCardInner, isRTL && styles.rowReverse]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.busInfo}>
          <View style={[styles.busHeader, isRTL && styles.rowReverse]}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>

            <Text
              style={[
                styles.busLineName,
                { color: theme.colors.textPrimary },
                isRTL && styles.textRight,
              ]}
            >
              {item.lineName}
            </Text>

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
            {t('driver')}: {item.driverName || item.driverId.slice(0, 6)}
          </Text>

          <Text
            style={[
              styles.busStatus,
              { color: theme.colors.textSecondary },
              isRTL && styles.textRight,
            ]}
          >
            {t('updated')}: {new Date(item.lastUpdated).toLocaleTimeString()}
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
            color={theme.colors.primary}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
};
