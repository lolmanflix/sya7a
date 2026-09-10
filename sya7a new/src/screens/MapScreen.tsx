import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import SettingsModal from '../components/SettingsModal';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { saveToHistory } from '../utils/historyUtils';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { getMapHTML } from '../components/map/passengerMapHtml';
import BusDetailsSheet, { BusLocation } from '../components/map/BusDetailsSheet';

// High-precision Haversine distance in km
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371008.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) / 1000;
}

export default function MapScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { busLine } = route.params as { busLine: string };
  const { location, getCurrentLocation } = useLocation();
  const { user } = useAuth();
  const { theme, mode } = useTheme();
  const { t, isRTL } = useI18n();
  const [savingRoute, setSavingRoute] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  const [routeDefinition, setRouteDefinition] = useState<any>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number =>
    haversineKm(lat1, lon1, lat2, lon2);

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };

  const getDirectionName = (bearing: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(bearing / 22.5) % 16];
  };

  const calculateTimeToArrival = (distanceKm: number): string => {
    const timeInMinutes = Math.round((distanceKm / 30) * 60);
    if (timeInMinutes < 1) return isRTL ? 'أقل من دقيقة' : 'Less than 1 min';
    if (timeInMinutes < 60) return `${timeInMinutes} ${isRTL ? 'دقيقة' : 'min'}`;
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  // Push real-time bus location updates into the Leaflet WebView
  const pushBusUpdate = (locations: BusLocation[]) => {
    webViewRef.current?.injectJavaScript(`
      (function() {
        if (typeof updateBusLocations === 'function') {
          updateBusLocations(${JSON.stringify(locations)});
        }
      })();
      true;
    `);
  };

  // Push user location into the WebView
  const pushUserLocation = () => {
    if (location) {
      webViewRef.current?.injectJavaScript(`
        (function() {
          if (typeof addUserLocation === 'function') {
            addUserLocation(${location.coords.latitude}, ${location.coords.longitude});
          }
        })();
        true;
      `);
    }
  };

  // Push user→bus path
  const pushUserToBusRoute = (bus: BusLocation) => {
    if (location) {
      webViewRef.current?.injectJavaScript(`
        (function() {
          if (typeof drawUserToBus === 'function') {
            drawUserToBus(
              ${location.coords.latitude}, ${location.coords.longitude},
              ${bus.latitude}, ${bus.longitude}
            );
          }
        })();
        true;
      `);
    }
  };

  // Push full route and mandatory intermediate stops
  const pushFullRoute = (routeDef: any) => {
    if (!routeDef) return;
    webViewRef.current?.injectJavaScript(`
      (function() {
        if (typeof drawFullRouteWithStops === 'function') {
          drawFullRouteWithStops(${JSON.stringify(routeDef)});
        }
      })();
      true;
    `);
  };

  // 1. Fetch Line Route Definition & Mandatory Stops from RTDB
  useEffect(() => {
    if (!busLine) return;
    const compRef = ref(database, 'companies');
    const unsub = onValue(compRef, (snap) => {
      const allComp = snap.val() || {};
      let found: any = null;
      Object.values(allComp).forEach((comp: any) => {
        if (comp?.buses && typeof comp.buses === 'object') {
          Object.values(comp.buses).forEach((b: any) => {
            if (b?.lineId && b.lineId.toLowerCase() === busLine.toLowerCase()) {
              found = b;
            }
          });
        }
      });
      if (found) {
        setRouteDefinition(found);
        pushFullRoute(found);
      }
    });
    return () => off(compRef, 'value', unsub);
  }, [busLine]);

  // 2. Listen for active live buses broadcasting on this line
  useEffect(() => {
    const busLocationsRef = ref(database, `busLocations/${busLine}`);
    const unsubscribe = onValue(busLocationsRef, (snapshot) => {
      const data = snapshot.val();
      let locations: BusLocation[] = [];
      if (data && typeof data === 'object') {
        locations = Object.keys(data).map((key) => {
          const bus = { id: key, ...data[key] };
          if (location && bus.latitude && bus.longitude) {
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
            return {
              ...bus,
              distance,
              direction: getDirectionName(bearing),
              timeToArrival: calculateTimeToArrival(distance),
            };
          }
          return bus;
        });
      }

      // Only mock if explicitly requesting 'Demo Line'
      if (busLine === 'Demo Line' && locations.length === 0) {
        const mockBus: BusLocation = {
          id: 'demo-bus',
          latitude: 30.0444,
          longitude: 31.2357,
          lastUpdated: new Date().toISOString(),
          eta: '5 min',
        };
        if (location) {
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            mockBus.latitude,
            mockBus.longitude
          );
          const bearing = calculateBearing(
            location.coords.latitude,
            location.coords.longitude,
            mockBus.latitude,
            mockBus.longitude
          );
          locations.push({
            ...mockBus,
            distance,
            direction: getDirectionName(bearing),
            timeToArrival: calculateTimeToArrival(distance),
          });
        } else {
          locations.push(mockBus);
        }
      }

      setBusLocations(locations);

      if (!selectedBus && locations.length > 0) {
        let pick: BusLocation = locations[0];
        if (location) {
          let minD = Number.MAX_VALUE;
          locations.forEach((b) => {
            const d = calculateDistance(
              location.coords.latitude,
              location.coords.longitude,
              b.latitude,
              b.longitude
            );
            if (d < minD) {
              minD = d;
              pick = b;
            }
          });
        }
        setSelectedBus(pick);
      }

      pushBusUpdate(locations);
    });

    return () => off(busLocationsRef, 'value', unsubscribe);
  }, [busLine, location]);

  useEffect(() => {
    if (!location) {
      getCurrentLocation().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (selectedBus) {
      pushUserToBusRoute(selectedBus);
    }
  }, [selectedBus, location]);

  const handleSaveRoute = async (line: string, destination: string) => {
    if (!user) {
      Alert.alert(t('saveRoute'), isRTL ? 'سجّل الدخول لحفظ الخط.' : 'Sign in to save this route.');
      return;
    }
    try {
      setSavingRoute(true);
      await saveToHistory(user.uid, line, destination);
      Alert.alert(t('routeSavedSuccess'));
    } catch {
      Alert.alert(isRTL ? 'تعذر الحفظ' : 'Could not save', isRTL ? 'حاول مرة أخرى.' : 'Please try again.');
    } finally {
      setSavingRoute(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WebView
        ref={webViewRef}
        source={{ html: getMapHTML(mode === 'dark') }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={() => {
          setTimeout(() => {
            if (routeDefinition) pushFullRoute(routeDefinition);
            pushBusUpdate(busLocations);
            pushUserLocation();
            if (selectedBus) pushUserToBusRoute(selectedBus);
          }, 400);
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data && data.type === 'selectBus' && data.payload) {
              setSelectedBus(data.payload as BusLocation);
            }
          } catch {}
        }}
      />

      {/* Floating Top Header */}
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={[
          styles.floatingHeader,
          {
            backgroundColor: mode === 'dark' ? 'rgba(18,18,18,0.92)' : 'rgba(255,255,255,0.92)',
            borderColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.colors.searchBg }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            {t('line')} {busLine}
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: busLocations.length > 0 ? theme.colors.success : theme.colors.muted },
            ]}
          >
            {busLocations.length > 0
              ? `${busLocations.length} ${isRTL ? t('busesActive') : 'buses active'}`
              : isRTL
              ? 'لا توجد حافلات نشطة حالياً'
              : 'No active buses right now'}
          </Text>
        </View>

        <View style={[styles.headerActions, isRTL && styles.rowReverse]}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.searchBg }]}
            onPress={() => handleSaveRoute(busLine, routeDefinition?.endPoint || t('busLine'))}
          >
            <Ionicons name="bookmark-outline" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.searchBg }]}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="options-outline" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Modular Bottom Details Sheet */}
      <BusDetailsSheet
        selectedBus={selectedBus}
        onCloseBus={() => setSelectedBus(null)}
        routeDefinition={routeDefinition}
        busLine={busLine}
        user={user}
        isDark={mode === 'dark'}
        theme={theme}
        t={t}
        isRTL={isRTL}
        savingRoute={savingRoute}
        onSaveRoute={handleSaveRoute}
      />

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  rowReverse: { flexDirection: 'row-reverse' },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
});
