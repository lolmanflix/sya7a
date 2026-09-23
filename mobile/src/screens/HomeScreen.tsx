/**
 * @file HomeScreen.tsx
 * @description Primary commuter discovery screen coordinator.
 * Orchestrates live active fleet discovery, catalog browsing, real-time search,
 * geodesic proximity calculations, and multi-tenant institutional branding.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';

// Modular UI Components & Hook
import { useHomeBuses, Bus, ActiveBus } from '../hooks/useHomeBuses';
import { HomeHeader } from '../components/home/HomeHeader';
import { BusCardItem } from '../components/home/BusCardItem';
import { ActiveBusCardItem } from '../components/home/ActiveBusCardItem';
import { ActiveBusModal } from '../components/home/ActiveBusModal';
import SidebarMenu from '../components/SidebarMenu';
import SettingsModal from '../components/SettingsModal';
import { Input } from '../components/ui/Input';
import { styles } from '../styles/homeStyles';

/**
 * Commuter home screen providing real-time bus and shuttle discovery.
 *
 * @returns JSX Element.
 */
export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const navigation = useNavigation();
  const { user } = useAuth();
  const { location } = useLocation();
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();

  const userCoords = location?.coords
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    : null;

  const {
    searchQuery,
    setSearchQuery,
    filteredBuses,
    activeBuses,
    favoriteLines,
    selectedActiveBus,
    setSelectedActiveBus,
    refreshing,
    handleRefresh,
    handleToggleFavorite,
    handleSaveToHistory,
  } = useHomeBuses({
    userId: user?.uid,
    userCoords,
    isRTL,
  });

  /**
   * Navigates to MapScreen if line has active vehicles, or displays alert if none.
   */
  const handleBusPress = async (bus: Bus) => {
    if (bus.activeBusCount > 0) {
      await handleSaveToHistory(bus.lineName, bus.companyName);
      (navigation.navigate as any)('Map', { busLine: bus.lineName });
    } else {
      Alert.alert(
        isRTL ? 'لا حافلات نشطة' : 'No Active Buses',
        isRTL
          ? 'لا توجد حافلات نشطة لهذا الخط حالياً.'
          : 'There are currently no active buses for this line.'
      );
    }
  };

  /**
   * Bookmarks route and provides user feedback toast/alert.
   */
  const handleSaveBookmark = async (bus: Bus) => {
    try {
      await handleSaveToHistory(bus.lineName, bus.companyName);
      Alert.alert(t('routeSavedSuccess'));
    } catch {
      Alert.alert(
        isRTL ? 'تعذر الحفظ' : 'Could not save',
        isRTL ? 'حاول مرة أخرى.' : 'Please try again.'
      );
    }
  };

  /**
   * Launches MapScreen focused on a selected active vehicle.
   */
  const handleOpenMapForActiveBus = async (activeBus: ActiveBus) => {
    await handleSaveToHistory(
      activeBus.lineName,
      activeBus.driverName || t('busLine')
    );
    setSelectedActiveBus(null);
    (navigation.navigate as any)('Map', { busLine: activeBus.lineName });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Institutional White-Label Navigation Bar */}
      <HomeHeader
        onOpenSidebar={() => setSidebarVisible(true)}
        onOpenSettings={() => setSettingsVisible(true)}
      />

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <Input
          iconName="search"
          placeholder={t('searchBus')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {/* Live Fleet Section */}
      {activeBuses.length > 0 && (
        <View style={[styles.sectionHeader, isRTL && styles.rowReverse]}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            {t('activeBuses')}
          </Text>
          <View
            style={[styles.badge, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.badgeText}>{activeBuses.length}</Text>
          </View>
        </View>
      )}

      {activeBuses.length > 0 && (
        <FlatList
          data={activeBuses}
          renderItem={({ item, index }) => (
            <ActiveBusCardItem
              item={item}
              index={index}
              onSelect={setSelectedActiveBus}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.busList}
          contentContainerStyle={styles.busListContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Catalog Route Lines Section */}
      <View style={[styles.sectionHeader, isRTL && styles.rowReverse]}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          {t('allRoutes')}
        </Text>
      </View>

      <FlatList
        data={filteredBuses}
        renderItem={({ item, index }) => (
          <BusCardItem
            item={item}
            index={index}
            isFavorite={favoriteLines.has(item.lineName)}
            isAuthenticated={Boolean(user)}
            onPress={handleBusPress}
            onToggleFavorite={handleToggleFavorite}
            onSaveBookmark={handleSaveBookmark}
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.busList}
        contentContainerStyle={styles.busListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Navigation Drawers & Action Modals */}
      <SidebarMenu
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      <ActiveBusModal
        selectedBus={selectedActiveBus}
        onClose={() => setSelectedActiveBus(null)}
        onOpenMap={handleOpenMapForActiveBus}
      />
    </SafeAreaView>
  );
}
