/**
 * @file ActiveBusModal.tsx
 * @description Bottom sheet overlay modal presenting selected vehicle telemetry,
 * driver details, geodesic distance/bearing, and one-tap map navigation.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { styles } from '../../styles/homeStyles';
import { ActiveBus } from '../../hooks/useHomeBuses';

interface ActiveBusModalProps {
  selectedBus: ActiveBus | null;
  onClose: () => void;
  onOpenMap: (bus: ActiveBus) => void;
}

/**
 * Bottom modal sheet showing active bus details and action button.
 *
 * @param props - Selected bus data and modal actions.
 * @returns JSX Element or null if unselected.
 */
export const ActiveBusModal: React.FC<ActiveBusModalProps> = ({
  selectedBus,
  onClose,
  onOpenMap,
}) => {
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();

  if (!selectedBus) return null;

  return (
    <View style={styles.bottomSheetOverlay}>
      <Card style={{ ...styles.bottomSheetCard, backgroundColor: theme.colors.card }}>
        <View style={[styles.bottomSheetHeader, isRTL && styles.rowReverse]}>
          <Text
            style={[
              styles.bottomSheetTitle,
              { color: theme.colors.textPrimary },
              isRTL && styles.textRight,
            ]}
          >
            {selectedBus.lineName}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.closeButton,
              { backgroundColor: theme.colors.searchBg },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color={theme.colors.muted} />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.bottomSheetSubtitle,
            { color: theme.colors.muted },
            isRTL && styles.textRight,
          ]}
        >
          {t('driver')}: {selectedBus.driverName || selectedBus.driverId.slice(0, 6)}
        </Text>

        <Text
          style={[
            styles.bottomSheetSubtitle,
            { color: theme.colors.muted },
            isRTL && styles.textRight,
          ]}
        >
          {t('updated')}: {new Date(selectedBus.lastUpdated).toLocaleTimeString()}
        </Text>

        {selectedBus.distance !== undefined &&
          selectedBus.direction &&
          selectedBus.timeToArrival && (
            <View
              style={[
                styles.bottomSheetDetails,
                { borderTopColor: theme.colors.border },
              ]}
            >
              <View style={[styles.detailRow, isRTL && styles.rowReverse]}>
                <Ionicons name="location" size={18} color={theme.colors.primary} />
                <Text
                  style={[
                    styles.detailText,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {selectedBus.distance < 1
                    ? `${Math.round(selectedBus.distance * 1000)}m`
                    : `${selectedBus.distance.toFixed(1)}km`}{' '}
                  {selectedBus.direction}
                </Text>
              </View>

              <View style={[styles.detailRow, isRTL && styles.rowReverse]}>
                <Ionicons name="time" size={18} color={theme.colors.success} />
                <Text
                  style={[
                    styles.detailText,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {selectedBus.timeToArrival} {t('away')}
                </Text>
              </View>
            </View>
          )}

        <Button
          title={t('openMap')}
          icon={<Ionicons name="map-outline" size={20} color="#FFFFFF" />}
          onPress={() => onOpenMap(selectedBus)}
          style={{ marginTop: 16 }}
        />
      </Card>
    </View>
  );
};
