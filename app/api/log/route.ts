import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * POST /api/log
 * Receives client-side logs and logs them server-side
 *
 * @param request - Next.js request object
 * @returns JSON response
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { level = 'info', message, ...context } = body;

    // Extract IP address from request
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Add IP to context if not already present
    const contextWithIp = {
      ...context,
      ip,
    };

    // Log with the appropriate level
    switch (level) {
      case 'error':
        logger.error(message, undefined, contextWithIp);
        break;
      case 'warn':
        logger.warn(message, contextWithIp);
        break;
      case 'debug':
        logger.debug(message, contextWithIp);
        break;
      case 'info':
      default:
        logger.info(message, contextWithIp);
        break;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    // Silently fail to avoid breaking the UI
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
