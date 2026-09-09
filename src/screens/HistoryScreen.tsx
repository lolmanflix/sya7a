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
      'Clear History',
      'Are you sure you want to clear all search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            if (user) {
              try {
                const historyRef = ref(database, `users/${user.uid}/history`);
                await remove(historyRef);
                setHistory([]);
              } catch (error) {
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
      entering={FadeInUp.delay(index * 100).duration(400).springify()}
      exiting={FadeOutDown.duration(200)}
    >
      <TouchableOpacity
        style={[styles.historyCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => handleHistoryItemPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
          <Ionicons name="time-outline" size={22} color={theme.colors.primary} />
        </View>
        <View style={styles.historyInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.busLineName, { color: theme.colors.textPrimary }]}>Bus {item.busLine}</Text>
            <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <Text style={[styles.companyName, { color: theme.colors.textSecondary }]}>{item.companyName}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.emptyState}>
      <View style={[styles.emptyIconContainer, { backgroundColor: `${theme.colors.border}50` }]}>
        <Ionicons name="search-outline" size={48} color={theme.colors.textSecondary} />
      </View>
      <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>No History Yet</Text>
      <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
        Your recent bus searches will appear here. Start searching for buses on the Home tab!
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Search History</Text>
        {history.length > 0 ? (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

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
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF3B3015',
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '700',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
    fontSize: 18,
    fontWeight: '700',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
