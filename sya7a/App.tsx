import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import CompaniesScreen from './src/screens/CompaniesScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SidebarMenu from './src/components/SidebarMenu';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import DriverHomeScreen from './src/screens/DriverHomeScreen';

// Import Firebase auth context
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
// Import Location context
import { LocationProvider } from './src/contexts/LocationContext';
// Theme & I18n
import { ThemeProvider } from './src/contexts/ThemeContext';
import { I18nProvider } from './src/contexts/I18nContext';
// User type
import { UserTypeProvider, useUserType } from './src/contexts/UserTypeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Companies') {
            iconName = focused ? 'business' : 'business-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Companies" component={CompaniesScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user } = useAuth();
  const { userType } = useUserType();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            {userType === 'driver' ? (
              <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
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

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <ThemeProvider>
          <I18nProvider>
            <UserTypeProvider>
              <StatusBar style="auto" />
              <AppNavigator />
            </UserTypeProvider>
          </I18nProvider>
        </ThemeProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
