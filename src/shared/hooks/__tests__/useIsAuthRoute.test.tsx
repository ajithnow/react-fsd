import { renderHook } from '@testing-library/react';
import { useIsAuthRoute } from '../useIsAuthRoute';

let mockPathname = '/auth/login';

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    state: { location: { pathname: mockPathname } },
  }),
}));

// Mock isAuthRoute to test only hook logic, not utility logic
vi.mock('@/features/auth/utils/auth.utils', async () => {
  const actual = await vi.importActual<
    typeof import('@/features/auth/utils/auth.utils')
  >('@/features/auth/utils/auth.utils');
  return {
    ...actual,
    isAuthRoute: vi.fn((path: string) => path.startsWith('/auth')),
  };
});

describe('useIsAuthRoute', () => {
  it('returns true for auth route', () => {
    mockPathname = '/auth/login';
    const { result } = renderHook(() => useIsAuthRoute());
    expect(result.current).toBe(true);
  });

  it('returns false for non-auth route', () => {
    mockPathname = '/dashboard';
    const { result } = renderHook(() => useIsAuthRoute());
    expect(result.current).toBe(false);
  });

  it('returns true for /auth root', () => {
    mockPathname = '/auth/';
    const { result } = renderHook(() => useIsAuthRoute());
    expect(result.current).toBe(true);
  });
});
