import { useLoginManager } from '../login.manager';
import { authStorage } from '../../utils';
import { renderHook, act } from '@testing-library/react';
import { ROLES } from '@/shared/lib/rbac';

const mockGetProfile = vi.fn();

vi.mock('../../services', () => ({
  __esModule: true,
  default: {
    useProfileService: () => ({
      getProfile: mockGetProfile,
    }),
  },
}));

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockUseSearch = vi.fn().mockReturnValue({});
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
}));

describe('useLoginManager', () => {
  const defaultPayload = {
    accessToken: 'fake-token',
    refreshToken: 'fake-refresh',
  };

  const profileUser = {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: ROLES.VIEWER,
    roles: [ROLES.VIEWER],
    name: 'John Doe',
    permissions: [],
    status: 'active',
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockGetProfile.mockResolvedValue(profileUser);
  });

  it('should store tokens, load profile, and navigate on success', async () => {
    const { result } = renderHook(() => useLoginManager());

    await act(async () => {
      await result.current.onLoginSuccess(defaultPayload);
    });

    expect(authStorage.getToken()).toBe('fake-token');
    expect(authStorage.getRefreshToken()).toBe('fake-refresh');
    expect(mockGetProfile).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(expect.anything());
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });

  it('should navigate to custom return URL on success when provided', async () => {
    mockUseSearch.mockReturnValue({ returnUrl: '/dashboard' });

    const { result } = renderHook(() => useLoginManager());

    await act(async () => {
      await result.current.onLoginSuccess(defaultPayload);
    });

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
  });

  it('should navigate to home when return URL is login page', async () => {
    mockUseSearch.mockReturnValue({ returnUrl: '/auth/login' });

    const { result } = renderHook(() => useLoginManager());

    await act(async () => {
      await result.current.onLoginSuccess(defaultPayload);
    });

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });

  it('should clear tokens when getProfile fails', async () => {
    mockGetProfile.mockRejectedValue(new Error('Profile failed'));

    const { result } = renderHook(() => useLoginManager());

    await expect(
      act(async () => {
        await result.current.onLoginSuccess(defaultPayload);
      })
    ).rejects.toThrow('Profile failed');

    expect(authStorage.getToken()).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle login error correctly', async () => {
    const { result } = renderHook(() => useLoginManager());

    act(() => {
      result.current.onLoginError(new Error('Network error'));
    });

    expect(authStorage.getToken()).toBeNull();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
