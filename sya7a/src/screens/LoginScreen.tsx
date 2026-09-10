import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { useUserType } from '../contexts/UserTypeContext';
import { ref, onValue, off, get, child } from 'firebase/database';
import { database } from '../config/firebase';
import { setDriverCompanyId } from '../utils/driverStorage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, signUp, signInWithApple, resetPassword } = useAuth();
  const route = useRoute();
  const { userType } = useUserType();
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && !username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }
    if (userType === 'driver' && !selectedCompany) {
      Alert.alert('Error', 'Please select your company');
      return;
    }

    setLoading(true);
    try {
      // If driver, check for existing active sharing session tied to this email
      if (!isSignUp && userType === 'driver') {
        const emailKey = email.replace(/\./g, '(dot)').replace(/\$/g, '');
        // We don’t store sessions by email yet; instead, scan busLocations for any entry with driverEmail == email
        // For performance in small dataset, fetch busLocations root and search client-side
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
          return;
        }
      }
      if (isSignUp) {
        await signUp(email, password, username.trim());
      } else {
        await signIn(email, password);
      }

      if (userType === 'driver' && selectedCompany) {
        await setDriverCompanyId(selectedCompany);
      }
    } catch (error: any) {
      // Check if it's a wrong password error and show forgot password option
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

  // Load companies from Firebase for driver
  React.useEffect(() => {
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
        // fallback to defaults if none
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>BUS TRACKER</Text>
        </View>

        <View style={styles.form}>
          {userType === 'driver' && (
            <View style={styles.inputContainer}>
              <Text style={styles.dropdownLabel}>Company</Text>
              <View style={styles.dropdown}>
                <Picker
                  selectedValue={selectedCompany}
                  onValueChange={(itemValue) => setSelectedCompany(String(itemValue))}
                >
                  {companies.map(c => (
                    <Picker.Item key={c.id} label={c.name} value={c.id} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {isSignUp && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>
            {!isSignUp && (
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={() => setShowForgotPassword(true)}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.authButton}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.authButtonText}>
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setUsername(''); // Clear username when switching modes
            }}
          >
            <Text style={styles.toggleButtonText}>
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Create account"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {userType !== 'driver' && (
            <TouchableOpacity
              style={styles.appleButton}
              onPress={handleAppleSignIn}
              disabled={loading}
            >
              <Ionicons name="logo-apple" size={20} color="#000000" />
              <Text style={styles.appleButtonText}>Sign in with Apple</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <Text style={styles.modalText}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowForgotPassword(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalResetButton}
                  onPress={handlePasswordReset}
                  disabled={loading}
                >
                  <Text style={styles.modalResetText}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 2,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  authButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  toggleButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666666',
    fontSize: 14,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  appleButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  modalResetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  modalResetText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
