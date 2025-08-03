import { render, act, waitFor } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

// Mock the router
const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock('@tanstack/react-router', () => ({
  useRouter: jest.fn(() => ({
    subscribe: mockSubscribe,
  })),
}));

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

// Mock timers
jest.useFakeTimers();

describe('ProgressBar', () => {
  let onBeforeLoadHandler: () => void;
  let onLoadHandler: () => void;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSubscribe.mockImplementation((event: string, handler: () => void) => {
      if (event === 'onBeforeLoad') {
        onBeforeLoadHandler = handler;
      } else if (event === 'onLoad') {
        onLoadHandler = handler;
      }
      return mockUnsubscribe;
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('renders nothing when not loading', () => {
    const { container } = render(<ProgressBar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with default props', async () => {
    render(<ProgressBar />);

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      const progressBar = document.querySelector('.fixed.top-0.left-0');
      expect(progressBar).toBeInTheDocument();
    });

    const progressContainer = document.querySelector('.fixed.top-0.left-0');
    expect(progressContainer).toHaveClass('fixed top-0 left-0 z-[60] w-full');
  });

  it('renders with custom props', async () => {
    render(<ProgressBar className="custom-class" color="red" height={5} />);

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      const progressBar = document.querySelector('.custom-class');
      expect(progressBar).toBeInTheDocument();
    });

    const progressContainer = document.querySelector('.custom-class');
    expect(progressContainer).toHaveClass('custom-class');

    const progressBarElement = progressContainer?.querySelector(
      'div'
    ) as HTMLElement;
    expect(progressBarElement).toHaveStyle('height: 5px');
    expect(progressBarElement?.style.backgroundColor).toBe('red');
  });

  it('starts progress when onBeforeLoad is triggered', async () => {
    render(<ProgressBar />);

    // Initially not loading
    expect(
      document.querySelector('.fixed.top-0.left-0')
    ).not.toBeInTheDocument();

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      expect(document.querySelector('.fixed.top-0.left-0')).toBeInTheDocument();
    });
  });

  it('completes progress when onLoad is triggered', async () => {
    render(<ProgressBar />);

    // Start loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      expect(document.querySelector('.fixed.top-0.left-0')).toBeInTheDocument();
    });

    // Complete loading
    act(() => {
      onLoadHandler();
    });

    await waitFor(() => {
      const progressBarElement = document.querySelector(
        '.fixed.top-0.left-0 > div'
      ) as HTMLElement;
      expect(progressBarElement).toHaveStyle({ width: '100%' });
    });
  });

  it('stops progress at 85% until completion', async () => {
    render(<ProgressBar />);

    // Start loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      expect(document.querySelector('.fixed.top-0.left-0')).toBeInTheDocument();
    });

    // Fast-forward enough time to reach 85%
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      const progressBarElement = document.querySelector(
        '.fixed.top-0.left-0 > div'
      ) as HTMLElement;
      const width = parseFloat(progressBarElement?.style.width || '0');
      expect(width).toBeLessThanOrEqual(85);
    });
  });

  it('cleans up timers and subscriptions on unmount', () => {
    const { unmount } = render(<ProgressBar />);

    // Start loading to create timers
    act(() => {
      onBeforeLoadHandler();
    });

    // Clear the mock calls from setup
    mockUnsubscribe.mockClear();

    // Unmount component
    unmount();

    // Verify unsubscribe was called
    expect(mockUnsubscribe).toHaveBeenCalledTimes(2); // For both event subscriptions
  });
});
