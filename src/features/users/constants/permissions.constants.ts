import { PERMISSIONS } from '@/shared/lib/rbac';

/** User feature permissions — same `resource:action` namespace as shared RBAC. */
export const USER_PERMISSIONS = {
  USER_READ: PERMISSIONS.USERS_READ,
  USER_CREATE: PERMISSIONS.USERS_CREATE,
  USER_UPDATE: PERMISSIONS.USERS_UPDATE,
  USER_DELETE: PERMISSIONS.USERS_DELETE,
  USER_EXPORT: PERMISSIONS.USERS_EXPORT,
} as const;
