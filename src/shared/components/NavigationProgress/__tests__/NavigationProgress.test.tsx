import { render } from '@testing-library/react';
import { useRouterState } from '@tanstack/react-router';
import { useRef } from 'react';
import { NavigationProgress } from '../NavigationProgress';

const mockRouterState = {
  status: 'idle',
};

vi.mock('@tanstack/react-router', () => ({
  useRouterState: vi.fn(() => mockRouterState),
}));

const mockContinuousStart = vi.fn();
const mockComplete = vi.fn();

vi.mock('react-top-loading-bar', () => {
  const MockLoadingBar = ({
    color,
    height,
    shadow,
  }: {
    color?: string;
    height?: number;
    shadow?: boolean;
  }) => (
    <div
      data-testid="loading-bar"
      data-color={color}
      data-height={height}
      data-shadow={shadow}
    />
  );
  MockLoadingBar.displayName = 'LoadingBar';
  return {
    __esModule: true,
    default: MockLoadingBar,
  };
});

vi.mock('react', async importOriginal => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useRef: vi.fn(() => ({
      current: {
        continuousStart: mockContinuousStart,
        complete: mockComplete,
      },
    })),
  };
});

const mockedUseRouterState = vi.mocked(useRouterState);
const mockedUseRef = vi.mocked(useRef);

describe('NavigationProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRouterState.status = 'idle';
    mockedUseRouterState.mockReturnValue(mockRouterState as never);
    mockedUseRef.mockReturnValue({
      current: {
        continuousStart: mockContinuousStart,
        complete: mockComplete,
      },
    } as never);
  });

  it('renders with default props', () => {
    const { getByTestId } = render(<NavigationProgress />);

    const loadingBar = getByTestId('loading-bar');
    expect(loadingBar).toBeInTheDocument();
    expect(loadingBar).toHaveAttribute('data-color', 'hsl(var(--primary))');
    expect(loadingBar).toHaveAttribute('data-height', '3');
    expect(loadingBar).toHaveAttribute('data-shadow', 'true');
  });

  it('renders with custom props', () => {
    const { getByTestId } = render(
      <NavigationProgress color="red" height={5} shadow={false} />
    );

    const loadingBar = getByTestId('loading-bar');
    expect(loadingBar).toHaveAttribute('data-color', 'red');
    expect(loadingBar).toHaveAttribute('data-height', '5');
    expect(loadingBar).toHaveAttribute('data-shadow', 'false');
  });

  it('starts loading when router status is pending', () => {
    mockedUseRouterState.mockReturnValue({ status: 'pending' } as never);

    render(<NavigationProgress />);

    expect(mockContinuousStart).toHaveBeenCalledTimes(1);
    expect(mockComplete).not.toHaveBeenCalled();
  });

  it('completes loading when router status is not pending', () => {
    mockedUseRouterState.mockReturnValue({ status: 'idle' } as never);

    render(<NavigationProgress />);

    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(mockContinuousStart).not.toHaveBeenCalled();
  });

  it('completes loading when router status changes from pending to idle', () => {
    mockedUseRouterState.mockReturnValue({ status: 'pending' } as never);

    const { rerender } = render(<NavigationProgress />);

    expect(mockContinuousStart).toHaveBeenCalledTimes(1);
    expect(mockComplete).not.toHaveBeenCalled();

    mockedUseRouterState.mockReturnValue({ status: 'idle' } as never);
    rerender(<NavigationProgress />);

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });

  it('handles success status', () => {
    mockedUseRouterState.mockReturnValue({ status: 'success' } as never);

    render(<NavigationProgress />);

    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(mockContinuousStart).not.toHaveBeenCalled();
  });

  it('handles error status', () => {
    mockedUseRouterState.mockReturnValue({ status: 'error' } as never);

    render(<NavigationProgress />);

    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(mockContinuousStart).not.toHaveBeenCalled();
  });

  it('handles missing ref gracefully', () => {
    mockedUseRef.mockReturnValue({ current: null } as never);
    mockedUseRouterState.mockReturnValue({ status: 'pending' } as never);

    expect(() => render(<NavigationProgress />)).not.toThrow();
  });
});
