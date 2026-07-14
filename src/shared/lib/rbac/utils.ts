import type { Role, User, Permission } from './types';
import { ROLE_HIERARCHY, ROLES } from './roles';
import { ENV } from '@/core/utils/env.utils';

export { ROLES, ROLE_HIERARCHY } from './roles';
export { PERMISSIONS } from './permissions';

let rbacEnabledOverride: boolean | undefined;

/** Override `VITE_RBAC_ENABLED` at runtime (tests / local toggles). Pass `undefined` to clear. */
export const setRbacEnabled = (enabled: boolean | undefined): void => {
  rbacEnabledOverride = enabled;
};

/** `VITE_RBAC_ENABLED=false` (or override) bypasses all permission/role checks. */
export const isRbacEnabled = (): boolean => {
  if (rbacEnabledOverride !== undefined) return rbacEnabledOverride;
  return ENV.RBAC_ENABLED;
};

export const getAllPermissionsForUser = (user: User | null): Permission[] => {
  if (!user) return [];
  return user.permissions ?? [];
};

export const getUserRoles = (user: User | null): Role[] => {
  if (!user) return [];
  if (user.roles?.length) return user.roles;
  return user.role ? [user.role] : [];
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
  return permissions.some((p) => userPerms.includes(p));
};

export const hasAllPermissions = (
  user: User | null,
  permissions: Permission[]
): boolean => {
  if (!isRbacEnabled()) return true;
  if (!user) return false;
  if (!permissions.length) return true;
  const userPerms = getAllPermissionsForUser(user);
  return permissions.every((p) => userPerms.includes(p));
};

export const hasRole = (user: User | null, role: Role): boolean => {
  if (!isRbacEnabled()) return true;
  if (!user) return false;
  return getUserRoles(user).includes(role);
};

export const hasAnyRole = (user: User | null, roles: Role[]): boolean => {
  if (!isRbacEnabled()) return true;
  if (!user || !roles.length) return false;
  const userRoles = getUserRoles(user);
  return roles.some((role) => userRoles.includes(role));
};

/** Convenience hierarchy helper for UI only — do not use for authorization. */
export const isRoleHigherThan = (role1: Role, role2: Role): boolean => {
  return (ROLE_HIERARCHY[role1] || 0) > (ROLE_HIERARCHY[role2] || 0);
};

export const getMissingPermissions = (
  user: User | null,
  requiredPermissions: Permission[]
): Permission[] => {
  if (!isRbacEnabled()) return [];
  if (!user) return requiredPermissions;
  const userPermissions = getAllPermissionsForUser(user);
  return requiredPermissions.filter((p) => !userPermissions.includes(p));
};

export const canAccessFeature = (
  user: User | null,
  featurePermissions: Permission[]
): boolean => {
  return hasAnyPermission(user, featurePermissions);
};

/** @deprecated Prefer PERMISSIONS / ROLES imports; kept for older demo fixtures. */
export const DEMO_ROLES = ROLES;
