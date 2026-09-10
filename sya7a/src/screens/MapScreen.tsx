import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
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
}

const { width, height } = Dimensions.get('window');

const getMapHTML = () => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bus Tracker Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        #map {
            width: 100%;
            height: 100vh;
        }
        .bus-icon-wrapper { width: 36px; height: 36px; display:flex; align-items:center; justify-content:center; }
        .bus-icon-shadow { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
        .bus-popup {
            text-align: center;
            font-family: Arial, sans-serif;
        }
        .bus-popup h3 {
            margin: 0 0 5px 0;
            color: #007AFF;
        }
        .bus-popup p {
            margin: 2px 0;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <script>
        // Initialize the map centered on Cairo, Egypt
        const map = L.map('map').setView([30.0444, 31.2357], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Store bus markers
        const busMarkers = {};
        
        // Function to add or update bus markers
        function updateBusLocations(busLocations) {
            // Clear existing markers
            Object.values(busMarkers).forEach(marker => {
                map.removeLayer(marker);
            });
            Object.keys(busMarkers).forEach(key => {
                delete busMarkers[key];
            });
            
            // Add new markers
            busLocations.forEach(bus => {
                const svg = \`
                  <div class='bus-icon-wrapper'>
                    <svg class='bus-icon-shadow' width='28' height='28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <rect x='3' y='3' width='18' height='12' rx='2' ry='2' fill='#007AFF' stroke='#FFFFFF' stroke-width='1.5'/>
                      <rect x='5' y='5' width='10' height='5' rx='1' fill='#E6F0FF'/>
                      <circle cx='7.5' cy='16.5' r='2' fill='#1C1C1E' stroke='#FFFFFF' stroke-width='1'/>
                      <circle cx='16.5' cy='16.5' r='2' fill='#1C1C1E' stroke='#FFFFFF' stroke-width='1'/>
                      <rect x='17' y='5' width='3' height='5' rx='0.8' fill='#E6F0FF'/>
                    </svg>
                  </div>\`;
                const marker = L.marker([bus.latitude, bus.longitude], {
                  icon: L.divIcon({
                    className: 'bus-icon',
                    html: svg,
                    iconSize: [36, 36],
                    iconAnchor: [18, 18]
                  })
                }).addTo(map);
                // Post message to React Native on marker click
                marker.on('click', function() {
                  if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                    try {
                      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'selectBus', payload: bus }));
                    } catch (e) {}
                  }
                });
                
                busMarkers[bus.id] = marker;
            });
            
            // Fit map to show all markers if there are any
            if (busLocations.length > 0) {
                const group = new L.featureGroup(Object.values(busMarkers));
                map.fitBounds(group.getBounds().pad(0.1));
            }
        }
        
        // Expose function to React Native
        window.updateBusLocations = updateBusLocations;
        
        // Add user location if available
        // User location will be added via injected JavaScript
        window.addUserLocation = function(lat, lng) {
            if (lat && lng) {
                L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'user-marker',
                        html: '<div style="background-color: #34C759; border: 2px solid #FFFFFF; border-radius: 50%; width: 20px; height: 20px;"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(map).bindPopup('Your Location');
            }
        };

        // If window.userLat/Lng and mock bus, draw a polyline
        // (injectedJavaScript will set window.userLat/Lng)
        window.drawRoute = async function(userLat, userLng, busLat, busLng) {
          if (window.routeLine) {
            map.removeLayer(window.routeLine);
          }
          if (!(userLat && userLng && busLat && busLng)) return;
          try {
            const url = \`https://router.project-osrm.org/route/v1/driving/\${userLng},\${userLat};\${busLng},\${busLat}?overview=full&geometries=geojson\`;
            const res = await fetch(url);
            const json = await res.json();
            const coords = json && json.routes && json.routes[0] && json.routes[0].geometry && json.routes[0].geometry.coordinates;
            if (Array.isArray(coords)) {
              const latlngs = coords.map(([lng, lat]) => [lat, lng]);
              window.routeLine = L.polyline(latlngs, { color: '#007AFF', weight: 4, opacity: 0.8 }).addTo(map);
            }
          } catch (e) {
            // fallback to straight line
            window.routeLine = L.polyline([[userLat, userLng], [busLat, busLng]], {color: '#007AFF', weight: 4, opacity: 0.7}).addTo(map);
          }
        };

        window.drawBusToEndpoint = async function(busLat, busLng, endLat, endLng) {
          if (window.busToEndLine) {
            map.removeLayer(window.busToEndLine);
          }
          if (!(busLat && busLng && endLat && endLng)) return;
          try {
            const url = \`https://router.project-osrm.org/route/v1/driving/\${busLng},\${busLat};\${endLng},\${endLat}?overview=full&geometries=geojson\`;
            const res = await fetch(url);
            const json = await res.json();
            const coords = json && json.routes && json.routes[0] && json.routes[0].geometry && json.routes[0].geometry.coordinates;
            if (Array.isArray(coords)) {
              const latlngs = coords.map(([lng, lat]) => [lat, lng]);
              window.busToEndLine = L.polyline(latlngs, { color: '#FF9500', weight: 3, opacity: 0.9 }).addTo(map);
            }
          } catch (e) {
            // fallback to straight line
            window.busToEndLine = L.polyline([[busLat, busLng], [endLat, endLng]], {color: '#FF9500', weight: 3, opacity: 0.7}).addTo(map);
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
  const { theme } = useTheme();
  const { t } = useI18n();
  const [settingsVisible, setSettingsVisible] = useState(false);
  
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  const slideY = React.useRef(new Animated.Value(300)).current;

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
  const [region, setRegion] = useState({
    latitude: 30.0444, // Default Cairo coordinates
    longitude: 31.2357,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    // Listen to Firebase for bus locations for the specific line
    const busLocationsRef = ref(database, `busLocations/${busLine}`);
    const unsubscribe = onValue(busLocationsRef, (snapshot) => {
      const data = snapshot.val();
      let locations: BusLocation[] = [];
      if (data) {
        locations = Object.keys(data).map(key => {
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
            const direction = getDirectionName(bearing);
            const timeToArrival = calculateTimeToArrival(distance);
            return { ...bus, distance, direction, timeToArrival };
          }
          return bus;
        });
      }
      // Add a mock bus for demo/testing if viewing Demo Line or if no buses
      if (busLine === 'Demo Line' || locations.length === 0) {
        const mockBus: BusLocation = {
          id: 'mock-bus',
          latitude: 30.0444,
          longitude: 31.2357,
          lastUpdated: new Date().toISOString(),
          eta: '5 min',
        };
        // Add distance/direction if user location
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
          const direction = getDirectionName(bearing);
          const timeToArrival = calculateTimeToArrival(distance);
          locations.push({ ...mockBus, distance, direction, timeToArrival });
        } else {
          locations.push(mockBus);
        }
      }
      setBusLocations(locations);
      // Auto-select nearest bus if none selected
      if (!selectedBus && locations.length > 0) {
        let pick: BusLocation = locations[0];
        if (location) {
          let minD = Number.MAX_VALUE;
          locations.forEach(b => {
            if (typeof b.latitude === 'number' && typeof b.longitude === 'number') {
              const d = calculateDistance(location.coords.latitude, location.coords.longitude, b.latitude, b.longitude);
              if (d < minD) { minD = d; pick = b; }
            }
          });
        }
        setSelectedBus(pick);
      }
      
      // Update map region to show all buses or user location
      if (locations.length > 0) {
        const latitudes = locations.map(loc => loc.latitude);
        const longitudes = locations.map(loc => loc.longitude);
        
        // Include user location if available
        if (location) {
          latitudes.push(location.coords.latitude);
          longitudes.push(location.coords.longitude);
        }
        
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);
        
        setRegion({
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: Math.max(maxLat - minLat, 0.01) * 1.2,
          longitudeDelta: Math.max(maxLng - minLng, 0.01) * 1.2,
        });
      } else if (location) {
        // If no buses but user location available, center on user
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    });

    return () => off(busLocationsRef, 'value', unsubscribe);
  }, [busLine, location, selectedBus]);

  // Ensure WebView gets updates on every change
  useEffect(() => {
    // no-op body; the injectedJavaScript below pulls latest serialized arrays
  }, [busLocations, location, selectedBus]);

  // Animate bottom card slide
  useEffect(() => {
    Animated.timing(slideY, {
      toValue: selectedBus ? 0 : 300,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [selectedBus]);

  // Auto-center on user location when map opens
  useEffect(() => {
    const initializeMapLocation = async () => {
      if (location) {
        // If we already have location, center on it
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        // Try to get current location when map opens
        try {
          const currentLocation = await getCurrentLocation();
          if (currentLocation) {
            setRegion({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        } catch (error) {
          console.log('Could not get location for map centering');
        }
      }
    };

    initializeMapLocation();
  }, []);

  const handleMarkerPress = (bus: BusLocation) => {
    setSelectedBus(bus);
  };

  const handleSaveBus = () => {
    if (selectedBus) {
      // Save to user's saved buses in Firebase
      Alert.alert('Saved', `Bus ${selectedBus.id} has been saved to your favorites.`);
    }
  };

  const renderBusDetails = () => {
    if (!selectedBus) return null;

    return (
      <Animated.View style={[styles.busDetailsCard, { transform: [{ translateY: slideY }] }]}>
        <View style={styles.busDetailsHeader}>
          <Text style={styles.busNumber}>Bus {selectedBus.id}</Text>
          <TouchableOpacity onPress={() => setSelectedBus(null)}>
            <Ionicons name="close" size={24} color="#666666" />
          </TouchableOpacity>
        </View>
        <Text style={styles.busLine}>Line: {busLine}</Text>
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(selectedBus.lastUpdated).toLocaleTimeString()}
        </Text>
        
        {/* Distance and Direction Info */}
        {selectedBus.distance !== undefined && selectedBus.direction && selectedBus.timeToArrival && (
          <View style={styles.locationDetails}>
            <View style={styles.locationDetailRow}>
              <Ionicons name="location" size={16} color="#007AFF" />
              <Text style={styles.locationDetailText}>
                {selectedBus.distance < 1 
                  ? `${Math.round(selectedBus.distance * 1000)}m ${selectedBus.direction}` 
                  : `${selectedBus.distance.toFixed(1)}km ${selectedBus.direction}`
                }
              </Text>
            </View>
            <View style={styles.locationDetailRow}>
              <Ionicons name="time" size={16} color="#34C759" />
              <Text style={styles.locationDetailText}>
                {selectedBus.timeToArrival} away
              </Text>
            </View>
          </View>
        )}
        
        {selectedBus.eta && (
          <Text style={styles.eta}>ETA: {selectedBus.eta}</Text>
        )}
        {selectedBus.endPoint && (
          <Text style={styles.eta}>Endpoint: {selectedBus.endPoint}</Text>
        )}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveBus}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>{busLine}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <WebView
        source={{ html: getMapHTML() }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data && data.type === 'selectBus' && data.payload) {
              setSelectedBus(data.payload as any);
            }
          } catch {}
        }}
        injectedJavaScript={`
          // Set user location variables
          window.userLat = ${location ? location.coords.latitude : 'null'};
          window.userLng = ${location ? location.coords.longitude : 'null'};
          // Update bus markers
          if (window.updateBusLocations) {
            window.updateBusLocations(${JSON.stringify(busLocations)});
          }
          // Add user marker
          if (window.addUserLocation && window.userLat && window.userLng) {
            window.addUserLocation(window.userLat, window.userLng);
          }
          // Draw route for selected bus, if any
          const selectedBusData = ${JSON.stringify(selectedBus)};
          if (window.drawRoute && window.userLat && window.userLng && selectedBusData && selectedBusData.latitude && selectedBusData.longitude) {
            window.drawRoute(window.userLat, window.userLng, selectedBusData.latitude, selectedBusData.longitude);
          }
          if (window.drawBusToEndpoint && selectedBusData && selectedBusData.latitude && selectedBusData.longitude && selectedBusData.endLat && selectedBusData.endLng) {
            window.drawBusToEndpoint(selectedBusData.latitude, selectedBusData.longitude, selectedBusData.endLat, selectedBusData.endLng);
          }
          true;
        `}
        onLoadEnd={() => {
          // Update bus locations when WebView loads
          if (busLocations.length > 0) {
            // This will be handled by the injected JavaScript
          }
        }}
      />

      {renderBusDetails()}
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
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
  backButton: {
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
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  busDetailsCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  busDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  busLine: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 8,
  },
  eta: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 12,
  },
  locationDetails: {
    marginVertical: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  locationDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
