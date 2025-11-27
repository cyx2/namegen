import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../route';

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { logger } from '@/lib/logger';
const mockLogger = vi.mocked(logger);

describe('POST /api/log', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log info level messages with IP address', async () => {
    const request = new NextRequest('http://localhost:3000/api/log', {
      method: 'POST',
      headers: {
        'x-forwarded-for': '192.168.1.100',
      },
      body: JSON.stringify({
        level: 'info',
        message: 'Test message',
        source: 'ui',
        name: 'test-name',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockLogger.info).toHaveBeenCalledWith('Test message', {
      source: 'ui',
      name: 'test-name',
      ip: '192.168.1.100',
    });
  });

  it('should extract IP from x-forwarded-for header', async () => {
    const request = new NextRequest('http://localhost:3000/api/log', {
      method: 'POST',
      headers: {
        'x-forwarded-for': '10.0.0.1',
      },
      body: JSON.stringify({
        level: 'info',
        message: 'Test',
      }),
    });

    await POST(request);

    expect(mockLogger.info).toHaveBeenCalledWith('Test', {
      ip: '10.0.0.1',
    });
  });

  it('should extract IP from x-real-ip header if x-forwarded-for is not available', async () => {
    const request = new NextRequest('http://localhost:3000/api/log', {
      method: 'POST',
      headers: {
        'x-real-ip': '172.16.0.1',
      },
      body: JSON.stringify({
        level: 'info',
        message: 'Test',
      }),
    });

    await POST(request);

    expect(mockLogger.info).toHaveBeenCalledWith('Test', {
      ip: '172.16.0.1',
    });
  });

  it('should use unknown if no IP headers are available', async () => {
    const request = new NextRequest('http://localhost:3000/api/log', {
      method: 'POST',
      body: JSON.stringify({
        level: 'info',
        message: 'Test',
      }),
    });

    await POST(request);

    expect(mockLogger.info).toHaveBeenCalledWith('Test', {
      ip: expect.stringMatching(/unknown|127\.0\.0\.1/),
    });
  });

  it('should log warn level messages', async () => {
    const request = new NextRequest('http://localhost:3000/api/log', {
      method: 'POST',
      body: JSON.stringify({
        level: 'warn',
        message: 'Warning message',
        context: 'test',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockLogger.warn).toHaveBeenCalledWith('Warning message', {
      context: 'test',
      ip: expect.any(String),
    });
  });

  it('should log error level messages', async () => {
    const request = new NextRequest('http://localhost:3000/api/log', {
      method: 'POST',
      body: JSON.stringify({
        level: 'error',
        message: 'Error message',
        error: { name: 'Error', message: 'Test error' },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Error message',
      undefined,
      expect.objectContaining({
        error: expect.any(Object),
        ip: expect.any(String),
      })
    );
  });

  it('should log debug level messages', async () => {
    const request = new NextRequest('http://localhost:3000/api/log', {
      method: 'POST',
      body: JSON.stringify({
        level: 'debug',
        message: 'Debug message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockLogger.debug).toHaveBeenCalledWith('Debug message', {
      ip: expect.any(String),
    });
  });

  it('should default to info level when level is not specified', async () => {
    const request = new NextRequest('http://localhost:3000/api/log', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockLogger.info).toHaveBeenCalledWith('Test message', {
      ip: expect.any(String),
    });
  });

  it('should handle invalid JSON gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/log', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should handle missing body gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/log', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
