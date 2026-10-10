/**
 * @file SidebarAccountsSection.tsx
 * @description Sidebar block listing previously added accounts for silent
 * switching (password from the SecureStore vault) plus an "Add account" row
 * that signs out of the current session while keeping it saved.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';

interface SidebarAccountsSectionProps {
  /** Invoked after a successful switch or once the add-account flow starts. */
  onClose: () => void;
}

/**
 * Builds a 1-2 letter avatar label from a display name or email.
 */
const initialsOf = (label: string) =>
  label
    .split(' ')
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

/**
 * Accounts switcher + "Add account" entry for the slide-out menu.
 */
export default function SidebarAccountsSection({ onClose }: SidebarAccountsSectionProps) {
  const { accounts, activeAccount, switchAccount, addAccount, isSwitching } = useAuth();
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();
  const [switchingUid, setSwitchingUid] = useState<string | null>(null);

  /**
   * Silently switches to another added account (re-authenticates in background).
   */
  const handleSwitchPress = (uid: string) => {
    if (isSwitching || switchingUid) return;
    setSwitchingUid(uid);
    switchAccount(uid)
      .then(() => onClose())
      .catch((error: unknown) => {
        Alert.alert(
          t('switchAccountFailed', 'Could not switch account'),
          error instanceof Error ? error.message : 'Please try again.'
        );
      })
      .finally(() => setSwitchingUid(null));
  };

  /**
   * Starts the "add a new login" flow: signs out of Firebase only, so the
   * current account (and its password) stays in the registry for switching.
   */
  const handleAddAccountPress = () => {
    Alert.alert(
      t('addAccount', 'Add account'),
      t(
        'addAccountConfirm',
        'Sign in with a new account? Your current account stays saved so you can switch back anytime.'
      ),
      [
        { text: t('close'), style: 'cancel' },
        {
          text: t('addAccount', 'Add account'),
          onPress: async () => {
            try {
              await addAccount();
              onClose();
            } catch (error: unknown) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Could not add account.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.menuSection}>
      <Text
        style={[styles.sectionTitle, { color: theme.colors.muted }, isRTL && styles.textRight]}
      >
        {t('accountsSection', 'Accounts')}
      </Text>
      {accounts.map((account) => {
        const isActive = account.uid === activeAccount?.uid;
        const busy = switchingUid === account.uid;
        const label = account.displayName || account.email.split('@')[0] || 'User';
        return (
          <TouchableOpacity
            key={account.uid}
            style={[styles.accountRow, isRTL && styles.rowReverse]}
            activeOpacity={0.7}
            disabled={isSwitching || switchingUid !== null}
            onPress={() => handleSwitchPress(account.uid)}
          >
            <View
              style={[
                styles.accountAvatar,
                {
                  backgroundColor: isActive
                    ? `${theme.colors.primary}30`
                    : `${theme.colors.primary}15`,
                },
              ]}
            >
              <Text style={[styles.accountAvatarText, { color: theme.colors.primary }]}>
                {initialsOf(label)}
              </Text>
            </View>
            <View style={styles.accountMeta}>
              <Text
                style={[styles.accountName, { color: theme.colors.textPrimary }]}
                numberOfLines={1}
              >
                {label}
              </Text>
              <Text style={[styles.accountEmail, { color: theme.colors.muted }]} numberOfLines={1}>
                {account.email}
              </Text>
            </View>
            {busy ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : isActive ? (
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            ) : (
              <Ionicons name="swap-horizontal" size={18} color={theme.colors.muted} />
            )}
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={[styles.menuItem, isRTL && styles.rowReverse]}
        onPress={handleAddAccountPress}
        activeOpacity={0.7}
      >
        <View style={[styles.menuIconWrap, { backgroundColor: `${theme.colors.primary}15` }]}>
          <Ionicons name="person-add-outline" size={20} color={theme.colors.primary} />
        </View>
        <Text
          style={[styles.menuItemText, { color: theme.colors.textPrimary }, isRTL && styles.menuTextRTL]}
        >
          {t('addAccount', 'Add account')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuSection: { paddingVertical: 10, paddingHorizontal: 12 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginHorizontal: 12,
    marginBottom: 6,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 2,
  },
  accountAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountAvatarText: { fontSize: 12, fontWeight: '800' },
  accountMeta: { flex: 1, marginHorizontal: 10 },
  accountName: { fontSize: 14, fontWeight: '600' },
  accountEmail: { fontSize: 11, marginTop: 1 },
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
  menuItemText: { flex: 1, fontSize: 16, fontWeight: '600', marginLeft: 12 },
  rowReverse: { flexDirection: 'row-reverse' },
  textRight: { textAlign: 'right' },
  menuTextRTL: { textAlign: 'right', marginLeft: 0, marginRight: 12 },
});
