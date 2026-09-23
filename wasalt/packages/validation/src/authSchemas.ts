/**
 * Validation functions for Admin Registration & Login
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateSignUp(data: {
  fullName?: string;
  email?: string;
  password?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters long.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Please provide a valid work email address.';
  }

  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters with a mix of letters and numbers.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLogin(data: { email?: string; password?: string }): ValidationResult {
  const errors: Record<string, string> = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!data.password || data.password.length === 0) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
