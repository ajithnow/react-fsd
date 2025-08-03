// Mock auth storage first
jest.mock('../../utils', () => ({
  authStorage: {
    getRefreshToken: jest.fn(),
    clearTokens: jest.fn(),
  },
}));

import { renderHook, act } from '@testing-library/react';
import { useLogoutManager } from '../logout.manager';
import { AUTH_ROUTES } from '../../constants';
import { authStorage } from '../../utils';

// Mock functions
const mockGetRefreshToken = authStorage.getRefreshToken as jest.MockedFunction<
  typeof authStorage.getRefreshToken
>;
const mockClearTokens = authStorage.clearTokens as jest.MockedFunction<
  typeof authStorage.clearTokens
>;

// Mock the logout query
const mockLogoutMutation = jest.fn();
jest.mock('../../queries/logout.query', () => ({
  useLogoutMutation: () => ({
    mutateAsync: mockLogoutMutation,
    isPending: false,
    error: null,
  }),
}));

// Mock the auth store
const mockSetUser = jest.fn();
const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
let mockCurrentUser: typeof mockUser | null = mockUser;

jest.mock('../../stores/auth.store', () => ({
  useAuthStore: (
    fn: (state: { setUser: (user: unknown) => void; user: unknown }) => unknown
  ) => fn({ setUser: mockSetUser, user: mockCurrentUser }),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useLogoutManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser = mockUser;
    mockLogoutMutation.mockResolvedValue({});
    mockGetRefreshToken.mockReturnValue('fake-refresh-token');
  });

  it('should logout user successfully with API call', async () => {
    const { result } = renderHook(() => useLogoutManager());

    await act(async () => {
      await result.current.logoutUser();
    });

    // Should call logout API with refresh token
    expect(mockLogoutMutation).toHaveBeenCalledWith('fake-refresh-token');

    // Should clear tokens and user state
    expect(mockClearTokens).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);

    // Should navigate to login page
    expect(mockNavigate).toHaveBeenCalledWith({
      to: AUTH_ROUTES.LOGIN,
      replace: true,
    });
  });

  it('should logout user even when API call fails', async () => {
    mockLogoutMutation.mockRejectedValue(new Error('API Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useLogoutManager());

    await act(async () => {
      await result.current.logoutUser();
    });

    // Should still clear tokens and user state
    expect(mockClearTokens).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);

    // Should still navigate to login page
    expect(mockNavigate).toHaveBeenCalledWith({
      to: AUTH_ROUTES.LOGIN,
      replace: true,
    });

    // Should log the error
    expect(consoleSpy).toHaveBeenCalledWith(
      'Logout API call failed, clearing local state:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should logout user with empty refresh token when none available', async () => {
    mockGetRefreshToken.mockReturnValue(null);

    const { result } = renderHook(() => useLogoutManager());

    await act(async () => {
      await result.current.logoutUser();
    });

    // Should call logout API with empty string
    expect(mockLogoutMutation).toHaveBeenCalledWith('');

    // Should still clear tokens and user state
    expect(mockClearTokens).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });

  it('should perform quick logout without API call', () => {
    const { result } = renderHook(() => useLogoutManager());

    act(() => {
      result.current.quickLogout();
    });

    // Should NOT call logout API
    expect(mockLogoutMutation).not.toHaveBeenCalled();

    // Should clear tokens and user state
    expect(mockClearTokens).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);

    // Should navigate to login page
    expect(mockNavigate).toHaveBeenCalledWith({
      to: AUTH_ROUTES.LOGIN,
      replace: true,
    });
  });

  it('should indicate if user can logout', () => {
    const { result } = renderHook(() => useLogoutManager());

    expect(result.current.canLogout).toBe(true);
  });

  it('should indicate user cannot logout when no user', () => {
    mockCurrentUser = null;
    const { result } = renderHook(() => useLogoutManager());

    expect(result.current.canLogout).toBe(false);
  });

  it('should expose loading and error states', () => {
    const { result } = renderHook(() => useLogoutManager());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
