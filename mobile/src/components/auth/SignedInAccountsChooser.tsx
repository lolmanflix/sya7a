/**
 * @file SignedInAccountsChooser.tsx
 * @description Lists every previously added account while signed out so the user
 * can silently switch back (password comes from the SecureStore vault) or pick
 * the normal login form below to add a new login.
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
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';

function initialsFor(label: string): string {
  return label
    .split(' ')
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
}

/**
 * Compact "Signed-in accounts" list rendered above the login form.
 */
export default function SignedInAccountsChooser() {
  const { accounts, activeUid, switchAccount, isSwitching } = useAuth();
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();
  const [pendingUid, setPendingUid] = useState<string | null>(null);

  if (accounts.length === 0) return null;

  /**
   * Triggers a silent re-authentication switch into the tapped account.
   */
  const handleSwitch = async (uid: string) => {
    if (isSwitching || pendingUid) return;
    setPendingUid(uid);
    try {
      await switchAccount(uid);
    } catch (error) {
      Alert.alert(
        t('switchAccountFailed', 'Could not switch account'),
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setPendingUid(null);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {t('signedInAccounts', 'Signed-in accounts')}
      </Text>
      {accounts.map((account) => {
        const isActive = account.uid === activeUid;
        const busy = pendingUid === account.uid;
        const label = account.displayName || account.email.split('@')[0] || 'User';
        return (
          <TouchableOpacity
            key={account.uid}
            style={[styles.row, isRTL && styles.rowReverse]}
            activeOpacity={0.7}
            disabled={isSwitching || pendingUid !== null}
            onPress={() => handleSwitch(account.uid)}
          >
            <View style={[styles.avatar, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                {initialsFor(label)}
              </Text>
            </View>
            <View style={styles.meta}>
              <Text
                style={[styles.name, { color: theme.colors.textPrimary }]}
                numberOfLines={1}
              >
                {label}
              </Text>
              <Text style={[styles.email, { color: theme.colors.muted }]} numberOfLines={1}>
                {account.email}
              </Text>
            </View>
            {busy ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : isActive ? (
              <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
            ) : (
              <Ionicons name="swap-horizontal" size={20} color={theme.colors.muted} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowReverse: { flexDirection: 'row-reverse' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 10,
  },
  avatarText: { fontSize: 13, fontWeight: '800' },
  meta: { flex: 1, marginEnd: 8 },
  name: { fontSize: 15, fontWeight: '600' },
  email: { fontSize: 12, marginTop: 1 },
});
