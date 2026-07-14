import type { Permission } from './types';
import { PERMISSIONS } from './permissions';
import { ROLES } from './roles';

/**
 * Shell defaults only. Features merge their own via `FeatureConfig.rolePermissions`.
 * API `/me` permissions still win in `resolvePermissions`.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.SETTINGS_SECURITY,
    PERMISSIONS.SETTINGS_BILLING,
    PERMISSIONS.SETTINGS_NOTIFICATIONS,
    PERMISSIONS.ADMIN_DASHBOARD,
    PERMISSIONS.ADMIN_SETTINGS,
    PERMISSIONS.ADMIN_SYSTEM_LOGS,
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.ADMIN_DASHBOARD,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.ADMIN_DASHBOARD,
  ],
};

let rolePermissions: Record<string, Permission[]> = structuredClone(
  DEFAULT_ROLE_PERMISSIONS
);

export const setRolePermissions = (
  next: Record<string, Permission[]>
): void => {
  rolePermissions = { ...next };
};

/** Merge feature-owned permissions into the fallback role map (deduped). */
export const mergeRolePermissions = (
  contribution: Record<string, readonly Permission[]>
): void => {
  for (const [role, perms] of Object.entries(contribution)) {
    const existing = rolePermissions[role] ?? [];
    rolePermissions[role] = [...new Set([...existing, ...perms])];
  }
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
