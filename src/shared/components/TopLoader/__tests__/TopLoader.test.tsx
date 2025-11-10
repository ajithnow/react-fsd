import { render, act, waitFor } from '@testing-library/react';
import { TopLoader } from '../TopLoader'; // Adjust path as necessary

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

describe('TopLoader', () => {
  let onBeforeLoadHandler: () => void;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSubscribe.mockImplementation((event: string, handler: () => void) => {
      if (event === 'onBeforeLoad') {
        onBeforeLoadHandler = handler;
      }
      return mockUnsubscribe; // Return unsubscribe function for cleanup
    });
  });

  afterEach(() => {
    // Ensure all timers are cleared after each test
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers(); // Restore real timers after all tests
  });

  it('renders nothing when not loading', () => {
    const { container } = render(<TopLoader />);
    // Expect the component's output to be null initially
    expect(container.firstChild).toBeNull();
  });

  it('renders with default props when loading', async () => {
    render(<TopLoader />);

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    // Wait for the loader to appear in the DOM
    await waitFor(() => {
      const loader = document.querySelector('.fixed.top-0.left-0.z-50');
      expect(loader).toBeInTheDocument();
    });

    // Assert on default styles
    const loaderElement = document.querySelector(
      '.fixed.top-0.left-0.z-50'
    ) as HTMLElement;
    expect(loaderElement).toHaveStyle({
      height: '3px',
      backgroundColor: 'hsl(var(--primary))',
    });
  });

  it('renders with custom props', async () => {
    render(
      <TopLoader
        className="custom-loader"
        color="blue"
        height={5}
        speed={200}
      />
    );

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    // Wait for the custom loader class to be present
    await waitFor(() => {
      const loader = document.querySelector('.custom-loader');
      expect(loader).toBeInTheDocument();
    });

    // Assert on custom styles
    const loaderElement = document.querySelector(
      '.custom-loader'
    ) as HTMLElement;
    expect(loaderElement).toHaveClass('custom-loader');
    expect(loaderElement.style.height).toBe('5px');
    expect(loaderElement.style.backgroundColor).toBe('blue');
  });

  it('starts loading when onBeforeLoad is triggered', async () => {
    render(<TopLoader />);

    // Initially, the loader should not be in the document
    expect(
      document.querySelector('.fixed.top-0.left-0.z-50')
    ).not.toBeInTheDocument();

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    // Wait for the loader to become visible
    await waitFor(() => {
      expect(
        document.querySelector('.fixed.top-0.left-0.z-50')
      ).toBeInTheDocument();
    });
  });

  it('respects custom speed prop', async () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    render(<TopLoader speed={50} />);

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      expect(
        document.querySelector('.fixed.top-0.left-0.z-50')
      ).toBeInTheDocument();
    });

    // Verify that setInterval was called with the custom speed
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 50);

    setIntervalSpy.mockRestore();
  });

  it('applies box shadow styling', async () => {
    render(<TopLoader color="red" />);

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      const loader = document.querySelector('.fixed.top-0.left-0.z-50');
      expect(loader).toBeInTheDocument();
    });

    const loaderElement = document.querySelector(
      '.fixed.top-0.left-0.z-50'
    ) as HTMLElement;
    expect(loaderElement?.style.boxShadow).toBe('0 0 10px red, 0 0 5px red');
  });

  it('cleans up timers and subscriptions on unmount', () => {
    const { unmount } = render(<TopLoader />);

    // Start loading to create timers and subscriptions
    act(() => {
      onBeforeLoadHandler();
    });

    // Clear the mock calls from setup to only count unmount-triggered calls
    mockUnsubscribe.mockClear();

    // Unmount component
    unmount();

    // Verify unsubscribe was called for both subscriptions (onBeforeLoad and onLoad)
    expect(mockUnsubscribe).toHaveBeenCalledTimes(2);
    // Also verify that any active timers are cleared by advancing them
    act(() => {
      jest.runOnlyPendingTimers(); // Ensure any scheduled timers are processed
    });
    // While we can't directly assert setInterval/setTimeout were cleared without spying
    // on clearInterval/clearTimeout, the lack of `act` warnings after unmount suggests cleanup.
  });

  it('applies cn utility for className merging', async () => {
    // Get the mocked cn function
    const { cn } = jest.requireMock('@/lib/utils');
    // Clear previous calls to cn
    cn.mockClear();

    render(<TopLoader className="custom" />);

    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      expect(
        document.querySelector('.fixed.top-0.left-0.z-50')
      ).toBeInTheDocument();
    });

    // Expect cn to have been called with the base classes and the custom class
    expect(cn).toHaveBeenCalledWith(
      'fixed top-0 left-0 z-50 transition-all duration-200 ease-out',
      'custom'
    );
  });
});
