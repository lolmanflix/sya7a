/**
 * @file driverHomeStyles.ts
 * @description Master style aggregator for DriverHomeScreen.
 * Re-exports modular style packages to adhere to the strict <400 lines per file rule.
 */

import { StyleSheet } from "react-native";
import { styles as headerStyles } from "./driverHeaderStyles";
import { styles as tripStyles } from "./driverTripStyles";
import { styles as safetyStyles } from "./driverSafetyStyles";
import { styles as routeStyles } from "./driverRouteStyles";
import { styles as modalStyles } from "./driverModalStyles";

export {
  headerStyles,
  tripStyles,
  safetyStyles,
  routeStyles,
  modalStyles,
};

export const layoutStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 48,
    gap: 14,
  },
});

/** Unified style object combining all modular styles for complete backwards compatibility */
export const styles = {
  ...layoutStyles,
  ...headerStyles,
  ...tripStyles,
  ...safetyStyles,
  ...routeStyles,
  ...modalStyles,
};
