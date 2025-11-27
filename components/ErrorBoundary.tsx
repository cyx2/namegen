'use client';

import { Component, type ReactNode } from 'react';
import { clientLogger } from '@/lib/clientLogger';
import { ERROR_MESSAGES } from '@/lib/constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch and handle React errors gracefully
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }): void {
    clientLogger.error('ErrorBoundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-screen flex items-center justify-center bg-[#1e1e1e] p-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-xl font-semibold text-[#cccccc] mb-4">
              Something went wrong
            </h1>
            <p className="text-[#858585] mb-6">
              {ERROR_MESSAGES.GENERIC_ERROR}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-[#0e639c] text-[#ffffff] text-sm font-normal py-2 px-4 rounded hover:bg-[#1177bb] transition-colors"
              aria-label="Reload page"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
