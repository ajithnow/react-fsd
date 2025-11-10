// User feature permissions

export const USER_PERMISSIONS = {
  // User management
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_EXPORT: 'user:export',

  // User reports
  USER_REPORTS_VIEW: 'user:reports_view',
  USER_REPORTS_EXPORT: 'user:reports_export',
} as const;
