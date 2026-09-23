/**
 * @file driverRouteStyles.ts
 * @description Route line selector, multi-stop itinerary timeline, and landmark order badge styles.
 */

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E0EAF8',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  configCardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  configTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  configIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  configTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  configSub: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },

  // Bus chips,
  chipScroll: { gap: 10, paddingVertical: 2, paddingHorizontal: 2 },
  busChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  busChipSel: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  busChipText: { fontSize: 14, fontWeight: '800', color: '#334155' },
  busChipTextSel: { color: '#FFFFFF' },
  selLineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
  },
  selLineBannerText: { fontSize: 12, fontWeight: '700', color: '#1D4ED8' },

  // ── ITINERARY & STOPS TIMELINE ────────────────────────────,
  stopsCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  stopsCountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itineraryBox: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  itineraryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  terminalIndicator: {
    alignItems: 'center',
    width: 24,
  },
  terminalDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 3,
  },
  timelineTrack: {
    width: 2,
    minHeight: 28,
    flex: 1,
    marginVertical: 3,
  },
  stopNumberCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stopNumberText: {
    fontSize: 10,
    fontWeight: '800',
  },
  itineraryInfo: {
    flex: 1,
    paddingBottom: 14,
  },
  itineraryRole: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  itineraryName: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyRouteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  emptyRouteText: {
    fontSize: 13,
    flex: 1,
  },

  // ── ACTION BUTTONS ────────────────────────────────────────
});
