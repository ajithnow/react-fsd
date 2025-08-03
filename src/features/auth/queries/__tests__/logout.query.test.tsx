import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogoutMutation } from '../logout.query';

// Mock auth service
const mockLogout = jest.fn() as jest.MockedFunction<
  (refreshToken: string) => Promise<unknown>
>;
jest.mock('../../services', () => ({
  __esModule: true,
  default: {
    useLogoutService: () => ({
      logout: mockLogout,
    }),
  },
}));

// Test wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useLogoutMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return mutation function', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
    expect(typeof result.current.mutate).toBe('function');
  });

  it('should have correct initial state', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('should show pending state when mutation is called', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    // Mock a promise that doesn't resolve immediately
    let resolveLogout: (value: unknown) => void;
    const logoutPromise = new Promise(resolve => {
      resolveLogout = resolve;
    });

    mockLogout.mockReturnValue(logoutPromise);

    result.current.mutate('token');

    // Should be pending
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Resolve the promise
    resolveLogout!({ success: true });

    // Should no longer be pending
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should handle mutation success', async () => {
    const mockResponse = { success: true };
    const wrapper = createWrapper();
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    mockLogout.mockResolvedValue(mockResponse);

    result.current.mutate('token');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  it('should handle mutation error', async () => {
    const mockError = new Error('Logout failed');
    const wrapper = createWrapper();
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    mockLogout.mockRejectedValue(mockError);

    result.current.mutate('token');

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('should handle mutateAsync', async () => {
    const mockResponse = { success: true };
    const wrapper = createWrapper();
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    mockLogout.mockResolvedValue(mockResponse);

    const response = await result.current.mutateAsync('token');

    expect(response).toEqual(mockResponse);
    expect(mockLogout).toHaveBeenCalledWith('token');
  });

  it('should pass refresh token to service', async () => {
    const mockResponse = { success: true };
    const wrapper = createWrapper();
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    mockLogout.mockResolvedValue(mockResponse);

    const refreshToken = 'mock-refresh-token';
    result.current.mutate(refreshToken);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith(refreshToken);
    });
  });
});
