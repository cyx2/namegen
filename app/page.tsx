'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Check, Loader2 } from 'lucide-react';
import { generateName } from '@/lib/nameGenerator';
import {
  COPY_FEEDBACK_DURATION_MS,
  ARIA_LABELS,
  ERROR_MESSAGES,
} from '@/lib/constants';
import { clientLogger } from '@/lib/clientLogger';

/**
 * Home page component - Name Generator
 * Provides a simple interface to generate and copy random names
 */
export default function Home() {
  // Initialize with empty string to avoid hydration mismatch
  // Name will be generated on client side only
  const [name, setName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const generateButtonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate initial name only on client side after hydration
  useEffect(() => {
    // Use setTimeout to make state update asynchronous and avoid lint warning
    // This is necessary to prevent hydration mismatch between server and client
    setTimeout(() => {
      try {
        const initialName = generateName();
        setName(initialName);
        clientLogger.info('Name generated', {
          source: 'ui',
          event: 'initial_load',
          name: initialName,
        });
      } catch (err) {
        clientLogger.error('Failed to generate initial name', err);
        setError(ERROR_MESSAGES.GENERATE_FAILED);
      }
    }, 0);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setError(null);
    setCopied(false);

    try {
      const newName = generateName();
      setName(newName);
      setIsGenerating(false);
      clientLogger.info('Name generated', {
        source: 'ui',
        event: 'button_click',
        name: newName,
      });
      // Focus on generate button for accessibility
      generateButtonRef.current?.focus();
    } catch (err) {
      clientLogger.error('Failed to generate name', err);
      setError(ERROR_MESSAGES.GENERATE_FAILED);
      setIsGenerating(false);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!name) return;

    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
      setError(null);

      // Clear existing timeout if any
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset copied state after duration
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        copyButtonRef.current?.focus();
      }, COPY_FEEDBACK_DURATION_MS);
    } catch (err) {
      clientLogger.error('Failed to copy name', err);
      setError(ERROR_MESSAGES.COPY_FAILED);
    }
  }, [name]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, action: () => void) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        action();
      }
    },
    []
  );

  return (
    <main className="h-screen h-dvh flex flex-col items-center justify-center bg-[#1e1e1e] p-4">
      <div className="max-w-md w-full flex-1 flex flex-col justify-center">
        <h1 className="text-lg font-normal text-center text-[#cccccc] mb-6">
          Name Generator
        </h1>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="bg-red-900/20 border border-red-700 rounded p-3 mb-4 text-red-300 text-sm"
          >
            {error}
          </div>
        )}

        <div className="bg-[#252526] rounded border border-[#3e3e3e] p-4 mb-4">
          <div className="flex items-center justify-center gap-3">
            <p
              className="text-xl font-normal text-[#cccccc] text-center flex-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {isGenerating || (!name && !error) ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    aria-hidden="true"
                  />
                  <span className="sr-only">
                    {isGenerating ? 'Generating name...' : 'Loading...'}
                  </span>
                </span>
              ) : (
                name || ''
              )}
            </p>
            <button
              ref={copyButtonRef}
              onClick={handleCopy}
              onKeyDown={(e) => handleKeyDown(e, handleCopy)}
              disabled={!name || isGenerating}
              className="flex-shrink-0 p-1.5 rounded hover:bg-[#2a2d2e] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#0e639c] focus:ring-offset-2 focus:ring-offset-[#1e1e1e] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={ARIA_LABELS.COPY_NAME}
              aria-pressed={copied}
            >
              {copied ? (
                <>
                  <Check
                    className="w-4 h-4 text-[#4ec9b0]"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#858585]" aria-hidden="true" />
                  <span className="sr-only">Copy name</span>
                </>
              )}
            </button>
          </div>
        </div>

        <button
          ref={generateButtonRef}
          onClick={handleGenerate}
          onKeyDown={(e) => handleKeyDown(e, handleGenerate)}
          disabled={isGenerating}
          className="w-full bg-[#0e639c] text-[#ffffff] text-sm font-normal py-2 px-4 rounded hover:bg-[#1177bb] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0e639c] focus:ring-offset-2 focus:ring-offset-[#1e1e1e] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={ARIA_LABELS.GENERATE_NEW}
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Generating...
            </span>
          ) : (
            'Generate new'
          )}
        </button>
      </div>

      <footer className="mt-auto pt-4 pb-2 text-center">
        <p className="text-xs text-[#858585]">
          API:{' '}
          <code className="text-[#4ec9b0] bg-[#252526] px-1.5 py-0.5 rounded">
            GET /api/name
          </code>
        </p>
      </footer>
    </main>
  );
}
