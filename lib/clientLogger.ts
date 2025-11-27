/**
 * Client-side logger that sends logs to the server
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Sends log to server-side logging endpoint
 */
async function sendLogToServer(
  level: LogLevel,
  message: string,
  context?: LogContext
): Promise<void> {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level,
        message,
        ...context,
      }),
    });
  } catch (error) {
    // Silently fail - don't break the UI if logging fails
    console.error('Failed to send log to server:', error);
  }
}

class ClientLogger {
  info(message: string, context?: LogContext): void {
    sendLogToServer('info', message, context);
    // Also log to browser console for debugging
    console.log('[UI]', message, context);
  }

  warn(message: string, context?: LogContext): void {
    sendLogToServer('warn', message, context);
    console.warn('[UI]', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    };
    sendLogToServer('error', message, errorContext);
    console.error('[UI]', message, errorContext);
  }

  debug(message: string, context?: LogContext): void {
    sendLogToServer('debug', message, context);
    console.debug('[UI]', message, context);
  }
}

export const clientLogger = new ClientLogger();
