import { NextRequest, NextResponse } from 'next/server';
import { generateName } from '@/lib/nameGenerator';
import { logger } from '@/lib/logger';
import { ERROR_MESSAGES } from '@/lib/constants';

/**
 * GET /api/name
 * Generates a random name in adjective-noun format
 *
 * @param request - Next.js request object
 * @returns JSON response with generated name or error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  try {
    // Generate name
    const name = generateName();

    logger.info('Name generated', {
      source: 'api',
      event: 'api_request',
      name,
      ip,
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      { name },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (error) {
    logger.error('Error generating name', error, {
      source: 'api',
      event: 'api_request',
      ip,
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      { error: ERROR_MESSAGES.GENERATE_FAILED },
      {
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }
}

// Note: Edge runtime removed as unique-names-generator may have compatibility issues
// Using Node.js runtime for better compatibility
