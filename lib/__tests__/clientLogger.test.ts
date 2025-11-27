import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { clientLogger } from '../clientLogger';

// Mock fetch globally
global.fetch = vi.fn();

describe('ClientLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('info', () => {
    it('should send info log to server', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      clientLogger.info('Test message', { key: 'value' });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: 'info',
          message: 'Test message',
          key: 'value',
        }),
      });
    });

    it('should log to browser console', () => {
      clientLogger.info('Test message', { key: 'value' });
      expect(console.log).toHaveBeenCalledWith('[UI]', 'Test message', {
        key: 'value',
      });
    });
  });

  describe('warn', () => {
    it('should send warn log to server', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      clientLogger.warn('Warning message', { warning: true });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: 'warn',
          message: 'Warning message',
          warning: true,
        }),
      });
    });

    it('should log to browser console', () => {
      clientLogger.warn('Warning message');
      expect(console.warn).toHaveBeenCalledWith(
        '[UI]',
        'Warning message',
        undefined
      );
    });
  });

  describe('error', () => {
    it('should send error log to server with Error object', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const error = new Error('Test error');
      clientLogger.error('Error occurred', error, { context: 'test' });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalled();
      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);

      expect(body.level).toBe('error');
      expect(body.message).toBe('Error occurred');
      expect(body.error.name).toBe('Error');
      expect(body.error.message).toBe('Test error');
      expect(body.context).toBe('test');
    });

    it('should handle non-Error error objects', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      clientLogger.error('Error occurred', 'string error', { context: 'test' });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalled();
      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);

      expect(body.error).toBe('string error');
    });

    it('should log to browser console', () => {
      const error = new Error('Test error');
      clientLogger.error('Error occurred', error);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle fetch failures gracefully', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      clientLogger.error('Error occurred', new Error('Test'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should not throw, but log error to console
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('debug', () => {
    it('should send debug log to server', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      clientLogger.debug('Debug message', { debug: true });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: 'debug',
          message: 'Debug message',
          debug: true,
        }),
      });
    });

    it('should log to browser console', () => {
      clientLogger.debug('Debug message');
      expect(console.debug).toHaveBeenCalledWith(
        '[UI]',
        'Debug message',
        undefined
      );
    });
  });
});
