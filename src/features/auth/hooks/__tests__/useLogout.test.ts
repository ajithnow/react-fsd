import { type MockedFunction } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLogout } from '../useLogout';
import { useLogoutManager } from '../../managers/logout.manager';
import { useSelector } from 'react-redux';

// Mock the logout manager
vi.mock('../../managers/logout.manager', () => ({
  useLogoutManager: vi.fn(),
}));

// Mock react-redux
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

const mockUseLogoutManager = useLogoutManager as MockedFunction<
  typeof useLogoutManager
>;
const mockUseSelector = useSelector as unknown as vi.Mock;

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSelector.mockReturnValue(null); // No user logged in by default
    mockUseLogoutManager.mockReturnValue({
      logoutUser: vi.fn(),
      quickLogout: vi.fn(),
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
    mockUseSelector.mockReturnValue(null);
    const { result } = renderHook(() => useLogout());

    expect(result.current.isLoggedIn).toBe(false);
  });

  it('should return isLoggedIn as true when user exists', () => {
    mockUseSelector.mockReturnValue({ id: 1, name: 'John' });
    const { result } = renderHook(() => useLogout());

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('should expose loading state from logout manager', () => {
    mockUseLogoutManager.mockReturnValue({
      logoutUser: vi.fn(),
      quickLogout: vi.fn(),
      isPending: true,
      error: null,
      canLogout: true,
    });

    const { result } = renderHook(() => useLogout());
    expect(result.current.isLoading).toBe(true);
  });
});
