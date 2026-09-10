import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

interface LocationContextType {
  location: Location.LocationObject | null;
  loading: boolean;
  error: string | null;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Location.LocationObject | null>;
  startLocationUpdates: () => Promise<void>;
  stopLocationUpdates: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    // Request location permission on app start
    requestLocationPermission();
    
    return () => {
      // Clean up location subscription on unmount
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to use the bus tracker.',
          [{ text: 'OK' }]
        );
        setError('Location services are disabled');
        return false;
      }

      // Request foreground location permission
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'This app needs location permission to show you nearby buses. Please grant location permission in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.openSettingsAsync() }
          ]
        );
        setError('Location permission denied');
        return false;
      }

      // For Expo Go, we only need foreground permission
      console.log('Location permission granted');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request location permission';
      setError(errorMessage);
      Alert.alert('Location Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      setLocation(currentLocation);
      return currentLocation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get current location';
      setError(errorMessage);
      Alert.alert('Location Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startLocationUpdates = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      // Stop any existing subscription
      if (locationSubscription) {
        locationSubscription.remove();
      }

      // For Expo Go, we'll use a simpler approach
      // Get current location first
      const currentLocation = await getCurrentLocation();
      if (currentLocation) {
        // Start location updates with more conservative settings for Expo Go
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000, // Update every 10 seconds
            distanceInterval: 50, // Update every 50 meters
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );

        setLocationSubscription(subscription);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start location updates';
      setError(errorMessage);
      Alert.alert('Location Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const stopLocationUpdates = (): void => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const value = {
    location,
    loading,
    error,
    requestLocationPermission,
    getCurrentLocation,
    startLocationUpdates,
    stopLocationUpdates,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
