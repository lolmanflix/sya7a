/**
 * @file useLineOperations.ts
 * @description Centralized custom hook for bus line administrative operations (renaming and deletion)
 * with confirmation prompts, RTDB persistence, and toast feedback.
 */

import { useCallback } from 'react';
import { toast } from 'sonner';
import { renameCompanyLine, deleteCompanyLine } from '../services/companiesService';

/**
 * Custom hook providing standardized line mutation workflows with user confirmations and feedback.
 */
export function useLineOperations() {
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
        toast.success(`Renamed line "${oldLine}" to "${newLine.trim()}"`);
        
      } catch (err) {
        console.error('[useLineOperations] Failed to rename line:', err);
        toast.error('Failed to rename line');
        return;
      }
    },
    []
  );

  /**
   * Deletes a bus line from a company after user confirmation.
   * @param companyId - The target company identifier.
   * @param line - Line identifier to delete.
   * @returns Promise resolving to boolean indicating success or cancellation.
   */
  const handleDeleteLine = useCallback(
    async (companyId: string, line: string): Promise<void> => {
      if (!confirm(`Delete bus line "${line}" from ${companyId.toUpperCase()}?`)) {
        return;
      }
      try {
        await deleteCompanyLine(companyId, line);
        toast.success(`Deleted bus line "${line}"`);
        
      } catch (err) {
        console.error('[useLineOperations] Failed to delete line:', err);
        toast.error('Failed to delete bus line');
        return;
      }
    },
    []
  );

  return {
    handleRenameLine,
    handleDeleteLine,
  };
}
