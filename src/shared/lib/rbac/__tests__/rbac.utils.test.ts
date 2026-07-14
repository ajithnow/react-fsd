import {
  getAllPermissionsForUser,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isRoleHigherThan,
  getMissingPermissions,
  canAccessFeature,
  hasRole,
  hasAnyRole,
  ROLES,
  PERMISSIONS,
  setRbacEnabled,
  isRbacEnabled,
} from '../utils';
import type { User } from '../types';

const adminUser: User = {
  role: ROLES.ADMIN,
  roles: [ROLES.ADMIN],
  permissions: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.ADMIN_DASHBOARD,
  ],
};

const editorUser: User = {
  role: ROLES.EDITOR,
  roles: [ROLES.EDITOR],
  permissions: [PERMISSIONS.USERS_READ, PERMISSIONS.USERS_UPDATE],
};

const viewerUser: User = {
  role: ROLES.VIEWER,
  roles: [ROLES.VIEWER],
  permissions: [PERMISSIONS.PROFILE_READ],
};

const viewerWithExtra: User = {
  role: ROLES.VIEWER,
  roles: [ROLES.VIEWER],
  permissions: [PERMISSIONS.PROFILE_READ, PERMISSIONS.ADMIN_DASHBOARD],
};

describe('RBAC Utils', () => {
  beforeEach(() => {
    setRbacEnabled(true);
  });

  afterEach(() => {
    setRbacEnabled(undefined);
  });
  describe('getAllPermissionsForUser', () => {
    it('returns empty array for null user', () => {
      expect(getAllPermissionsForUser(null)).toEqual([]);
    });

    it('returns user permissions', () => {
      const permissions = getAllPermissionsForUser(adminUser);
      expect(permissions).toContain(PERMISSIONS.USERS_READ);
      expect(permissions).toContain(PERMISSIONS.USERS_CREATE);
      expect(permissions).toContain(PERMISSIONS.ADMIN_DASHBOARD);
    });

    it('returns viewer permissions', () => {
      const permissions = getAllPermissionsForUser(viewerUser);
      expect(permissions).toContain(PERMISSIONS.PROFILE_READ);
    });

    it('returns extended viewer permissions', () => {
      const permissions = getAllPermissionsForUser(viewerWithExtra);
      expect(permissions).toContain(PERMISSIONS.PROFILE_READ);
      expect(permissions).toContain(PERMISSIONS.ADMIN_DASHBOARD);
    });
  });

  describe('hasPermission', () => {
    it('returns false for null user', () => {
      expect(hasPermission(null, PERMISSIONS.USERS_READ)).toBe(false);
    });

    it('returns true when user has permission', () => {
      expect(hasPermission(adminUser, PERMISSIONS.USERS_READ)).toBe(true);
    });

    it('returns true for profile read on viewer', () => {
      expect(hasPermission(viewerUser, PERMISSIONS.PROFILE_READ)).toBe(true);
    });

    it('returns false when user lacks permission', () => {
      expect(hasPermission(viewerUser, PERMISSIONS.USERS_CREATE)).toBe(false);
    });

    it('returns true for extra permission on viewer', () => {
      expect(
        hasPermission(viewerWithExtra, PERMISSIONS.ADMIN_DASHBOARD)
      ).toBe(true);
    });
  });

  describe('hasAnyPermission', () => {
    it('returns true if any permission matches', () => {
      const permissions = [PERMISSIONS.USERS_CREATE, PERMISSIONS.PROFILE_READ];
      expect(hasAnyPermission(adminUser, permissions)).toBe(true);
      expect(hasAnyPermission(viewerUser, permissions)).toBe(true);
    });

    it('returns false if none match', () => {
      const permissions = [
        PERMISSIONS.USERS_CREATE,
        PERMISSIONS.ADMIN_DASHBOARD,
      ];
      expect(hasAnyPermission(viewerUser, permissions)).toBe(false);
    });

    it('returns false for null user', () => {
      expect(hasAnyPermission(null, [PERMISSIONS.USERS_READ])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('returns true when all permissions present', () => {
      const permissions = [PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_READ];
      expect(hasAllPermissions(adminUser, permissions)).toBe(true);
    });

    it('returns false when any permission missing', () => {
      const permissions = [
        PERMISSIONS.USERS_READ,
        PERMISSIONS.ADMIN_DASHBOARD,
      ];
      expect(hasAllPermissions(editorUser, permissions)).toBe(false);
    });

    it('returns false for null user', () => {
      expect(hasAllPermissions(null, [PERMISSIONS.USERS_READ])).toBe(false);
    });
  });

  describe('isRoleHigherThan', () => {
    it('returns true for higher roles', () => {
      expect(isRoleHigherThan(ROLES.EDITOR, ROLES.VIEWER)).toBe(true);
      expect(isRoleHigherThan(ROLES.ADMIN, ROLES.VIEWER)).toBe(true);
      expect(isRoleHigherThan(ROLES.ADMIN, ROLES.EDITOR)).toBe(true);
    });

    it('returns false for lower or equal roles', () => {
      expect(isRoleHigherThan(ROLES.VIEWER, ROLES.EDITOR)).toBe(false);
      expect(isRoleHigherThan(ROLES.EDITOR, ROLES.ADMIN)).toBe(false);
      expect(isRoleHigherThan(ROLES.VIEWER, ROLES.VIEWER)).toBe(false);
    });

    it('handles unknown roles', () => {
      expect(isRoleHigherThan('unknown', ROLES.VIEWER)).toBe(false);
      expect(isRoleHigherThan(ROLES.ADMIN, 'unknown')).toBe(true);
    });
  });

  describe('getMissingPermissions', () => {
    it('returns missing permissions', () => {
      const required = [PERMISSIONS.USERS_CREATE, PERMISSIONS.PROFILE_READ];
      const missing = getMissingPermissions(viewerUser, required);
      expect(missing).toContain(PERMISSIONS.USERS_CREATE);
      expect(missing).not.toContain(PERMISSIONS.PROFILE_READ);
    });

    it('returns all required when user is null', () => {
      const required = [PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_READ];
      expect(getMissingPermissions(null, required)).toEqual(required);
    });

    it('returns empty when user has all', () => {
      const required = [PERMISSIONS.USERS_READ, PERMISSIONS.USERS_CREATE];
      expect(getMissingPermissions(adminUser, required)).toEqual([]);
    });
  });

  describe('canAccessFeature', () => {
    it('returns true when any feature permission matches', () => {
      expect(
        canAccessFeature(adminUser, [
          PERMISSIONS.USERS_READ,
          PERMISSIONS.ADMIN_DASHBOARD,
        ])
      ).toBe(true);
    });

    it('returns false when none match', () => {
      expect(
        canAccessFeature(viewerUser, [
          PERMISSIONS.USERS_CREATE,
          PERMISSIONS.ADMIN_DASHBOARD,
        ])
      ).toBe(false);
    });

    it('returns false for null user', () => {
      expect(canAccessFeature(null, [PERMISSIONS.USERS_READ])).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('returns true for matching role', () => {
      expect(hasRole(adminUser, ROLES.ADMIN)).toBe(true);
      expect(hasRole(viewerUser, ROLES.VIEWER)).toBe(true);
      expect(hasRole(editorUser, ROLES.EDITOR)).toBe(true);
    });

    it('returns false for non-matching role', () => {
      expect(hasRole(adminUser, ROLES.VIEWER)).toBe(false);
      expect(hasRole(viewerUser, ROLES.ADMIN)).toBe(false);
      expect(hasRole(editorUser, ROLES.VIEWER)).toBe(false);
    });

    it('returns false for null user', () => {
      expect(hasRole(null, ROLES.ADMIN)).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('returns true when any role matches', () => {
      const roles = [ROLES.ADMIN, ROLES.EDITOR];
      expect(hasAnyRole(adminUser, roles)).toBe(true);
      expect(hasAnyRole(editorUser, roles)).toBe(true);
    });

    it('returns false when none match', () => {
      const roles = [ROLES.ADMIN, ROLES.EDITOR];
      expect(hasAnyRole(viewerUser, roles)).toBe(false);
    });

    it('returns false for null user', () => {
      expect(hasAnyRole(null, [ROLES.ADMIN])).toBe(false);
    });

    it('checks single role lists', () => {
      expect(hasAnyRole(adminUser, [ROLES.ADMIN])).toBe(true);
      expect(hasAnyRole(adminUser, [ROLES.VIEWER])).toBe(false);
    });
  });

  describe('RBAC_ENABLED bypass', () => {
    it('allows all permission and role checks when disabled', () => {
      setRbacEnabled(false);

      expect(isRbacEnabled()).toBe(false);
      expect(hasPermission(null, PERMISSIONS.USERS_READ)).toBe(true);
      expect(hasRole(null, ROLES.ADMIN)).toBe(true);
      expect(hasAnyPermission(null, [PERMISSIONS.USERS_CREATE])).toBe(true);
      expect(getMissingPermissions(null, [PERMISSIONS.USERS_READ])).toEqual([]);
    });
  });

  describe('ROLES constants', () => {
    it('exposes standard role values', () => {
      expect(ROLES.ADMIN).toBe('admin');
      expect(ROLES.EDITOR).toBe('editor');
      expect(ROLES.VIEWER).toBe('viewer');
    });
  });
});
