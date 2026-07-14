import { describe, it, expect, beforeEach } from 'vitest';
import {
  defaultMapProfileToUser,
  mapProfileToUser,
  setProfileMapper,
  resetProfileMapper,
  unwrapProfilePayload,
} from '../profile.mapper';
import {
  resolvePermissions,
  setRolePermissions,
  DEFAULT_ROLE_PERMISSIONS,
} from '../../constants/rolePermissions.constants';
import { AUTH_PERMISSIONS } from '../../constants/permissions.constants';
import { ROLES } from '@/shared/lib/rbac';

describe('profile.mapper', () => {
  beforeEach(() => {
    resetProfileMapper();
    setRolePermissions({ ...DEFAULT_ROLE_PERMISSIONS });
  });

  describe('unwrapProfilePayload', () => {
    it('unwraps data envelopes', () => {
      expect(unwrapProfilePayload({ data: { email: 'a@b.com' } })).toEqual({
        email: 'a@b.com',
      });
    });

    it('unwraps nested user objects', () => {
      expect(
        unwrapProfilePayload({ data: { user: { FirstName: 'Ada' } } })
      ).toEqual({ FirstName: 'Ada' });
    });
  });

  describe('defaultMapProfileToUser', () => {
    it('maps camelCase me payloads and resolves permissions from role', () => {
      const user = defaultMapProfileToUser({
        data: {
          id: '42',
          firstName: 'Ada',
          lastName: 'Admin',
          email: 'ada@example.com',
          role: ROLES.SUPER_ADMIN,
          status: 'active',
        },
      });

      expect(user).toMatchObject({
        Id: '42',
        FirstName: 'Ada',
        LastName: 'Admin',
        Email: 'ada@example.com',
        Name: 'Ada Admin',
        Role: ROLES.SUPER_ADMIN,
        Status: 'active',
      });
      expect(user.permissions).toEqual(
        expect.arrayContaining([AUTH_PERMISSIONS.ADMIN_DASHBOARD])
      );
    });

    it('prefers API permissions over role map', () => {
      const user = defaultMapProfileToUser({
        Role: ROLES.NORMAL_USER,
        permissions: [AUTH_PERMISSIONS.ADMIN_SYSTEM_LOGS],
      });

      expect(user.permissions).toEqual([AUTH_PERMISSIONS.ADMIN_SYSTEM_LOGS]);
    });

    it('maps CaptureHire-like PascalCase ProfileResponse', () => {
      const user = defaultMapProfileToUser({
        data: {
          Id: 'p1',
          UserId: 'u1',
          FullName: 'Priya Creative',
          Email: 'priya@capturehire.test',
          Role: 'Admin',
          Status: 'Active',
        },
      });

      expect(user.Name).toBe('Priya Creative');
      expect(user.Email).toBe('priya@capturehire.test');
      expect(user.Role).toBe('Admin');
      expect(user.Id).toBe('p1');
    });
  });

  describe('setProfileMapper', () => {
    it('allows host projects to swap the mapper', () => {
      setProfileMapper(() => ({
        Role: 'Custom',
        permissions: ['custom:perm'],
        Name: 'Custom User',
      }));

      expect(mapProfileToUser({})).toEqual({
        Role: 'Custom',
        permissions: ['custom:perm'],
        Name: 'Custom User',
      });
    });
  });
});

describe('resolvePermissions', () => {
  beforeEach(() => {
    setRolePermissions({ ...DEFAULT_ROLE_PERMISSIONS });
  });

  it('returns empty array for unknown roles without API perms', () => {
    expect(resolvePermissions('Unknown')).toEqual([]);
  });

  it('uses custom role maps when set', () => {
    setRolePermissions({ Ops: ['profiles:approve'] });
    expect(resolvePermissions('Ops')).toEqual(['profiles:approve']);
  });
});
