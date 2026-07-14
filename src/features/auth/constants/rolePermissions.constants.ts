import { ROLES, PERMISSIONS } from '@/shared/lib/rbac';
import type { Permission } from '@/shared/lib/rbac';

/**
 * Default role → permission map for the open-source template.
 *
 * Host apps should either:
 * - return `permissions` from `/api/auth/me`, or
 * - call `setRolePermissions` with their own map
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.EDITOR]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.ADMIN_DASHBOARD,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.ADMIN_DASHBOARD,
  ],
};

let rolePermissions: Record<string, Permission[]> = {
  ...DEFAULT_ROLE_PERMISSIONS,
};

/** Replace the entire role→permission map for a host project. */
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
