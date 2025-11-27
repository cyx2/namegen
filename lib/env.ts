/**
 * Environment variable validation and access
 */

interface EnvConfig {
  NEXT_PUBLIC_BASE_URL?: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

/**
 * Validates and returns environment configuration
 */
export function getEnvConfig(): EnvConfig {
  const config: EnvConfig = {
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  };

  // Validate NODE_ENV
  if (!['development', 'production', 'test'].includes(config.NODE_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${config.NODE_ENV}`);
  }

  // Validate NEXT_PUBLIC_BASE_URL format if provided
  if (config.NEXT_PUBLIC_BASE_URL) {
    try {
      new URL(config.NEXT_PUBLIC_BASE_URL);
    } catch {
      throw new Error(
        `Invalid NEXT_PUBLIC_BASE_URL: ${config.NEXT_PUBLIC_BASE_URL}`
      );
    }
  }

  return config;
}

export const env = getEnvConfig();
