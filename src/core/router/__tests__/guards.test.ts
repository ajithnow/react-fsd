import { requireAuth, requireGuest, requirePermission } from '../guards';
import { getRouteLayout } from '../route-meta';

const redirectMock = vi.hoisted(() =>
  vi.fn((options: unknown) => {
    throw Object.assign(new Error('redirect'), { options });
  })
);

vi.mock('@tanstack/react-router', () => ({
  redirect: redirectMock,
}));

vi.mock('@/features/auth/utils/auth.utils', () => ({
  isAuthenticated: vi.fn(),
}));

vi.mock('@/core/store', () => ({
  store: {
    getState: vi.fn(),
  },
}));

import { isAuthenticated } from '@/features/auth/utils/auth.utils';
import { store } from '@/core/store';

describe('route guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('allows authenticated users', () => {
      vi.mocked(isAuthenticated).mockReturnValue(true);

      expect(() =>
        requireAuth({ location: { pathname: '/users' } })
      ).not.toThrow();
    });

    it('redirects guests to login with return URL', () => {
      vi.mocked(isAuthenticated).mockReturnValue(false);

      expect(() =>
        requireAuth({ location: { pathname: '/users' } })
      ).toThrow('redirect');

      expect(redirectMock).toHaveBeenCalledWith({
        to: '/auth/login',
        replace: true,
        search: { returnUrl: '/users' },
      });
    });

    it('does not store return URL for auth pages or home', () => {
      vi.mocked(isAuthenticated).mockReturnValue(false);

      expect(() =>
        requireAuth({ location: { pathname: '/auth/login' } })
      ).toThrow('redirect');

      expect(redirectMock).toHaveBeenCalledWith({
        to: '/auth/login',
        replace: true,
        search: undefined,
      });
    });
  });

  describe('requireGuest', () => {
    it('allows guests', () => {
      vi.mocked(isAuthenticated).mockReturnValue(false);

      expect(() => requireGuest({ search: {} })).not.toThrow();
    });

    it('redirects authenticated users to return URL when safe', () => {
      vi.mocked(isAuthenticated).mockReturnValue(true);

      expect(() =>
        requireGuest({ search: { returnUrl: '/users' } })
      ).toThrow('redirect');

      expect(redirectMock).toHaveBeenCalledWith({
        to: '/users',
        replace: true,
      });
    });

    it('redirects authenticated users to home when return URL is auth', () => {
      vi.mocked(isAuthenticated).mockReturnValue(true);

      expect(() =>
        requireGuest({ search: { returnUrl: '/auth/login' } })
      ).toThrow('redirect');

      expect(redirectMock).toHaveBeenCalledWith({
        to: '/',
        replace: true,
      });
    });
  });

  describe('requirePermission', () => {
    it('allows users with permission', () => {
      vi.mocked(store.getState).mockReturnValue({
        auth: { user: { permissions: ['users:read'] } },
      });

      expect(() =>
        requirePermission('users:read')()
      ).not.toThrow();
    });

    it('redirects users without permission to home', () => {
      vi.mocked(store.getState).mockReturnValue({
        auth: { user: { permissions: [] } },
      });

      expect(() => requirePermission('users:read')()).toThrow('redirect');

      expect(redirectMock).toHaveBeenCalledWith({
        to: '/',
        replace: true,
      });
    });
  });
});

describe('getRouteLayout', () => {
  it('defaults to app when layout is not declared', () => {
    expect(getRouteLayout({} as never)).toBe('app');
  });

  it('reads layout from route staticData', () => {
    expect(
      getRouteLayout({
        options: { staticData: { layout: 'standalone' } },
      } as never)
    ).toBe('standalone');
  });
});
