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
import SettingsModal from '../components/SettingsModal';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import Animated, { FadeInDown, FadeOutDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface BusLocation {
  id: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  eta?: string;
  distance?: number;
  direction?: string;
  timeToArrival?: string;
  endPoint?: string;
  endLat?: number | null;
  endLng?: number | null;
  speedKmh?: number;
}

// High-precision Haversine distance (returns km)
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371008.8; // IUGG mean Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) / 1000;
}

const getMapHTML = (isDark: boolean) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bus Tracker Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; background: ${isDark ? '#000' : '#fff'}; }
        #map { width: 100%; height: 100vh; }
        .bus-icon-wrapper { width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; }
        .bus-icon-shadow { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35)); }
        /* Smooth CSS transition for bus marker movement — only applies when JS enables it */
        .leaflet-marker-icon { transition: none; }
        .bus-animated .leaflet-marker-icon { transition: transform 1s ease-out !important; }
    </style>
</head>
<body>
    <div id="map"></div>

    <script>
        // --- Map setup ---
        const isDark = ${isDark};
        const tileUrl = isDark
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

        const map = L.map('map', { zoomControl: false }).setView([30.0444, 31.2357], 13);
        L.tileLayer(tileUrl, { attribution: '© OpenStreetMap contributors © CARTO' }).addTo(map);

        const busMarkers = {};
        const routeLayer = L.layerGroup().addTo(map);
        let lastRoutePos = null; // { lat, lng } — last position used for OSRM routing

        // --- Haversine in JS (mirrors the TypeScript version) ---
        function calcDistKm(lat1, lng1, lat2, lng2) {
          const R = 6371008.8;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lng2 - lng1) * Math.PI / 180;
          const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
                    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
                    Math.sin(dLon/2)*Math.sin(dLon/2);
          return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))) / 1000;
        }

        // --- OSRM dynamic re-routing ---
        function drawRouteOSRM(startLat, startLng, endLat, endLng, currentLat, currentLng, isInitialDraw) {
          // Route from current bus position to endpoint (dynamic rerouting)
          const routeStartLat = currentLat || startLat;
          const routeStartLng = currentLng || startLng;

          // Clear old route before drawing new one
          routeLayer.clearLayers();

          const url = \`https://router.project-osrm.org/route/v1/driving/\${routeStartLng},\${routeStartLat};\${endLng},\${endLat}?overview=full&geometries=geojson\`;
          fetch(url)
            .then(r => r.json())
            .then(data => {
              if (data.routes && data.routes[0]) {
                const coordinates = data.routes[0].geometry.coordinates;
                const latLngs = coordinates.map(coord => [coord[1], coord[0]]);
                L.polyline(latLngs, {
                  color: '#007AFF',
                  weight: 5,
                  opacity: 0.85
                }).addTo(routeLayer);
              }
            })
            .catch(() => {
              // Fallback: straight line
              if (routeStartLat && routeStartLng && endLat && endLng) {
                L.polyline([[routeStartLat, routeStartLng], [endLat, endLng]], {
                  color: '#007AFF', weight: 4, opacity: 0.7, dashArray: '8, 8'
                }).addTo(routeLayer);
              }
            });

          lastRoutePos = { lat: currentLat || startLat, lng: currentLng || startLng };
        }

        // --- Update bus marker with smooth CSS animation ---
        function updateBusMarkers(busLocations) {
          busLocations.forEach(bus => {
            const newLatLng = L.latLng(bus.latitude, bus.longitude);

            if (busMarkers[bus.id]) {
              // Existing marker: calculate distance moved
              const existingLatLng = busMarkers[bus.id].getLatLng();
              const distKm = calcDistKm(existingLatLng.lat, existingLatLng.lng, bus.latitude, bus.longitude);

              // Only animate if distance is reasonable (< 5km) and > 0 per README spec
              if (distKm < 5 && distKm > 0) {
                busMarkers[bus.id].setLatLng(newLatLng);
                // Apply CSS smooth transition on the marker element
                const markerEl = busMarkers[bus.id].getElement();
                if (markerEl) {
                  markerEl.style.transition = 'all 1s ease-out';
                }
              } else if (distKm === 0) {
                // No movement, just update
                busMarkers[bus.id].setLatLng(newLatLng);
              } else {
                // Bus teleported far — move instantly, no animation
                const markerEl = busMarkers[bus.id].getElement();
                if (markerEl) markerEl.style.transition = 'none';
                busMarkers[bus.id].setLatLng(newLatLng);
              }

              // Dynamic re-routing: if bus moved > 50m from last route position, recalculate
              if (lastRoutePos && bus.endLat && bus.endLng) {
                const movedKm = calcDistKm(lastRoutePos.lat, lastRoutePos.lng, bus.latitude, bus.longitude);
                if (movedKm > 0.05) { // 50 meters = 0.05 km
                  drawRouteOSRM(
                    bus.latitude, bus.longitude,
                    bus.endLat, bus.endLng,
                    bus.latitude, bus.longitude,
                    false
                  );
                }
              }
            } else {
              // New marker: create it
              const svg = \`<div class='bus-icon-wrapper'><svg class='bus-icon-shadow' width='36' height='36' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='3' y='3' width='18' height='12' rx='3' ry='3' fill='#007AFF' stroke='#FFFFFF' stroke-width='2'/><rect x='5' y='5' width='10' height='5' rx='1.5' fill='#E6F0FF'/><circle cx='7.5' cy='16.5' r='2' fill='#1C1C1E' stroke='#FFFFFF' stroke-width='1.5'/><circle cx='16.5' cy='16.5' r='2' fill='#1C1C1E' stroke='#FFFFFF' stroke-width='1.5'/><rect x='17' y='5' width='3' height='5' rx='1' fill='#E6F0FF'/></svg></div>\`;

              const marker = L.marker([bus.latitude, bus.longitude], {
                icon: L.divIcon({
                  className: 'bus-icon bus-animated',
                  html: svg,
                  iconSize: [44, 44],
                  iconAnchor: [22, 22]
                })
              }).addTo(map);

              marker.on('click', function () {
                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                  try { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'selectBus', payload: bus })); } catch (e) {}
                }
              });

              busMarkers[bus.id] = marker;

              // Initial route draw when bus first appears
              if (bus.endLat && bus.endLng) {
                drawRouteOSRM(
                  bus.latitude, bus.longitude,
                  bus.endLat, bus.endLng,
                  bus.latitude, bus.longitude,
                  true
                );
              }
            }
          });

          // Remove markers for buses that are no longer active
          const activeIds = new Set(busLocations.map(b => b.id));
          Object.keys(busMarkers).forEach(id => {
            if (!activeIds.has(id)) {
              map.removeLayer(busMarkers[id]);
              delete busMarkers[id];
            }
          });

          if (busLocations.length > 0 && !window.hasFittedBounds) {
            const group = new L.featureGroup(Object.values(busMarkers));
            if (group.getBounds().isValid()) {
              map.fitBounds(group.getBounds().pad(0.2));
            }
            window.hasFittedBounds = true;
          }
        }

        window.updateBusLocations = updateBusMarkers;

        // User location marker
        window.addUserLocation = function(lat, lng) {
          if (lat && lng) {
            if (window.userMarker) {
              window.userMarker.setLatLng([lat, lng]);
            } else {
              window.userMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                  className: 'user-marker',
                  html: '<div style="background-color:#007AFF;border:3px solid #FFFFFF;border-radius:50%;width:22px;height:22px;box-shadow:0 0 10px rgba(0,122,255,0.5);"></div>',
                  iconSize: [22, 22],
                  iconAnchor: [11, 11]
                })
              }).addTo(map);
            }
          }
        };

        // User → Bus route (dashed, indicating user's path to bus)
        window.drawUserToBus = async function(userLat, userLng, busLat, busLng) {
          if (window.userToBusLine) map.removeLayer(window.userToBusLine);
          if (!(userLat && userLng && busLat && busLng)) return;
          try {
            const url = \`https://router.project-osrm.org/route/v1/driving/\${userLng},\${userLat};\${busLng},\${busLat}?overview=full&geometries=geojson\`;
            const res = await fetch(url);
            const json = await res.json();
            const coords = json && json.routes && json.routes[0] && json.routes[0].geometry && json.routes[0].geometry.coordinates;
            if (Array.isArray(coords)) {
              const latlngs = coords.map(([lng, lat]) => [lat, lng]);
              window.userToBusLine = L.polyline(latlngs, { color: '#34C759', weight: 4, opacity: 0.7, dashArray: '10, 10' }).addTo(map);
            }
          } catch (e) {
            window.userToBusLine = L.polyline([[userLat, userLng], [busLat, busLng]], { color: '#34C759', weight: 3, opacity: 0.6, dashArray: '6, 10' }).addTo(map);
          }
        };
    </script>
</body>
</html>
`;

export default function MapScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { busLine } = route.params as { busLine: string };
  const { location, getCurrentLocation } = useLocation();
  const { theme, mode } = useTheme();
  const { t, isRTL } = useI18n();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number =>
    haversineKm(lat1, lon1, lat2, lon2);

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
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

  // Push real-time bus location updates into the WebView
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

  // Push user→bus route
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

  useEffect(() => {
    const busLocationsRef = ref(database, `busLocations/${busLine}`);
    const unsubscribe = onValue(busLocationsRef, (snapshot) => {
      const data = snapshot.val();
      let locations: BusLocation[] = [];
      if (data) {
        locations = Object.keys(data).map(key => {
          const bus = { id: key, ...data[key] };
          if (location && bus.latitude && bus.longitude) {
            const distance = calculateDistance(location.coords.latitude, location.coords.longitude, bus.latitude, bus.longitude);
            const bearing = calculateBearing(location.coords.latitude, location.coords.longitude, bus.latitude, bus.longitude);
            return { ...bus, distance, direction: getDirectionName(bearing), timeToArrival: calculateTimeToArrival(distance) };
          }
          return bus;
        });
      }

      if (busLine === 'Demo Line' || locations.length === 0) {
        const mockBus: BusLocation = {
          id: 'mock-bus',
          latitude: 30.0444,
          longitude: 31.2357,
          lastUpdated: new Date().toISOString(),
          eta: '5 min',
        };
        if (location) {
          const distance = calculateDistance(location.coords.latitude, location.coords.longitude, mockBus.latitude, mockBus.longitude);
          const bearing = calculateBearing(location.coords.latitude, location.coords.longitude, mockBus.latitude, mockBus.longitude);
          locations.push({ ...mockBus, distance, direction: getDirectionName(bearing), timeToArrival: calculateTimeToArrival(distance) });
        } else {
          locations.push(mockBus);
        }
      }
      setBusLocations(locations);

      if (!selectedBus && locations.length > 0) {
        let pick: BusLocation = locations[0];
        if (location) {
          let minD = Number.MAX_VALUE;
          locations.forEach(b => {
            const d = calculateDistance(location.coords.latitude, location.coords.longitude, b.latitude, b.longitude);
            if (d < minD) { minD = d; pick = b; }
          });
        }
        setSelectedBus(pick);
      }

      // Push real-time update into the WebView (1s cycle from Firebase)
      pushBusUpdate(locations);
    });

    return () => off(busLocationsRef, 'value', unsubscribe);
  }, [busLine, location]);

  useEffect(() => {
    if (!location) {
      getCurrentLocation().catch(() => {});
    }
  }, []);

  // When selected bus changes, draw user→bus route
  useEffect(() => {
    if (selectedBus) {
      pushUserToBusRoute(selectedBus);
    }
  }, [selectedBus, location]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WebView
        ref={webViewRef}
        source={{ html: getMapHTML(mode === 'dark') }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={() => {
          // Push initial data once the WebView is ready
          setTimeout(() => {
            pushBusUpdate(busLocations);
            pushUserLocation();
            if (selectedBus) pushUserToBusRoute(selectedBus);
          }, 500);
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

      {/* Floating Header */}
      <Animated.View entering={FadeInUp.duration(400)} style={[
        styles.floatingHeader,
        {
          backgroundColor: mode === 'dark' ? 'rgba(18,18,18,0.92)' : 'rgba(255,255,255,0.92)',
          borderColor: theme.colors.border,
        }
      ]}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.searchBg }]} onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>{t('line')} {busLine}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.success }]}>
            {busLocations.length} {isRTL ? t('busesActive') : 'buses active'}
          </Text>
        </View>

        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.searchBg }]} onPress={() => setSettingsVisible(true)}>
          <Ionicons name="options-outline" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Details Card */}
      {selectedBus && (
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
                onPress={() => setSelectedBus(null)}
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

            {selectedBus.endPoint && (
              <View style={[styles.endpointRow, isRTL && styles.rowReverse]}>
                <Ionicons name="pin-outline" size={18} color="#FF9500" />
                <Text style={[styles.endpointText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                  {t('headingTo')} <Text style={{ fontWeight: '700' }}>{selectedBus.endPoint}</Text>
                </Text>
              </View>
            )}

            <Button
              title={t('saveFavorites')}
              icon={<Ionicons name="bookmark-outline" size={18} color="#FFFFFF" />}
              onPress={() => Alert.alert(isRTL ? 'تم الحفظ' : 'Saved', `Bus ${selectedBus.id} saved to favorites.`)}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Animated.View>
      )}

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
    width: 40, height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
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
    marginBottom: 20,
  },
  detailsHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  busIconContainer: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  busTitle: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  busSubtitle: { fontSize: 13 },
  closeBtn: { padding: 8, borderRadius: 20 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 30 },
  statValue: { fontSize: 18, fontWeight: '800', marginTop: 4, marginBottom: 2 },
  statLabel: { fontSize: 12, fontWeight: '500' },
  endpointRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingHorizontal: 8 },
  endpointText: { marginLeft: 8, fontSize: 14, flex: 1 },
});
