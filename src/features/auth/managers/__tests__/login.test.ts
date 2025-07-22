import { useLoginManager } from "../login.manager";
import { renderHook, act } from '@testing-library/react';

jest.mock('../../queries/login.query', () => ({
  useLoginMutation: () => ({
    mutateAsync: jest.fn().mockResolvedValue({ token: 'fake-token' }),
    isPending: false,
    error: null,
  }),
}));

const mockSetUser = jest.fn();
jest.mock('../../stores/auth.store', () => ({
  useAuthStore: (fn: (state: { setUser: (user: unknown) => void }) => unknown) => fn({ setUser: mockSetUser }),
}));

const mockNavigate = jest.fn();
jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
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

    expect(localStorage.getItem('authToken')).toBe('fake-token');

    expect(mockSetUser).toHaveBeenCalledWith({
      id: 1,
      name: 'john',
      email: 'john@demo.com',
    });

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
  });

  it('should expose isLoading and error correctly', () => {
    const { result } = renderHook(() => useLoginManager());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});

