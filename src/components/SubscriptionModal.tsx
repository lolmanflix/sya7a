import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { useSubscription, PlanTier } from '../contexts/SubscriptionContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Plan = {
  id: PlanTier;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  nameKey: string;
  price: string;
  periodKey: string;
  oldPrice?: string;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: 'free',
    icon: 'leaf-outline',
    color: '#34C759',
    nameKey: 'freePlanName',
    price: '0',
    periodKey: 'egpMonth',
    features: ['freeFeature1', 'freeFeature2', 'freeFeature3'],
  },
  {
    id: 'pro',
    icon: 'flash-outline',
    color: '#007AFF',
    nameKey: 'proPlanName',
    price: '20',
    periodKey: 'egpMonthPerson',
    features: ['proFeature1', 'proFeature2', 'proFeature3'],
  },
  {
    id: 'family',
    icon: 'people-outline',
    color: '#FF9500',
    nameKey: 'familyPlanName',
    price: '17',
    periodKey: 'egpMonthPerson',
    oldPrice: '20',
    features: ['familyFeature1', 'familyFeature2', 'familyFeature3'],
  },
];

export default function SubscriptionModal({ visible, onClose }: Props) {
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();
  const { currentPlan, setPlan } = useSubscription();
  const slideY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 22,
        stiffness: 220,
      }).start();
    } else {
      slideY.setValue(SCREEN_HEIGHT);
    }
  }, [visible, slideY]);

  const closeWithAnimation = () => {
    Animated.timing(slideY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleSelectPlan = async (plan: PlanTier) => {
    if (plan === currentPlan) return;
    await setPlan(plan);
    Alert.alert(t('planSubscribedSuccess'));
    closeWithAnimation();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeWithAnimation}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeWithAnimation} activeOpacity={1} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: theme.colors.background, transform: [{ translateY: slideY }] },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />

          <View style={[styles.header, isRTL && styles.rowReverse]}>
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
              {t('plansAndPricing')}
            </Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.searchBg }]}
              onPress={closeWithAnimation}
            >
              <Ionicons name="close" size={18} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.headerHint, { color: theme.colors.muted }, isRTL && styles.textRight]}>
            {t('chooseBestPlan')}
          </Text>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {PLANS.map((plan) => {
              const isActive = currentPlan === plan.id;

              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    {
                      backgroundColor: theme.colors.card,
                      borderColor: isActive ? plan.color : theme.colors.border,
                    },
                  ]}
                  onPress={() => handleSelectPlan(plan.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.planTop, isRTL && styles.rowReverse]}>
                    <View style={[styles.planIcon, { backgroundColor: `${plan.color}18` }]}>
                      <Ionicons name={plan.icon} size={20} color={plan.color} />
                    </View>
                    <View style={styles.planMeta}>
                      <Text style={[styles.planName, { color: theme.colors.textPrimary }, isRTL && styles.textRight]}>
                        {t(plan.nameKey)}
                      </Text>
                      <View style={[styles.priceRow, isRTL && styles.rowReverse]}>
                        <Text style={[styles.price, { color: theme.colors.textPrimary }]}>
                          {plan.price} {t(plan.periodKey)}
                        </Text>
                        {plan.oldPrice ? (
                          <Text style={[styles.oldPrice, { color: theme.colors.muted }]}>
                            {plan.oldPrice}
                          </Text>
                        ) : null}
                      </View>
                      {plan.id === 'family' ? (
                        <Text style={[styles.discountNote, { color: plan.color }, isRTL && styles.textRight]}>
                          {t('discountBadge')}
                        </Text>
                      ) : null}
                    </View>
                    {isActive ? (
                      <View style={[styles.currentChip, { backgroundColor: `${plan.color}18` }]}>
                        <Text style={[styles.currentChipText, { color: plan.color }]}>
                          {t('currentPlanActive')}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {plan.features.map((featureKey) => (
                    <View key={featureKey} style={[styles.featureRow, isRTL && styles.rowReverse]}>
                      <Ionicons name="checkmark" size={16} color={plan.color} />
                      <Text style={[styles.featureText, { color: theme.colors.textSecondary }, isRTL && styles.featureTextRTL]}>
                        {t(featureKey)}
                      </Text>
                    </View>
                  ))}

                  {!isActive ? (
                    <View style={[styles.selectBtn, { backgroundColor: plan.color }]}>
                      <Text style={styles.selectBtnText}>{t('selectPlan')}</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerHint: {
    fontSize: 13,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: { flexGrow: 0 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
    paddingTop: 8,
  },
  planCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planMeta: {
    flex: 1,
    marginHorizontal: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
  },
  oldPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  discountNote: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  currentChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    marginLeft: 8,
  },
  featureTextRTL: {
    textAlign: 'right',
    marginLeft: 0,
    marginRight: 8,
  },
  selectBtn: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  selectBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  rowReverse: { flexDirection: 'row-reverse' },
  textRight: { textAlign: 'right' },
});
