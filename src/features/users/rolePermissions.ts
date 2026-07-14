import { ROLES } from '@/shared/lib/rbac';
import { USER_PERMISSIONS } from './constants/permissions.constants';

/** Fallback role map for when `/me` does not return permissions. */
export const usersRolePermissions = {
  [ROLES.ADMIN]: [
    USER_PERMISSIONS.USER_READ,
    USER_PERMISSIONS.USER_CREATE,
    USER_PERMISSIONS.USER_UPDATE,
    USER_PERMISSIONS.USER_DELETE,
    USER_PERMISSIONS.USER_EXPORT,
  ],
  [ROLES.EDITOR]: [
    USER_PERMISSIONS.USER_READ,
    USER_PERMISSIONS.USER_CREATE,
    USER_PERMISSIONS.USER_UPDATE,
  ],
  [ROLES.VIEWER]: [USER_PERMISSIONS.USER_READ],
} as const;
