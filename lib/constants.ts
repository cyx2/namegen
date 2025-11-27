/**
 * Application-wide constants
 */

export const COPY_FEEDBACK_DURATION_MS = 2000;

export const API_ROUTES = {
  NAME: '/api/name',
  LOG: '/api/log',
} as const;

export const ARIA_LABELS = {
  COPY_NAME: 'Copy name to clipboard',
  GENERATE_NEW: 'Generate a new random name',
} as const;

export const ERROR_MESSAGES = {
  COPY_FAILED: 'Failed to copy name to clipboard',
  GENERATE_FAILED: 'Failed to generate name',
  GENERIC_ERROR: 'An error occurred. Please try again.',
} as const;
