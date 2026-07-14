import type { User, Permission } from './types';
import { ENV } from '@/core/utils/env.utils';

let rbacEnabledOverride: boolean | undefined;

/** Override `VITE_RBAC_ENABLED` at runtime (tests / local toggles). Pass `undefined` to clear. */
export const setRbacEnabled = (enabled: boolean | undefined): void => {
  rbacEnabledOverride = enabled;
};

/** `VITE_RBAC_ENABLED=false` (or override) bypasses all permission checks. */
export const isRbacEnabled = (): boolean => {
  if (rbacEnabledOverride !== undefined) return rbacEnabledOverride;
  return ENV.RBAC_ENABLED;
};

export const getAllPermissionsForUser = (user: User | null): Permission[] => {
  if (!user) return [];
  return user.permissions ?? [];
};

export const hasPermission = (
  user: User | null,
  permission: Permission
): boolean => {
  if (!isRbacEnabled()) return true;
  if (!user) return false;
  return getAllPermissionsForUser(user).includes(permission);
};

export const hasAnyPermission = (
  user: User | null,
  permissions: Permission[]
): boolean => {
  if (!isRbacEnabled()) return true;
  if (!user || permissions.length === 0) return false;
  const userPerms = getAllPermissionsForUser(user);
  return permissions.some(p => userPerms.includes(p));
};

export const hasAllPermissions = (
  user: User | null,
  permissions: Permission[]
): boolean => {
  if (!isRbacEnabled()) return true;
  if (!user) return false;
  if (!permissions.length) return true;
  const userPerms = getAllPermissionsForUser(user);
  return permissions.every(p => userPerms.includes(p));
};

export const getMissingPermissions = (
  user: User | null,
  requiredPermissions: Permission[]
): Permission[] => {
  if (!isRbacEnabled()) return [];
  if (!user) return requiredPermissions;
  const userPermissions = getAllPermissionsForUser(user);
  return requiredPermissions.filter(p => !userPermissions.includes(p));
};
