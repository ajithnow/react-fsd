import { renderHook } from '@testing-library/react';
import { useSidebarData } from '../useSidebar';
import * as useRBACModule from '../useRBAC';

// Mock i18n - return key as the translated value
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock useRBAC - note: User model uses Name (capital N)
jest.mock('../useRBAC', () => ({
  useRBAC: jest.fn(() => ({
    user: { Name: 'Test User', Email: 'test@example.com', Role: 'user', permissions: ['dashboard:view', 'customers:view', 'settings:view'] },
    permissions: ['dashboard:view', 'customers:view', 'settings:view'],
  })),
}));

// Mock useSelector
jest.mock('react-redux', () => ({
  useSelector: jest.fn(selector =>
    selector({
      auth: {
        user: { Name: 'Test User', Email: 'test@example.com', Role: 'user', permissions: ['dashboard:view'] },
        isAuthenticated: true,
      },
    })
  ),
  useDispatch: jest.fn(() => jest.fn()),
}));

describe('useSidebarData', () => {
  it('returns sidebar data for default user', () => {
    const { result } = renderHook(() => useSidebarData());
    expect(result.current).toBeDefined();
    expect(result.current.user.name).toBe('Test User');
    expect(result.current.navGroups.length).toBeGreaterThan(0);
  });

  it('returns sidebar data for admin role', () => {
    jest.spyOn(useRBACModule, 'useRBAC').mockImplementation(() => ({
      user: { Name: 'Test User', Email: 'test@example.com', Role: 'admin', permissions: [
        'dashboard:view',
        'customers:view',
        'settings:view',
        'admin:view',
      ] },
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
      result.current.navGroups.some(g => g.title === 'sidebar.groups.main')
    ).toBe(true);
    jest.restoreAllMocks();
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
    // Only dashboard permission
    jest.spyOn(useRBACModule, 'useRBAC').mockImplementation(() => ({
      user: { Name: 'Test User', Email: 'test@example.com', Role: 'user', permissions: ['dashboard:view'] },
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
      result.current.navGroups[0].items.some(i => i.title === 'sidebar.home')
    ).toBe(true);
    expect(
      result.current.navGroups[0].items.some(i => i.title === 'sidebar.customers.title')
    ).toBe(false);
    jest.restoreAllMocks();
  });
});
