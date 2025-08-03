import { renderHook } from '@testing-library/react';
let mockPathname = '/auth/login';

jest.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    state: { location: { pathname: mockPathname } },
  }),
}));
import { useIsAuthRoute } from '../useIsAuthRoute';

// Mock isAuthRoute to test only hook logic, not utility logic
jest.mock('../../utils/route.utils', () => ({
  isAuthRoute: jest.fn(path => path.startsWith('/auth')),
}));

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
