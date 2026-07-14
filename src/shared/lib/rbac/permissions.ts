/**
 * Standard permission format: `resource:action`
 *
 * Features may re-export subsets; keep a single namespace across the app.
 */
export const PERMISSIONS = {
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_MANAGE_ROLES: 'users:manage_roles',
  USERS_EXPORT: 'users:export',

  BOOKINGS_READ: 'bookings:read',
  BOOKINGS_MANAGE: 'bookings:manage',

  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',

  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_SECURITY: 'settings:security',
  SETTINGS_BILLING: 'settings:billing',
  SETTINGS_NOTIFICATIONS: 'settings:notifications',

  ADMIN_DASHBOARD: 'admin:dashboard',
  ADMIN_SETTINGS: 'admin:settings',
  ADMIN_SYSTEM_LOGS: 'admin:system_logs',
} as const;

export type AppPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
