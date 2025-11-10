import { renderHook } from '@testing-library/react';
import { useSidebarData } from '../useSidebar';
import * as useRBACModule from '../useRBAC';

// Mock useRBAC
jest.mock('../useRBAC', () => ({
  useRBAC: jest.fn(() => ({
    user: { name: 'Test User', email: 'test@example.com', role: 'user' },
    permissions: ['dashboard:view', 'customers:view', 'settings:view'],
  })),
}));

// Mock useAuthStore
jest.mock('../../../features/auth/stores/auth.store', () => ({
  useAuthStore: {
    getState: () => ({
      user: { name: 'Test User', email: 'test@example.com', role: 'user' },
    }),
  },
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
      user: { name: 'Test User', email: 'test@example.com', Role: 'admin' },
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
      result.current.navGroups.some(g => g.title === 'Administration')
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
      user: { name: 'Test User', email: 'test@example.com', Role: 'user' },
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
      result.current.navGroups[0].items.some(i => i.title === 'Home')
    ).toBe(true);
    expect(
      result.current.navGroups[0].items.some(i => i.title === 'Customers')
    ).toBe(false);
    jest.restoreAllMocks();
  });
});
