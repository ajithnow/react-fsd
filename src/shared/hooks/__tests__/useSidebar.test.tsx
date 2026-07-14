import { renderHook } from '@testing-library/react';
import { useSidebarData } from '../useSidebar';
import * as useRBACModule from '../useRBAC';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../useRBAC', () => ({
  useRBAC: vi.fn(() => ({
    user: {
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      roles: ['user'],
      permissions: ['dashboard:view', 'customers:view', 'settings:view'],
    },
    permissions: ['dashboard:view', 'customers:view', 'settings:view'],
  })),
}));

vi.mock('react-redux', () => ({
  useSelector: vi.fn((selector) =>
    selector({
      auth: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
          roles: ['user'],
          permissions: ['dashboard:view'],
        },
        isAuthenticated: true,
      },
    })
  ),
  useDispatch: vi.fn(() => vi.fn()),
}));

describe('useSidebarData', () => {
  it('returns sidebar data for default user', () => {
    const { result } = renderHook(() => useSidebarData());
    expect(result.current).toBeDefined();
    expect(result.current.user.name).toBe('Test User');
    expect(result.current.navGroups.length).toBeGreaterThan(0);
  });

  it('returns sidebar data for admin role', () => {
    vi.spyOn(useRBACModule, 'useRBAC').mockImplementation(() => ({
      user: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        roles: ['admin'],
        permissions: [
          'dashboard:view',
          'customers:view',
          'settings:view',
          'admin:view',
        ],
      },
      permissions: [
        'dashboard:view',
        'customers:view',
        'settings:view',
        'admin:view',
      ],
      hasPermission: () => true,
      hasAnyPermission: () => true,
      hasAllPermissions: () => true,
      hasRole: () => true,
      hasAnyRole: () => true,
      hasAllRoles: () => true,
      canAccessFeature: () => true,
      getRoleInfo: () => ({ role: 'admin', permissions: ['admin:view'] }),
      isRoleHigherThan: () => true,
      getMissingPermissions: () => [],
    }));
    const { result } = renderHook(() => useSidebarData({ userRole: 'admin' }));
    expect(result.current).toBeDefined();
    expect(result.current.user.name).toBe('Test User');
    expect(
      result.current.navGroups.some((g) => g.title === 'sidebar.groups.main')
    ).toBe(true);
    vi.restoreAllMocks();
  });

  it('returns sidebar data for feature-specific config', () => {
    const { result } = renderHook(() =>
      useSidebarData({ feature: 'dashboard' })
    );
    expect(result.current).toBeDefined();
    expect(result.current.user.name).toBe('Test User');
    expect(result.current.navGroups.length).toBeGreaterThan(0);
  });

  it('filters sidebar items based on permissions', () => {
    vi.spyOn(useRBACModule, 'useRBAC').mockImplementation(() => ({
      user: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        roles: ['user'],
        permissions: ['dashboard:view'],
      },
      permissions: ['dashboard:view'],
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      hasRole: () => false,
      hasAnyRole: () => false,
      hasAllRoles: () => false,
      canAccessFeature: () => false,
      getRoleInfo: () => ({ role: '', permissions: [] }),
      isRoleHigherThan: () => false,
      getMissingPermissions: () => [],
    }));
    const { result } = renderHook(() => useSidebarData());
    expect(
      result.current.navGroups[0].items.some((i) => i.title === 'sidebar.home')
    ).toBe(true);
    vi.restoreAllMocks();
  });
});
