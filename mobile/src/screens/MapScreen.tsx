/**
 * @file MapScreen.tsx
 * @description Primary commuter live map tracking coordinator screen.
 * Orchestrates real-time Leaflet WebView rendering, GPS telemetry updates,
 * multi-stop route geometry polylines, vehicle selection, and bookmarking.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { saveToHistory } from '../utils/historyUtils';

// Modular Presentation & State Layers
import { getMapHTML } from '../components/map/passengerMapHtml';
import BusDetailsSheet, { BusLocation } from '../components/map/BusDetailsSheet';
import SettingsModal from '../components/SettingsModal';
import { MapFloatingHeader } from '../components/map/MapFloatingHeader';
import { useMapBuses } from '../hooks/useMapBuses';
import {
  injectBusLocations,
  injectUserLocation,
  injectUserToBusRoute,
  injectFullRouteWithStops,
  injectMapStyle,
} from '../utils/mapBridgeUtils';
import { styles } from '../styles/mapStyles';

/**
 * Commuter interactive map screen displaying active vehicle fleet and route corridor.
 *
 * @returns JSX Element.
 */
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

  // Basemap HTML is built once from the mount-time theme; later theme changes are
  // pushed into the page through the window.__setMapStyle bridge (no reload).
  const initialMapDark = useRef(mode === 'dark').current;
  const mapHtml = useMemo(() => getMapHTML(initialMapDark), [initialMapDark]);

  const userCoords = location?.coords
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    : null;

  const {
    busLocations,
    selectedBus,
    setSelectedBus,
    routeDefinition,
  } = useMapBuses({
    busLine,
    userCoords,
    isRTL,
  });

  // Ensure initial location permission and coordinates are queried
  useEffect(() => {
    if (!location) {
      getCurrentLocation().catch(() => {});
    }
  }, [location, getCurrentLocation]);

  // Keep the OpenFreeMap basemap style in sync with the live theme mode
  useEffect(() => {
    injectMapStyle(webViewRef, mode);
  }, [mode]);

  // Synchronize live vehicle locations with Leaflet WebView
  useEffect(() => {
    injectBusLocations(webViewRef, busLocations);
  }, [busLocations]);

  // Synchronize full route polyline and intermediate stops
  useEffect(() => {
    if (routeDefinition) {
      injectFullRouteWithStops(
        webViewRef,
        routeDefinition,
        selectedBus || busLocations[0]
      );
    }
  }, [routeDefinition, selectedBus, busLocations]);

  // Synchronize user to selected vehicle direct route polyline
  useEffect(() => {
    if (selectedBus && userCoords) {
      injectUserToBusRoute(
        webViewRef,
        userCoords.latitude,
        userCoords.longitude,
        selectedBus.latitude,
        selectedBus.longitude
      );
    }
  }, [selectedBus, userCoords]);

  /**
   * Saves route to user history with feedback notifications.
   */
  const handleSaveRoute = async (line: string, destination: string) => {
    if (!user) {
      Alert.alert(
        t('saveRoute'),
        isRTL ? 'سجّل الدخول لحفظ الخط.' : 'Sign in to save this route.'
      );
      return;
    }
    try {
      setSavingRoute(true);
      await saveToHistory(user.uid, line, destination);
      Alert.alert(t('routeSavedSuccess'));
    } catch {
      Alert.alert(
        isRTL ? 'تعذر الحفظ' : 'Could not save',
        isRTL ? 'حاول مرة أخرى.' : 'Please try again.'
      );
    } finally {
      setSavingRoute(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onError={(event) => {
          console.error('[MapScreen] WebView error:', event.nativeEvent);
        }}
        onHttpError={(event) => {
          console.error(
            '[MapScreen] WebView HTTP error:',
            event.nativeEvent.statusCode,
            event.nativeEvent.description
          );
        }}
        onLoad={() => {
          setTimeout(() => {
            injectMapStyle(webViewRef, mode);
            if (routeDefinition) {
              injectFullRouteWithStops(
                webViewRef,
                routeDefinition,
                selectedBus || busLocations[0]
              );
            }
            injectBusLocations(webViewRef, busLocations);
            if (userCoords) {
              injectUserLocation(
                webViewRef,
                userCoords.latitude,
                userCoords.longitude
              );
            }
            if (selectedBus && userCoords) {
              injectUserToBusRoute(
                webViewRef,
                userCoords.latitude,
                userCoords.longitude,
                selectedBus.latitude,
                selectedBus.longitude
              );
            }
          }, 400);
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data && data.type === 'selectBus' && data.payload) {
              setSelectedBus(data.payload as BusLocation);
            } else if (data && data.type === 'mapError') {
              console.warn('[MapScreen] Map page error:', data.payload);
            }
          } catch (err) {
            console.error('[MapScreen] WebView message parsing failed:', err);
          }
        }}
      />

      {/* Floating Top Navigation Header */}
      <MapFloatingHeader
        busLine={busLine}
        activeBusCount={busLocations.length}
        onBack={() => navigation.goBack()}
        onSaveRoute={() =>
          handleSaveRoute(
            busLine,
            routeDefinition?.endPoint || t('busLine')
          )
        }
        onOpenSettings={() => setSettingsVisible(true)}
      />

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

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
}
