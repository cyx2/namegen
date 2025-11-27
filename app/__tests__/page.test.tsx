import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';
import * as nameGenerator from '@/lib/nameGenerator';

// Mock the name generator
vi.mock('@/lib/nameGenerator', () => ({
  generateName: vi.fn(() => 'test-name'),
}));

// Mock client logger
vi.mock('@/lib/clientLogger', () => ({
  clientLogger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import { clientLogger } from '@/lib/clientLogger';
const mockClientLogger = vi.mocked(clientLogger);

// Mock fetch for client logger
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ success: true }),
});

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the name generator', () => {
    render(<Home />);
    expect(screen.getByText('Name Generator')).toBeInTheDocument();
  });

  it('should generate a name on mount', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(vi.mocked(nameGenerator.generateName)).toHaveBeenCalled();
    });
  });

  it('should display generated name', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('test-name')).toBeInTheDocument();
    });
  });

  it('should generate new name when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const generateButton = screen.getByLabelText(/generate/i);
    await user.click(generateButton);

    await waitFor(() => {
      expect(vi.mocked(nameGenerator.generateName)).toHaveBeenCalledTimes(2);
    });
  });

  it('should copy name to clipboard when copy button is clicked', async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);

    // Mock navigator.clipboard using Object.defineProperty
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextSpy,
      },
      writable: true,
      configurable: true,
    });

    render(<Home />);

    const copyButton = screen.getByLabelText(/copy/i);
    await user.click(copyButton);

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledWith('test-name');
    });
  });

  it('should be accessible', () => {
    render(<Home />);
    const copyButton = screen.getByLabelText(/copy/i);
    const generateButton = screen.getByLabelText(/generate/i);

    expect(copyButton).toBeInTheDocument();
    expect(generateButton).toBeInTheDocument();
  });

  it('should log name generation on initial load', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(mockClientLogger.info).toHaveBeenCalledWith('Name generated', {
        source: 'ui',
        event: 'initial_load',
        name: 'test-name',
      });
    });
  });

  it('should log name generation on button click', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const generateButton = screen.getByLabelText(/generate/i);
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockClientLogger.info).toHaveBeenCalledWith('Name generated', {
        source: 'ui',
        event: 'button_click',
        name: 'test-name',
      });
    });
  });

  it('should handle error states', async () => {
    vi.mocked(nameGenerator.generateName).mockImplementationOnce(() => {
      throw new Error('Generation failed');
    });

    render(<Home />);

    await waitFor(() => {
      expect(mockClientLogger.error).toHaveBeenCalled();
    });
  });

  it('should show loading state during generation', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const generateButton = screen.getByLabelText(/generate/i);
    await user.click(generateButton);

    // Should show loading state briefly (check for visible text, not sr-only)
    const loadingElements = screen.getAllByText(/Generating/i);
    expect(loadingElements.length).toBeGreaterThan(0);
    // Check that at least one is visible (not sr-only)
    const visibleLoading = loadingElements.find(
      (el) => !el.classList.contains('sr-only')
    );
    expect(visibleLoading).toBeTruthy();
  });
});
