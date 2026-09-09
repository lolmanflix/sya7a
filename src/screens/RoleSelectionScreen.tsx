import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUserType } from '../contexts/UserTypeContext';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const RoleCard = ({ 
  title, 
  iconName, 
  onPress, 
  delay,
  theme 
}: { 
  title: string; 
  iconName: keyof typeof Ionicons.glyphMap; 
  onPress: () => void; 
  delay: number;
  theme: any;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(delay).duration(500).springify()}
      style={[
        styles.card, 
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        animatedStyle
      ]}
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.95))}
      onPressOut={() => (scale.value = withSpring(1))}
      activeOpacity={0.9}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
        <Ionicons name={iconName} size={36} color={theme.colors.primary} />
      </View>
      <Text style={[styles.cardText, { color: theme.colors.textPrimary }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary || '#8E8E93'} style={styles.chevron} />
    </AnimatedTouchable>
  );
};

export default function RoleSelectionScreen() {
  const navigation = useNavigation();
  const { setUserType } = useUserType();
  const { theme } = useTheme();
  const { t } = useI18n();

  const choose = (type: 'passenger' | 'driver' | 'admin') => {
    setUserType(type);
    (navigation as any).navigate('Login', { role: type });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="bus" size={48} color={theme.colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t('appTitle', 'BUS TRACKER')}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary || '#8E8E93' }]}>
          Choose your role to continue
        </Text>
      </Animated.View>

      <View style={styles.cardsContainer}>
        <RoleCard 
          title="I'm a Passenger" 
          iconName="person" 
          onPress={() => choose('passenger')} 
          delay={200}
          theme={theme}
        />
        <RoleCard 
          title="I'm a Driver" 
          iconName="car" 
          onPress={() => choose('driver')} 
          delay={350}
          theme={theme}
        />
        <RoleCard
          title="Admin dashboard"
          iconName="shield-checkmark"
          onPress={() => choose('admin')}
          delay={500}
          theme={theme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF15', // fallback
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  cardsContainer: {
    width: '100%',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  }
});


