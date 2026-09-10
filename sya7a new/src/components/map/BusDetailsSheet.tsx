import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface BusLocation {
  id: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  eta?: string;
  distance?: number;
  direction?: string;
  timeToArrival?: string;
  startPoint?: string;
  startLat?: number | null;
  startLng?: number | null;
  endPoint?: string;
  endLat?: number | null;
  endLng?: number | null;
  speedKmh?: number;
}

interface BusDetailsSheetProps {
  selectedBus: BusLocation | null;
  onCloseBus: () => void;
  routeDefinition?: any;
  busLine: string;
  user: any;
  isDark: boolean;
  theme: any;
  t: (key: any) => string;
  isRTL: boolean;
  savingRoute: boolean;
  onSaveRoute: (busLine: string, destination: string) => Promise<void>;
}

export default function BusDetailsSheet({
  selectedBus,
  onCloseBus,
  routeDefinition,
  busLine,
  user,
  isDark,
  theme,
  t,
  isRTL,
  savingRoute,
  onSaveRoute,
}: BusDetailsSheetProps) {
  if (selectedBus) {
    return (
      <Animated.View
        entering={FadeInDown.springify()}
        exiting={FadeOutDown.duration(200)}
        style={styles.floatingBottom}
      >
        <Card style={styles.detailsCard}>
          <View style={[styles.detailsHeader, isRTL && styles.rowReverse]}>
            <View style={[styles.detailsHeaderLeft, isRTL && styles.rowReverse]}>
              <View style={[styles.busIconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name="bus" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.busTitle, { color: theme.colors.textPrimary }]}>
                  {isRTL ? 'حافلة' : 'Bus'} {selectedBus.id.slice(-4) || '101'}
                </Text>
                <Text style={[styles.busSubtitle, { color: theme.colors.muted }]}>
                  {t('updated')} {new Date(selectedBus.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onCloseBus}
              style={[styles.closeBtn, { backgroundColor: theme.colors.searchBg }]}
            >
              <Ionicons name="close" size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>

          {selectedBus.distance !== undefined && selectedBus.direction && selectedBus.timeToArrival && (
            <View style={[styles.statsRow, { backgroundColor: theme.colors.searchBg }]}>
              <View style={styles.statItem}>
                <Ionicons name="navigate-outline" size={18} color={theme.colors.primary} />
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                  {selectedBus.distance < 1
                    ? `${Math.round(selectedBus.distance * 1000)}m`
                    : `${selectedBus.distance.toFixed(1)}km`}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.muted }]}>{selectedBus.direction}</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={18} color={theme.colors.success} />
                <Text style={[styles.statValue, { color: theme.colors.success }]}>{selectedBus.timeToArrival}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.muted }]}>{t('away')}</Text>
              </View>
              {selectedBus.speedKmh !== undefined && (
                <>
                  <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                  <View style={styles.statItem}>
                    <Ionicons name="speedometer-outline" size={18} color="#FF9500" />
                    <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{selectedBus.speedKmh}</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.muted }]}>km/h</Text>
                  </View>
                </>
              )}
            </View>
          )}

          <View style={[styles.endpointRow, isRTL && styles.rowReverse, { marginBottom: 6 }]}>
            <Ionicons name="radio-outline" size={18} color="#10B981" />
            <Text style={[styles.endpointText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {isRTL ? 'نقطة الانطلاق (A): ' : 'Point A (Origin): '}
              <Text style={{ fontWeight: '700', color: '#10B981' }}>
                {selectedBus.startPoint || (isRTL ? 'موقع السائق المباشر' : "Driver's Current Location")}
              </Text>
            </Text>
          </View>

          {selectedBus.endPoint && (
            <View style={[styles.endpointRow, isRTL && styles.rowReverse]}>
              <Ionicons name="pin-outline" size={18} color="#FF9500" />
              <Text style={[styles.endpointText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                {t('headingTo')} <Text style={{ fontWeight: '700' }}>{selectedBus.endPoint}</Text>
              </Text>
            </View>
          )}

          <Button
            title={t('saveRoute')}
            loading={savingRoute}
            icon={<Ionicons name="bookmark-outline" size={18} color="#FFFFFF" />}
            onPress={() => onSaveRoute(busLine, selectedBus.endPoint || t('busLine'))}
            style={{ marginTop: 16 }}
          />
        </Card>
      </Animated.View>
    );
  }

  // Fallback / Route info card when no specific bus is selected
  if (routeDefinition) {
    const stopsCount = Array.isArray(routeDefinition.stops) ? routeDefinition.stops.length : 0;
    return (
      <Animated.View entering={FadeInDown.springify()} style={styles.floatingBottom}>
        <Card style={styles.detailsCard}>
          <View style={[styles.detailsHeader, isRTL && styles.rowReverse]}>
            <View style={[styles.detailsHeaderLeft, isRTL && styles.rowReverse]}>
              <View style={[styles.busIconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name="git-network-outline" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.busTitle, { color: theme.colors.textPrimary }]}>
                  {t('line')} {busLine}
                </Text>
                <Text style={[styles.busSubtitle, { color: theme.colors.muted }]}>
                  {stopsCount > 0 ? `${stopsCount} ${isRTL ? 'محطات توقف إجبارية' : 'Mandatory Stops'}` : (isRTL ? 'مسار مباشر' : 'Direct Route')}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.routeItineraryPreview, isRTL && styles.rowReverse]}>
            <View style={styles.itineraryPill}>
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.itineraryPillText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                {routeDefinition.startPoint || 'Origin'}
              </Text>
            </View>
            <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={14} color={theme.colors.muted} />
            <View style={styles.itineraryPill}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.itineraryPillText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                {routeDefinition.endPoint || 'Destination'}
              </Text>
            </View>
          </View>

          <Button
            title={t('saveRoute')}
            loading={savingRoute}
            icon={<Ionicons name="bookmark-outline" size={18} color="#FFFFFF" />}
            onPress={() => onSaveRoute(busLine, routeDefinition.endPoint || t('busLine'))}
            style={{ marginTop: 14 }}
          />
        </Card>
      </Animated.View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  floatingBottom: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 20,
    right: 20,
  },
  detailsCard: { padding: 20, borderRadius: 24 },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailsHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  busIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  busTitle: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  busSubtitle: { fontSize: 12 },
  closeBtn: { padding: 8, borderRadius: 20 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 4,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 28 },
  statValue: { fontSize: 16, fontWeight: '800', marginTop: 4, marginBottom: 2 },
  statLabel: { fontSize: 11, fontWeight: '500' },
  endpointRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14, paddingHorizontal: 4 },
  endpointText: { marginLeft: 8, fontSize: 13, flex: 1 },
  rowReverse: { flexDirection: 'row-reverse' },
  routeItineraryPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  itineraryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itineraryPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
