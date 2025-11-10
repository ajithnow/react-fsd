import { describe, it, expect } from '@jest/globals';
import {
  getAllPermissionsForRole,
  getAllPermissionsForUser,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRoleInfo,
  isRoleHigherThan,
  canManageUser,
  getMissingPermissions,
  canAccessFeature,
  hasRole,
  hasAnyRole,
  PERMISSIONS,
  ROLES,
  ROLE_PERMISSIONS,
} from '../rbac.utils';
import type { User } from '@/core';

// Mock users for testing
const adminUser: User = {
  Role: ROLES.SUPER_ADMIN,
  permissions: [],
};

const managerUser: User = {
  Role: ROLES.POWER_ADMIN,
  permissions: [],
};

const regularUser: User = {
  Role: ROLES.NORMAL_USER,
  permissions: [],
};

const userWithExtraPermissions: User = {
  Role: ROLES.NORMAL_USER,
  permissions: [PERMISSIONS.ADMIN_DASHBOARD],
};

describe('RBAC Utils - Comprehensive Tests', () => {
  describe('getAllPermissionsForRole', () => {
    it('should return permissions for admin role', () => {
      const permissions = getAllPermissionsForRole(ROLES.SUPER_ADMIN);

      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions.length).toBeGreaterThan(0);
      expect(permissions).toContain(PERMISSIONS.USERS_READ);
      expect(permissions).toContain(PERMISSIONS.ADMIN_DASHBOARD);
    });

    it('should return permissions for manager role', () => {
      const permissions = getAllPermissionsForRole(ROLES.POWER_ADMIN);

      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions).toContain(PERMISSIONS.USERS_READ);
      expect(permissions).toContain(PERMISSIONS.USERS_UPDATE);
      expect(permissions).not.toContain(PERMISSIONS.ADMIN_DASHBOARD);
      expect(permissions).not.toContain(PERMISSIONS.USERS_MANAGE_ROLES);
    });

    it('should return permissions for user role', () => {
      const permissions = getAllPermissionsForRole(ROLES.NORMAL_USER);

      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions).toContain(PERMISSIONS.PROFILE_READ);
      expect(permissions).not.toContain(PERMISSIONS.USERS_CREATE);
    });

    it('should return empty array for unknown role', () => {
      const permissions = getAllPermissionsForRole('unknown');

      expect(permissions).toEqual([]);
    });
  });

  describe('getAllPermissionsForUser', () => {
    it('should return permissions for admin user', () => {
      const permissions = getAllPermissionsForUser(adminUser);

      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions.length).toBeGreaterThan(0);
    });

    it('should return permissions for regular user', () => {
      const permissions = getAllPermissionsForUser(regularUser);

      expect(Array.isArray(permissions)).toBe(true);
    });

    it('should combine role and user-specific permissions', () => {
      const permissions = getAllPermissionsForUser(userWithExtraPermissions);

      expect(permissions).toContain(PERMISSIONS.PROFILE_READ); // From role
      expect(permissions).toContain(PERMISSIONS.ADMIN_DASHBOARD); // User-specific
    });

    it('should remove duplicate permissions', () => {
      const userWithDuplicate: User = {
        Role: ROLES.NORMAL_USER,
        permissions: [PERMISSIONS.PROFILE_READ], // Already in user role
      };

      const permissions = getAllPermissionsForUser(userWithDuplicate);
      const uniquePermissions = [...new Set(permissions)];

      expect(permissions.length).toBe(uniquePermissions.length);
    });

    it('should handle user without permissions property', () => {
      const userWithoutPermissions: User = {
        Role: ROLES.NORMAL_USER,
        // No permissions property
      };

      const permissions = getAllPermissionsForUser(userWithoutPermissions);
      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions.length).toBeGreaterThan(0);
    });
  });

  describe('hasPermission', () => {
    it('should return false for null user', () => {
      expect(hasPermission(null, PERMISSIONS.USERS_READ)).toBe(false);
    });

    it('should return true when admin has permission', () => {
      expect(hasPermission(adminUser, PERMISSIONS.USERS_READ)).toBe(true);
    });

    it('should return true when user has permission through role', () => {
      expect(hasPermission(regularUser, PERMISSIONS.PROFILE_READ)).toBe(true);
    });

    it('should return false when user lacks permission', () => {
      expect(hasPermission(regularUser, PERMISSIONS.USERS_CREATE)).toBe(false);
    });

    it('should return true when user has permission through user-specific permissions', () => {
      expect(
        hasPermission(userWithExtraPermissions, PERMISSIONS.ADMIN_DASHBOARD)
      ).toBe(true);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when user has at least one permission', () => {
      const permissions = [PERMISSIONS.USERS_CREATE, PERMISSIONS.PROFILE_READ];

      expect(hasAnyPermission(adminUser, permissions)).toBe(true);
      expect(hasAnyPermission(regularUser, permissions)).toBe(true);
    });

    it('should return false when user has none of the permissions', () => {
      const permissions = [
        PERMISSIONS.USERS_CREATE,
        PERMISSIONS.ADMIN_DASHBOARD,
      ];

      expect(hasAnyPermission(regularUser, permissions)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(hasAnyPermission(null, [PERMISSIONS.USERS_READ])).toBe(false);
    });

    it('should return false for empty permissions array', () => {
      expect(hasAnyPermission(adminUser, [])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when user has all permissions', () => {
      const permissions = [PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_READ];

      expect(hasAllPermissions(adminUser, permissions)).toBe(true);
    });

    it('should return false when user is missing some permissions', () => {
      const permissions = [PERMISSIONS.USERS_READ, PERMISSIONS.ADMIN_DASHBOARD];

      expect(hasAllPermissions(managerUser, permissions)).toBe(false); // Missing admin dashboard
    });

    it('should return false for null user', () => {
      expect(hasAllPermissions(null, [PERMISSIONS.USERS_READ])).toBe(false);
    });

    it('should return true for empty permissions array', () => {
      expect(hasAllPermissions(adminUser, [])).toBe(true);
    });
  });

  describe('getRoleInfo', () => {
    it('should return role info for admin', () => {
      const roleInfo = getRoleInfo(ROLES.SUPER_ADMIN);

      expect(roleInfo).toBeDefined();
      expect(roleInfo?.role).toBe(ROLES.SUPER_ADMIN);
      expect(roleInfo?.permissions).toContain(PERMISSIONS.ADMIN_DASHBOARD);
    });

    it('should return role info for manager', () => {
      const roleInfo = getRoleInfo(ROLES.POWER_ADMIN);

      expect(roleInfo).toBeDefined();
      expect(roleInfo?.role).toBe(ROLES.POWER_ADMIN);
      expect(roleInfo?.permissions).not.toContain(PERMISSIONS.ADMIN_DASHBOARD);
    });

    it('should return role info for user', () => {
      const roleInfo = getRoleInfo(ROLES.NORMAL_USER);

      expect(roleInfo).toBeDefined();
      expect(roleInfo?.role).toBe(ROLES.NORMAL_USER);
    });

    it('should return undefined for unknown role', () => {
      const roleInfo = getRoleInfo('unknown');

      expect(roleInfo).toBeUndefined();
    });
  });

  describe('isRoleHigherThan', () => {
    it('should correctly compare role hierarchy', () => {
      expect(isRoleHigherThan(ROLES.POWER_ADMIN, ROLES.SUPER_ADMIN)).toBe(true);
      expect(isRoleHigherThan(ROLES.NORMAL_USER, ROLES.SUPER_ADMIN)).toBe(true);
      expect(isRoleHigherThan(ROLES.NORMAL_USER, ROLES.POWER_ADMIN)).toBe(true);
    });

    it('should return false for equal or lower roles', () => {
      expect(isRoleHigherThan(ROLES.POWER_ADMIN, ROLES.NORMAL_USER)).toBe(
        false
      );
      expect(isRoleHigherThan(ROLES.SUPER_ADMIN, ROLES.POWER_ADMIN)).toBe(
        false
      );
      expect(isRoleHigherThan(ROLES.NORMAL_USER, ROLES.NORMAL_USER)).toBe(
        false
      );
    });

    it('should handle unknown roles gracefully', () => {
      expect(isRoleHigherThan('unknown', ROLES.NORMAL_USER)).toBe(false);
      expect(isRoleHigherThan(ROLES.SUPER_ADMIN, 'unknown')).toBe(true);
      expect(isRoleHigherThan('unknown1', 'unknown2')).toBe(false);
    });
  });

  describe('canManageUser', () => {
    const targetAdmin: User = { Role: ROLES.SUPER_ADMIN, permissions: [] };
    const targetManager: User = { Role: ROLES.POWER_ADMIN, permissions: [] };
    const targetUser: User = { Role: ROLES.NORMAL_USER, permissions: [] };

    it('should allow admin to manage everyone', () => {
      expect(canManageUser(adminUser, targetAdmin)).toBe(true);
      expect(canManageUser(adminUser, targetManager)).toBe(true);
      expect(canManageUser(adminUser, targetUser)).toBe(true);
    });

    it('should NOT allow manager to manage users (no USERS_MANAGE_ROLES permission)', () => {
      // Based on current config, manager doesn't have USERS_MANAGE_ROLES
      expect(canManageUser(managerUser, targetUser)).toBe(false);
      expect(canManageUser(managerUser, targetManager)).toBe(false);
      expect(canManageUser(managerUser, targetAdmin)).toBe(false);
    });

    it('should not allow regular users to manage anyone', () => {
      expect(canManageUser(regularUser, targetUser)).toBe(false);
      expect(canManageUser(regularUser, targetManager)).toBe(false);
      expect(canManageUser(regularUser, targetAdmin)).toBe(false);
    });

    it('should return false for null current user', () => {
      expect(canManageUser(null, targetUser)).toBe(false);
    });

    it('should check for manage roles permission first', () => {
      const userWithoutManagePermission: User = {
        Role: 'special',
        permissions: [PERMISSIONS.USERS_READ], // No USERS_MANAGE_ROLES
      };

      expect(canManageUser(userWithoutManagePermission, targetUser)).toBe(
        false
      );
    });
  });

  describe('getMissingPermissions', () => {
    it('should return missing permissions for user', () => {
      const required = [PERMISSIONS.USERS_CREATE, PERMISSIONS.PROFILE_READ];
      const missing = getMissingPermissions(regularUser, required);

      expect(missing).toContain(PERMISSIONS.USERS_CREATE);
      expect(missing).not.toContain(PERMISSIONS.PROFILE_READ);
    });

    it('should return empty array when user has all permissions', () => {
      const required = [PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_READ];
      const missing = getMissingPermissions(adminUser, required);

      expect(missing).toEqual([]);
    });

    it('should return all permissions for null user', () => {
      const required = [PERMISSIONS.USERS_READ, PERMISSIONS.PROFILE_READ];
      const missing = getMissingPermissions(null, required);

      expect(missing).toEqual(required);
    });

    it('should handle empty required permissions', () => {
      const missing = getMissingPermissions(regularUser, []);

      expect(missing).toEqual([]);
    });
  });

  describe('canAccessFeature', () => {
    it('should return true when user has any required permission', () => {
      const featurePerms = [
        PERMISSIONS.USERS_READ,
        PERMISSIONS.ADMIN_DASHBOARD,
      ];

      expect(canAccessFeature(adminUser, featurePerms)).toBe(true); // Has both
      expect(canAccessFeature(managerUser, featurePerms)).toBe(true); // Has USERS_READ
    });

    it('should return false when user has no required permissions', () => {
      const featurePerms = [
        PERMISSIONS.USERS_CREATE,
        PERMISSIONS.ADMIN_DASHBOARD,
      ];

      expect(canAccessFeature(regularUser, featurePerms)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(canAccessFeature(null, [PERMISSIONS.USERS_READ])).toBe(false);
    });

    it('should return false for empty feature permissions', () => {
      expect(canAccessFeature(adminUser, [])).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the role', () => {
      expect(hasRole(adminUser, ROLES.SUPER_ADMIN)).toBe(true);
      expect(hasRole(regularUser, ROLES.NORMAL_USER)).toBe(true);
      expect(hasRole(managerUser, ROLES.POWER_ADMIN)).toBe(true);
    });

    it('should return false when user does not have the role', () => {
      expect(hasRole(adminUser, ROLES.NORMAL_USER)).toBe(false);
      expect(hasRole(regularUser, ROLES.SUPER_ADMIN)).toBe(false);
      expect(hasRole(managerUser, ROLES.NORMAL_USER)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(hasRole(null, ROLES.SUPER_ADMIN)).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true when user has any of the roles', () => {
      const roles = [ROLES.SUPER_ADMIN, ROLES.POWER_ADMIN];

      expect(hasAnyRole(adminUser, roles)).toBe(true);
      expect(hasAnyRole(managerUser, roles)).toBe(true);
    });

    it('should return false when user has none of the roles', () => {
      const roles = [ROLES.SUPER_ADMIN, ROLES.POWER_ADMIN];

      expect(hasAnyRole(regularUser, roles)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(hasAnyRole(null, [ROLES.SUPER_ADMIN])).toBe(false);
    });

    it('should return false for empty roles array', () => {
      expect(hasAnyRole(adminUser, [])).toBe(false);
    });

    it('should handle single role in array', () => {
      expect(hasAnyRole(adminUser, [ROLES.SUPER_ADMIN])).toBe(true);
      expect(hasAnyRole(adminUser, [ROLES.NORMAL_USER])).toBe(false);
    });
  });
  describe('Constants', () => {
    it('should have PERMISSIONS defined', () => {
      expect(PERMISSIONS).toBeDefined();
      expect(typeof PERMISSIONS.USERS_READ).toBe('string');
      expect(typeof PERMISSIONS.ADMIN_DASHBOARD).toBe('string');
      expect(typeof PERMISSIONS.PROFILE_READ).toBe('string');
      expect(typeof PERMISSIONS.USERS_CREATE).toBe('string');
      expect(typeof PERMISSIONS.USERS_UPDATE).toBe('string');
      expect(typeof PERMISSIONS.USERS_DELETE).toBe('string');
    });

    it('should have ROLES defined', () => {
      expect(ROLES).toBeDefined();
      expect(ROLES.SUPER_ADMIN).toBe('SUPER_ADMIN');
      expect(ROLES.POWER_ADMIN).toBe('POWER_ADMIN');
      expect(ROLES.NORMAL_USER).toBe('NORMAL_USER');
    });

    it('should have ROLE_PERMISSIONS defined', () => {
      expect(ROLE_PERMISSIONS).toBeDefined();
      expect(ROLE_PERMISSIONS[ROLES.SUPER_ADMIN]).toBeDefined();
      expect(Array.isArray(ROLE_PERMISSIONS[ROLES.SUPER_ADMIN])).toBe(true);
      expect(ROLE_PERMISSIONS[ROLES.POWER_ADMIN]).toBeDefined();
      expect(Array.isArray(ROLE_PERMISSIONS[ROLES.POWER_ADMIN])).toBe(true);
      expect(ROLE_PERMISSIONS[ROLES.NORMAL_USER]).toBeDefined();
      expect(Array.isArray(ROLE_PERMISSIONS[ROLES.NORMAL_USER])).toBe(true);
    });

    it('should have consistent permission strings', () => {
      expect(PERMISSIONS.USERS_READ).toBe('users:read');
      expect(PERMISSIONS.USERS_CREATE).toBe('users:create');
      expect(PERMISSIONS.PROFILE_READ).toBe('profile:read');
      expect(PERMISSIONS.ADMIN_DASHBOARD).toBe('admin:dashboard');
    });

    it('should have admin role with all permissions', () => {
      const adminPermissions = ROLE_PERMISSIONS[ROLES.SUPER_ADMIN];
      expect(adminPermissions).toContain(PERMISSIONS.USERS_READ);
      expect(adminPermissions).toContain(PERMISSIONS.USERS_CREATE);
      expect(adminPermissions).toContain(PERMISSIONS.ADMIN_DASHBOARD);
      expect(adminPermissions.length).toBeGreaterThan(5);
    });

    it('should have manager role with limited permissions', () => {
      const managerPermissions = ROLE_PERMISSIONS[ROLES.POWER_ADMIN];
      expect(managerPermissions).toContain(PERMISSIONS.USERS_READ);
      expect(managerPermissions).toContain(PERMISSIONS.USERS_UPDATE);
      expect(managerPermissions).not.toContain(PERMISSIONS.ADMIN_DASHBOARD);
      expect(managerPermissions).not.toContain(PERMISSIONS.USERS_MANAGE_ROLES);
      expect(managerPermissions.length).toBeLessThan(
        ROLE_PERMISSIONS[ROLES.SUPER_ADMIN].length
      );
    });

    it('should have user role with basic permissions', () => {
      const userPermissions = ROLE_PERMISSIONS[ROLES.NORMAL_USER];
      expect(userPermissions).toContain(PERMISSIONS.PROFILE_READ);
      expect(userPermissions).not.toContain(PERMISSIONS.USERS_CREATE);
      expect(userPermissions.length).toBeLessThan(
        ROLE_PERMISSIONS[ROLES.POWER_ADMIN].length
      );
    });
  });

  // Edge cases and error handling
  describe('Edge Cases', () => {
    it('should handle createRolePermissionsConfig internal function', () => {
      // Test that the internal config creation works by checking getRoleInfo
      const adminInfo = getRoleInfo(ROLES.SUPER_ADMIN);
      expect(adminInfo).toBeDefined();
      expect(adminInfo?.permissions).toBeDefined();
      expect(Array.isArray(adminInfo?.permissions)).toBe(true);
    });

    it('should handle users with undefined permissions gracefully', () => {
      const userWithUndefinedPermissions: User = {
        Role: ROLES.NORMAL_USER,
        permissions: undefined,
      };

      const permissions = getAllPermissionsForUser(
        userWithUndefinedPermissions
      );
      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions.length).toBeGreaterThan(0);
    });

    it('should handle unknown role in hierarchy comparison', () => {
      expect(isRoleHigherThan('nonexistent', 'also nonexistent')).toBe(false);
    });

    it('should maintain permission uniqueness in user aggregation', () => {
      const userWithManyDuplicates: User = {
        Role: ROLES.NORMAL_USER,
        permissions: [
          PERMISSIONS.PROFILE_READ, // Duplicate from role
          PERMISSIONS.PROFILE_READ, // Another duplicate
          PERMISSIONS.ADMIN_DASHBOARD, // Unique
        ],
      };

      const permissions = getAllPermissionsForUser(userWithManyDuplicates);
      const profileReadCount = permissions.filter(
        p => p === PERMISSIONS.PROFILE_READ
      ).length;
      expect(profileReadCount).toBe(1); // Should be deduplicated
    });
  });
});
