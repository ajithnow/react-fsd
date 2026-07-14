import { ROLES } from '@/shared/lib/rbac';
import type { Permission } from '@/shared/lib/rbac';
import { AUTH_PERMISSIONS } from './permissions.constants';

/**
 * Default role → permission map for the open-source template.
 * Override via `setRolePermissions` or return `permissions` from the me/profile API.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(AUTH_PERMISSIONS),
  [ROLES.POWER_ADMIN]: [
    AUTH_PERMISSIONS.PROFILE_READ,
    AUTH_PERMISSIONS.PROFILE_UPDATE,
    AUTH_PERMISSIONS.USERS_READ,
    AUTH_PERMISSIONS.USERS_CREATE,
    AUTH_PERMISSIONS.USERS_UPDATE,
    AUTH_PERMISSIONS.ADMIN_DASHBOARD,
    AUTH_PERMISSIONS.SETTINGS_READ,
    AUTH_PERMISSIONS.SETTINGS_UPDATE,
  ],
  [ROLES.NORMAL_USER]: [
    AUTH_PERMISSIONS.PROFILE_READ,
    AUTH_PERMISSIONS.PROFILE_UPDATE,
    AUTH_PERMISSIONS.SETTINGS_READ,
  ],
};

let rolePermissions: Record<string, Permission[]> = { ...DEFAULT_ROLE_PERMISSIONS };

/** Replace the entire role→permission map (e.g. CaptureHire Admin/Ops maps). */
export const setRolePermissions = (
  next: Record<string, Permission[]>
): void => {
  rolePermissions = { ...next };
};

export const getRolePermissionsMap = (): Record<string, Permission[]> =>
  rolePermissions;

/**
 * Resolve permissions for a role.
 * API-supplied permissions win when present; otherwise fall back to the map.
 */
export const resolvePermissions = (
  role: string,
  fromApi?: Permission[] | null
): Permission[] => {
  if (fromApi && fromApi.length > 0) {
    return [...fromApi];
  }
  return rolePermissions[role] ?? [];
};
