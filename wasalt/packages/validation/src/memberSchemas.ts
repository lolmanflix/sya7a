/**
 * Validation for Inviting Team Members and Role Assignment
 */
import { ValidationResult } from './authSchemas';
import { AdminRole } from '../../types/src/membership';

export function validateInviteMember(data: {
  email?: string;
  fullName?: string;
  role?: AdminRole;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Valid email address is required.';
  }

  const validRoles: AdminRole[] = ['owner', 'admin', 'manager'];
  if (!data.role || !validRoles.includes(data.role)) {
    errors.role = 'Role must be one of: owner, admin, or manager.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
