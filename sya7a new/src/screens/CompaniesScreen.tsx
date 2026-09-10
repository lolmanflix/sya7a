import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from '../components/SettingsModal';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { useNavigation } from '@react-navigation/native';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface Company {
  id: string;
  name: string;
  nameAr?: string;
  busLines: string[];
}

const defaultCompanies: Company[] = [
  {
    id: 'cta',
    name: 'CTA',
    nameAr: 'شركة أتوبيس القاهرة الكبرى',
    busLines: ['M554', 'N777', '304', 'M534']
  },
  {
    id: 'mwaslat-misr',
    name: 'Mwaslat Misr',
    nameAr: 'مواصلات مصر',
    busLines: ['M554', 'M534', 'M555']
  },
  {
    id: 'go-bus',
    name: 'Go Bus',
    busLines: ['G101', 'G102', 'G103']
  },
  {
    id: 'super-jet',
    name: 'Super Jet',
    busLines: ['S201', 'S202']
  },
  {
    id: 'white-bus',
    name: 'White Bus',
    busLines: ['W301', 'W302', 'W303']
  }
];

export default function CompaniesScreen() {
  const [companies, setCompanies] = useState<Company[]>(defaultCompanies);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t, lang } = useI18n();
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    const companiesRef = ref(database, 'companies');
    const unsubscribe = onValue(companiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const companiesList: Company[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setCompanies(companiesList);
      }
    });

    return () => off(companiesRef, 'value', unsubscribe);
  }, []);

  const handleCompanyPress = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleBusLinePress = (busLine: string) => {
    if (selectedCompany) {
      (navigation as any).navigate('Map', { busLine });
    }
  };

  const renderCompanyItem = ({ item, index }: { item: Company; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(400).springify()}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => handleCompanyPress(item)}
      >
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>{item.name}</Text>
          {item.nameAr && (
            <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>{item.nameAr}</Text>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.busLines.length} {item.busLines.length === 1 ? 'line' : 'lines'}
            </Text>
          </View>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderBusLineItem = ({ item, index }: { item: string; index: number }) => (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(400).springify()}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => handleBusLinePress(item)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15`, marginRight: 16 }]}>
            <Ionicons name="bus" size={20} color={theme.colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>{item}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );

  if (selectedCompany) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setSelectedCompany(null)}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>
            {lang === 'ar' && selectedCompany.nameAr ? selectedCompany.nameAr : selectedCompany.name}
          </Text>
          <View style={styles.headerButtonPlaceholder} />
        </View>

        <FlatList
          data={selectedCompany.busLines}
          renderItem={renderBusLineItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerButtonPlaceholder} />
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>{t('companies')}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={companies}
        renderItem={renderCompanyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerButtonPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
