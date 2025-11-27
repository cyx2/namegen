import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('info', () => {
    it('should log info messages', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('Test message', { key: 'value' });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleSpy.mock.calls[0][0];
      const logData = JSON.parse(logCall);

      expect(logData.level).toBe('info');
      expect(logData.message).toBe('Test message');
      expect(logData.key).toBe('value');
      expect(logData).toHaveProperty('timestamp');

      consoleSpy.mockRestore();
    });

    it('should log info messages without context', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('Test message');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleSpy.mock.calls[0][0];
      const logData = JSON.parse(logCall);

      expect(logData.level).toBe('info');
      expect(logData.message).toBe('Test message');

      consoleSpy.mockRestore();
    });
  });

  describe('warn', () => {
    it('should log warn messages', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      logger.warn('Warning message', { warning: true });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleSpy.mock.calls[0][0];
      const logData = JSON.parse(logCall);

      expect(logData.level).toBe('warn');
      expect(logData.message).toBe('Warning message');
      expect(logData.warning).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('error', () => {
    it('should log error messages with Error object', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('Test error');
      logger.error('Error occurred', error, { context: 'test' });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleSpy.mock.calls[0][0];
      const logData = JSON.parse(logCall);

      expect(logData.level).toBe('error');
      expect(logData.message).toBe('Error occurred');
      expect(logData.error.name).toBe('Error');
      expect(logData.error.message).toBe('Test error');
      expect(logData.error).toHaveProperty('stack');
      expect(logData.context).toBe('test');

      consoleSpy.mockRestore();
    });

    it('should log error messages with unknown error type', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      logger.error('Error occurred', 'string error', { context: 'test' });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleSpy.mock.calls[0][0];
      const logData = JSON.parse(logCall);

      expect(logData.level).toBe('error');
      expect(logData.error).toBe('string error');

      consoleSpy.mockRestore();
    });

    it('should log error messages without error object', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      logger.error('Error occurred', undefined, { context: 'test' });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleSpy.mock.calls[0][0];
      const logData = JSON.parse(logCall);

      expect(logData.level).toBe('error');
      expect(logData.message).toBe('Error occurred');

      consoleSpy.mockRestore();
    });
  });

  describe('debug', () => {
    it('should log debug messages', () => {
      const consoleSpy = vi
        .spyOn(console, 'debug')
        .mockImplementation(() => {});
      logger.debug('Debug message', { debug: true });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleSpy.mock.calls[0][0];
      const logData = JSON.parse(logCall);

      expect(logData.level).toBe('debug');
      expect(logData.message).toBe('Debug message');
      expect(logData.debug).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('formatMessage', () => {
    it('should include timestamp in all logs', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('Test');

      const logCall = consoleSpy.mock.calls[0][0];
      const logData = JSON.parse(logCall);

      expect(logData).toHaveProperty('timestamp');
      expect(new Date(logData.timestamp).getTime()).toBeLessThanOrEqual(
        Date.now()
      );

      consoleSpy.mockRestore();
    });
  });
});
