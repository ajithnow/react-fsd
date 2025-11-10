import { 
  User
} from '@/core';

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (user: User | null, permission: string, userPermissions?: string[]): boolean => {
  if (!user) return false;
  
  const permissions = userPermissions || user.permissions || [];
  return permissions.includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 */
export const hasAnyPermission = (user: User | null, permissions: string[], userPermissions?: string[]): boolean => {
  if (!user || permissions.length === 0) return false;
  
  const userPerms = userPermissions || user.permissions || [];
  return permissions.some(permission => userPerms.includes(permission));
};

/**
 * Check if a user has all of the specified permissions
 */
export const hasAllPermissions = (
  user: User | null,
  permissions: string[],
  userPermissions?: string[]
): boolean => {
  if (!user) return false;
  if (!permissions.length) return true; // Having "all" of zero permissions is true

  const userPerms = userPermissions || user.permissions || [];
  return permissions.every(permission => userPerms.includes(permission));
};

/**
 * Check if a user has a specific role
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user) return false;
  return user.Role === role;
};

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user || !roles.length) return false;
  return roles.includes(user.Role);
};
