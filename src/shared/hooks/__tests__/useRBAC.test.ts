import { renderHook } from '@testing-library/react';
import {
  useRBAC,
  usePermission,
  useAnyPermission,
  useAllPermissions,
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

  it('hasAnyPermission / hasAllPermissions work', () => {
    const { result } = renderHook(() => useRBAC());
    expect(result.current.hasAnyPermission(['not:real', 'users:read'])).toBe(
      true
    );
    expect(
      result.current.hasAllPermissions(['users:read', 'users:create'])
    ).toBe(true);
  });
});

describe('usePermission helpers', () => {
  it('usePermission / useAnyPermission / useAllPermissions', () => {
    expect(renderHook(() => usePermission('users:read')).result.current).toBe(
      true
    );
    expect(
      renderHook(() => useAnyPermission(['not:real', 'users:read'])).result
        .current
    ).toBe(true);
    expect(
      renderHook(() => useAllPermissions(['users:read', 'users:create'])).result
        .current
    ).toBe(true);
  });
});
