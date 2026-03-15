// Application-configured RBAC utilities
// This file provides pre-configured RBAC utilities using the app's specific configuration

import { 
  hasPermission as coreHasPermission,
  hasAnyPermission as coreHasAnyPermission,
  hasAllPermissions as coreHasAllPermissions,
  hasRole,
  hasAnyRole
} from '../../core/rbac';
import { PERMISSIONS, ROLES } from '../../core/rbac';
import type { Role, User, Permission } from '../../core/rbac';

// Utility to get all permissions for a user (now purely what's attached to the user from the backend)
export const getAllPermissionsForUser = (user: User | null): Permission[] => {
  if (!user) return [];
  return user.permissions || [];
};

// Pre-configured permission checking functions
export const hasPermission = (
  user: User | null,
  permission: Permission
): boolean => {
  return coreHasPermission(user, permission, getAllPermissionsForUser(user!));
};

export const hasAnyPermission = (
  user: User | null,
  permissions: Permission[]
): boolean => {
  return coreHasAnyPermission(user, permissions, getAllPermissionsForUser(user!));
};

export const hasAllPermissions = (
  user: User | null,
  permissions: Permission[]
): boolean => {
  return coreHasAllPermissions(user, permissions, getAllPermissionsForUser(user!));
};

// App-specific role hierarchy functions
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
  return requiredPermissions.filter(permission => !userPermissions.includes(permission));
};

export const canAccessFeature = (user: User | null, featurePermissions: Permission[]): boolean => {
  return hasAnyPermission(user, featurePermissions);
};

// Re-export core role functions that don't need configuration
export { hasRole, hasAnyRole };

// Export app-specific constants for easy access
export { PERMISSIONS, ROLES };