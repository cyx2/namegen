import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getEnvConfig } from '../env';

describe('getEnvConfig', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset process.env using Object.assign to work around TypeScript readonly
    Object.assign(process.env, originalEnv);
    // Ensure NODE_ENV is set to a valid value for tests
    (process.env as Record<string, string>).NODE_ENV = 'test';
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it('should return default NODE_ENV as development when not set', () => {
    delete (process.env as Record<string, string | undefined>).NODE_ENV;
    const config = getEnvConfig();
    expect(config.NODE_ENV).toBe('development');
  });

  it('should return valid NODE_ENV values', () => {
    (process.env as Record<string, string>).NODE_ENV = 'production';
    expect(getEnvConfig().NODE_ENV).toBe('production');

    (process.env as Record<string, string>).NODE_ENV = 'development';
    expect(getEnvConfig().NODE_ENV).toBe('development');

    (process.env as Record<string, string>).NODE_ENV = 'test';
    expect(getEnvConfig().NODE_ENV).toBe('test');
  });

  it('should throw error for invalid NODE_ENV', () => {
    (process.env as Record<string, string>).NODE_ENV = 'invalid';
    expect(() => getEnvConfig()).toThrow('Invalid NODE_ENV: invalid');
  });

  it('should return NEXT_PUBLIC_BASE_URL when set', () => {
    (process.env as Record<string, string>).NEXT_PUBLIC_BASE_URL =
      'https://example.com';
    const config = getEnvConfig();
    expect(config.NEXT_PUBLIC_BASE_URL).toBe('https://example.com');
  });

  it('should return undefined for NEXT_PUBLIC_BASE_URL when not set', () => {
    delete (process.env as Record<string, string | undefined>)
      .NEXT_PUBLIC_BASE_URL;
    const config = getEnvConfig();
    expect(config.NEXT_PUBLIC_BASE_URL).toBeUndefined();
  });

  it('should validate NEXT_PUBLIC_BASE_URL format', () => {
    (process.env as Record<string, string>).NEXT_PUBLIC_BASE_URL =
      'https://example.com';
    expect(() => getEnvConfig()).not.toThrow();
  });

  it('should throw error for invalid NEXT_PUBLIC_BASE_URL format', () => {
    (process.env as Record<string, string>).NEXT_PUBLIC_BASE_URL =
      'not-a-valid-url';
    expect(() => getEnvConfig()).toThrow(
      'Invalid NEXT_PUBLIC_BASE_URL: not-a-valid-url'
    );
  });

  it('should handle empty string NEXT_PUBLIC_BASE_URL', () => {
    (process.env as Record<string, string>).NEXT_PUBLIC_BASE_URL = '';
    const config = getEnvConfig();
    expect(config.NEXT_PUBLIC_BASE_URL).toBe('');
  });
});
