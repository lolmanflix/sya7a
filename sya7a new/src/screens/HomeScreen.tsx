import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';
import SidebarMenu from '../components/SidebarMenu';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import SettingsModal from '../components/SettingsModal';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { saveToHistory } from '../utils/historyUtils';
import { listenToFavorites, toggleFavorite } from '../utils/favoritesUtils';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface Bus {
  id: string;
  lineName: string;
  companyName: string;
  activeBusCount: number;
  eta?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  direction?: string;
  timeToArrival?: string;
}
interface ActiveBus {
  id: string;
  lineName: string;
  driverId: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  distance?: number;
  direction?: string;
  timeToArrival?: string;
  driverName?: string;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();
  const { location } = useLocation();
  const [activeCounts, setActiveCounts] = useState<Record<string, number>>({});
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [activeBuses, setActiveBuses] = useState<ActiveBus[]>([]);
  const [selectedActiveBus, setSelectedActiveBus] = useState<ActiveBus | null>(null);
  const [favoriteLines, setFavoriteLines] = useState<Set<string>>(new Set());

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371008.8; // IUGG mean Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c) / 1000; // return km
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  const getDirectionName = (bearing: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(bearing / 22.5) % 16;
    return directions[index];
  };

  const calculateTimeToArrival = (distanceKm: number): string => {
    const averageSpeed = 30; // km/h
    const timeInHours = distanceKm / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    if (timeInMinutes < 1) return isRTL ? 'أقل من دقيقة' : 'Less than 1 min';
    if (timeInMinutes < 60) return `${timeInMinutes} ${isRTL ? 'دقيقة' : 'min'}`;
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  useEffect(() => {
    if (!user) return;
    const unsub = listenToFavorites(user.uid, setFavoriteLines);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const busesRef = ref(database, 'buses');
    const unsubscribe = onValue(busesRef, (snapshot) => {
      const data = snapshot.val();
      let busesList: Bus[] = [];
      if (data) {
        busesList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      }

      const mockBus: Bus = {
        id: 'mock-bus',
        lineName: 'Demo Line',
        companyName: 'Demo Company',
        activeBusCount: activeCounts['Demo Line'] || 0,
        eta: '5 min',
        latitude: 30.0444,
        longitude: 31.2357,
      };
      busesList.push(mockBus);

      favoriteLines.forEach((fav) => {
        const exists = busesList.some(b => b.lineName === fav);
        if (!exists) {
          busesList.unshift({
            id: `fav-${fav}`,
            lineName: fav,
            companyName: 'Favorite',
            activeBusCount: activeCounts[fav] || 0,
          });
        }
      });

      if (location) {
        const busesWithLocation = busesList.map(bus => {
          if (bus.latitude && bus.longitude) {
            const distance = calculateDistance(location.coords.latitude, location.coords.longitude, bus.latitude, bus.longitude);
            const bearing = calculateBearing(location.coords.latitude, location.coords.longitude, bus.latitude, bus.longitude);
            const direction = getDirectionName(bearing);
            const timeToArrival = calculateTimeToArrival(distance);
            return { ...bus, activeBusCount: activeCounts[bus.lineName] ?? bus.activeBusCount ?? 0, distance, direction, timeToArrival };
          }
          return { ...bus, activeBusCount: activeCounts[bus.lineName] ?? bus.activeBusCount ?? 0 };
        });
        setBuses(busesWithLocation);
        setFilteredBuses(busesWithLocation);
      } else {
        const merged = busesList.map(b => ({ ...b, activeBusCount: activeCounts[b.lineName] ?? b.activeBusCount ?? 0 }));
        setBuses(merged);
        setFilteredBuses(merged);
      }
    });
    return () => off(busesRef, 'value', unsubscribe);
  }, [location, activeCounts]);

  useEffect(() => {
    const busLocationsRef = ref(database, 'busLocations');
    const unsub = onValue(busLocationsRef, (snapshot) => {
      const data = snapshot.val();
      const counts: Record<string, number> = {};
      const collected: ActiveBus[] = [];
      if (data) {
        Object.keys(data).forEach((line) => {
          const drivers = data[line];
          counts[line] = drivers ? Object.keys(drivers).length : 0;
          if (drivers) {
            Object.keys(drivers).forEach((driverId) => {
              const d = drivers[driverId];
              if (d && typeof d.latitude === 'number' && typeof d.longitude === 'number') {
                const base: ActiveBus = {
                  id: `${line}-${driverId}`,
                  lineName: line,
                  driverId,
                  latitude: d.latitude,
                  longitude: d.longitude,
                  lastUpdated: d.lastUpdated || new Date().toISOString(),
                  driverName: d.driverName || undefined,
                };
                if (location) {
                  const distance = calculateDistance(location.coords.latitude, location.coords.longitude, base.latitude, base.longitude);
                  const bearing = calculateBearing(location.coords.latitude, location.coords.longitude, base.latitude, base.longitude);
                  const direction = getDirectionName(bearing);
                  const timeToArrival = calculateTimeToArrival(distance);
                  collected.push({ ...base, distance, direction, timeToArrival });
                } else {
                  collected.push(base);
                }
              }
            });
          }
        });
      }
      setActiveCounts(counts);
      const sorted = [...collected].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
      setActiveBuses(sorted);
    });
    return () => off(busLocationsRef, 'value', unsub);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBuses(buses);
    } else {
      const filtered = buses.filter(bus =>
        bus.lineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBuses(filtered);
    }
  }, [searchQuery, buses]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleBusPress = async (bus: Bus) => {
    if (bus.activeBusCount > 0) {
      if (user) {
        try {
          await saveToHistory(user.uid, bus.lineName, bus.companyName);
        } catch {}
      }
      (navigation.navigate as any)('Map', { busLine: bus.lineName });
    } else {
      Alert.alert(isRTL ? 'لا حافلات نشطة' : 'No Active Buses', isRTL ? 'لا توجد حافلات نشطة لهذا الخط حالياً.' : 'There are currently no active buses for this line.');
    }
  };

  const renderBusItem = ({ item, index }: { item: Bus, index: number }) => (
    <Card animated delay={index * 50} style={styles.busCard}>
      <TouchableOpacity
        style={[styles.busCardInner, isRTL && styles.rowReverse]}
        onPress={() => handleBusPress(item)}
        disabled={item.activeBusCount === 0}
        activeOpacity={0.7}
      >
        <View style={styles.busInfo}>
          <View style={[styles.busHeader, isRTL && styles.rowReverse]}>
            <Text style={[styles.busLineName, { color: theme.colors.textPrimary }, isRTL && styles.textRight]}>{item.lineName}</Text>
            {user && (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={async () => {
                  try {
                    await saveToHistory(user.uid, item.lineName, item.companyName);
                    Alert.alert(t('routeSavedSuccess'));
                  } catch {
                    Alert.alert(isRTL ? 'تعذر الحفظ' : 'Could not save', isRTL ? 'حاول مرة أخرى.' : 'Please try again.');
                  }
                }}
              >
                <Ionicons name="bookmark-outline" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
            {user && item.id !== 'mock-bus' && item.companyName !== 'Demo Company' && !String(item.id).startsWith('fav-') && (
              <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(user.uid, item.lineName, favoriteLines.has(item.lineName))}>
                <Ionicons name={favoriteLines.has(item.lineName) ? 'star' : 'star-outline'} size={20} color={favoriteLines.has(item.lineName) ? '#FFCC00' : theme.colors.muted} />
              </TouchableOpacity>
            )}
            {item.distance !== undefined && (
              <View style={[styles.distanceBadge, { backgroundColor: `${theme.colors.primary}18` }]}>
                <Text style={[styles.distanceBadgeText, { color: theme.colors.primary }]}>
                  {item.distance < 1 ? `${Math.round(item.distance * 1000)}m` : `${item.distance.toFixed(1)}km`}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.companyName, { color: theme.colors.muted }, isRTL && styles.textRight]}>{item.companyName}</Text>
          <Text style={[
            styles.busStatus,
            item.activeBusCount > 0 ? { color: theme.colors.success } : { color: theme.colors.danger },
            isRTL && styles.textRight,
          ]}>
            {item.activeBusCount > 0
              ? `${item.activeBusCount} ${isRTL ? t('busesActive') : (item.activeBusCount > 1 ? 'active buses' : 'active bus')}`
              : t('noBuses')
            }
          </Text>

          {item.distance !== undefined && item.direction && item.timeToArrival && (
            <View style={[styles.locationInfoContainer, { borderTopColor: theme.colors.border }]}>
              <View style={[styles.locationRow, isRTL && styles.rowReverse]}>
                <Ionicons name="location" size={14} color={theme.colors.primary} />
                <Text style={[styles.locationText, { color: theme.colors.textPrimary }]}>
                  {item.distance < 1 ? `${Math.round(item.distance * 1000)}m ${item.direction}` : `${item.distance.toFixed(1)}km ${item.direction}`}
                </Text>
              </View>
              <View style={[styles.locationRow, isRTL && styles.rowReverse]}>
                <Ionicons name="time" size={14} color={theme.colors.success} />
                <Text style={[styles.locationText, { color: theme.colors.textPrimary }]}>
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
            color={item.activeBusCount > 0 ? theme.colors.primary : theme.colors.muted}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );

  const renderActiveBusItem = ({ item, index }: { item: ActiveBus, index: number }) => (
    <Card animated delay={index * 50} style={styles.busCard}>
      <TouchableOpacity
        style={[styles.busCardInner, isRTL && styles.rowReverse]}
        onPress={() => setSelectedActiveBus(item)}
        activeOpacity={0.7}
      >
        <View style={styles.busInfo}>
          <View style={[styles.busHeader, isRTL && styles.rowReverse]}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={[styles.busLineName, { color: theme.colors.textPrimary }]}>{item.lineName}</Text>
            {item.distance !== undefined && (
              <View style={[styles.distanceBadge, { backgroundColor: `${theme.colors.primary}18` }]}>
                <Text style={[styles.distanceBadgeText, { color: theme.colors.primary }]}>
                  {item.distance < 1 ? `${Math.round(item.distance * 1000)}m` : `${item.distance.toFixed(1)}km`}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.companyName, { color: theme.colors.muted }]}>{t('driver')}: {item.driverId.slice(0, 6)}</Text>
          <Text style={[styles.busStatus, { color: theme.colors.textSecondary }]}>{t('updated')}: {new Date(item.lastUpdated).toLocaleTimeString()}</Text>
          {item.distance !== undefined && item.direction && item.timeToArrival && (
            <View style={[styles.locationInfoContainer, { borderTopColor: theme.colors.border }]}>
              <View style={[styles.locationRow, isRTL && styles.rowReverse]}>
                <Ionicons name="location" size={14} color={theme.colors.primary} />
                <Text style={[styles.locationText, { color: theme.colors.textPrimary }]}>
                  {item.distance < 1 ? `${Math.round(item.distance * 1000)}m ${item.direction}` : `${item.distance.toFixed(1)}km ${item.direction}`}
                </Text>
              </View>
              <View style={[styles.locationRow, isRTL && styles.rowReverse]}>
                <Ionicons name="time" size={14} color={theme.colors.success} />
                <Text style={[styles.locationText, { color: theme.colors.textPrimary }]}>
                  {item.timeToArrival} {t('away')}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.chevronContainer}>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={theme.colors.primary} />
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }, isRTL && styles.rowReverse]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Ionicons name="menu-outline" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>{t('appTitle')}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={26} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <Input
          iconName="search"
          placeholder={t('searchBus')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {activeBuses.length > 0 && (
        <View style={[styles.sectionHeader, isRTL && styles.rowReverse]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>{t('activeBuses')}</Text>
          <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.badgeText}>{activeBuses.length}</Text>
          </View>
        </View>
      )}

      {activeBuses.length > 0 && (
        <FlatList
          data={activeBuses}
          renderItem={renderActiveBusItem}
          keyExtractor={(item) => item.id}
          style={styles.busList}
          contentContainerStyle={styles.busListContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={[styles.sectionHeader, isRTL && styles.rowReverse]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>{t('allRoutes')}</Text>
      </View>

      <FlatList
        data={filteredBuses}
        renderItem={renderBusItem}
        keyExtractor={(item) => item.id}
        style={styles.busList}
        contentContainerStyle={styles.busListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      />

      <SidebarMenu
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      {selectedActiveBus && (
        <View style={styles.bottomSheetOverlay}>
          <Card style={styles.bottomSheetCard}>
            <View style={[styles.bottomSheetHeader, isRTL && styles.rowReverse]}>
              <Text style={[styles.bottomSheetTitle, { color: theme.colors.textPrimary }]}>{selectedActiveBus.lineName}</Text>
              <TouchableOpacity
                onPress={() => setSelectedActiveBus(null)}
                style={[styles.closeButton, { backgroundColor: theme.colors.searchBg }]}
              >
                <Ionicons name="close" size={24} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.bottomSheetSubtitle, { color: theme.colors.muted }]}>{t('driver')}: {selectedActiveBus.driverName || selectedActiveBus.driverId.slice(0, 6)}</Text>
            <Text style={[styles.bottomSheetSubtitle, { color: theme.colors.muted }]}>{t('updated')}: {new Date(selectedActiveBus.lastUpdated).toLocaleTimeString()}</Text>
            {selectedActiveBus.distance !== undefined && selectedActiveBus.direction && selectedActiveBus.timeToArrival && (
              <View style={[styles.bottomSheetDetails, { borderTopColor: theme.colors.border }]}>
                <View style={[styles.detailRow, isRTL && styles.rowReverse]}>
                  <Ionicons name="location" size={18} color={theme.colors.primary} />
                  <Text style={[styles.detailText, { color: theme.colors.textPrimary }]}>
                    {selectedActiveBus.distance < 1 ? `${Math.round(selectedActiveBus.distance * 1000)}m` : `${selectedActiveBus.distance.toFixed(1)}km`} {selectedActiveBus.direction}
                  </Text>
                </View>
                <View style={[styles.detailRow, isRTL && styles.rowReverse]}>
                  <Ionicons name="time" size={18} color={theme.colors.success} />
                  <Text style={[styles.detailText, { color: theme.colors.textPrimary }]}>{selectedActiveBus.timeToArrival} {t('away')}</Text>
                </View>
              </View>
            )}
            <Button
              title={t('openMap')}
              icon={<Ionicons name="map-outline" size={20} color="#FFFFFF" />}
              onPress={async () => {
                const line = selectedActiveBus.lineName;
                if (user) {
                  try {
                    await saveToHistory(user.uid, line, selectedActiveBus.driverName || t('busLine'));
                  } catch {}
                }
                setSelectedActiveBus(null);
                (navigation.navigate as any)('Map', { busLine: line });
              }}
              style={{ marginTop: 16 }}
            />
          </Card>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowReverse: { flexDirection: 'row-reverse' },
  textRight: { textAlign: 'right' },
  headerButton: { padding: 8, marginHorizontal: -8 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  searchSection: { paddingHorizontal: 20, paddingVertical: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  busList: { flex: 1 },
  busListContent: { paddingHorizontal: 20, paddingBottom: 24 },
  busCard: { padding: 0, marginBottom: 12 },
  busCardInner: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  busInfo: { flex: 1 },
  busHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  busLineName: { fontSize: 18, fontWeight: '700', flex: 1 },
  favoriteButton: { paddingHorizontal: 8 },
  distanceBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  distanceBadgeText: { fontSize: 12, fontWeight: '700' },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B3015',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30', marginRight: 4 },
  liveText: { fontSize: 10, color: '#FF3B30', fontWeight: '800' },
  companyName: { fontSize: 14, marginBottom: 4, fontWeight: '500' },
  busStatus: { fontSize: 13, fontWeight: '600' },
  locationInfoContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  locationText: { marginLeft: 8, fontSize: 13, fontWeight: '500' },
  chevronContainer: { paddingLeft: 12 },
  bottomSheetOverlay: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  bottomSheetCard: { marginBottom: 20, padding: 24 },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bottomSheetTitle: { fontSize: 22, fontWeight: '800' },
  closeButton: { padding: 4, borderRadius: 16 },
  bottomSheetSubtitle: { fontSize: 15, marginBottom: 4 },
  bottomSheetDetails: { marginTop: 16, borderTopWidth: 1, paddingTop: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailText: { marginLeft: 12, fontSize: 16, fontWeight: '500' },
});
