import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout from '../layout';

// Mock Speed Insights since it's a third-party component
vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid="speed-insights" />,
}));

describe('RootLayout', () => {
  it('should render the root html structure', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    expect(markup).toContain('<html lang="en">');
    expect(markup).toContain('<body>');
  });

  it('should include SpeedInsights component', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    expect(markup).toContain('data-testid="speed-insights"');
  });

  it('should render children', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    expect(markup).toContain('Test content');
  });
});
