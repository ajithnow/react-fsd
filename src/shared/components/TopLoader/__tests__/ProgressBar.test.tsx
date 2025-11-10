import { render, waitFor, act } from '@testing-library/react';
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
  // These will hold the handlers passed to the mocked `subscribe` function
  let onBeforeLoadHandler: () => void;
  let onLoadHandler: () => void;

  beforeEach(() => {
    jest.clearAllMocks();
    // When the component subscribes, we capture the handlers to trigger them manually in tests.
    mockSubscribe.mockImplementation((event: string, handler: () => void) => {
      if (event === 'onBeforeLoad') {
        onBeforeLoadHandler = handler;
      } else if (event === 'onLoad') {
        onLoadHandler = handler;
      }
      // The subscribe function should return an unsubscribe function.
      return mockUnsubscribe;
    });
  });

  afterEach(() => {
    // It's good practice to run pending timers and restore real timers after each test.
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    // Re-apply fake timers for the next test
    jest.useFakeTimers();
  });

  it('renders nothing when not loading', () => {
    const { container } = render(<ProgressBar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with default props', async () => {
    render(<ProgressBar />);

    // Wrap state-triggering event in act
    act(() => {
      onBeforeLoadHandler();
    });

    // `waitFor` will wait for the component to re-render and the element to appear.
    await waitFor(() => {
      const progressBar = document.querySelector('.fixed.top-0.left-0');
      expect(progressBar).toBeInTheDocument();
    });

    const progressContainer = document.querySelector('.fixed.top-0.left-0');
    expect(progressContainer).toHaveClass('fixed top-0 left-0 z-[60] w-full');
  });

  it('renders with custom props', async () => {
    render(<ProgressBar className="custom-class" color="red" height={5} />);

    // Wrap state-triggering event in act
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

    // Wrap state-triggering event in act
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

  it('cleans up timers and subscriptions on unmount', () => {
    const { unmount } = render(<ProgressBar />);

    // Start loading to create timers and subscriptions
    act(() => {
      onBeforeLoadHandler();
    });

    // Clear any mock calls from the setup phase
    mockUnsubscribe.mockClear();

    // Unmount component to trigger cleanup
    unmount();

    // Verify the unsubscribe function returned by `subscribe` was called on cleanup.
    expect(mockUnsubscribe).toHaveBeenCalledTimes(2); // For both 'onBeforeLoad' and 'onLoad'
  });
});
