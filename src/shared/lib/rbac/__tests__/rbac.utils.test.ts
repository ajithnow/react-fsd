import {
  getAllPermissionsForUser,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getMissingPermissions,
  setRbacEnabled,
  isRbacEnabled,
} from '../utils';
import type { User } from '../types';

const adminUser: User = {
  permissions: ['admin:dashboard', 'profile:read', 'users:read', 'users:create'],
};

const viewerUser: User = {
  permissions: ['profile:read'],
};

describe('RBAC Utils', () => {
  beforeEach(() => {
    setRbacEnabled(true);
  });

  afterEach(() => {
    setRbacEnabled(undefined);
  });

  describe('getAllPermissionsForUser', () => {
    it('returns empty for null user', () => {
      expect(getAllPermissionsForUser(null)).toEqual([]);
    });

    it('returns user permissions', () => {
      expect(getAllPermissionsForUser(adminUser)).toContain('users:read');
      expect(getAllPermissionsForUser(viewerUser)).toContain('profile:read');
    });
  });

  describe('hasPermission', () => {
    it('denies null user', () => {
      expect(hasPermission(null, 'users:read')).toBe(false);
    });

    it('allows when present and denies when missing', () => {
      expect(hasPermission(adminUser, 'users:read')).toBe(true);
      expect(hasPermission(viewerUser, 'users:create')).toBe(false);
    });
  });

  describe('hasAnyPermission / hasAllPermissions', () => {
    it('checks combinations', () => {
      expect(
        hasAnyPermission(viewerUser, ['users:create', 'profile:read'])
      ).toBe(true);
      expect(hasAllPermissions(adminUser, ['users:read', 'users:create'])).toBe(
        true
      );
      expect(
        hasAllPermissions(viewerUser, ['profile:read', 'users:create'])
      ).toBe(false);
    });
  });

  describe('getMissingPermissions', () => {
    it('returns missing perms', () => {
      expect(
        getMissingPermissions(viewerUser, ['users:create', 'profile:read'])
      ).toEqual(['users:create']);
    });
  });

  describe('RBAC_ENABLED bypass', () => {
    it('allows all checks when disabled', () => {
      setRbacEnabled(false);
      expect(isRbacEnabled()).toBe(false);
      expect(hasPermission(null, 'users:read')).toBe(true);
      expect(getMissingPermissions(null, ['users:read'])).toEqual([]);
    });
  });
});
