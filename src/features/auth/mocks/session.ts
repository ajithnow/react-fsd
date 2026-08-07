import type { MeResponse } from '../types';

export const ACCESS_TOKEN = 'mock-access-token';
export const REFRESH_TOKEN = 'mock-refresh-token';

/** Dev-only demo login — mutable so the settings change-password mock can update it. */
export const demoCredentials = {
  email: 'admin@example.com',
  password: 'password123',
};

/** Every permission string used anywhere in the app, so the demo user exercises real RBAC gating. */
export const demoPermissions = [
  'bookings:read',
  'bookings:manage',
  'users:read',
  'users:create',
  'users:update',
  'users:delete',
  'users:export',
];

/**
 * Mutable session profile behind `GET /api/auth/me`. Other features' mocks
 * (e.g. settings' profile update) mutate this directly so the session stays
 * consistent across feature boundaries.
 */
export const demoProfile: MeResponse = {
  id: '1',
  email: demoCredentials.email,
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  roles: ['admin'],
  permissions: demoPermissions,
  status: 'active',
};

export function isAuthorized(request: Request): boolean {
  return request.headers.get('Authorization') === `Bearer ${ACCESS_TOKEN}`;
}
