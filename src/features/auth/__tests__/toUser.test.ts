import { describe, it, expect, beforeEach } from 'vitest';
import { toUser } from '../toUser';
import {
  resolvePermissions,
  setRolePermissions,
  DEFAULT_ROLE_PERMISSIONS,
  AUTH_PERMISSIONS,
} from '../constants';
import { ROLES } from '@/shared/lib/rbac';
import type { MeResponse } from '../types';

describe('toUser', () => {
  beforeEach(() => {
    setRolePermissions({ ...DEFAULT_ROLE_PERMISSIONS });
  });

  it('maps /me into a session user and resolves permissions from role', () => {
    const me: MeResponse = {
      id: '42',
      firstName: 'Ada',
      lastName: 'Admin',
      email: 'ada@example.com',
      role: ROLES.ADMIN,
      status: 'active',
    };

    const user = toUser(me);

    expect(user).toMatchObject({
      id: '42',
      firstName: 'Ada',
      lastName: 'Admin',
      email: 'ada@example.com',
      name: 'Ada Admin',
      role: ROLES.ADMIN,
      roles: [ROLES.ADMIN],
      status: 'active',
    });
    expect(user.permissions).toEqual(
      expect.arrayContaining([AUTH_PERMISSIONS.ADMIN_DASHBOARD])
    );
  });

  it('prefers API permissions over the role map', () => {
    const user = toUser({
      id: '1',
      email: 'v@example.com',
      role: ROLES.VIEWER,
      permissions: [AUTH_PERMISSIONS.ADMIN_SYSTEM_LOGS],
    });

    expect(user.permissions).toEqual([AUTH_PERMISSIONS.ADMIN_SYSTEM_LOGS]);
  });

  it('uses roles[] and fullName when role/name are omitted', () => {
    const user = toUser({
      id: 'u1',
      email: 'priya@example.com',
      fullName: 'Priya Admin',
      roles: ['admin'],
      permissions: ['users:read', 'admin:dashboard'],
      status: 'Active',
    });

    expect(user).toMatchObject({
      id: 'u1',
      name: 'Priya Admin',
      email: 'priya@example.com',
      role: 'admin',
      roles: ['admin'],
      permissions: ['users:read', 'admin:dashboard'],
      status: 'Active',
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
