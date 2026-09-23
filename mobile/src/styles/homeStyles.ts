/**
 * @file homeStyles.ts
 * @description Centralized StyleSheet for the Commuter HomeScreen, navigation header,
 * route catalog cards, live active vehicle cards, and telemetry bottom sheet modal.
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textRight: {
    textAlign: 'right',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    marginHorizontal: -8,
  },
  headerTitleContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: -1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  busList: {
    flex: 1,
  },
  busListContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  busCard: {
    padding: 0,
    marginBottom: 12,
  },
  busCardInner: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  busInfo: {
    flex: 1,
  },
  busHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  busLineName: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  favoriteButton: {
    paddingHorizontal: 8,
  },
  distanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distanceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B3018',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    color: '#FF3B30',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  companyName: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  busStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  locationInfoContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
  },
  chevronContainer: {
    paddingLeft: 12,
  },
  bottomSheetOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheetCard: {
    margin: 16,
    padding: 22,
    borderRadius: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bottomSheetTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  bottomSheetDetails: {
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
});
