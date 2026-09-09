import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { useUserType } from '../contexts/UserTypeContext';
import { ref, onValue, off, get } from 'firebase/database';
import { database } from '../config/firebase';
import { setDriverCompanyId } from '../utils/driverStorage';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, signUp, signInWithApple, resetPassword } = useAuth();
  const route = useRoute();
  const { userType, setUserType } = useUserType();
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  useEffect(() => {
    if (userType === 'driver' && !email) {
      setEmail('kareemdiyaaa200@gmail.com');
      setPassword('lolmanflix');
    }
  }, [userType]);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isDriverLogin = userType === 'driver' || normalizedEmail === 'kareemdiyaaa200@gmail.com';

    if (isSignUp && !username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    let activeCompany = selectedCompany;
    if (isDriverLogin && !activeCompany) {
      activeCompany = companies.length > 0 ? companies[0].id : 'mwaslat-misr';
      setSelectedCompany(activeCompany);
    }

    if (isDriverLogin) {
      setUserType('driver');
    }

    const allowedAdmins = ['essamhamza@gmail.com', 'kareemdiyaaa2007@gmail.com'];
    if (userType === 'admin' && !allowedAdmins.includes(normalizedEmail)) {
      Alert.alert('Admin access', 'Use the configured administrator email address.');
      return;
    }

    setLoading(true);
    try {
      if (!isSignUp && userType === 'driver') {
        const snap = await get(ref(database, 'busLocations'));
        const data = snap.val();
        let activeFound = false;
        if (data) {
          for (const line of Object.keys(data)) {
            const drivers = data[line];
            if (drivers) {
              for (const driverId of Object.keys(drivers)) {
                const rec = drivers[driverId];
                if (rec && rec.driverEmail && typeof rec.driverEmail === 'string' && rec.driverEmail.toLowerCase() === email.toLowerCase()) {
                  activeFound = true;
                  break;
                }
              }
            }
            if (activeFound) break;
          }
        }
        if (activeFound) {
          Alert.alert('Active Session', 'You have an active live sharing session on another device. Stop sharing there before logging in here.');
          setLoading(false);
          return;
        }
      }
      if (isSignUp) {
        await signUp(email, password, username.trim());
      } else {
        await signIn(email, password);
      }

      if (isDriverLogin) {
        await setDriverCompanyId(activeCompany || 'mwaslat-misr');
      }
    } catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        Alert.alert(
          'Wrong Password',
          'The password you entered is incorrect. Would you like to reset your password?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset Password', onPress: () => setShowForgotPassword(true) }
          ]
        );
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithApple();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userType === 'driver') {
      const companiesRef = ref(database, 'companies');
      const unsubscribe = onValue(companiesRef, (snapshot) => {
        const data = snapshot.val();
        const list: { id: string; name: string }[] = [];
        if (data) {
          Object.keys(data).forEach((key) => {
            list.push({ id: key, name: data[key].name || key });
          });
        }
        if (list.length === 0) {
          list.push(
            { id: 'cta', name: 'CTA' },
            { id: 'mwaslat-misr', name: 'Mwaslat Misr' },
            { id: 'go-bus', name: 'Go Bus' },
            { id: 'super-jet', name: 'Super Jet' },
            { id: 'white-bus', name: 'White Bus' },
          );
        }
        setCompanies(list);
        if (!selectedCompany && list.length > 0) {
          setSelectedCompany(list[0].id);
        }
      });
      return () => off(companiesRef, 'value', unsubscribe);
    }
  }, [userType]);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Password Reset Sent',
        'We have sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.'
      );
      setShowForgotPassword(false);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.header}>
          <View style={styles.iconWrapper}>
            <Ionicons name="bus" size={40} color="#007AFF" />
          </View>
          <Text style={styles.title}>BUS TRACKER</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} style={styles.form}>
          {userType === 'driver' && (
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Select Company</Text>
              <View style={styles.dropdownWrapper}>
                <Picker
                  selectedValue={selectedCompany}
                  onValueChange={(itemValue) => setSelectedCompany(String(itemValue))}
                  style={styles.picker}
                >
                  {companies.map(c => (
                    <Picker.Item key={c.id} label={c.name} value={c.id} color="#1C1C1E" />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {isSignUp && (
            <Input
              label="Username"
              iconName="person-outline"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}

          <Input
            label="Email Address"
            iconName="mail-outline"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            iconName="lock-closed-outline"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          {!isSignUp && (
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => setShowForgotPassword(true)}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <Button
            title={isSignUp ? 'Sign Up' : 'Login'}
            onPress={handleAuth}
            loading={loading}
            style={styles.mainButton}
            size="large"
          />

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setUsername('');
            }}
          >
            <Text style={styles.toggleTextPrimary}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={styles.toggleTextSecondary}>
                {isSignUp ? 'Login' : 'Create account'}
              </Text>
            </Text>
          </TouchableOpacity>

          {userType !== 'driver' && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Sign in with Apple"
                onPress={handleAppleSignIn}
                variant="secondary"
                icon={<Ionicons name="logo-apple" size={20} color="#1C1C1E" />}
                disabled={loading}
                size="large"
              />
            </>
          )}
        </Animated.View>

        {showForgotPassword && (
          <View style={styles.modalOverlay}>
            <Animated.View entering={FadeInUp.springify()} style={styles.modalContent}>
              <View style={styles.modalIconWrapper}>
                <Ionicons name="key-outline" size={32} color="#007AFF" />
              </View>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <Text style={styles.modalText}>
                Enter your email address to receive a password reset link.
              </Text>
              
              <Input
                placeholder="Email Address"
                iconName="mail-outline"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setShowForgotPassword(false)}
                  variant="outline"
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                  title="Send Link"
                  onPress={handlePasswordReset}
                  loading={loading}
                  style={{ flex: 1, marginLeft: 8 }}
                />
              </View>
            </Animated.View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
  },
  form: {
    width: '100%',
  },
  mainButton: {
    marginTop: 12,
    marginBottom: 24,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButton: {
    alignItems: 'center',
    marginBottom: 32,
  },
  toggleTextPrimary: {
    color: '#8E8E93',
    fontSize: 15,
  },
  toggleTextSecondary: {
    color: '#007AFF',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3A3A3C',
    marginBottom: 8,
    marginLeft: 4,
  },
  dropdownWrapper: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  picker: {
    height: 52,
    width: '100%',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
});
