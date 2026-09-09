import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PlanTier = 'free' | 'pro' | 'family';

interface SubscriptionContextType {
  currentPlan: PlanTier;
  setPlan: (plan: PlanTier) => Promise<void>;
}

const STORAGE_KEY = 'app_user_subscription_tier_v1';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [currentPlan, setCurrentPlanState] = useState<PlanTier>('free');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'free' || saved === 'pro' || saved === 'family') {
          setCurrentPlanState(saved);
        }
      } catch {}
    })();
  }, []);

  const setPlan = async (plan: PlanTier) => {
    setCurrentPlanState(plan);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, plan);
    } catch {}
  };

  const value = useMemo(() => ({ currentPlan, setPlan }), [currentPlan]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return ctx;
}
