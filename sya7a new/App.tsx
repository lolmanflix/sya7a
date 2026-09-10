import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { TouchableOpacity, I18nManager } from 'react-native';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import CompaniesScreen from './src/screens/CompaniesScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SidebarMenu from './src/components/SidebarMenu';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import DriverHomeScreen from './src/screens/DriverHomeScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';

// Contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LocationProvider } from './src/contexts/LocationContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { I18nProvider, useI18n } from './src/contexts/I18nContext';
import { UserTypeProvider, useUserType } from './src/contexts/UserTypeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Animated tab button with bounce effect
function AnimatedTabButton({ children, onPress, accessibilityState }: any) {
  const scale = useSharedValue(1);
  const focused = accessibilityState?.selected;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.85, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

function MainTabs() {
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else {
            iconName = focused ? 'business' : 'business-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarButton: (props) => <AnimatedTabButton {...props} />,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t('appTitle') }}
      />
      <Tab.Screen
        name="Companies"
        component={CompaniesScreen}
        options={{ tabBarLabel: t('companies') }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user } = useAuth();
  const { userType } = useUserType();
  const { theme, mode } = useTheme();
  const { isRTL } = useI18n();

  return (
    <NavigationContainer>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            {userType === 'driver' || user.email?.toLowerCase() === 'kareemdiyaaa200@gmail.com' ? (
              <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
            ) : userType === 'admin' || ['essamhamza@gmail.com', 'kareemdiyaaa2007@gmail.com'].includes(user.email?.toLowerCase() || '') ? (
              <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            ) : (
              <Stack.Screen name="MainTabs" component={MainTabs} />
            )}
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { SubscriptionProvider } from './src/contexts/SubscriptionContext';

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <ThemeProvider>
          <I18nProvider>
            <UserTypeProvider>
              <SubscriptionProvider>
                <AppNavigator />
              </SubscriptionProvider>
            </UserTypeProvider>
          </I18nProvider>
        </ThemeProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
