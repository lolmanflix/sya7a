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

interface PlanConfig {
  id: PlanTier;
  nameKey: string;
  priceKey: string;
  oldPriceKey?: string;
  periodKey: string;
  discountKey?: string;
  features: string[];
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  popular?: boolean;
}

const PLANS: PlanConfig[] = [
  {
    id: 'free',
    nameKey: 'freePlanName',
    priceKey: 'freePrice',
    periodKey: 'egpMonth',
    features: ['freeFeature1', 'freeFeature2', 'freeFeature3'],
    color: '#34C759',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'pro',
    nameKey: 'proPlanName',
    priceKey: 'proPrice',
    periodKey: 'egpMonthPerson',
    features: ['proFeature1', 'proFeature2', 'proFeature3'],
    color: '#007AFF',
    icon: 'star',
    popular: true,
  },
  {
    id: 'family',
    nameKey: 'familyPlanName',
    priceKey: 'familyPrice',
    oldPriceKey: 'familyPriceOld',
    periodKey: 'egpMonthPerson',
    discountKey: 'discountBadge',
    features: ['familyFeature1', 'familyFeature2', 'familyFeature3'],
    color: '#FF9500',
    icon: 'people',
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
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      slideY.setValue(SCREEN_HEIGHT);
    }
  }, [visible]);

  const closeWithAnimation = () => {
    Animated.timing(slideY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleSelectPlan = async (plan: PlanTier) => {
    if (plan === currentPlan) return;
    await setPlan(plan);
    Alert.alert('✅', t('planSubscribedSuccess'));
    closeWithAnimation();
  };

  // Extra translation keys not yet in context — fall back gracefully
  const tLocal = (key: string, fallback: string) => {
    const result = t(key, fallback);
    return result === key ? fallback : result;
  };

  const planNames: Record<PlanTier, string> = {
    free: tLocal('freePlanName', 'Free Plan'),
    pro: tLocal('proPlanName', 'Pro Plan'),
    family: tLocal('familyPlanName', 'Family Plan'),
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeWithAnimation}
    >
      <View style={styles.overlay}>
        {/* Backdrop tap to close */}
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeWithAnimation} activeOpacity={1} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: theme.colors.background, transform: [{ translateY: slideY }] },
          ]}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />

          {/* Header */}
          <View style={[styles.header, isRTL && styles.rowReverse]}>
            <View style={styles.headerLeft}>
              <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }, isRTL && styles.textRight]}>
                {t('plansAndPricing')}
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.muted }, isRTL && styles.textRight]}>
                {tLocal('chooseBestPlan', 'Choose the best plan for you')}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.searchBg }]}
              onPress={closeWithAnimation}
            >
              <Ionicons name="close" size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {PLANS.map((plan) => {
              const isActive = currentPlan === plan.id;

              return (
                <View
                  key={plan.id}
                  style={[
                    styles.planCard,
                    {
                      backgroundColor: theme.colors.card,
                      borderColor: isActive ? plan.color : theme.colors.border,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                      <Text style={styles.popularBadgeText}>
                        {tLocal('mostPopular', '⭐ Most Popular')}
                      </Text>
                    </View>
                  )}

                  {/* Plan header */}
                  <View style={[styles.planHeader, isRTL && styles.rowReverse]}>
                    <View style={[styles.planIconContainer, { backgroundColor: `${plan.color}18` }]}>
                      <Ionicons name={plan.icon} size={26} color={plan.color} />
                    </View>
                    <View style={styles.planTitleBlock}>
                      <Text style={[styles.planName, { color: theme.colors.textPrimary }, isRTL && styles.textRight]}>
                        {planNames[plan.id]}
                      </Text>

                      {/* Price row */}
                      <View style={[styles.priceRow, isRTL && styles.rowReverse]}>
                        <Text style={[styles.planPrice, { color: plan.color }]}>
                          {t(plan.priceKey)}
                        </Text>
                        {plan.oldPriceKey && (
                          <Text style={[styles.oldPrice, { color: theme.colors.muted }]}>
                            {t(plan.oldPriceKey)}
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.planPeriod, { color: theme.colors.muted }, isRTL && styles.textRight]}>
                        {t(plan.periodKey)}
                      </Text>
                    </View>

                    {/* Discount badge */}
                    {plan.discountKey && (
                      <View style={[styles.discountBadge, { backgroundColor: '#FF3B3015' }]}>
                        <Text style={[styles.discountText, { color: '#FF3B30' }]}>
                          {t(plan.discountKey)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Divider */}
                  <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                  {/* Features */}
                  <View style={styles.featuresBlock}>
                    {plan.features.map((featureKey, idx) => (
                      <View key={idx} style={[styles.featureRow, isRTL && styles.rowReverse]}>
                        <View style={[styles.featureCheck, { backgroundColor: `${plan.color}18` }]}>
                          <Ionicons name="checkmark" size={14} color={plan.color} />
                        </View>
                        <Text style={[styles.featureText, { color: theme.colors.textSecondary }, isRTL && styles.featureTextRTL]}>
                          {t(featureKey)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* CTA button */}
                  <TouchableOpacity
                    style={[
                      styles.selectButton,
                      isActive
                        ? { backgroundColor: `${plan.color}20`, borderColor: plan.color, borderWidth: 1.5 }
                        : { backgroundColor: plan.color },
                    ]}
                    onPress={() => handleSelectPlan(plan.id)}
                    activeOpacity={0.8}
                  >
                    {isActive ? (
                      <View style={[styles.selectButtonInner, isRTL && styles.rowReverse]}>
                        <Ionicons name="checkmark-circle" size={18} color={plan.color} style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }} />
                        <Text style={[styles.selectButtonText, { color: plan.color }]}>
                          {t('currentPlanActive')}
                        </Text>
                      </View>
                    ) : (
                      <Text style={[styles.selectButtonText, { color: '#FFFFFF' }]}>
                        {t('selectPlan')}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Footer note */}
            <Text style={[styles.footerNote, { color: theme.colors.muted }]}>
              {tLocal('subscriptionNote', '* Prices are in Egyptian Pounds (EGP). All plans renew monthly and can be cancelled at any time.')}
            </Text>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    maxHeight: SCREEN_HEIGHT * 0.92,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginTop: 4,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    paddingTop: 8,
  },
  planCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 14,
    borderTopRightRadius: 20,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 8,
  },
  planIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  planTitleBlock: { flex: 1 },
  planName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: '900',
  },
  oldPrice: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  planPeriod: {
    fontSize: 13,
    marginTop: 2,
  },
  discountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  featuresBlock: { marginBottom: 20 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  featureTextRTL: {
    textAlign: 'right',
    marginRight: 10,
    marginLeft: 0,
  },
  selectButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  rowReverse: { flexDirection: 'row-reverse' },
  textRight: { textAlign: 'right' },
});
