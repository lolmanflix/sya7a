/**
 * @file driverModalStyles.ts
 * @description Company and Route line selector modal styles.
 */

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({  companyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  companyModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '75%',
    elevation: 20,
  },
  companyModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  companyModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  companyModalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  companyModalCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginVertical: 4,
    borderWidth: 1,
  },
  companyOptionText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
