import { renderHook } from '@testing-library/react';
import {
  useRBAC,
  usePermission,
  useAnyPermission,
  useAllPermissions,
  useRole,
  useAnyRole,
} from '../useRBAC';

const mockUser = {
  id: '1',
  role: 'admin',
  roles: ['admin'],
  email: 'test@test.com',
  firstName: 'Test',
  lastName: 'Test',
  name: 'Test Test',
  permissions: ['users:read', 'users:create', 'admin:dashboard'],
  status: 'active',
};

vi.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    }),
}));

vi.mock('../../lib/rbac/utils', () => ({
  getAllPermissionsForUser: vi.fn(() => [
    'users:read',
    'users:create',
    'admin:dashboard',
  ]),
  getUserRoles: vi.fn((user: { role?: string } | null) =>
    user ? [user.role] : []
  ),
  hasPermission: vi.fn((_user, perm) =>
    ['users:read', 'users:create', 'admin:dashboard'].includes(perm)
  ),
  hasAnyPermission: vi.fn((_user, perms) =>
    perms.some((p: string) =>
      ['users:read', 'users:create', 'admin:dashboard'].includes(p)
    )
  ),
  hasAllPermissions: vi.fn((_user, perms) =>
    perms.every((p: string) =>
      ['users:read', 'users:create', 'admin:dashboard'].includes(p)
    )
  ),
  getMissingPermissions: vi.fn(),
  canAccessFeature: vi.fn(),
  isRbacEnabled: vi.fn(() => true),
}));

describe('useRBAC (shared/hooks)', () => {
  it('returns user and permissions', () => {
    const { result } = renderHook(() => useRBAC());
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.permissions).toContain('users:read');
  });

  it('hasPermission returns true for user permission', () => {
    const { result } = renderHook(() => useRBAC());
    expect(result.current.hasPermission('users:read')).toBe(true);
    expect(result.current.hasPermission('not:real')).toBe(false);
  });

  it('hasAnyPermission returns true if user has any', () => {
    const { result } = renderHook(() => useRBAC());
    expect(result.current.hasAnyPermission(['not:real', 'users:read'])).toBe(
      true
    );
    expect(result.current.hasAnyPermission(['not:real'])).toBe(false);
  });

  it('hasAllPermissions returns true only if user has all', () => {
    const { result } = renderHook(() => useRBAC());
    expect(
      result.current.hasAllPermissions(['users:read', 'users:create'])
    ).toBe(true);
    expect(
      result.current.hasAllPermissions(['users:read', 'not:real'])
    ).toBe(false);
  });

  it('hasRole and hasAnyRole work as expected', () => {
    const { result } = renderHook(() => useRBAC());
    expect(result.current.hasRole('admin')).toBe(true);
    expect(result.current.hasRole('user')).toBe(false);
    expect(result.current.hasAnyRole(['user', 'admin'])).toBe(true);
    expect(result.current.hasAnyRole(['user', 'manager'])).toBe(false);
  });
});

describe('usePermission, useAnyPermission, useAllPermissions, useRole, useAnyRole', () => {
  it('usePermission returns true if user has permission', () => {
    const { result } = renderHook(() => usePermission('users:read'));
    expect(result.current).toBe(true);
  });
  it('useAnyPermission returns true if user has any', () => {
    const { result } = renderHook(() =>
      useAnyPermission(['not:real', 'users:read'])
    );
    expect(result.current).toBe(true);
  });
  it('useAllPermissions returns true if user has all', () => {
    const { result } = renderHook(() =>
      useAllPermissions(['users:read', 'users:create'])
    );
    expect(result.current).toBe(true);
  });
  it('useRole returns true if user has role', () => {
    const { result } = renderHook(() => useRole('admin'));
    expect(result.current).toBe(true);
  });
  it('useAnyRole returns true if user has any role', () => {
    const { result } = renderHook(() => useAnyRole(['user', 'admin']));
    expect(result.current).toBe(true);
  });
});
