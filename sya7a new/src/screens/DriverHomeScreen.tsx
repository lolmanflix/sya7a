import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { ref, onValue, off, set, remove } from 'firebase/database';
import { WebView } from 'react-native-webview';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import {
  getDriverCompanyId,
  setDriverBusLine,
  getDriverBusLine,
  clearDriverSession,
} from '../utils/driverStorage';
import { useDriverSafetyStream } from '../utils/driverSafetyStream';
import { auth, database } from '../config/firebase';
import SettingsModal from '../components/SettingsModal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface CompanyData {
  busLines?: string[];
  name?: string;
}

// Haversine distance in meters
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371008.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const formatTimer = (totalSeconds: number) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function DriverHomeScreen() {
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();
  const { user, logout } = useAuth();

  // Permissions for Camera & Microphone safety monitoring
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');
  const [cameraPreviewOpen, setCameraPreviewOpen] = useState(true);
  const cameraRef = useRef<any>(null);

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [busLines, setBusLines] = useState<string[]>([]);
  const [selectedBusLine, setSelectedBusLine] = useState<string | null>(null);
  const [endPoint, setEndPoint] = useState<string>('');
  const [endLat, setEndLat] = useState<string>('');
  const [endLng, setEndLng] = useState<string>('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempPick, setTempPick] = useState<{ lat: number; lng: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);

  // Live trip state
  const [sharing, setSharing] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [tripSeconds, setTripSeconds] = useState<number>(0);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Search in map modal
  const pickerWebRef = useRef<WebView | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Driver initials & display name
  const driverInitials = useMemo(() => {
    if (user?.displayName) {
      const parts = user.displayName.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    const name = user?.email?.split('@')[0] || 'DR';
    return name.slice(0, 2).toUpperCase();
  }, [user]);

  const driverName = useMemo(() => {
    return user?.displayName || user?.email?.split('@')[0] || 'Driver';
  }, [user]);

  // Trip duration counter
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (sharing) {
      timer = setInterval(() => {
        setTripSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setTripSeconds(0);
      setCurrentSpeed(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sharing]);

  // Initial setup & load stored company / bus line
  useEffect(() => {
    (async () => {
      const storedCompany = await getDriverCompanyId();
      setCompanyId(storedCompany);
      const storedLine = await getDriverBusLine();
      if (storedLine) setSelectedBusLine(storedLine);

      if (storedCompany) {
        const compRef = ref(database, `companies/${storedCompany}`);
        const unsub = onValue(compRef, (snap) => {
          const data: CompanyData | null = snap.val();
          if (data && Array.isArray(data.busLines) && data.busLines.length > 0) {
            setBusLines(data.busLines);
            if (!storedLine && data.busLines.length > 0) {
              setSelectedBusLine(data.busLines[0]);
            }
          } else {
            setBusLines(['M554', 'N777', '304', 'M534']);
            if (!storedLine) setSelectedBusLine('M554');
          }
        });
        return () => off(compRef, 'value', unsub);
      } else {
        setBusLines(['M554', 'N777', '304', 'M534']);
        if (!storedLine) setSelectedBusLine('M554');
      }
    })();

    return () => {
      if (locationSubRef.current) {
        locationSubRef.current.remove();
        locationSubRef.current = null;
      }
    };
  }, []);

  // Check and prompt for Camera and Mic permissions
  const ensureSafetyPermissions = async () => {
    try {
      let camGranted = cameraPermission?.granted;
      if (!camGranted) {
        const res = await requestCameraPermission();
        camGranted = res.granted;
      }
      let micGranted = micPermission?.granted;
      if (!micGranted) {
        const res = await requestMicPermission();
        micGranted = res.granted;
      }
      return camGranted && micGranted;
    } catch {
      return false;
    }
  };

  // SafeTrip™ Remote Camera & Audio Safety Stream Manager (WebRTC P2P 30 FPS)
  const {
    isStreaming: isSafetyStreaming,
    webrtcHtml,
    webViewRef,
    onWebViewMessage,
  } = useDriverSafetyStream({
    user,
    driverName,
    cameraRef,
    isRTL,
    onSessionStart: () => setCameraPreviewOpen(true),
  });

  // Quick Curated Popular Destination Chips
  const quickDestinations = [
    { name: isRTL ? 'ميدان التحرير' : 'Tahrir Square', lat: 30.0444, lon: 31.2357 },
    { name: isRTL ? 'مطار القاهرة' : 'Cairo Airport', lat: 30.1219, lon: 31.4055 },
    { name: isRTL ? 'محطة رمسيس' : 'Ramses Square', lat: 30.0626, lon: 31.2469 },
    { name: isRTL ? 'التجمع الخامس' : 'New Cairo', lat: 30.0073, lon: 31.4916 },
    { name: isRTL ? 'ميدان لبنان' : 'Lebanon Square', lat: 30.061, lon: 31.2017 },
  ];

  const handleSelectQuickDest = (item: { name: string; lat: number; lon: number }) => {
    setEndPoint(item.name);
    setEndLat(String(item.lat));
    setEndLng(String(item.lon));
    setTempPick({ lat: item.lat, lng: item.lon });
  };

  const startSharing = async () => {
    if (!user) return;
    if (!selectedBusLine) {
      Alert.alert(
        isRTL ? 'اختر خط الحافلة' : 'Select Bus Line',
        isRTL ? 'يرجى اختيار خط الحافلة لبدء الرحلة.' : 'Please choose a bus line to start your trip.'
      );
      return;
    }
    if (!endPoint.trim()) {
      Alert.alert(
        isRTL ? 'الوجهة مطلوبة' : 'Destination Required',
        isRTL ? 'يرجى إدخال وجهة الرحلة.' : 'Please enter or select a destination endpoint.'
      );
      return;
    }

    // Check location permission
    const hasServices = await Location.hasServicesEnabledAsync();
    if (!hasServices) {
      Alert.alert(
        isRTL ? 'تحديد الموقع معطل' : 'Location Services Disabled',
        isRTL ? 'يرجى تفعيل خدمات الموقع.' : 'Please enable location services.'
      );
      return;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        isRTL ? 'إذن الموقع مطلوب' : 'Permission Required',
        isRTL ? 'امنح إذن الموقع لمشاركة مسار الرحلة.' : 'Grant location permission to start live sharing.'
      );
      return;
    }

    // Request camera and microphone permissions if not yet granted
    await ensureSafetyPermissions();

    const activeUser = auth.currentUser || user;
    if (!activeUser?.uid) {
      Alert.alert(
        isRTL ? 'تسجيل الدخول مطلوب' : 'Authentication Required',
        isRTL ? 'يرجى تسجيل الدخول مرة أخرى لبدء مشاركة الموقع.' : 'Your session has expired. Please log in again to start broadcasting.'
      );
      return;
    }

    try {
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true).catch(() => {});
      }
    } catch {
      // Allow attempt to continue
    }

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const driverUid = activeUser.uid;
      const payload = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        lastUpdated: new Date().toISOString(),
        endPoint: endPoint.trim(),
        endLat: endLat.trim() ? Number(endLat.trim()) : tempPick ? tempPick.lat : null,
        endLng: endLng.trim() ? Number(endLng.trim()) : tempPick ? tempPick.lng : null,
        driverName,
        driverEmail: activeUser.email || null,
        speedKmh: 0,
        cameraMonitored: !!cameraPermission?.granted,
        micMonitored: !!micPermission?.granted,
        safetyStatus: 'monitored_secure',
      };

      await set(ref(database, `busLocations/${selectedBusLine}/${driverUid}`), payload);

      if (selectedBusLine) {
        await setDriverBusLine(selectedBusLine);
      }

      let prevLat = loc.coords.latitude;
      let prevLng = loc.coords.longitude;
      let prevTime = Date.now();
      let smoothVel = 0;

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        async (position) => {
          try {
            const now = Date.now();
            const dt = (now - prevTime) / 1000;
            let instVel = 0;
            if (dt > 0.2) {
              const dist = haversineMeters(
                prevLat,
                prevLng,
                position.coords.latitude,
                position.coords.longitude
              );
              instVel = (dist / dt) * 3.6; // Convert m/s to km/h
            }
            prevLat = position.coords.latitude;
            prevLng = position.coords.longitude;
            prevTime = now;

            if (position.coords.speed !== null && position.coords.speed >= 0) {
              instVel = position.coords.speed * 3.6;
            }
            smoothVel = smoothVel * 0.4 + instVel * 0.6;
            setCurrentSpeed(Math.round(smoothVel));

            const currentUid = auth.currentUser?.uid || user?.uid;
            if (!currentUid || !selectedBusLine) return;

            await set(ref(database, `busLocations/${selectedBusLine}/${currentUid}`), {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              lastUpdated: new Date().toISOString(),
              speedKmh: Math.round(smoothVel),
              endPoint: endPoint.trim(),
              endLat: endLat.trim() ? Number(endLat.trim()) : tempPick ? tempPick.lat : null,
              endLng: endLng.trim() ? Number(endLng.trim()) : tempPick ? tempPick.lng : null,
              driverName,
              driverEmail: auth.currentUser?.email || user?.email || null,
              cameraMonitored: !!cameraPermission?.granted,
              micMonitored: !!micPermission?.granted,
              safetyStatus: 'monitored_secure',
            });
          } catch (syncErr: any) {
            console.warn('[DriverGPS] Telemetry push warning:', syncErr?.message || syncErr);
          }
        }
      );

      locationSubRef.current = sub;
      setSharing(true);
    } catch (err: any) {
      console.error('[DriverGPS] Start trip error:', err);
      const isPermissionDenied = err?.message?.includes('PERMISSION_DENIED') || err?.code === 'PERMISSION_DENIED';
      Alert.alert(
        isRTL ? 'خطأ' : 'Error',
        isPermissionDenied
          ? (isRTL ? 'تم رفض الإذن. يرجى تسجيل الخروج وتسجيل الدخول بحساب السائق مجدداً لتحديث الجلسة.' : 'Session expired or database permission denied. Please log out and log back in to refresh your credentials.')
          : (err?.message || 'Failed to start trip.')
      );
    }
  };

  const stopSharing = async () => {
    Alert.alert(
      isRTL ? 'إنهاء الرحلة' : 'End Trip',
      isRTL ? 'هل أنت متأكد من إنهاء الرحلة وإيقاف مشاركة الموقع؟' : 'Are you sure you want to end this trip and stop broadcasting?',
      [
        { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isRTL ? 'إنهاء الرحلة' : 'End Trip',
          style: 'destructive',
          onPress: async () => {
            if (locationSubRef.current) {
              locationSubRef.current.remove();
              locationSubRef.current = null;
            }
            if (user && selectedBusLine) {
              await remove(ref(database, `busLocations/${selectedBusLine}/${user.uid}`)).catch(() => {});
            }
            setSharing(false);
            setCurrentSpeed(0);
          },
        },
      ]
    );
  };

  const handleSendSOS = async () => {
    if (!user) return;
    Alert.alert(
      isRTL ? 'تنبيه طوارئ SOS' : 'Emergency SOS Alert',
      isRTL ? 'هل تريد إرسال نداء استغاثة فوري لمركز التحكم؟' : 'Broadcast immediate distress signal to operations control?',
      [
        { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isRTL ? 'إرسال SOS' : 'Send SOS Alert',
          style: 'destructive',
          onPress: async () => {
            try {
              await set(ref(database, `driverControls/${user.uid}/sosAlert`), {
                triggeredAt: new Date().toISOString(),
                driverName,
                driverEmail: user.email,
                busLine: selectedBusLine,
                endPoint,
                status: 'critical_sos',
              });
              Alert.alert(
                isRTL ? 'تم إرسال الاستغاثة' : 'SOS Sent',
                isRTL ? 'تم إخطار مركز العمليات بموقعك فورياً.' : 'Operations dispatch has been alerted with your live location.'
              );
            } catch (e: any) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    if (sharing) {
      Alert.alert(
        isRTL ? 'أوقف الرحلة أولاً' : 'Stop Trip First',
        isRTL ? 'يجب إنهاء الرحلة قبل تسجيل الخروج.' : 'Please end your live trip before logging out.'
      );
      return;
    }
    try {
      await clearDriverSession();
      await logout();
    } catch {}
  };

  const isDark = theme.mode === 'dark';

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#0A0E1A' : '#F0F4FF' },
      ]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ── TOP DRIVER HEADER ── */}
          <View
            style={[
              styles.topBar,
              {
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                borderColor: isDark ? '#1F2937' : '#E0E8F8',
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={[styles.driverInfoLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={styles.driverAvatarWrap}>
                <View style={[styles.driverAvatarRing, { borderColor: sharing ? '#10B981' : (isDark ? '#3B82F6' : '#93C5FD') }]}>
                  <View style={[styles.driverAvatar, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
                    <Text style={[styles.avatarInitials, { color: isDark ? '#60A5FA' : '#1D4ED8' }]}>{driverInitials}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: sharing ? '#10B981' : '#94A3B8',
                      borderColor: isDark ? '#111827' : '#FFFFFF',
                      [isRTL ? 'left' : 'right']: 1,
                    },
                  ]}
                />
              </View>
              <View style={styles.driverTextCol}>
                <Text
                  style={[
                    styles.driverNameText,
                    {
                      color: isDark ? '#F9FAFB' : '#0F172A',
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                >
                  {driverName}
                </Text>
                <View style={[styles.driverSubRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View
                    style={[
                      styles.companyBadge,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                        borderColor: isDark ? '#334155' : '#BFDBFE',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                      },
                    ]}
                  >
                    <Ionicons name="business" size={10} color={isDark ? '#60A5FA' : '#2563EB'} />
                    <Text style={[styles.companyBadgeText, { color: isDark ? '#60A5FA' : '#1D4ED8' }]}>
                      {companyId ? companyId.toUpperCase() : 'CTA'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusChip,
                      {
                        backgroundColor: sharing
                          ? (isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5')
                          : (isDark ? '#1F2937' : '#F1F5F9'),
                        borderColor: sharing
                          ? (isDark ? '#059669' : '#86EFAC')
                          : (isDark ? '#374151' : '#CBD5E1'),
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                      },
                    ]}
                  >
                    <View style={[styles.statusChipDot, { backgroundColor: sharing ? '#10B981' : '#94A3B8' }]} />
                    <Text
                      style={[
                        styles.statusChipText,
                        { color: sharing ? '#10B981' : (isDark ? '#9CA3AF' : '#64748B') },
                      ]}
                    >
                      {sharing ? t('onLiveTrip') : t('standby')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.topBarActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  {
                    backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
                    borderColor: isDark ? '#374151' : '#E2E8F0',
                  },
                ]}
                onPress={() => setSettingsVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="settings-outline" size={19} color={isDark ? '#D1D5DB' : '#475569'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  styles.logoutIconBtn,
                  isDark && { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)' },
                ]}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={19} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── ACTIVE TRIP COCKPIT HUD ── */}
          {sharing && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.cockpitCard}>
              {/* Header row */}
              <View style={[styles.cockpitTopRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.liveTag, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={styles.pulsingDot} />
                  <Text style={styles.liveTagText}>{t('liveDispatch')}</Text>
                </View>
                <Text style={styles.timerText}>{formatTimer(tripSeconds)}</Text>
              </View>

              {/* Speed + Route */}
              <View style={[styles.speedRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={styles.speedBox}>
                  <Text style={styles.speedNum}>{currentSpeed}</Text>
                  <Text style={styles.speedUnit}>{t('speedUnitKmh')}</Text>
                </View>
                <View style={[styles.routeCol, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.routeLabel}>{t('lineLabel')}</Text>
                  <Text style={styles.routeVal}>{selectedBusLine}</Text>
                  <Text style={styles.routeLabel}>{t('destinationLabel')}</Text>
                  <Text
                    style={[
                      styles.routeDest,
                      { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                    numberOfLines={2}
                  >
                    {endPoint}
                  </Text>
                </View>
              </View>

              {/* SOS */}
              <TouchableOpacity
                style={[styles.sosBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={handleSendSOS}
                activeOpacity={0.8}
              >
                <Ionicons name="warning" size={17} color="#FFF" />
                <Text style={styles.sosBtnText}>{t('emergencySOS')}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* ───────────────────────────────────────────── */}
          {/*  SAFETRIP GUARD™ — CAMERA + MIC MONITORING  */}
          {/* ───────────────────────────────────────────── */}
          <Animated.View
            entering={FadeInUp.duration(450)}
            style={[
              styles.safetyCard,
              {
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                borderColor: isDark ? '#1F2937' : '#E0EAF8',
              },
            ]}
          >

            {/* Card header */}
            <View style={[styles.safetyCardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.safetyTitleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View
                  style={[
                    styles.shieldPill,
                    {
                      backgroundColor: isDark ? 'rgba(5,150,105,0.2)' : '#ECFDF5',
                      borderColor: isDark ? '#059669' : '#A7F3D0',
                    },
                  ]}
                >
                  <Ionicons name="shield-checkmark" size={16} color={isDark ? '#10B981' : '#059669'} />
                </View>
                <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                  <Text style={[styles.safetyTitle, { color: isDark ? '#F9FAFB' : '#0F172A' }]}>
                    {t('safeTripGuard')}
                  </Text>
                  <Text style={[styles.safetySub, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
                    {t('liveCabinMonitoring')}
                  </Text>
                </View>
              </View>
              {/* CAM / MIC pills */}
              <View style={[styles.sensorRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View
                  style={[
                    styles.sensorPill,
                    cameraPermission?.granted
                      ? (isDark ? { backgroundColor: 'rgba(16,185,129,0.15)', borderColor: '#059669' } : styles.sensorOn)
                      : (isDark ? { backgroundColor: '#1F2937', borderColor: '#374151' } : styles.sensorOff),
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                >
                  <View style={[styles.sensorDot, { backgroundColor: cameraPermission?.granted ? '#10B981' : '#94A3B8' }]} />
                  <Ionicons
                    name="videocam"
                    size={11}
                    color={cameraPermission?.granted ? '#10B981' : (isDark ? '#6B7280' : '#94A3B8')}
                  />
                  <Text
                    style={[
                      styles.sensorText,
                      { color: cameraPermission?.granted ? '#10B981' : (isDark ? '#9CA3AF' : '#94A3B8') },
                    ]}
                  >
                    {t('camPill')}
                  </Text>
                </View>
                <View
                  style={[
                    styles.sensorPill,
                    micPermission?.granted
                      ? (isDark ? { backgroundColor: 'rgba(16,185,129,0.15)', borderColor: '#059669' } : styles.sensorOn)
                      : (isDark ? { backgroundColor: '#1F2937', borderColor: '#374151' } : styles.sensorOff),
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                >
                  <View style={[styles.sensorDot, { backgroundColor: micPermission?.granted ? '#10B981' : '#94A3B8' }]} />
                  <Ionicons
                    name="mic"
                    size={11}
                    color={micPermission?.granted ? '#10B981' : (isDark ? '#6B7280' : '#94A3B8')}
                  />
                  <Text
                    style={[
                      styles.sensorText,
                      { color: micPermission?.granted ? '#10B981' : (isDark ? '#9CA3AF' : '#94A3B8') },
                    ]}
                  >
                    {t('micPill')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Permission prompt */}
            {(!cameraPermission?.granted || !micPermission?.granted) && (
              <View
                style={[
                  styles.permPrompt,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#F0F7FF',
                    borderColor: isDark ? '#334155' : '#BFDBFE',
                  },
                ]}
              >
                <View
                  style={[
                    styles.permIconRing,
                    {
                      backgroundColor: isDark ? '#0F172A' : '#DBEAFE',
                      borderColor: isDark ? '#3B82F6' : '#93C5FD',
                    },
                  ]}
                >
                  <Ionicons name="camera-outline" size={28} color="#3B82F6" />
                </View>
                <Text style={[styles.permTitle, { color: isDark ? '#93C5FD' : '#1E40AF' }]}>
                  {t('camMicPermRequired')}
                </Text>
                <Text style={[styles.permDesc, { color: isDark ? '#CBD5E1' : '#3B82F6' }]}>
                  {t('camMicPermDesc')}
                </Text>
                <TouchableOpacity
                  style={[styles.grantBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                  onPress={ensureSafetyPermissions}
                  activeOpacity={0.85}
                >
                  <Ionicons name="shield-checkmark-outline" size={15} color="#FFF" />
                  <Text style={styles.grantBtnText}>{t('enableSafetyMonitoring')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Live camera viewfinder */}
            {cameraPermission?.granted && (
              <View style={styles.camWrapper}>
                {cameraPreviewOpen ? (
                  <View style={styles.camFrame}>
                    {isSafetyStreaming ? (
                      <WebView
                        ref={webViewRef}
                        source={{ html: webrtcHtml, baseUrl: 'https://localhost' }}
                        onMessage={onWebViewMessage}
                        javaScriptEnabled={true}
                        mediaPlaybackRequiresUserAction={false}
                        allowsInlineMediaPlayback={true}
                        mediaCapturePermissionGrantType="grant"
                        originWhitelist={['*']}
                        style={styles.camView}
                      />
                    ) : (
                      <CameraView ref={cameraRef} facing={cameraFacing} style={styles.camView} mute={false} />
                    )}

                    {/* Top HUD */}
                    {!isSafetyStreaming && (
                      <View style={[styles.camTopHUD, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={[styles.recBadge, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                          <View style={styles.recDot} />
                          <Text style={styles.recText}>{t('recLiveCabin') || '● REC  LIVE CABIN FEED'}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.flipBtn}
                          onPress={() => setCameraFacing((p) => (p === 'front' ? 'back' : 'front'))}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="camera-reverse-outline" size={17} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Corner brackets */}
                    {!isSafetyStreaming && (
                      <>
                        <View style={[styles.corner, styles.cTL]} />
                        <View style={[styles.corner, styles.cTR]} />
                        <View style={[styles.corner, styles.cBL]} />
                        <View style={[styles.corner, styles.cBR]} />
                      </>
                    )}

                    {/* Bottom audio HUD */}
                    {!isSafetyStreaming && (
                      <View style={[styles.camBottomHUD, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Ionicons name="mic" size={13} color="#10B981" />
                        <Text
                          style={[
                            styles.audioText,
                            { textAlign: isRTL ? 'right' : 'left' },
                          ]}
                        >
                          {micPermission?.granted
                            ? (t('audioGuardActive') || 'Audio Guard Active')
                            : (t('micAccessNeeded') || 'Mic Access Needed')}
                        </Text>
                        {micPermission?.granted && (
                          <View style={[styles.waves, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            {[5, 10, 7, 14, 6, 11, 8].map((h, i) => (
                              <View key={i} style={[styles.wave, { height: h }]} />
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={[
                      styles.camMini,
                      {
                        backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#F0FDF4',
                        borderColor: isDark ? '#065F46' : '#A7F3D0',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                      },
                    ]}
                  >
                    <View style={[styles.camMiniLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <View
                        style={[
                          styles.camMiniIcon,
                          { backgroundColor: isDark ? 'rgba(16,185,129,0.2)' : '#DCFCE7' },
                        ]}
                      >
                        <Ionicons name="videocam" size={16} color="#10B981" />
                      </View>
                      <Text style={[styles.camMiniText, { color: isDark ? '#34D399' : '#065F46' }]}>
                        {t('cabinCameraBackground')}
                      </Text>
                    </View>
                    <View style={[styles.livePill, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <View style={styles.recDotSmall} />
                      <Text style={styles.livePillText}>{t('liveBadge')}</Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.toggleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                  onPress={() => setCameraPreviewOpen(!cameraPreviewOpen)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toggleText, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
                    {cameraPreviewOpen ? t('hideViewfinder') : t('showViewfinder')}
                  </Text>
                  <Ionicons
                    name={cameraPreviewOpen ? 'chevron-up' : 'chevron-down'}
                    size={15}
                    color={isDark ? '#9CA3AF' : '#64748B'}
                  />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

          {/* ───────────────────────────────────── */}
          {/* TRIP CONFIGURATION (when NOT active) */}
          {/* ───────────────────────────────────── */}
          {!sharing ? (
            <>
              {/* Bus Line */}
              <Animated.View
                entering={FadeInDown.delay(80).duration(400)}
                style={[
                  styles.configCard,
                  {
                    backgroundColor: isDark ? '#111827' : '#FFFFFF',
                    borderColor: isDark ? '#1F2937' : '#E0EAF8',
                  },
                ]}
              >
                <View style={[styles.configCardHead, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.configTitleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View
                      style={[
                        styles.configIcon,
                        {
                          backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                          borderColor: isDark ? '#334155' : '#BFDBFE',
                        },
                      ]}
                    >
                      <Ionicons name="bus" size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
                    </View>
                    <Text style={[styles.configTitle, { color: isDark ? '#F9FAFB' : '#0F172A' }]}>
                      {t('busLine')}
                    </Text>
                  </View>
                  <Text style={[styles.configSub, { color: isDark ? '#9CA3AF' : '#94A3B8' }]}>
                    {t('activeRoute')}
                  </Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.chipScroll,
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                >
                  {busLines.map((line) => {
                    const sel = selectedBusLine === line;
                    return (
                      <TouchableOpacity
                        key={line}
                        onPress={() => setSelectedBusLine(line)}
                        style={[
                          styles.busChip,
                          {
                            backgroundColor: sel
                              ? '#1D4ED8'
                              : (isDark ? '#1F2937' : '#F8FAFC'),
                            borderColor: sel
                              ? '#1D4ED8'
                              : (isDark ? '#374151' : '#CBD5E1'),
                            flexDirection: isRTL ? 'row-reverse' : 'row',
                          },
                          sel && styles.busChipSel,
                        ]}
                        activeOpacity={0.75}
                      >
                        <Ionicons name="bus" size={15} color={sel ? '#FFF' : (isDark ? '#60A5FA' : '#2563EB')} />
                        <Text
                          style={[
                            styles.busChipText,
                            { color: sel ? '#FFF' : (isDark ? '#E5E7EB' : '#334155') },
                            sel && styles.busChipTextSel,
                          ]}
                        >
                          {line}
                        </Text>
                        {sel && <Ionicons name="checkmark-circle" size={13} color="#FFF" />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {selectedBusLine && (
                  <View
                    style={[
                      styles.selLineBanner,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                        borderColor: isDark ? '#334155' : '#BFDBFE',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                      },
                    ]}
                  >
                    <Ionicons name="checkmark-circle" size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
                    <Text style={[styles.selLineBannerText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
                      {`${t('selectedLabel')}: ${selectedBusLine}`}
                    </Text>
                  </View>
                )}
              </Animated.View>

              {/* Destination */}
              <Animated.View
                entering={FadeInDown.delay(140).duration(400)}
                style={[
                  styles.configCard,
                  {
                    backgroundColor: isDark ? '#111827' : '#FFFFFF',
                    borderColor: isDark ? '#1F2937' : '#E0EAF8',
                  },
                ]}
              >
                <View style={[styles.configCardHead, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.configTitleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View
                      style={[
                        styles.configIcon,
                        {
                          backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                          borderColor: isDark ? '#334155' : '#BFDBFE',
                        },
                      ]}
                    >
                      <Ionicons name="navigate" size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
                    </View>
                    <Text style={[styles.configTitle, { color: isDark ? '#F9FAFB' : '#0F172A' }]}>
                      {t('destination')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.mapPickBtn,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                        borderColor: isDark ? '#334155' : '#BFDBFE',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                      },
                    ]}
                    onPress={async () => {
                      try {
                        const hasServices = await Location.hasServicesEnabledAsync();
                        if (hasServices) {
                          const { status } = await Location.requestForegroundPermissionsAsync();
                          if (status === 'granted') {
                            const cur = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                            setCurrentPos({ lat: cur.coords.latitude, lng: cur.coords.longitude });
                          }
                        }
                      } catch {}
                      setPickerVisible(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="map-outline" size={14} color={isDark ? '#60A5FA' : '#2563EB'} />
                    <Text style={[styles.mapPickText, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
                      {t('pickOnMap')}
                    </Text>
                    {tempPick && (
                      <View
                        style={[
                          styles.mapPickedBadge,
                          {
                            backgroundColor: isDark ? 'rgba(16,185,129,0.2)' : '#ECFDF5',
                            flexDirection: isRTL ? 'row-reverse' : 'row',
                          },
                        ]}
                      >
                        <Ionicons name="checkmark-circle" size={11} color="#10B981" />
                        <Text style={[styles.mapPickedText, { color: '#10B981' }]}>
                          {t('selectedBadge')}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <Input
                  placeholder={isRTL ? 'مثال: التحرير، رمسيس، مطار القاهرة' : 'e.g. Tahrir Square, Ramses, Airport'}
                  iconName="location-outline"
                  value={endPoint}
                  onChangeText={setEndPoint}
                  containerStyle={{ marginBottom: 14 }}
                />

                <Text
                  style={[
                    styles.quickLabel,
                    {
                      color: isDark ? '#9CA3AF' : '#94A3B8',
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                >
                  {t('quickDestinations')}
                </Text>
                <View style={[styles.quickWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  {quickDestinations.map((q) => {
                    const isActive = endPoint === q.name;
                    return (
                      <TouchableOpacity
                        key={q.name}
                        style={[
                          styles.quickChip,
                          {
                            backgroundColor: isActive
                              ? (isDark ? '#1E3A8A' : '#EFF6FF')
                              : (isDark ? '#1F2937' : '#F1F5F9'),
                            borderColor: isActive
                              ? '#3B82F6'
                              : (isDark ? '#374151' : '#E2E8F0'),
                            flexDirection: isRTL ? 'row-reverse' : 'row',
                          },
                        ]}
                        onPress={() => handleSelectQuickDest(q)}
                        activeOpacity={0.75}
                      >
                        <Ionicons
                          name="location"
                          size={11}
                          color={isActive ? '#38BDF8' : (isDark ? '#9CA3AF' : '#94A3B8')}
                        />
                        <Text
                          style={[
                            styles.quickChipText,
                            { color: isActive ? (isDark ? '#93C5FD' : '#1D4ED8') : (isDark ? '#D1D5DB' : '#475569') },
                            isActive && { fontWeight: '700' },
                          ]}
                        >
                          {q.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>

              {/* ── START TRIP BUTTON ── */}
              <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                <TouchableOpacity
                  style={[styles.startBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                  onPress={startSharing}
                  activeOpacity={0.83}
                >
                  <View style={styles.startBtnIcon}>
                    <Ionicons name="radio" size={21} color="#2563EB" />
                  </View>
                  <View style={[styles.startBtnText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                    <Text style={styles.startBtnLabel}>{t('startLiveTrip')}</Text>
                    <Text style={styles.startBtnSub}>{t('startLiveTripSub')}</Text>
                  </View>
                  <Ionicons
                    name={isRTL ? 'chevron-back' : 'chevron-forward'}
                    size={18}
                    color="rgba(255,255,255,0.65)"
                  />
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            /* ── STOP TRIP BUTTON ── */
            <Animated.View entering={FadeInDown.duration(300)}>
              <TouchableOpacity
                style={[styles.stopBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={stopSharing}
                activeOpacity={0.83}
              >
                <Ionicons name="stop-circle" size={22} color="#FFFFFF" />
                <Text style={styles.stopBtnText}>{t('endLiveTrip')}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── MAP PICKER MODAL ── */}
      <Modal visible={pickerVisible} animationType="slide" onRequestClose={() => setPickerVisible(false)}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#FFFFFF' }}
          edges={['top', 'bottom']}
        >
          <View
            style={[
              styles.mapModalHeader,
              {
                borderColor: isDark ? '#1F2937' : '#E2E8F0',
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={{ flex: 1, marginHorizontal: 8 }}>
              <Input
                placeholder={t('searchDestination')}
                iconName="search"
                value={searchQuery}
                onChangeText={(q) => {
                  setSearchQuery(q);
                  if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                  searchTimerRef.current = setTimeout(async () => {
                    if (!q || q.trim().length < 2) return setSearchResults([]);
                    try {
                      const res = await fetch(
                        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&lat=30.0444&lon=31.2357`
                      );
                      const data = await res.json();
                      const results = (data.features || []).map((f: any) => ({
                        display_name: [f.properties.name, f.properties.city].filter(Boolean).join(', '),
                        lat: String(f.geometry.coordinates[1]),
                        lon: String(f.geometry.coordinates[0]),
                      }));
                      setSearchResults(results);
                    } catch {
                      setSearchResults([]);
                    }
                  }, 250);
                }}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            <TouchableOpacity onPress={() => setPickerVisible(false)} style={styles.modalDoneBtn}>
              <Text style={styles.modalDoneBtnText}>{isRTL ? 'تم' : 'Done'}</Text>
            </TouchableOpacity>
          </View>

          {currentPos && (
            <TouchableOpacity
              style={[
                styles.useCurrentLocRow,
                {
                  backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                  borderBottomColor: isDark ? '#334155' : '#DBEAFE',
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                },
              ]}
              onPress={() => {
                const latNum = currentPos.lat;
                const lngNum = currentPos.lng;
                setTempPick({ lat: latNum, lng: lngNum });
                setEndLat(String(latNum));
                setEndLng(String(lngNum));
                setEndPoint(isRTL ? 'الموقع الحالي' : 'Current Location');
                pickerWebRef.current?.injectJavaScript(
                  `(function(){ if (typeof setPin==='function'){ setPin(${latNum}, ${lngNum}); } if (typeof map!=='undefined'){ map.setView([${latNum}, ${lngNum}], 15); } })();`
                );
              }}
            >
              <Ionicons
                name="locate"
                size={18}
                color={isDark ? '#60A5FA' : '#2563EB'}
                style={isRTL ? { marginLeft: 10 } : { marginRight: 10 }}
              />
              <Text style={[styles.useCurrentLocText, { color: isDark ? '#93C5FD' : '#2563EB' }]}>
                {t('useCurrentLocation')}
              </Text>
            </TouchableOpacity>
          )}

          {searchResults.length > 0 && (
            <ScrollView
              style={[
                styles.searchResultsContainer,
                {
                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                  borderBottomColor: isDark ? '#1F2937' : '#E2E8F0',
                },
              ]}
              keyboardShouldPersistTaps="handled"
            >
              {searchResults.map((r, idx) => (
                <TouchableOpacity
                  key={`${r.lat},${r.lon}-${idx}`}
                  style={[
                    styles.searchItem,
                    {
                      borderBottomColor: isDark ? '#1F2937' : '#F1F5F9',
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                  ]}
                  onPress={() => {
                    const latNum = Number(r.lat);
                    const lngNum = Number(r.lon);
                    setTempPick({ lat: latNum, lng: lngNum });
                    setEndLat(String(latNum));
                    setEndLng(String(lngNum));
                    setEndPoint(r.display_name);
                    setSearchResults([]);
                    pickerWebRef.current?.injectJavaScript(
                      `(function(){ if (typeof setPin==='function'){ setPin(${latNum}, ${lngNum}); } if (typeof map!=='undefined'){ map.setView([${latNum}, ${lngNum}], 15); } })();`
                    );
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={isDark ? '#9CA3AF' : '#64748B'}
                    style={isRTL ? { marginLeft: 10 } : { marginRight: 10 }}
                  />
                  <Text
                    style={[
                      styles.searchItemText,
                      {
                        color: isDark ? '#F3F4F6' : '#1E293B',
                        textAlign: isRTL ? 'right' : 'left',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {r.display_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <WebView
            style={{ flex: 1 }}
            javaScriptEnabled
            ref={pickerWebRef}
            source={{
              html: `<!DOCTYPE html>
              <html><head>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' />
                <script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script>
                <style>html,body,#map{height:100%;margin:0} .pin{background:#2563EB;border:3px solid #fff;border-radius:50%;width:24px;height:24px;box-shadow: 0 2px 6px rgba(0,0,0,0.35);}</style>
              </head><body>
                <div id='map'></div>
                <script>
                  const map = L.map('map').setView([30.0444,31.2357], 13);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                  let marker = null;
                  function setPin(lat, lng){
                    if (marker) map.removeLayer(marker);
                    marker = L.marker([lat,lng], { icon: L.divIcon({ className: 'pin' }) }).addTo(map);
                  }
                  map.on('click', function(e){
                    setPin(e.latlng.lat, e.latlng.lng);
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng }));
                  });
                  window.setPin = setPin;
                </script>
              </body></html>`,
            }}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data && typeof data.lat === 'number' && typeof data.lng === 'number') {
                  setTempPick({ lat: data.lat, lng: data.lng });
                  setEndLat(String(data.lat));
                  setEndLng(String(data.lng));
                }
              } catch {}
            }}
          />
          <View
            style={[
              styles.mapModalFooter,
              {
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                borderColor: isDark ? '#1F2937' : '#E2E8F0',
              },
            ]}
          >
            <Button title={t('confirmLocation')} onPress={() => setPickerVisible(false)} size="large" />
          </View>
        </SafeAreaView>
      </Modal>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════
//  STYLES — Premium Driver Dashboard Design System
// ═══════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 48,
    gap: 14,
  },

  // ── TOP BAR ─────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E0E8F8',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  driverInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    flex: 1,
  },
  driverAvatarWrap: { position: 'relative' },
  driverAvatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1D4ED8',
    letterSpacing: -0.5,
  },
  statusDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  driverTextCol: { flex: 1 },
  driverNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  driverSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 4,
  },
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  companyBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1D4ED8',
    letterSpacing: 0.3,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusChipDot: { width: 5, height: 5, borderRadius: 3 },
  statusChipText: { fontSize: 10, fontWeight: '700' },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoutIconBtn: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FECACA',
  },

  // ── COCKPIT HUD ─────────────────────────────────────────
  cockpitCard: {
    backgroundColor: '#080D1A',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1A2540',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 10,
  },
  cockpitTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#1A2540',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(239,68,68,0.12)',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.28)',
  },
  pulsingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F87171',
    letterSpacing: 1,
  },
  timerText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F1F5F9',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 18,
  },
  speedBox: {
    alignItems: 'center',
    backgroundColor: '#0D1526',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#162240',
    minWidth: 92,
  },
  speedNum: {
    fontSize: 50,
    fontWeight: '900',
    color: '#38BDF8',
    lineHeight: 54,
    letterSpacing: -2,
  },
  speedUnit: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 2,
  },
  routeCol: { flex: 1, gap: 1 },
  routeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 1.2,
    marginTop: 6,
  },
  routeVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  routeDest: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 18,
  },
  sosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: '#C41E1E',
    borderRadius: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  sosBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // ── SAFETY CARD ─────────────────────────────────────────
  safetyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0EAF8',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  safetyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  safetyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shieldPill: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  safetySub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  sensorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sensorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  sensorOn: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  sensorOff: { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' },
  sensorDot: { width: 5, height: 5, borderRadius: 3 },
  sensorText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },

  // ── PERMISSION PROMPT ────────────────────────────────────
  permPrompt: {
    backgroundColor: '#F0F7FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 6,
  },
  permIconRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DBEAFE',
    borderWidth: 2,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  permTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 8,
    textAlign: 'center',
  },
  permDesc: {
    fontSize: 13,
    color: '#3B82F6',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  grantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  grantBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── CAMERA VIEWFINDER ────────────────────────────────────
  camWrapper: { gap: 0 },
  camFrame: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  camView: { flex: 1 },
  camTopHUD: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.5)',
  },
  recDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  recDotSmall: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#EF4444' },
  recText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.6 },
  flipBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  // Viewfinder corner brackets
  corner: { position: 'absolute', width: 20, height: 20, borderColor: 'rgba(255,255,255,0.6)' },
  cTL: { top: 9, left: 9, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 4 },
  cTR: { top: 9, right: 9, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 4 },
  cBL: { bottom: 44, left: 9, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 4 },
  cBR: { bottom: 44, right: 9, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 4 },
  camBottomHUD: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 9,
    paddingHorizontal: 13,
  },
  audioText: { fontSize: 11, fontWeight: '600', color: '#D1FAE5', flex: 1 },
  waves: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  wave: { width: 3, backgroundColor: '#10B981', borderRadius: 2 },
  camMini: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  camMiniLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  camMiniIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camMiniText: { fontSize: 13, fontWeight: '700', color: '#065F46' },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(220,38,38,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.2)',
  },
  livePillText: { fontSize: 10, fontWeight: '800', color: '#DC2626', letterSpacing: 0.5 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 11,
    paddingBottom: 2,
  },
  toggleText: { fontSize: 12, fontWeight: '700', color: '#64748B' },

  // ── CONFIG CARDS ─────────────────────────────────────────
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E0EAF8',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  configCardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  configTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  configIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  configTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  configSub: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },

  // Bus chips
  chipScroll: { gap: 10, paddingVertical: 2, paddingHorizontal: 2 },
  busChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  busChipSel: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  busChipText: { fontSize: 14, fontWeight: '800', color: '#334155' },
  busChipTextSel: { color: '#FFFFFF' },
  selLineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
  },
  selLineBannerText: { fontSize: 12, fontWeight: '700', color: '#1D4ED8' },

  // Map pick button
  mapPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  mapPickText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
  mapPickedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 2,
  },
  mapPickedText: { fontSize: 9, fontWeight: '800', color: '#059669' },

  // Quick destinations
  quickLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 9,
  },
  quickWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickChipActive: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
  quickChipText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  quickChipTextActive: { color: '#1D4ED8', fontWeight: '700' },

  // ── ACTION BUTTONS ────────────────────────────────────────
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#1D4ED8',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.42,
    shadowRadius: 14,
    elevation: 8,
  },
  startBtnIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: { flex: 1 },
  startBtnLabel: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.2 },
  startBtnSub: { fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: '500', marginTop: 2 },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#DC2626',
    borderRadius: 22,
    paddingVertical: 18,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.42,
    shadowRadius: 14,
    elevation: 8,
  },
  stopBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },

  // ── MAP MODAL ─────────────────────────────────────────────
  mapModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalDoneBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalDoneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  useCurrentLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  useCurrentLocText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  searchResultsContainer: {
    maxHeight: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchItemText: {
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
  },
  searchResults: { maxHeight: 200, borderBottomWidth: 1 },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalFooter: { padding: 16, borderTopWidth: 1 },
  mapModalFooter: { padding: 16, borderTopWidth: 1, borderColor: '#E2E8F0' },
});
