/** User feature permissions — owned by this module (`resource:action`). */
export const USER_PERMISSIONS = {
  USER_READ: 'users:read',
  USER_CREATE: 'users:create',
  USER_UPDATE: 'users:update',
  USER_DELETE: 'users:delete',
  USER_EXPORT: 'users:export',
} as const;
