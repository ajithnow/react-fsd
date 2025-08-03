// Auth feature permissions

export const AUTH_PERMISSIONS = {
  // User management
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_MANAGE_ROLES: 'users:manage_roles',

  // Profile management
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',

  // Settings management
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_SECURITY: 'settings:security',
  SETTINGS_BILLING: 'settings:billing',
  SETTINGS_NOTIFICATIONS: 'settings:notifications',

  // Admin features
  ADMIN_DASHBOARD: 'admin:dashboard',
  ADMIN_SETTINGS: 'admin:settings',
  ADMIN_SYSTEM_LOGS: 'admin:system_logs',
} as const;
