import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ visible, onClose }: SidebarMenuProps) {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const slideX = useRef(new Animated.Value(-Dimensions.get('window').width * 0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideX, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    } else {
      // reset for next open
      slideX.setValue(-Dimensions.get('window').width * 0.8);
    }
  }, [visible]);

  const closeWithAnimation = () => {
    Animated.timing(slideX, { toValue: -Dimensions.get('window').width * 0.8, duration: 200, useNativeDriver: true }).start(() => {
      onClose();
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const handleHistoryPress = () => {
    // Navigate to history screen
    closeWithAnimation();
    navigation.navigate('History' as never);
  };

  const handleBusTrackerPress = () => {
    // Navigate to home screen
    closeWithAnimation();
    navigation.navigate('MainTabs' as never);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeWithAnimation}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideX }] }]}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={styles.userEmail}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeWithAnimation}>
              <Ionicons name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleBusTrackerPress}
            >
              <Ionicons name="home" size={20} color="#007AFF" />
              <Text style={styles.menuItemText}>Bus Tracker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleHistoryPress}
            >
              <Ionicons name="time" size={20} color="#007AFF" />
              <Text style={styles.menuItemText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={20} color="#FF3B30" />
              <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <TouchableWithoutFeedback onPress={closeWithAnimation}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  sidebar: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
  },
  closeButton: {
    padding: 8,
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 16,
  },
  logoutText: {
    color: '#FF3B30',
  },
});
