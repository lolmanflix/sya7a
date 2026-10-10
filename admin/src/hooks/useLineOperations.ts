/**
 * @file useLineOperations.ts
 * @description Centralized custom hook for bus line administrative operations (renaming and deletion)
 * with confirmation prompts, RTDB persistence, and toast feedback.
 */

import { useCallback } from 'react';
import { toast } from 'sonner';
import { renameCompanyLine, deleteCompanyLine } from '../services/companiesService';
import { useTranslation } from '../i18n/useTranslation';

/**
 * Custom hook providing standardized line mutation workflows with user confirmations and feedback.
 */
export function useLineOperations() {
  const { t } = useTranslation();

  /**
   * Renames a bus line across companies, routes, and vehicle assignments.
   * @param companyId - The target company identifier.
   * @param oldLine - Current line identifier.
   * @param newLine - New line identifier.
   * @returns Promise resolving to boolean indicating success.
   */
  const handleRenameLine = useCallback(
    async (companyId: string, oldLine: string, newLine: string): Promise<void> => {
      if (!newLine || !newLine.trim() || oldLine === newLine.trim()) {
        return;
      }
      try {
        await renameCompanyLine(companyId, oldLine, newLine.trim());
        toast.success(t('companies.renameLineSuccess', { old: oldLine, new: newLine.trim() }));

      } catch (err) {
        console.error('[useLineOperations] Failed to rename line:', err);
        toast.error(t('companies.renameLineError'));
        return;
      }
    },
    [t]
  );

  /**
   * Deletes a bus line from a company after user confirmation.
   * @param companyId - The target company identifier.
   * @param line - Line identifier to delete.
   * @returns Promise resolving to boolean indicating success or cancellation.
   */
  const handleDeleteLine = useCallback(
    async (companyId: string, line: string): Promise<void> => {
      if (!confirm(t('companies.deleteLineConfirmCompany', { line, company: companyId.toUpperCase() }))) {
        return;
      }
      try {
        await deleteCompanyLine(companyId, line);
        toast.success(t('companies.deleteBusLineSuccess', { line }));

      } catch (err) {
        console.error('[useLineOperations] Failed to delete line:', err);
        toast.error(t('companies.deleteBusLineError'));
        return;
      }
    },
    [t]
  );

  return {
    handleRenameLine,
    handleDeleteLine,
  };
}
