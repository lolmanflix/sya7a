import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from '../components/SettingsModal';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { useNavigation } from '@react-navigation/native';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

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
    // Listen to Firebase for companies data
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

  const renderCompanyItem = ({ item }: { item: Company }) => (
    <TouchableOpacity
      style={styles.companyCard}
      onPress={() => handleCompanyPress(item)}
    >
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>{item.name}</Text>
        {item.nameAr && (
          <Text style={styles.companyNameAr}>{item.nameAr}</Text>
        )}
        <Text style={styles.busLinesCount}>
          {item.busLines.length} bus line{item.busLines.length > 1 ? 's' : ''}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#007AFF" />
    </TouchableOpacity>
  );

  const renderBusLineItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.busLineCard}
      onPress={() => handleBusLinePress(item)}
    >
      <Text style={styles.busLineName}>{item}</Text>
      <Ionicons name="chevron-forward" size={16} color="#007AFF" />
    </TouchableOpacity>
  );

  if (selectedCompany) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedCompany(null)}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>{lang === 'ar' && selectedCompany.nameAr ? selectedCompany.nameAr : selectedCompany.name}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => setSettingsVisible(true)}>
            <Ionicons name="settings-outline" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={selectedCompany.busLines}
          renderItem={renderBusLineItem}
          keyExtractor={(item) => item}
          style={styles.busLinesList}
          contentContainerStyle={styles.busLinesListContent}
          showsVerticalScrollIndicator={false}
        />
        <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.placeholder} />
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>{t('companies')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={companies}
        renderItem={renderCompanyItem}
        keyExtractor={(item) => item.id}
        style={styles.companiesList}
        contentContainerStyle={styles.companiesListContent}
        showsVerticalScrollIndicator={false}
      />
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
  companiesList: {
    flex: 1,
  },
  companiesListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  companyNameAr: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    textAlign: 'right',
  },
  busLinesCount: {
    fontSize: 14,
    color: '#007AFF',
  },
  busLinesList: {
    flex: 1,
  },
  busLinesListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  busLineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  busLineName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
});


