import { describe, it, expect } from 'vitest';
import { toUser } from '../toUser';
import type { MeResponse } from '../types';

describe('toUser', () => {
  it('maps /me into a session user with API permissions', () => {
    const me: MeResponse = {
      id: '42',
      firstName: 'Ada',
      lastName: 'Admin',
      email: 'ada@example.com',
      role: 'admin',
      status: 'active',
      permissions: ['admin:dashboard', 'users:read'],
    };

    const user = toUser(me);

    expect(user).toMatchObject({
      id: '42',
      firstName: 'Ada',
      lastName: 'Admin',
      email: 'ada@example.com',
      name: 'Ada Admin',
      role: 'admin',
      roles: ['admin'],
      status: 'active',
      permissions: ['admin:dashboard', 'users:read'],
    });
  });

  it('uses empty permissions when /me omits them', () => {
    const user = toUser({
      id: '1',
      email: 'v@example.com',
      role: 'viewer',
    });

    expect(user.permissions).toEqual([]);
  });

  it('keeps API permissions as provided', () => {
    const user = toUser({
      id: '1',
      email: 'v@example.com',
      role: 'viewer',
      permissions: ['admin:system_logs'],
    });

    expect(user.permissions).toEqual(['admin:system_logs']);
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
