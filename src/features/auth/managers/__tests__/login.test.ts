import { AUTH_CONSTANTS } from '../../constants';
import { useLoginManager } from '../login.manager';
import { renderHook, act } from '@testing-library/react';

jest.mock('../../queries/login.query', () => ({
  useLoginMutation: () => ({
    mutateAsync: jest.fn().mockResolvedValue({
      token: 'fake-token',
      user: {
        id: 1,
        name: 'john',
        username: 'john',
        role: 'NORMAL_USER',
      },
    }),
    isPending: false,
    error: null,
  }),
}));

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
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should handle login correctly', async () => {
    const { result } = renderHook(() => useLoginManager());

    await act(async () => {
      await result.current.handleLogin({
        username: 'john',
        password: 'secret',
      });
    });

    expect(localStorage.getItem(AUTH_CONSTANTS.ACCESS_TOKEN)).toBe(
      'fake-token'
    );

    expect(mockDispatch).toHaveBeenCalledWith(expect.anything());
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });

  it('should navigate to custom return URL when provided and not login page', async () => {
    const mockSearchParams = { returnUrl: '/dashboard' };
    mockUseSearch.mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useLoginManager());

    const user = {
      username: 'testuser',
      password: 'password123',
    };

    await act(async () => {
      await result.current.handleLogin(user);
    });

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
  });

  it('should navigate to home when return URL is login page', async () => {
    const mockSearchParams = { returnUrl: '/auth/login' };
    mockUseSearch.mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useLoginManager());

    const user = {
      username: 'testuser',
      password: 'password123',
    };

    await act(async () => {
      await result.current.handleLogin(user);
    });

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });

  it('should expose isLoading and error correctly', () => {
    const { result } = renderHook(() => useLoginManager());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
