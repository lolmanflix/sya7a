import React, { useEffect, useRef, useState } from 'react';
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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import SubscriptionModal from './SubscriptionModal';

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.82;

const PLAN_COLORS: Record<string, string> = {
  free: '#34C759',
  pro: '#007AFF',
  family: '#FF9500',
};

export default function SidebarMenu({ visible, onClose }: SidebarMenuProps) {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();
  const { currentPlan } = useSubscription();
  const [subscriptionVisible, setSubscriptionVisible] = useState(false);

  const slideX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideX, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 220,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideX.setValue(-SIDEBAR_WIDTH);
      overlayOpacity.setValue(0);
    }
  }, [visible]);

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(slideX, {
        toValue: isRTL ? SIDEBAR_WIDTH : -SIDEBAR_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const handleLogout = () => {
    Alert.alert(
      t('logoutMenu'),
      t('logoutConfirm'),
      [
        { text: t('close'), style: 'cancel' },
        {
          text: t('logoutMenu'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              onClose();
            } catch {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const handleHistoryPress = () => {
    closeWithAnimation();
    setTimeout(() => navigation.navigate('History' as never), 250);
  };

  const handleBusTrackerPress = () => {
    closeWithAnimation();
    setTimeout(() => navigation.navigate('MainTabs' as never), 250);
  };

  const planColor = PLAN_COLORS[currentPlan] ?? '#34C759';

  const planBadgeLabel = currentPlan === 'free'
    ? t('freePlanBadge')
    : currentPlan === 'pro'
    ? 'PRO'
    : t('familyPlanName', 'Family');

  const initials = (user?.displayName || user?.email || 'U')
    .split(' ')
    .map((w: string) => w[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sidebarTranslate = isRTL
    ? { translateX: Animated.multiply(slideX, -1) }
    : { translateX: slideX };

  return (
    <>
      <Modal
        visible={visible}
        animationType="none"
        transparent
        onRequestClose={closeWithAnimation}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.overlayBase, { opacity: overlayOpacity }]}
          pointerEvents="none"
        />
        <TouchableWithoutFeedback onPress={closeWithAnimation}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sidebar,
            isRTL ? styles.sidebarRight : styles.sidebarLeft,
            {
              backgroundColor: theme.colors.card,
              transform: [sidebarTranslate],
            },
          ]}
        >
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={[styles.profileSection, { borderBottomColor: theme.colors.border }]}>
              <View style={[styles.avatarRow, isRTL && styles.rowReverse]}>
                <View style={[styles.avatar, { backgroundColor: planColor }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={closeWithAnimation}>
                  <Ionicons name="close" size={22} color={theme.colors.muted} />
                </TouchableOpacity>
              </View>
              <View style={[styles.userMeta, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={[styles.userName, { color: theme.colors.textPrimary }, isRTL && styles.textRight]} numberOfLines={1}>
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={[styles.userEmail, { color: theme.colors.muted }, isRTL && styles.textRight]} numberOfLines={1}>
                  {user?.email || ''}
                </Text>
                <View style={[styles.planBadge, { backgroundColor: `${planColor}20`, borderColor: `${planColor}50` }]}>
                  <View style={[styles.planDot, { backgroundColor: planColor }]} />
                  <Text style={[styles.planBadgeText, { color: planColor }]}>{planBadgeLabel}</Text>
                </View>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <TouchableOpacity style={[styles.menuItem, isRTL && styles.rowReverse]} onPress={handleBusTrackerPress} activeOpacity={0.7}>
                <View style={[styles.menuIconWrap, { backgroundColor: `${theme.colors.primary}15` }]}>
                  <Ionicons name="navigate" size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: theme.colors.textPrimary }, isRTL && styles.menuTextRTL]}>
                  {t('busTracker')}
                </Text>
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={theme.colors.muted} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, isRTL && styles.rowReverse]} onPress={handleHistoryPress} activeOpacity={0.7}>
                <View style={[styles.menuIconWrap, { backgroundColor: '#FF950015' }]}>
                  <Ionicons name="time" size={20} color="#FF9500" />
                </View>
                <Text style={[styles.menuItemText, { color: theme.colors.textPrimary }, isRTL && styles.menuTextRTL]}>
                  {t('historyMenu')}
                </Text>
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={theme.colors.muted} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, isRTL && styles.rowReverse]} onPress={() => setSubscriptionVisible(true)} activeOpacity={0.7}>
                <View style={[styles.menuIconWrap, { backgroundColor: '#FFD70018' }]}>
                  <Ionicons name="diamond" size={20} color="#FFB800" />
                </View>
                <View style={[styles.menuItemCenter, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.menuItemText, { color: theme.colors.textPrimary, flex: 0 }, isRTL && styles.menuTextRTL]}>
                    {t('subscriptionMenu')}
                  </Text>
                  <Text style={[styles.menuItemSub, { color: theme.colors.muted }]}>
                    {planBadgeLabel} {t('currentTier')}
                  </Text>
                </View>
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.menuSection}>
              <TouchableOpacity style={[styles.menuItem, isRTL && styles.rowReverse]} onPress={handleLogout} activeOpacity={0.7}>
                <View style={[styles.menuIconWrap, { backgroundColor: '#FF3B3015' }]}>
                  <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                </View>
                <Text style={[styles.menuItemText, { color: '#FF3B30' }, isRTL && styles.menuTextRTL]}>
                  {t('logoutMenu')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </Modal>

      <SubscriptionModal visible={subscriptionVisible} onClose={() => setSubscriptionVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  overlayBase: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    paddingTop: 56,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  sidebarLeft: { left: 0, borderRightWidth: 1, borderRightColor: 'transparent' },
  sidebarRight: { right: 0, borderLeftWidth: 1, borderLeftColor: 'transparent' },
  profileSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  rowReverse: { flexDirection: 'row-reverse' },
  textRight: { textAlign: 'right' },
  menuTextRTL: { textAlign: 'right', marginLeft: 0, marginRight: 12 },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMeta: { alignItems: 'flex-start' },
  userName: { fontSize: 19, fontWeight: '800', marginBottom: 3 },
  userEmail: { fontSize: 13, marginBottom: 10 },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  planDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 6 },
  planBadgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  menuSection: { paddingVertical: 10, paddingHorizontal: 12 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 4,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemCenter: { flex: 1, marginLeft: 12, marginRight: 4 },
  menuItemText: { flex: 1, fontSize: 16, fontWeight: '600', marginLeft: 12 },
  menuItemSub: { fontSize: 12, marginTop: 1 },
  divider: { height: 1, marginHorizontal: 20, marginVertical: 4 },
});
