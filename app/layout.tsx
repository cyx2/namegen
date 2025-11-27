import type { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { env } from '@/lib/env';
import './globals.css';

export const metadata: Metadata = {
  title: 'Name Generator',
  description: 'Generate random names in adjective-noun format',
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Name Generator',
    description: 'Generate random names in adjective-noun format',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Name Generator',
    description: 'Generate random names in adjective-noun format',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e1e1e',
};

/**
 * Root layout component
 * Wraps the entire application with error boundary
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}
