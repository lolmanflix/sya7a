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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../config/firebase';
import { ref, onValue, off, remove } from 'firebase/database';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';

interface HistoryItem {
  id: string;
  busLine: string;
  companyName: string;
  timestamp: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { user } = useAuth();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();

  useEffect(() => {
    if (!user) return;

    const historyRef = ref(database, `users/${user.uid}/history`);
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyList: HistoryItem[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        historyList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistory(historyList);
      } else {
        setHistory([]);
      }
    });

    return () => off(historyRef, 'value', unsubscribe);
  }, [user]);

  const handleHistoryItemPress = (item: HistoryItem) => {
    (navigation.navigate as any)('Map', { busLine: item.busLine });
  };

  const handleClearHistory = () => {
    Alert.alert(
      t('clearHistory'),
      t('clearHistoryConfirm'),
      [
        { text: t('close'), style: 'cancel' },
        {
          text: t('clearHistory'),
          style: 'destructive',
          onPress: async () => {
            if (user) {
              try {
                const historyRef = ref(database, `users/${user.uid}/history`);
                await remove(historyRef);
                setHistory([]);
              } catch {
                Alert.alert('Error', 'Failed to clear history');
              }
            }
          },
        },
      ]
    );
  };

  const renderHistoryItem = ({ item, index }: { item: HistoryItem; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(400).springify()}
      exiting={FadeOutDown.duration(200)}
    >
      <TouchableOpacity
        style={[
          styles.historyCard,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          isRTL && styles.rowReverse,
        ]}
        onPress={() => handleHistoryItemPress(item)}
        activeOpacity={0.75}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
          <Ionicons name="time-outline" size={22} color={theme.colors.primary} />
        </View>
        <View style={[styles.historyInfo, isRTL && { alignItems: 'flex-end' }]}>
          <View style={[styles.titleRow, isRTL && styles.rowReverse]}>
            <Text style={[styles.busLineName, { color: theme.colors.textPrimary }, isRTL && styles.textRight]}>
              {item.busLine}
            </Text>
            <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
              {new Date(item.timestamp).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
            </Text>
          </View>
          <Text style={[styles.companyName, { color: theme.colors.textSecondary }, isRTL && styles.textRight]}>
            {item.companyName}
          </Text>
        </View>
        <Ionicons
          name={isRTL ? 'chevron-back' : 'chevron-forward'}
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.emptyState}>
      <View style={[styles.emptyIconContainer, { backgroundColor: `${theme.colors.border}50` }]}>
        <Ionicons name="time-outline" size={52} color={theme.colors.textSecondary} />
      </View>
      <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>
        {t('noHistory')}
      </Text>
      <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }, isRTL && styles.textRight]}>
        {isRTL
          ? 'ستظهر هنا خطوط الحافلات التي بحثت عنها مؤخراً.'
          : 'Your recent bus searches will appear here. Start searching for buses on the Home tab!'}
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }, isRTL && styles.rowReverse]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.searchBg }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name={isRTL ? 'arrow-forward' : 'arrow-back'}
            size={22}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          {t('historyTitle')}
        </Text>

        {history.length > 0 ? (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
            <Text style={styles.clearButtonText}>{t('clearHistory')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Count banner */}
      {history.length > 0 && (
        <View style={[styles.countBanner, { backgroundColor: theme.colors.searchBg, borderBottomColor: theme.colors.border }]}>
          <Ionicons name="albums-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.countText, { color: theme.colors.textSecondary }, isRTL && { marginLeft: 0, marginRight: 8 }]}>
            {history.length} {isRTL ? 'رحلة محفوظة' : `saved ${history.length === 1 ? 'route' : 'routes'}`}
          </Text>
        </View>
      )}

      {history.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'android' ? 44 : 14,
  },
  rowReverse: { flexDirection: 'row-reverse' },
  textRight: { textAlign: 'right' },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: { width: 40 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  clearButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FF3B3015',
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '700',
  },
  countBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  countText: {
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  historyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  busLineName: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
