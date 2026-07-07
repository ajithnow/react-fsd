import type { Role, User, Permission } from './models';

// Roles definition for app hierarchy
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  POWER_ADMIN: 'POWER_ADMIN',
  NORMAL_USER: 'NORMAL_USER',
} as const;

// Utility to get all permissions for a user
export const getAllPermissionsForUser = (user: User | null): Permission[] => {
  if (!user) return [];
  return user.permissions || [];
};

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  const userPermissions = getAllPermissionsForUser(user);
  return userPermissions.includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 */
export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  if (!user || permissions.length === 0) return false;
  const userPerms = getAllPermissionsForUser(user);
  return permissions.some(p => userPerms.includes(p));
};

/**
 * Check if a user has all of the specified permissions
 */
export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  if (!permissions.length) return true;
  const userPerms = getAllPermissionsForUser(user);
  return permissions.every(p => userPerms.includes(p));
};

/**
 * Check if a user has a specific role
 */
export const hasRole = (user: User | null, role: Role): boolean => {
  if (!user) return false;
  return user.Role === role;
};

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: Role[]): boolean => {
  if (!user || !roles.length) return false;
  return roles.includes(user.Role);
};

export const isRoleHigherThan = (role1: Role, role2: Role): boolean => {
  const hierarchy: Record<string, number> = {
    [ROLES.SUPER_ADMIN]: 3,
    [ROLES.POWER_ADMIN]: 2,
    [ROLES.NORMAL_USER]: 1,
  };
  return (hierarchy[role1] || 0) > (hierarchy[role2] || 0);
};

export const getMissingPermissions = (user: User | null, requiredPermissions: Permission[]): Permission[] => {
  if (!user) return requiredPermissions;
  const userPermissions = getAllPermissionsForUser(user);
  return requiredPermissions.filter(p => !userPermissions.includes(p));
};

export const canAccessFeature = (user: User | null, featurePermissions: Permission[]): boolean => {
  return hasAnyPermission(user, featurePermissions);
};
