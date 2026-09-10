import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
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
  const { t } = useI18n();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [activeBuses, setActiveBuses] = useState<ActiveBus[]>([]);
  const [selectedActiveBus, setSelectedActiveBus] = useState<ActiveBus | null>(null);
  const [favoriteLines, setFavoriteLines] = useState<Set<string>>(new Set());

  // Function to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Function to calculate bearing (direction) between two coordinates
  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  // Function to get direction name from bearing
  const getDirectionName = (bearing: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(bearing / 22.5) % 16;
    return directions[index];
  };

  // Function to calculate time to arrival (simplified)
  const calculateTimeToArrival = (distance: number): string => {
    // Assuming average bus speed of 30 km/h in city traffic
    const averageSpeed = 30; // km/h
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    if (timeInMinutes < 1) {
      return 'Less than 1 min';
    } else if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  useEffect(() => {
    if (!user) return;
    const unsub = listenToFavorites(user.uid, setFavoriteLines);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    // Listen to Firebase for active buses
    const busesRef = ref(database, 'buses');
    const unsubscribe = onValue(busesRef, (snapshot) => {
      const data = snapshot.val();
      let busesList: Bus[] = [];
      if (data) {
        busesList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      // Add a mock bus for demo/testing
      const mockBus: Bus = {
        id: 'mock-bus',
        lineName: 'Demo Line',
        companyName: 'Demo Company',
        activeBusCount: activeCounts['Demo Line'] || 0,
        eta: '5 min',
        latitude: 30.0444, // Cairo
        longitude: 31.2357,
      };
      busesList.push(mockBus);
      // Ensure favorites remain visible even if not in data
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
      // Calculate distance and direction if user location is available
      if (location) {
        const busesWithLocation = busesList.map(bus => {
          if (bus.latitude && bus.longitude) {
            const distance = calculateDistance(
              location.coords.latitude,
              location.coords.longitude,
              bus.latitude,
              bus.longitude
            );
            const bearing = calculateBearing(
              location.coords.latitude,
              location.coords.longitude,
              bus.latitude,
              bus.longitude
            );
            const direction = getDirectionName(bearing);
            const timeToArrival = calculateTimeToArrival(distance);
            return { 
              ...bus,
              activeBusCount: activeCounts[bus.lineName] ?? bus.activeBusCount ?? 0,
              distance, 
              direction, 
              timeToArrival 
            };
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

  // Listen to live busLocations to compute active counts per line
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
                  const distance = calculateDistance(
                    location.coords.latitude,
                    location.coords.longitude,
                    base.latitude,
                    base.longitude
                  );
                  const bearing = calculateBearing(
                    location.coords.latitude,
                    location.coords.longitude,
                    base.latitude,
                    base.longitude
                  );
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
    // Filter buses based on search query
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
    // Firebase will automatically update through the listener
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleBusPress = async (bus: Bus) => {
    if (bus.activeBusCount > 0) {
      // Save to history
      if (user) {
        await saveToHistory(user.uid, bus.lineName, bus.companyName);
      }
      navigation.navigate('Map' as never, { busLine: bus.lineName } as never);
    } else {
      Alert.alert('No Active Buses', 'There are currently no active buses for this line.');
    }
  };

  const renderBusItem = ({ item }: { item: Bus }) => (
    <TouchableOpacity
      style={styles.busCard}
      onPress={() => handleBusPress(item)}
      disabled={item.activeBusCount === 0}
    >
      <View style={styles.busInfo}>
        <View style={styles.busHeader}>
          <Text style={styles.busLineName}>{item.lineName}</Text>
          {user && item.id !== 'mock-bus' && item.companyName !== 'Demo Company' && !String(item.id).startsWith('fav-') && (
            <TouchableOpacity onPress={() => toggleFavorite(user.uid, item.lineName, favoriteLines.has(item.lineName))}>
              <Ionicons name={favoriteLines.has(item.lineName) ? 'star' : 'star-outline'} size={18} color={favoriteLines.has(item.lineName) ? '#FFCC00' : '#666666'} />
            </TouchableOpacity>
          )}
          {item.distance !== undefined && (
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>
                {item.distance < 1 
                  ? `${Math.round(item.distance * 1000)}m` 
                  : `${item.distance.toFixed(1)}km`
                }
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.companyName}>{item.companyName}</Text>
        <Text style={[
          styles.busStatus,
          item.activeBusCount > 0 ? styles.activeStatus : styles.inactiveStatus
        ]}>
          {item.activeBusCount > 0 
            ? `${item.activeBusCount} active bus${item.activeBusCount > 1 ? 'es' : ''}`
            : 'No buses currently active'
          }
        </Text>
        
        {/* Distance and Direction Info */}
        {item.distance !== undefined && item.direction && item.timeToArrival && (
          <View style={styles.locationInfo}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color="#007AFF" />
              <Text style={styles.locationText}>
                {item.distance < 1 
                  ? `${Math.round(item.distance * 1000)}m ${item.direction}` 
                  : `${item.distance.toFixed(1)}km ${item.direction}`
                }
              </Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="time" size={14} color="#34C759" />
              <Text style={styles.locationText}>
                {item.timeToArrival} away
              </Text>
            </View>
          </View>
        )}
        
        {item.eta && (
          <Text style={styles.eta}>ETA: {item.eta}</Text>
        )}
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={item.activeBusCount > 0 ? '#007AFF' : '#CCCCCC'} 
      />
    </TouchableOpacity>
  );

  const renderActiveBusItem = ({ item }: { item: ActiveBus }) => (
    <TouchableOpacity
      style={styles.busCard}
      onPress={() => setSelectedActiveBus(item)}
    >
      <View style={styles.busInfo}>
        <View style={styles.busHeader}>
          <Text style={styles.busLineName}>{item.lineName}</Text>
          {item.distance !== undefined && (
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>
                {item.distance < 1 
                  ? `${Math.round(item.distance * 1000)}m` 
                  : `${item.distance.toFixed(1)}km`
                }
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.companyName}>Driver: {item.driverId.slice(0, 6)}</Text>
        <Text style={styles.busStatus}>Updated: {new Date(item.lastUpdated).toLocaleTimeString()}</Text>
        {item.distance !== undefined && item.direction && item.timeToArrival && (
          <View style={styles.locationInfo}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color="#007AFF" />
              <Text style={styles.locationText}>
                {item.distance < 1 
                  ? `${Math.round(item.distance * 1000)}m ${item.direction}` 
                  : `${item.distance.toFixed(1)}km ${item.direction}`
                }
              </Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="time" size={14} color="#34C759" />
              <Text style={styles.locationText}>
                {item.timeToArrival} away
              </Text>
            </View>
          </View>
        )}
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={'#007AFF'} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Ionicons name="menu" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>{t('appTitle')}</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.colors.searchBg }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.textPrimary }]}
          placeholder={t('searchBus')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      {activeBuses.length > 0 && (
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary }}>Active Buses ({activeBuses.length})</Text>
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
      <FlatList
        data={filteredBuses}
        renderItem={renderBusItem}
        keyExtractor={(item) => item.id}
        style={styles.busList}
        contentContainerStyle={styles.busListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <SidebarMenu
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      {selectedActiveBus && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16 }}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#000000' }}>{selectedActiveBus.lineName}</Text>
              <TouchableOpacity onPress={() => setSelectedActiveBus(null)}>
                <Ionicons name="close" size={22} color="#666666" />
              </TouchableOpacity>
            </View>
            <Text style={{ marginTop: 4, color: '#666666' }}>Driver: {selectedActiveBus.driverName || selectedActiveBus.driverId.slice(0,6)}</Text>
            <Text style={{ marginTop: 4, color: '#666666' }}>Updated: {new Date(selectedActiveBus.lastUpdated).toLocaleTimeString()}</Text>
            {selectedActiveBus.distance !== undefined && selectedActiveBus.direction && selectedActiveBus.timeToArrival && (
              <View style={{ marginTop: 10, borderTopWidth: 1, borderColor: '#F0F0F0', paddingTop: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons name="location" size={16} color="#007AFF" />
                  <Text style={{ marginLeft: 6, color: '#333333' }}>
                    {selectedActiveBus.distance < 1 ? `${Math.round(selectedActiveBus.distance * 1000)}m` : `${selectedActiveBus.distance.toFixed(1)}km`} {selectedActiveBus.direction}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="time" size={16} color="#34C759" />
                  <Text style={{ marginLeft: 6, color: '#333333' }}>{selectedActiveBus.timeToArrival} away</Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={{ marginTop: 12, backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}
              onPress={() => {
                const line = selectedActiveBus.lineName;
                setSelectedActiveBus(null);
                navigation.navigate('Map' as never, { busLine: line } as never);
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Open Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  busList: {
    flex: 1,
  },
  busListContent: {
    paddingHorizontal: 20,
  },
  busCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  busInfo: {
    flex: 1,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  busLineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  distanceContainer: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  locationInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  companyName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  busStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeStatus: {
    color: '#34C759',
  },
  inactiveStatus: {
    color: '#FF3B30',
  },
  eta: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
});
