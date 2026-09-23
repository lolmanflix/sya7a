/**
 * Validation for Company Setup and Profile Settings
 */
import { ValidationResult } from './authSchemas';

export function validateCompanySetup(data: {
  name?: string;
  slug?: string;
  industry?: string;
  website?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Company name is required (at least 2 characters).';
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Workspace slug can only contain lowercase letters, numbers, and hyphens.';
  }

  if (data.website && !/^https?:\/\/.+/.test(data.website)) {
    errors.website = 'Website must start with http:// or https://';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
