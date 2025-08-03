import { render, act, waitFor } from '@testing-library/react';
import { TopLoader } from '../TopLoader';

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
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders nothing when not loading', () => {
    const { container } = render(<TopLoader />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with default props when loading', async () => {
    render(<TopLoader />);

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

    await waitFor(() => {
      const loader = document.querySelector('.custom-loader');
      expect(loader).toBeInTheDocument();
    });

    const loaderElement = document.querySelector(
      '.custom-loader'
    ) as HTMLElement;
    expect(loaderElement).toHaveClass('custom-loader');
    expect(loaderElement.style.height).toBe('5px');
    expect(loaderElement.style.backgroundColor).toBe('blue');
  });

  it('starts loading when onBeforeLoad is triggered', async () => {
    render(<TopLoader />);

    // Initially not loading
    expect(
      document.querySelector('.fixed.top-0.left-0.z-50')
    ).not.toBeInTheDocument();

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      expect(
        document.querySelector('.fixed.top-0.left-0.z-50')
      ).toBeInTheDocument();
    });
  });

  it('increments progress over time', async () => {
    const spy = jest.spyOn(global, 'setInterval');

    render(<TopLoader speed={100} />);

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      expect(
        document.querySelector('.fixed.top-0.left-0.z-50')
      ).toBeInTheDocument();
    });

    // Verify that setInterval was called with the correct speed
    expect(spy).toHaveBeenCalledWith(expect.any(Function), 100);

    spy.mockRestore();
  });

  it('stops progress at 85%', async () => {
    render(<TopLoader />);

    // Trigger loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      expect(
        document.querySelector('.fixed.top-0.left-0.z-50')
      ).toBeInTheDocument();
    });

    // Fast-forward enough time to reach the 85% limit
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      const loaderElement = document.querySelector(
        '.fixed.top-0.left-0.z-50'
      ) as HTMLElement;
      const width = parseFloat(loaderElement?.style.width || '0');
      expect(width).toBeLessThanOrEqual(85);
    });
  });

  it('completes progress when onLoad is triggered', async () => {
    render(<TopLoader />);

    // Start loading
    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      expect(
        document.querySelector('.fixed.top-0.left-0.z-50')
      ).toBeInTheDocument();
    });

    // Complete loading
    act(() => {
      onLoadHandler();
    });

    await waitFor(() => {
      const loaderElement = document.querySelector(
        '.fixed.top-0.left-0.z-50'
      ) as HTMLElement;
      expect(loaderElement).toHaveStyle({ width: '100%' });
    });
  });

  it('respects custom speed prop', async () => {
    const spy = jest.spyOn(global, 'setInterval');

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
    expect(spy).toHaveBeenCalledWith(expect.any(Function), 50);

    spy.mockRestore();
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

    // Start loading to create timers
    act(() => {
      onBeforeLoadHandler();
    });

    // Clear the mock calls from setup
    mockUnsubscribe.mockClear();

    // Unmount component
    unmount();

    // Verify unsubscribe was called for both subscriptions
    expect(mockUnsubscribe).toHaveBeenCalledTimes(2);
  });

  it('applies cn utility for className merging', async () => {
    const { cn } = jest.requireMock('@/lib/utils');
    render(<TopLoader className="custom" />);

    act(() => {
      onBeforeLoadHandler();
    });

    await waitFor(() => {
      expect(
        document.querySelector('.fixed.top-0.left-0.z-50')
      ).toBeInTheDocument();
    });

    expect(cn).toHaveBeenCalledWith(
      'fixed top-0 left-0 z-50 transition-all duration-200 ease-out',
      'custom'
    );
  });
});
