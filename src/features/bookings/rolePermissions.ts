import { ROLES } from '@/shared/lib/rbac';
import { BOOKING_PERMISSIONS } from './constants';

/** Fallback role map for when `/me` does not return permissions. */
export const bookingsRolePermissions = {
  [ROLES.ADMIN]: [BOOKING_PERMISSIONS.READ, BOOKING_PERMISSIONS.MANAGE],
  [ROLES.EDITOR]: [BOOKING_PERMISSIONS.READ],
  [ROLES.VIEWER]: [BOOKING_PERMISSIONS.READ],
} as const;
