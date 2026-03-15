import { AUTH_CONSTANTS } from '../../constants';
import { useLoginManager } from '../login.manager';
import { renderHook, act } from '@testing-library/react';

// Mock react-redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockUseSearch = jest.fn().mockReturnValue({});
jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
}));

describe('useLoginManager', () => {
  const defaultApiUser = {
    Email: 'john@example.com',
    FirstName: 'John',
    LastName: 'Doe',
    Role: 'NORMAL_USER',
    Name: 'John Doe',
  };

  const defaultPayload = {
    token: 'fake-token',
    user: defaultApiUser,
    refreshToken: 'fake-refresh',
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should handle login success correctly', async () => {
    const { result } = renderHook(() => useLoginManager());

    await act(async () => {
      await result.current.onLoginSuccess(defaultPayload);
    });

    expect(localStorage.getItem(AUTH_CONSTANTS.ACCESS_TOKEN)).toBe('fake-token');
    expect(localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN)).toBe('fake-refresh');

    expect(mockDispatch).toHaveBeenCalledWith(expect.anything());
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });

  it('should navigate to custom return URL on success when provided', async () => {
    const mockSearchParams = { returnUrl: '/dashboard' };
    mockUseSearch.mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useLoginManager());

    await act(async () => {
      await result.current.onLoginSuccess(defaultPayload);
    });

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
  });

  it('should navigate to home when return URL is login page', async () => {
    const mockSearchParams = { returnUrl: '/auth/login' };
    mockUseSearch.mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useLoginManager());

    await act(async () => {
      await result.current.onLoginSuccess(defaultPayload);
    });

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });

  it('should handle login error correctly', async () => {
    const { result } = renderHook(() => useLoginManager());

    act(() => {
      result.current.onLoginError(new Error('Network error'));
    });

    // Should not store tokens or dispatch user
    expect(localStorage.getItem(AUTH_CONSTANTS.ACCESS_TOKEN)).toBeNull();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
