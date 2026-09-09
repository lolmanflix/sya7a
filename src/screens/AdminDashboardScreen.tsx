import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { onValue, push, ref, set, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

type Bus = { id: string; lineName: string; companyName: string; capacity?: string; eta?: string };
type LiveBus = {
  id: string;
  line: string;
  driverId: string;
  driverName: string;
  latitude: number;
  longitude: number;
  lastUpdated?: string;
  speedKmh?: number;
};

const formatUpdated = (value?: string) => {
  if (!value) return 'Waiting for location';
  const seconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  return seconds < 60 ? `Updated ${seconds}s ago` : `Updated ${Math.floor(seconds / 60)}m ago`;
};

export default function AdminDashboardScreen() {
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<string[]>([]);
  const [liveBuses, setLiveBuses] = useState<LiveBus[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'routes'>('overview');
  const [modal, setModal] = useState<'bus' | 'route' | null>(null);
  const [lineName, setLineName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [routeName, setRouteName] = useState('');
  const [selectedLive, setSelectedLive] = useState<LiveBus | null>(null);

  // Derive admin initials & display name
  const adminInitials = useMemo(() => {
    if (user?.displayName) {
      const parts = user.displayName.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    const email = user?.email?.toLowerCase() || '';
    if (email.includes('kareem')) return 'KD';
    if (email.includes('essam')) return 'EH';
    return email ? email.slice(0, 2).toUpperCase() : 'AD';
  }, [user]);

  const adminName = useMemo(() => {
    if (user?.displayName) return user.displayName;
    const email = user?.email?.toLowerCase() || '';
    if (email.includes('kareem')) return 'Kareem Diyaa';
    if (email.includes('essam')) return 'Essam Hamza';
    return email.split('@')[0] || 'Administrator';
  }, [user]);

  useEffect(() => {
    const unsubscribe = onValue(ref(database, 'buses'), (snap) => {
      const value = snap.val() || {};
      setBuses(Object.entries(value).map(([id, bus]: [string, any]) => ({ id, ...bus })));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onValue(ref(database, 'companies'), (snap) => {
      const value = snap.val() || {};
      const lines = new Set<string>();
      Object.values(value).forEach((company: any) =>
        (company?.busLines || []).forEach((line: string) => lines.add(line))
      );
      setRoutes([...lines].sort());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onValue(ref(database, 'busLocations'), (snap) => {
      const data = snap.val() || {};
      const flattened: LiveBus[] = [];
      Object.entries(data).forEach(([line, drivers]: [string, any]) =>
        Object.entries(drivers || {}).forEach(([driverId, value]: [string, any]) => {
          if (typeof value?.latitude === 'number' && typeof value?.longitude === 'number') {
            flattened.push({
              id: `${line}-${driverId}`,
              line,
              driverId,
              driverName: value.driverName || 'Driver',
              latitude: value.latitude,
              longitude: value.longitude,
              lastUpdated: value.lastUpdated,
              speedKmh: value.speedKmh,
            });
          }
        })
      );
      setLiveBuses(flattened);
    });
    return unsubscribe;
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Live buses', value: liveBuses.length, icon: 'radio-outline' as const, color: '#10B981', bg: '#ECFDF5' },
      { label: 'Fleet records', value: buses.length, icon: 'bus-outline' as const, color: '#2563EB', bg: '#EFF6FF' },
      { label: 'Published routes', value: routes.length, icon: 'navigate-outline' as const, color: '#F59E0B', bg: '#FFFBEB' },
    ],
    [buses.length, liveBuses.length, routes.length]
  );

  const saveBus = async () => {
    if (!lineName.trim() || !companyName.trim()) {
      return Alert.alert('Missing details', 'Please enter both route/line code and company name.');
    }
    await set(push(ref(database, 'buses')), {
      lineName: lineName.trim().toUpperCase(),
      companyName: companyName.trim(),
      capacity: capacity.trim() || null,
      activeBusCount: 0,
      createdAt: new Date().toISOString(),
    });
    setLineName('');
    setCompanyName('');
    setCapacity('');
    setModal(null);
  };

  const confirmDeleteBus = (bus: Bus) => {
    Alert.alert('Delete Bus', `Are you sure you want to delete ${bus.lineName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await remove(ref(database, `buses/${bus.id}`));
        },
      },
    ]);
  };

  const saveRoute = async () => {
    if (!routeName.trim()) {
      return Alert.alert('Missing route', 'Please enter a route code or name.');
    }
    const companyKey = 'admin-managed';
    const next = [...new Set([...routes, routeName.trim()])];
    await set(ref(database, `companies/${companyKey}`), {
      name: 'Admin managed routes',
      busLines: next,
    });
    setRouteName('');
    setModal(null);
  };

  const confirmDeleteRoute = (targetRoute: string) => {
    Alert.alert('Delete Route', `Remove "${targetRoute}" from published routes?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const companyKey = 'admin-managed';
          const next = routes.filter((r) => r !== targetRoute);
          await set(ref(database, `companies/${companyKey}`), {
            name: 'Admin managed routes',
            busLines: next,
          });
        },
      },
    ]);
  };

  const requestMediaCheck = async (kind: 'audio' | 'video') => {
    if (!selectedLive) return;
    await set(ref(database, `driverControls/${selectedLive.driverId}/mediaRequest`), {
      kind,
      requestedAt: new Date().toISOString(),
      requestedBy: user?.email || 'admin',
      status: 'pending',
    });
    Alert.alert(
      'Request Sent',
      `The driver will receive a prompt to approve the ${kind} safety check.`
    );
  };

  const openMap = (bus: LiveBus) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${bus.latitude},${bus.longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Coordinates', `${bus.latitude.toFixed(5)}, ${bus.longitude.toFixed(5)}`)
    );
  };

  const renderNavTabs = () => (
    <View style={isMobile ? styles.mobileNavSegment : styles.navGroup}>
      {(
        [
          ['overview', 'grid-outline', 'Overview', liveBuses.length],
          ['fleet', 'bus-outline', 'Fleet', buses.length],
          ['routes', 'git-network-outline', 'Routes', routes.length],
        ] as const
      ).map(([key, icon, label, count]) => {
        const isActive = activeTab === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => setActiveTab(key)}
            style={[
              isMobile ? styles.mobileTab : styles.desktopTab,
              isActive && (isMobile ? styles.mobileTabActive : styles.desktopTabActive),
            ]}
          >
            <Ionicons
              name={icon}
              size={isMobile ? 16 : 18}
              color={isActive ? (isMobile ? '#1E40AF' : '#2563EB') : '#64748B'}
            />
            <Text
              style={[
                isMobile ? styles.mobileTabText : styles.desktopTabText,
                isActive && (isMobile ? styles.mobileTabTextActive : styles.desktopTabTextActive),
              ]}
            >
              {label}
            </Text>
            {count > 0 && (
              <View
                style={[
                  styles.tabBadge,
                  isActive ? styles.tabBadgeActive : styles.tabBadgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    isActive ? styles.tabBadgeTextActive : styles.tabBadgeTextInactive,
                  ]}
                >
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={isMobile ? styles.mobileShell : styles.desktopShell}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <View style={styles.sidebar}>
            <View>
              <View style={styles.brandRow}>
                <View style={styles.brandMark}>
                  <Ionicons name="bus" color="#FFF" size={20} />
                </View>
                <View>
                  <Text style={styles.brandTitle}>Safar Admin</Text>
                  <Text style={styles.brandSubtitle}>Operations Console</Text>
                </View>
              </View>
              {renderNavTabs()}
            </View>
            <TouchableOpacity onPress={logout} style={styles.desktopLogoutButton}>
              <Ionicons name="log-out-outline" size={20} color="#64748B" />
              <Text style={styles.logoutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Workspace */}
        <View style={styles.workspace}>
          {/* Header Bar */}
          <View style={isMobile ? styles.mobileHeader : styles.desktopHeader}>
            {isMobile ? (
              <View style={styles.mobileHeaderTop}>
                <View style={styles.mobileBrand}>
                  <View style={styles.mobileBrandIcon}>
                    <Ionicons name="bus" color="#FFF" size={16} />
                  </View>
                  <View>
                    <Text style={styles.mobileBrandTitle}>Safar Admin</Text>
                    <Text style={styles.mobileBrandSubtitle}>{adminName}</Text>
                  </View>
                </View>
                <View style={styles.mobileHeaderActions}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{adminInitials}</Text>
                  </View>
                  <TouchableOpacity onPress={logout} style={styles.mobileLogoutBtn}>
                    <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.desktopHeaderContent}>
                <View>
                  <Text style={styles.desktopPageTitle}>
                    {activeTab === 'overview'
                      ? 'Operations Overview'
                      : activeTab === 'fleet'
                      ? 'Fleet Management'
                      : 'Route Management'}
                  </Text>
                  <Text style={styles.desktopSubtitle}>
                    Real-time fleet telemetry and active controls
                  </Text>
                </View>
                <View style={styles.desktopProfileRow}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{adminInitials}</Text>
                  </View>
                  <View>
                    <Text style={styles.profileName}>{adminName}</Text>
                    <Text style={styles.profileRole}>Administrator</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Mobile Tab Bar */}
            {isMobile && renderNavTabs()}
          </View>

          {/* Scrollable Content */}
          <ScrollView
            contentContainerStyle={isMobile ? styles.mobileContent : styles.desktopContent}
            showsVerticalScrollIndicator={false}
          >
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                {/* Stats Grid */}
                <View style={styles.statsContainer}>
                  {stats.map((item) => (
                    <View key={item.label} style={styles.statCard}>
                      <View style={[styles.statIconBadge, { backgroundColor: item.bg }]}>
                        <Ionicons name={item.icon} size={18} color={item.color} />
                      </View>
                      <Text style={styles.statNumber}>{item.value}</Text>
                      <Text style={styles.statCaption} numberOfLines={1}>
                        {item.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Section Title */}
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Live Driver Locations</Text>
                    <Text style={styles.sectionSubtitle}>
                      Select a bus for telemetry & safety controls
                    </Text>
                  </View>
                  <View style={styles.liveIndicatorPill}>
                    <View style={styles.pulsingDot} />
                    <Text style={styles.liveIndicatorText}>LIVE</Text>
                  </View>
                </View>

                {/* Live Buses List */}
                {liveBuses.length > 0 ? (
                  <View style={styles.listContainer}>
                    {liveBuses.map((bus) => (
                      <TouchableOpacity
                        key={bus.id}
                        style={styles.busItemRow}
                        onPress={() => setSelectedLive(bus)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.busIconBadge}>
                          <Ionicons name="bus" size={18} color="#059669" />
                        </View>
                        <View style={styles.busDetailsCol}>
                          <View style={styles.busLineRow}>
                            <Text style={styles.busLineName}>{bus.line}</Text>
                            <Text style={styles.busDriverName}>· {bus.driverName}</Text>
                          </View>
                          <Text style={styles.busUpdatedText}>{formatUpdated(bus.lastUpdated)}</Text>
                        </View>
                        <View style={styles.speedBadge}>
                          <Text style={styles.speedText}>{Math.round(bus.speedKmh || 0)} km/h</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateCard}>
                    <View style={styles.emptyIconCircle}>
                      <Ionicons name="location-outline" size={28} color="#3B82F6" />
                    </View>
                    <Text style={styles.emptyTitle}>No buses currently active</Text>
                    <Text style={styles.emptyDesc}>
                      When a driver starts a route from the driver app, their live telemetry and speed will appear here.
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* FLEET TAB */}
            {activeTab === 'fleet' && (
              <>
                <View style={styles.tabActionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Fleet Records</Text>
                    <Text style={styles.sectionSubtitle}>
                      Manage registered bus lines and operators
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.primaryActionButton}
                    onPress={() => setModal('bus')}
                  >
                    <Ionicons name="add" size={18} color="#FFF" />
                    <Text style={styles.primaryActionText}>Add Bus</Text>
                  </TouchableOpacity>
                </View>

                {buses.length > 0 ? (
                  <View style={styles.listContainer}>
                    {buses.map((bus) => (
                      <View key={bus.id} style={styles.busItemRow}>
                        <View style={[styles.busIconBadge, { backgroundColor: '#EFF6FF' }]}>
                          <Ionicons name="bus-outline" size={18} color="#2563EB" />
                        </View>
                        <View style={styles.busDetailsCol}>
                          <Text style={styles.busLineName}>{bus.lineName}</Text>
                          <Text style={styles.busDriverName}>
                            {bus.companyName}
                            {bus.capacity ? ` · ${bus.capacity} seats` : ''}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => confirmDeleteBus(bus)}
                          style={styles.deleteIconButton}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateCard}>
                    <View style={styles.emptyIconCircle}>
                      <Ionicons name="bus-outline" size={28} color="#2563EB" />
                    </View>
                    <Text style={styles.emptyTitle}>Your fleet is empty</Text>
                    <Text style={styles.emptyDesc}>
                      Add a bus record to make it available for passenger search and driver selection.
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* ROUTES TAB */}
            {activeTab === 'routes' && (
              <>
                <View style={styles.tabActionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Published Routes</Text>
                    <Text style={styles.sectionSubtitle}>
                      Routes selectable by drivers during trips
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.primaryActionButton}
                    onPress={() => setModal('route')}
                  >
                    <Ionicons name="add" size={18} color="#FFF" />
                    <Text style={styles.primaryActionText}>Add Route</Text>
                  </TouchableOpacity>
                </View>

                {routes.length > 0 ? (
                  <View style={styles.listContainer}>
                    {routes.map((route) => (
                      <View key={route} style={styles.busItemRow}>
                        <View style={[styles.busIconBadge, { backgroundColor: '#FFFBEB' }]}>
                          <Ionicons name="navigate-outline" size={18} color="#F59E0B" />
                        </View>
                        <View style={styles.busDetailsCol}>
                          <Text style={styles.busLineName}>{route}</Text>
                          <Text style={styles.busDriverName}>Active in Safar app</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => confirmDeleteRoute(route)}
                          style={styles.deleteIconButton}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateCard}>
                    <View style={styles.emptyIconCircle}>
                      <Ionicons name="navigate-outline" size={28} color="#F59E0B" />
                    </View>
                    <Text style={styles.emptyTitle}>No routes published yet</Text>
                    <Text style={styles.emptyDesc}>
                      Routes created here are offered to drivers whenever they begin a shift.
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>

        {/* CREATE MODAL */}
        <Modal
          transparent
          visible={!!modal}
          animationType="fade"
          onRequestClose={() => setModal(null)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalBackdrop}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {modal === 'bus' ? 'Add Fleet Record' : 'Add Published Route'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {modal === 'bus'
                  ? 'This makes the bus route and company searchable in the passenger app.'
                  : 'This route code will appear in the driver route selection menu.'}
              </Text>

              {modal === 'bus' ? (
                <>
                  <Text style={styles.inputLabel}>ROUTE / BUS CODE</Text>
                  <TextInput
                    value={lineName}
                    onChangeText={setLineName}
                    placeholder="e.g. M554 or 304"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                    autoCapitalize="characters"
                  />

                  <Text style={styles.inputLabel}>OPERATOR / COMPANY</Text>
                  <TextInput
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="e.g. Mwasalat Misr or CTA"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />

                  <Text style={styles.inputLabel}>SEATS CAPACITY (OPTIONAL)</Text>
                  <TextInput
                    value={capacity}
                    onChangeText={setCapacity}
                    placeholder="e.g. 45"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    style={styles.inputField}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.inputLabel}>ROUTE TITLE OR CODE</Text>
                  <TextInput
                    value={routeName}
                    onChangeText={setRouteName}
                    placeholder="e.g. M554 · New Cairo — Tahrir"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </>
              )}

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  onPress={() => setModal(null)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={modal === 'bus' ? saveBus : saveRoute}
                  style={styles.modalSaveBtn}
                >
                  <Text style={styles.modalSaveText}>Save Record</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* LIVE BUS DETAIL & SAFETY MODAL */}
        <Modal
          transparent
          visible={!!selectedLive}
          animationType="slide"
          onRequestClose={() => setSelectedLive(null)}
        >
          {selectedLive && (
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedLive(null)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>

                <View style={styles.liveDetailHeader}>
                  <View style={styles.busIconBadge}>
                    <Ionicons name="bus" size={20} color="#059669" />
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>
                      {selectedLive.line} · {selectedLive.driverName}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                      {formatUpdated(selectedLive.lastUpdated)} · {Math.round(selectedLive.speedKmh || 0)} km/h
                    </Text>
                  </View>
                </View>

                {/* Telemetry info */}
                <View style={styles.telemetryCard}>
                  <Text style={styles.telemetryLabel}>COORDINATES</Text>
                  <Text style={styles.telemetryValue}>
                    {selectedLive.latitude.toFixed(5)}, {selectedLive.longitude.toFixed(5)}
                  </Text>
                </View>

                {/* Map Link */}
                <TouchableOpacity
                  style={styles.openMapButton}
                  onPress={() => openMap(selectedLive)}
                >
                  <Ionicons name="map-outline" size={18} color="#2563EB" />
                  <Text style={styles.openMapText}>Open in Google Maps</Text>
                </TouchableOpacity>

                {/* Safety Check Notice */}
                <View style={styles.safetyBox}>
                  <Ionicons name="shield-checkmark" size={22} color="#059669" />
                  <View style={styles.flex1}>
                    <Text style={styles.safetyTitle}>Consent-based safety check</Text>
                    <Text style={styles.safetyDesc}>
                      A request will be delivered to this driver's phone. Audio and video never activate without driver consent.
                    </Text>
                  </View>
                </View>

                {/* Media Request Buttons */}
                <View style={styles.mediaButtonsRow}>
                  <TouchableOpacity
                    style={styles.mediaBtn}
                    onPress={() => requestMediaCheck('audio')}
                  >
                    <Ionicons name="mic-outline" size={18} color="#1E293B" />
                    <Text style={styles.mediaBtnText}>Request Audio</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.mediaBtn}
                    onPress={() => requestMediaCheck('video')}
                  >
                    <Ionicons name="videocam-outline" size={18} color="#1E293B" />
                    <Text style={styles.mediaBtnText}>Request Video</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  desktopShell: {
    flex: 1,
    flexDirection: 'row',
  },
  mobileShell: {
    flex: 1,
    flexDirection: 'column',
  },

  // Desktop Sidebar
  sidebar: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 36,
    paddingHorizontal: 4,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  navGroup: {
    gap: 6,
  },
  desktopTab: {
    height: 44,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
  },
  desktopTabActive: {
    backgroundColor: '#EFF6FF',
  },
  desktopTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
  },
  desktopTabTextActive: {
    color: '#2563EB',
  },
  desktopLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },

  // Workspace
  workspace: {
    flex: 1,
  },

  // Desktop Top Header
  desktopHeader: {
    minHeight: 84,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 32,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  desktopHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  desktopPageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  desktopSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  desktopProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  profileRole: {
    fontSize: 12,
    color: '#64748B',
  },

  // Mobile Header
  mobileHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  mobileHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mobileBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mobileBrandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileBrandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  mobileBrandSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  mobileHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  mobileLogoutBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Mobile Tab Segment Control
  mobileNavSegment: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  mobileTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 8,
  },
  mobileTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  mobileTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  mobileTabTextActive: {
    color: '#1E40AF',
    fontWeight: '700',
  },

  tabBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  tabBadgeActive: {
    backgroundColor: '#DBEAFE',
  },
  tabBadgeInactive: {
    backgroundColor: '#E2E8F0',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  tabBadgeTextActive: {
    color: '#1D4ED8',
  },
  tabBadgeTextInactive: {
    color: '#64748B',
  },

  // Content Layout
  mobileContent: {
    padding: 16,
    paddingBottom: 36,
  },
  desktopContent: {
    padding: 32,
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 48,
  },

  // Stats Grid
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  statCaption: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  liveIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveIndicatorText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },

  tabActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // List Rows
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  busItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  busIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busDetailsCol: {
    flex: 1,
  },
  busLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  busLineName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  busDriverName: {
    fontSize: 13,
    color: '#64748B',
  },
  busUpdatedText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  speedBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  speedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  deleteIconButton: {
    padding: 6,
  },

  // Empty State
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },

  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 17,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    marginTop: 4,
  },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Live Detail Modal specifics
  liveDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  telemetryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  telemetryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  telemetryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  openMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 11,
    borderRadius: 9,
    marginBottom: 16,
  },
  openMapText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  flex1: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  safetyDesc: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
    lineHeight: 15,
  },
  mediaButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mediaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  mediaBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
});

