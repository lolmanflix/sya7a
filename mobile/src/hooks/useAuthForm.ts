/**
 * @file useAuthForm.ts
 * @description Authentication form custom hook managing credentials state,
 * sign-in/sign-up validation, Apple authentication, password reset workflows,
 * driver company assignment, and session conflict prevention.
 */

import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { ref, onValue, off, get, set, update } from "firebase/database";
import { database, auth } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useUserType } from "../contexts/UserTypeContext";
import { setDriverCompanyId } from "../utils/driverStorage";

export interface CompanyItem {
  id: string;
  name: string;
}

/**
 * Validates basic authentication credentials and required fields.
 */
function validateAuthInput(email: string, password: string, isSignUp: boolean, username: string): string | null {
  if (!email.trim() || !password) {
    return "Please fill in all fields";
  }
  if (isSignUp && !username.trim()) {
    return "Please enter a username";
  }
  return null;
}

/**
 * Checks Realtime Database for any active concurrent broadcasting sessions for a driver email.
 */
async function checkActiveDriverBroadcast(normalizedEmail: string): Promise<boolean> {
  const snap = await get(ref(database, "busLocations")).catch(() => null);
  const data = snap?.val();
  if (!data) return false;

  for (const line of Object.keys(data)) {
    const drivers = data[line];
    if (drivers) {
      for (const driverId of Object.keys(drivers)) {
        const rec = drivers[driverId];
        if (
          rec &&
          rec.driverEmail &&
          typeof rec.driverEmail === "string" &&
          rec.driverEmail.toLowerCase() === normalizedEmail
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Synchronizes driver profile and company affiliation to Realtime Database and storage.
 */
async function syncDriverCompanyProfile(
  uid: string,
  email: string,
  fallbackName: string,
  companyId: string
): Promise<void> {
  try {
    const drRef = ref(database, `drivers/${uid}`);
    const drSnap = await get(drRef);
    if (drSnap.exists()) {
      await update(drRef, { companyId });
    } else {
      await set(drRef, {
        displayName: auth.currentUser?.displayName || fallbackName || email.split("@")[0] || "Driver",
        email,
        companyId,
      });
    }
  } catch (drErr) {
    console.warn("[DriverAuth] Could not update driver company in RTDB:", drErr);
  }
  await setDriverCompanyId(companyId);
}

/**
 * Maps authentication errors to human-friendly dialogs with recovery actions.
 */
function displayAuthError(error: any, onResetPassword: () => void): void {
  if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
    Alert.alert(
      "Invalid Password",
      "The password you entered is incorrect. Would you like to reset your password?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset Password", onPress: onResetPassword },
      ]
    );
  } else {
    Alert.alert("Authentication Error", error.message || "Failed to authenticate.");
  }
}

/**
 * Custom hook encapsulating authentication form logic.
 */
export function useAuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { signIn, signUp, signInWithApple, resetPassword } = useAuth();
  const { userType, setUserType } = useUserType();

  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [companyModalVisible, setCompanyModalVisible] = useState(false);

  // Derive display name for currently selected company
  const selectedCompanyName = useMemo(() => {
    const found = companies.find((c) => c.id.toLowerCase() === selectedCompany?.toLowerCase());
    return found ? found.name : companies[0]?.name || "Select Organization";
  }, [companies, selectedCompany]);

  // Real-time listener for companies when in driver mode
  useEffect(() => {
    if (userType === "driver") {
      const companiesRef = ref(database, "companies");
      const unsubscribe = onValue(
        companiesRef,
        (snapshot) => {
          const data = snapshot.val();
          const list: CompanyItem[] = [];
          if (data) {
            Object.keys(data).forEach((key) => {
              list.push({ id: key, name: data[key].name || key.toUpperCase() });
            });
          }
          setCompanies(list);
          if (!selectedCompany && list.length > 0) {
            setSelectedCompany(list[0].id);
          }
        },
        (error) => {
          console.warn("[AuthForm] Companies fetch error:", error);
        }
      );
      return () => off(companiesRef, "value", unsubscribe);
    }
  }, [userType]);

  /**
   * Coordinates authentication workflow across validation, credentials auth, and profile synchronization.
   */
  const handleAuth = async () => {
    const validationError = validateAuthInput(email, password, isSignUp, username);
    if (validationError) {
      Alert.alert("Error", validationError);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isDriverLogin = userType === "driver";

    let activeCompany = selectedCompany;
    if (isDriverLogin && !activeCompany && companies.length > 0) {
      activeCompany = companies[0].id;
      setSelectedCompany(activeCompany);
    }

    setLoading(true);
    try {
      if (!isSignUp && isDriverLogin) {
        const hasActiveSession = await checkActiveDriverBroadcast(normalizedEmail);
        if (hasActiveSession) {
          Alert.alert(
            "Active Session Detected",
            "You have an active broadcasting session on another device. Please conclude your previous trip before signing in."
          );
          setLoading(false);
          return;
        }
      }

      if (isSignUp) {
        await signUp(normalizedEmail, password, username.trim());
      } else {
        await signIn(normalizedEmail, password);
      }

      if (isDriverLogin) {
        const chosenCompany = activeCompany || selectedCompany;
        const currentUid = auth.currentUser?.uid;
        if (currentUid && chosenCompany) {
          await syncDriverCompanyProfile(
            currentUid,
            normalizedEmail,
            username,
            chosenCompany
          );
        }
      }
    } catch (error: any) {
      displayAuthError(error, () => setShowForgotPassword(true));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Executes Apple Single Sign-On flow.
   */
  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithApple();
    } catch (error: any) {
      Alert.alert("Apple Sign-In Error", error.message || "Apple sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dispatches password reset email.
   */
  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert("Required", "Please enter your email address first.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim().toLowerCase());
      Alert.alert(
        "Password Reset Sent",
        "We have sent a password reset link to your email address. Please follow the instructions to reset your password."
      );
      setShowForgotPassword(false);
    } catch (error: any) {
      Alert.alert("Reset Error", error.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    isSignUp,
    setIsSignUp,
    loading,
    userType,
    setUserType,
    companies,
    selectedCompany,
    setSelectedCompany,
    selectedCompanyName,
    companyModalVisible,
    setCompanyModalVisible,
    showForgotPassword,
    setShowForgotPassword,
    handleAuth,
    handleAppleSignIn,
    handlePasswordReset,
  };
}
