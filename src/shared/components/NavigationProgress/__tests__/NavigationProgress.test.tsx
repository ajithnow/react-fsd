import { render } from '@testing-library/react';
import { NavigationProgress } from '../NavigationProgress';

// Mock the router state hook
const mockRouterState = {
  status: 'idle',
};

jest.mock('@tanstack/react-router', () => ({
  useRouterState: jest.fn(() => mockRouterState),
}));

// Mock the LoadingBar component and its ref
const mockContinuousStart = jest.fn();
const mockComplete = jest.fn();

jest.mock('react-top-loading-bar', () => {
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

// Mock useRef to return our mock methods
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => ({
    current: {
      continuousStart: mockContinuousStart,
      complete: mockComplete,
    },
  }),
}));

describe('NavigationProgress', () => {
  const { useRouterState } = jest.requireMock('@tanstack/react-router');

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouterState.status = 'idle';
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
    useRouterState.mockReturnValue({ status: 'pending' });

    render(<NavigationProgress />);

    expect(mockContinuousStart).toHaveBeenCalledTimes(1);
    expect(mockComplete).not.toHaveBeenCalled();
  });

  it('completes loading when router status is not pending', () => {
    useRouterState.mockReturnValue({ status: 'idle' });

    render(<NavigationProgress />);

    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(mockContinuousStart).not.toHaveBeenCalled();
  });

  it('completes loading when router status changes from pending to idle', () => {
    useRouterState.mockReturnValue({ status: 'pending' });

    const { rerender } = render(<NavigationProgress />);

    expect(mockContinuousStart).toHaveBeenCalledTimes(1);
    expect(mockComplete).not.toHaveBeenCalled();

    // Change status to idle
    useRouterState.mockReturnValue({ status: 'idle' });
    rerender(<NavigationProgress />);

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });

  it('handles success status', () => {
    useRouterState.mockReturnValue({ status: 'success' });

    render(<NavigationProgress />);

    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(mockContinuousStart).not.toHaveBeenCalled();
  });

  it('handles error status', () => {
    useRouterState.mockReturnValue({ status: 'error' });

    render(<NavigationProgress />);

    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(mockContinuousStart).not.toHaveBeenCalled();
  });

  it('handles missing ref gracefully', () => {
    // Mock useRef to return null
    const mockUseRef = jest.fn(() => ({ current: null }));
    const reactModule = jest.requireMock('react');
    jest.spyOn(reactModule, 'useRef').mockImplementation(mockUseRef);

    useRouterState.mockReturnValue({ status: 'pending' });

    // Should not throw an error
    expect(() => render(<NavigationProgress />)).not.toThrow();
  });
});
