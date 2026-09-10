import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, Modal, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { getDriverCompanyId, setDriverBusLine, getDriverBusLine, clearDriverSession } from '../utils/driverStorage';
import { database } from '../config/firebase';
import { ref, onValue, off, set, remove, serverTimestamp } from 'firebase/database';
import * as Location from 'expo-location';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import SettingsModal from '../components/SettingsModal';

interface CompanyData { busLines?: string[] }

export default function DriverHomeScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [busLines, setBusLines] = useState<string[]>([]);
  const [selectedBusLine, setSelectedBusLine] = useState<string | null>(null);
  const [endPoint, setEndPoint] = useState<string>('');
  const [endLat, setEndLat] = useState<string>('');
  const [endLng, setEndLng] = useState<string>('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempPick, setTempPick] = useState<{ lat: number; lng: number } | null>(null);
  const [sharing, setSharing] = useState(false);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const pickerWebRef = useRef<WebView | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);

  // Curated well-known places in Egypt (Arabic / English) to boost UX
  const curatedPlaces: Array<{ names: string[]; lat: number; lon: number }> = [
    { names: ['ميدان التحرير', 'Tahrir Square', 'التحرير'], lat: 30.044420, lon: 31.235712 },
    { names: ['ميدان لبنان', 'Lebanon Square'], lat: 30.061010, lon: 31.201750 },
    { names: ['مطار القاهرة الدولي', 'Cairo International Airport', 'CAI'], lat: 30.121944, lon: 31.405556 },
    { names: ['الاهرامات', 'الاهرام', 'أهرامات الجيزة', 'Giza Pyramids', 'Pyramids of Giza'], lat: 29.979235, lon: 31.134202 },
    { names: ['قلعة صلاح الدين', 'Citadel of Saladin', 'Cairo Citadel'], lat: 30.029973, lon: 31.261571 },
    { names: ['شارع المعز', 'Al-Muizz Street'], lat: 30.049444, lon: 31.262222 },
    { names: ['جامعة القاهرة', 'Cairo University'], lat: 30.026470, lon: 31.208650 },
    { names: ['مدينة نصر', 'Nasr City'], lat: 30.056113, lon: 31.330000 },
    { names: ['الزمالك', 'Zamalek'], lat: 30.066667, lon: 31.216667 },
    { names: ['التجمع الخامس', 'New Cairo', 'Fifth Settlement'], lat: 30.007300, lon: 31.491600 },
    { names: ['رمسيس', 'Ramses Square', 'محطة مصر', 'Cairo Ramses Station'], lat: 30.062630, lon: 31.246960 },
    { names: ['المهندسين', 'Mohandessin'], lat: 30.054000, lon: 31.204000 },
    { names: ['مدينة 6 أكتوبر', '6th of October City'], lat: 29.963700, lon: 30.917700 },
    { names: ['المعادي', 'Maadi'], lat: 29.960000, lon: 31.270000 },
    { names: ['شبرا', 'Shubra'], lat: 30.082000, lon: 31.246000 },
    { names: ['وسط البلد', 'Downtown Cairo'], lat: 30.044000, lon: 31.235000 },
    { names: ['سيتي ستارز', 'City Stars'], lat: 30.072917, lon: 31.346667 },
    { names: ['مول مصر', 'Mall of Egypt'], lat: 29.969930, lon: 31.017330 },
    { names: ['كايرو فيستيفال سيتي', 'Cairo Festival City', 'CFC'], lat: 30.030556, lon: 31.409722 },
  ];

  useEffect(() => {
    (async () => {
      const storedCompany = await getDriverCompanyId();
      setCompanyId(storedCompany);
      const storedLine = await getDriverBusLine();
      if (storedLine) setSelectedBusLine(storedLine);

      // Load bus lines from Firebase
      if (storedCompany) {
        const compRef = ref(database, `companies/${storedCompany}`);
        const unsub = onValue(compRef, (snap) => {
          const data: CompanyData | null = snap.val();
          if (data && Array.isArray(data.busLines)) {
            setBusLines(data.busLines);
          } else {
            // fallback
            setBusLines(['M554', 'N777', '304', 'M534']);
          }
        });
        return () => off(compRef, 'value', unsub);
      } else {
        setBusLines(['M554', 'N777', '304', 'M534']);
      }
    })();
    return () => {
      if (locationSubRef.current) {
        locationSubRef.current.remove();
        locationSubRef.current = null;
      }
    };
  }, []);

  const startSharing = async () => {
    if (!user) return;
    if (!selectedBusLine) {
      Alert.alert('Select Bus', 'Please choose a bus line to start sharing location.');
      return;
    }
    if (!endPoint.trim()) {
      Alert.alert('Endpoint Required', 'Please enter your endpoint (destination) for this trip.');
      return;
    }
    await setDriverBusLine(selectedBusLine);
    const hasServices = await Location.hasServicesEnabledAsync();
    if (!hasServices) {
      Alert.alert('Location Services Disabled', 'Enable location services to share your live location.');
      return;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Grant location permission to share your live location.');
      return;
    }
    // initial write
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    await set(ref(database, `busLocations/${selectedBusLine}/${user.uid}`), {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      lastUpdated: new Date().toISOString(),
      endPoint: endPoint.trim(),
      endLat: endLat.trim() ? Number(endLat.trim()) : (tempPick ? tempPick.lat : null),
      endLng: endLng.trim() ? Number(endLng.trim()) : (tempPick ? tempPick.lng : null),
      driverName: user.displayName || (user.email ? user.email.split('@')[0] : 'Driver'),
      driverEmail: user.email || null,
    });
    const sub = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 20 },
      async (position) => {
        await set(ref(database, `busLocations/${selectedBusLine}/${user.uid}`), {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          lastUpdated: new Date().toISOString(),
          endPoint: endPoint.trim(),
          endLat: endLat.trim() ? Number(endLat.trim()) : (tempPick ? tempPick.lat : null),
          endLng: endLng.trim() ? Number(endLng.trim()) : (tempPick ? tempPick.lng : null),
          driverName: user.displayName || (user.email ? user.email.split('@')[0] : 'Driver'),
          driverEmail: user.email || null,
        });
      }
    );
    locationSubRef.current = sub;
    setSharing(true);
  };

  const stopSharing = async () => {
    if (locationSubRef.current) {
      locationSubRef.current.remove();
      locationSubRef.current = null;
    }
    setSharing(false);
    if (user && selectedBusLine) {
      await remove(ref(database, `busLocations/${selectedBusLine}/${user.uid}`));
    }
  };

  const handleLogout = async () => {
    if (sharing) {
      Alert.alert('Stop Sharing First', 'You must stop sharing your live location before logging out.');
      return;
    }
    try {
      await clearDriverSession();
      await logout();
    } catch (e) {
      // no-op
    }
  };

  const runSearch = async (q: string) => {
    if (!q || q.trim().length < 2) {
      // Show curated suggestions when query is short
      const curated = curatedPlaces.slice(0, 12).map(cp => ({ display_name: cp.names[0], lat: String(cp.lat), lon: String(cp.lon) }));
      setSearchResults(curated);
      return;
    }
    const query = q.trim();
    try {
      // No borders/constraints: allow any place/road; still prefer Arabic/English
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=15&addressdetails=0&accept-language=ar,en&namedetails=0&extratags=0`;
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=20&lang=ar`;

      const [nResp, pResp] = await Promise.all([
        fetch(nominatimUrl, { headers: { 'User-Agent': 'BusTracker/1.0 (support@example.com)', 'Accept-Language': 'ar,en;q=0.9' } }),
        fetch(photonUrl)
      ]);
      const nominatim: Array<any> = await nResp.json();
      const photon: { features?: Array<{ geometry?: { coordinates?: [number, number] }, properties?: { name?: string } }> } = await pResp.json();

      // Curated matches: prefix or substring match in Arabic/English
      const lower = (s: string) => s.toLowerCase();
      const curatedMatches = curatedPlaces
        .map(cp => ({
          place: cp,
          score: cp.names.reduce((acc, name) => {
            const ln = lower(name);
            const lq = lower(query);
            if (ln === lq) return Math.max(acc, 3);
            if (ln.startsWith(lq)) return Math.max(acc, 2);
            if (ln.includes(lq)) return Math.max(acc, 1);
            return acc;
          }, 0)
        }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(x => ({ display_name: x.place.names[0], lat: String(x.place.lat), lon: String(x.place.lon) }));

      // Merge: curated, Nominatim, then Photon
      const combined: Array<{ display_name: string; lat: string; lon: string; _imp?: number }> = [
        ...curatedMatches,
        ...(Array.isArray(nominatim) ? nominatim.map(n => ({ display_name: n.display_name, lat: n.lat, lon: n.lon, _imp: typeof n.importance === 'number' ? n.importance : 0 })) : []),
        ...((photon.features || []).map(f => {
          const coords = f.geometry && f.geometry.coordinates ? f.geometry.coordinates : undefined;
          const name = f.properties && f.properties.name ? f.properties.name : '';
          return coords && name ? { display_name: name, lat: String(coords[1]), lon: String(coords[0]), _imp: 0.5 } : null;
        }).filter(Boolean) as Array<{ display_name: string; lat: string; lon: string; _imp?: number }>)
      ];

      // Deduplicate by near-same coordinate/name
      const seen = new Set<string>();
      const deduped: Array<{ display_name: string; lat: string; lon: string; _imp?: number }> = [];
      for (const r of combined) {
        const key = `${r.display_name.split(',')[0].toLowerCase()}|${Number(r.lat).toFixed(4)}|${Number(r.lon).toFixed(4)}`;
        if (!seen.has(key)) { seen.add(key); deduped.push(r); }
      }

      const sorted = deduped.sort((a, b) => (b._imp || 0) - (a._imp || 0));
      setSearchResults(sorted.slice(0, 15).map(({ _imp, ...rest }) => rest));
    } catch {
      setSearchResults([]);
    }
  };

  const searchPlaces = (q: string) => {
    setSearchQuery(q);
    if (searchTimerRef.current) { clearTimeout(searchTimerRef.current); }
    searchTimerRef.current = setTimeout(() => runSearch(q), 25);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}> 
        <View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t('appTitle')} - Driver</Text>
          <Text style={{ color: theme.colors.textSecondary }}>
            {user?.displayName || user?.email?.split('@')[0] || 'Driver'}{user?.email ? ` • ${user.email}` : ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.logoutBtn, { borderColor: theme.colors.border, marginRight: 8 }]} onPress={() => setSettingsVisible(true)}>
            <Text style={{ color: theme.colors.textPrimary, fontWeight: '700' }}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.logoutBtn, { borderColor: theme.colors.border }]} onPress={handleLogout}>
            <Text style={{ color: theme.colors.danger, fontWeight: '700' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={{ color: theme.colors.textSecondary, marginBottom: 16, marginHorizontal: 16 }}>Company: {companyId ?? 'N/A'}</Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Select Bus Line</Text>
      <FlatList
        data={busLines}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.busItem, { borderColor: theme.colors.border, backgroundColor: selectedBusLine === item ? theme.colors.searchBg : theme.colors.card }]}
            onPress={() => setSelectedBusLine(item)}
          >
            <Text style={{ color: theme.colors.textPrimary, fontWeight: selectedBusLine === item ? '700' : '500' }}>{item}</Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      />

      <View style={{ width: '100%', paddingHorizontal: 16, marginTop: 8 }}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Enter Endpoint</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.card, color: theme.colors.textPrimary }]}
          placeholder="e.g., Dreamland Gate, Tahrir Square"
          placeholderTextColor={theme.colors.muted}
          value={endPoint}
          onChangeText={setEndPoint}
          keyboardType={'default'}
          returnKeyType={'done'}
        />
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity style={[styles.secondaryBtn, { borderColor: theme.colors.border }]} onPress={async () => {
            // Warm up current position for search bias
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
          }}>
            <Text style={[styles.secondaryBtnText, { color: theme.colors.textPrimary }]}>Pick on Map</Text>
          </TouchableOpacity>
          {tempPick && (
            <View style={{ justifyContent: 'center', marginLeft: 8 }}>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>Selected: {tempPick.lat.toFixed(5)}, {tempPick.lng.toFixed(5)}</Text>
            </View>
          )}
        </View>
      </View>

      <Modal visible={pickerVisible} animationType="slide" onRequestClose={() => setPickerVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <TextInput
                placeholder="Search destination (e.g., Tahrir Square)"
                value={searchQuery}
                onChangeText={searchPlaces}
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}
              />
            </View>
            <TouchableOpacity onPress={() => setPickerVisible(false)}>
              <Text style={{ color: '#007AFF', fontWeight: '700' }}>Close</Text>
            </TouchableOpacity>
          </View>
          {currentPos && (
            <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#f3f3f3' }} onPress={() => {
              const latNum = currentPos.lat; const lngNum = currentPos.lng;
              setTempPick({ lat: latNum, lng: lngNum });
              setEndLat(String(latNum));
              setEndLng(String(lngNum));
              setEndPoint('Current Location');
              pickerWebRef.current?.injectJavaScript(`(function(){ if (typeof setPin==='function'){ setPin(${latNum}, ${lngNum}); } if (typeof map!=='undefined'){ map.setView([${latNum}, ${lngNum}], 15); } })();`);
            }}>
              <Text style={{ fontSize: 14 }}>Use Current Location</Text>
            </TouchableOpacity>
          )}
          {searchResults.length > 0 && (
            <ScrollView style={{ maxHeight: 180, borderBottomWidth: 1, borderColor: '#eee' }} keyboardShouldPersistTaps="handled">
              {searchResults.map((r, idx) => (
                <TouchableOpacity key={`${r.lat},${r.lon}-${idx}`} style={{ paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#f3f3f3' }} onPress={() => {
                  const latNum = Number(r.lat); const lngNum = Number(r.lon);
                  setTempPick({ lat: latNum, lng: lngNum });
                  setEndLat(String(latNum));
                  setEndLng(String(lngNum));
                  setEndPoint(r.display_name);
                  setSearchResults([]);
                  // center and drop pin in the webview map
                  pickerWebRef.current?.injectJavaScript(`(function(){ if (typeof setPin==='function'){ setPin(${latNum}, ${lngNum}); } if (typeof map!=='undefined'){ map.setView([${latNum}, ${lngNum}], 15); } })();`);
                }}>
                  <Text style={{ fontSize: 14 }}>{r.display_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          <WebView
            style={{ flex: 1 }}
            javaScriptEnabled
            ref={pickerWebRef}
            source={{ html: `<!DOCTYPE html>
              <html><head>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' />
                <script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script>
                <style>html,body,#map{height:100%;margin:0} .pin{background:#FF3B30;border:3px solid #fff;border-radius:50%;width:22px;height:22px;}</style>
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
              </body></html>` }}
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
          <View style={{ padding: 16, borderTopWidth: 1, borderColor: '#eee' }}>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]} onPress={() => setPickerVisible(false)}>
              <Text style={styles.primaryBtnText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {!sharing ? (
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]} onPress={startSharing}>
          <Text style={styles.primaryBtnText}>Start Sharing Live Location</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.colors.danger }]} onPress={stopSharing}>
          <Text style={styles.primaryBtnText}>Stop Sharing</Text>
        </TouchableOpacity>
      )}
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} onLogout={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  busItem: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  primaryBtn: {
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
  },
});


