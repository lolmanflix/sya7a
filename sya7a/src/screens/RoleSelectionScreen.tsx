import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUserType } from '../contexts/UserTypeContext';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';

export default function RoleSelectionScreen() {
  const navigation = useNavigation();
  const { setUserType } = useUserType();
  const { theme } = useTheme();
  const { t } = useI18n();

  const choose = (type: 'passenger' | 'driver') => {
    setUserType(type);
    (navigation as any).navigate('Login', { role: type });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t('appTitle')}</Text>

      <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={() => choose('passenger')}>
        <Ionicons name="person" size={28} color={theme.colors.primary} />
        <Text style={[styles.cardText, { color: theme.colors.textPrimary }]}>Passenger</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={() => choose('driver')}>
        <Ionicons name="bus" size={28} color={theme.colors.primary} />
        <Text style={[styles.cardText, { color: theme.colors.textPrimary }]}>Driver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
  },
});



