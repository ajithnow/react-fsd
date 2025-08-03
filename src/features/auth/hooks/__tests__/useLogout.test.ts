import { renderHook } from '@testing-library/react';
import { useLogout } from '../useLogout';
import { useLogoutManager } from '../../managers/logout.manager';
import { useAuthStore } from '../../stores/auth.store';

// Mock the logout manager
jest.mock('../../managers/logout.manager', () => ({
  useLogoutManager: jest.fn(),
}));

// Mock the auth store
jest.mock('../../stores/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

const mockUseLogoutManager = useLogoutManager as jest.MockedFunction<
  typeof useLogoutManager
>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

describe('useLogout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue(null); // No user logged in by default
    mockUseLogoutManager.mockReturnValue({
      logoutUser: jest.fn(),
      quickLogout: jest.fn(),
      isPending: false,
      error: null,
      canLogout: false,
    });
  });

  it('should return logout function and loading state', () => {
    const { result } = renderHook(() => useLogout());

    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('isLoggedIn');
    expect(typeof result.current.logout).toBe('function');
  });

  it('should return isLoggedIn as false when no user', () => {
    mockUseAuthStore.mockReturnValue(null);
    const { result } = renderHook(() => useLogout());

    expect(result.current.isLoggedIn).toBe(false);
  });

  it('should return isLoggedIn as true when user exists', () => {
    mockUseAuthStore.mockReturnValue({ id: 1, name: 'John' });
    const { result } = renderHook(() => useLogout());

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('should expose loading state from logout manager', () => {
    mockUseLogoutManager.mockReturnValue({
      logoutUser: jest.fn(),
      quickLogout: jest.fn(),
      isPending: true,
      error: null,
      canLogout: true,
    });

    const { result } = renderHook(() => useLogout());
    expect(result.current.isLoading).toBe(true);
  });
});
