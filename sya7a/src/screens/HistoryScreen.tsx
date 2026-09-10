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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../config/firebase';
import { ref, onValue, off, remove } from 'firebase/database';

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

  useEffect(() => {
    if (!user) return;

    // Listen to Firebase for user's search history
    const historyRef = ref(database, `users/${user.uid}/history`);
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyList: HistoryItem[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Sort by timestamp (newest first)
        historyList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistory(historyList);
      }
    });

    return () => off(historyRef, 'value', unsubscribe);
  }, [user]);

  const handleHistoryItemPress = (item: HistoryItem) => {
    navigation.navigate('Map' as never, { busLine: item.busLine } as never);
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

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleHistoryItemPress(item)}
    >
      <View style={styles.historyInfo}>
        <Text style={styles.busLineName}>{item.busLine}</Text>
        <Text style={styles.companyName}>{item.companyName}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#007AFF" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="time-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyStateTitle}>No History Yet</Text>
      <Text style={styles.emptyStateText}>
        Your recent bus searches will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        {history.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          style={styles.historyList}
          contentContainerStyle={styles.historyListContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  historyList: {
    flex: 1,
  },
  historyListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  historyItem: {
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
  historyInfo: {
    flex: 1,
  },
  busLineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 24,
  },
});



