import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';

const mockGenerateName = vi.fn(() => 'test-name');

vi.mock('@/lib/nameGenerator', () => ({
  generateName: () => mockGenerateName(),
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { logger } from '@/lib/logger';
const mockLogger = vi.mocked(logger);

describe('GET /api/name', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a generated name', async () => {
    const request = new NextRequest('http://localhost:3000/api/name');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('name');
    expect(data.name).toBe('test-name');
  });

  it('should log name generation with correct schema', async () => {
    const request = new NextRequest('http://localhost:3000/api/name');
    await GET(request);

    expect(mockLogger.info).toHaveBeenCalledWith('Name generated', {
      source: 'api',
      event: 'api_request',
      name: 'test-name',
      ip: expect.any(String),
      duration: expect.any(Number),
    });
  });

  it('should handle errors gracefully', async () => {
    mockGenerateName.mockImplementation(() => {
      throw new Error('Generation failed');
    });

    const request = new NextRequest('http://localhost:3000/api/name');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });

  it('should log errors with IP address', async () => {
    mockGenerateName.mockImplementation(() => {
      throw new Error('Generation failed');
    });

    const request = new NextRequest('http://localhost:3000/api/name', {
      headers: {
        'x-forwarded-for': '192.168.1.50',
      },
    });

    await GET(request);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Error generating name',
      expect.any(Error),
      {
        source: 'api',
        event: 'api_request',
        ip: '192.168.1.50',
        duration: expect.any(Number),
      }
    );
  });
});
