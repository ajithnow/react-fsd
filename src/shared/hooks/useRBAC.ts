// RBAC React hooks for permission and role checking

import { useRBACContext } from '@/core/rbac/hooks/useRBAC';
import {
  getAllPermissionsForUser,
  hasPermission as sharedHasPermission,
  hasAnyPermission as sharedHasAnyPermission,
  hasAllPermissions as sharedHasAllPermissions,
  getRoleInfo,
  isRoleHigherThan,
  getMissingPermissions,
  canAccessFeature,
} from '../utils/rbac.utils';

export const useRBAC = () => {
  const { user } = useRBACContext();
  const permissions = user ? getAllPermissionsForUser(user) : [];

  return {
    user,
    permissions,
    // Permission/role helpers from shared utils
    hasPermission: (permission: string) =>
      sharedHasPermission(user, permission),
    hasAnyPermission: (perms: string[]) => sharedHasAnyPermission(user, perms),
    hasAllPermissions: (perms: string[]) =>
      sharedHasAllPermissions(user, perms),
    hasRole: (role: string) => !!user && user.Role === role,
    hasAnyRole: (roles: string[]) => !!user && roles.includes(user.Role),
    getRoleInfo,
    isRoleHigherThan,
    getMissingPermissions: (required: string[]) =>
      getMissingPermissions(user, required),
    canAccessFeature: (featurePerms: string[]) =>
      canAccessFeature(user, featurePerms),
  };
};

/**
 * Hook for checking if user has a specific permission
 */
export const usePermission = (permission: string) => {
  const { hasPermission } = useRBAC();
  return hasPermission(permission);
};

/**
 * Hook for checking if user has any of the specified permissions
 */
export const useAnyPermission = (permissions: string[]) => {
  const { hasAnyPermission } = useRBAC();
  return hasAnyPermission(permissions);
};

/**
 * Hook for checking if user has all of the specified permissions
 */
export const useAllPermissions = (permissions: string[]) => {
  const { hasAllPermissions } = useRBAC();
  return hasAllPermissions(permissions);
};

/**
 * Hook for checking if user has a specific role
 */
export const useRole = (role: string) => {
  const { hasRole } = useRBAC();
  return hasRole(role);
};

/**
 * Hook for checking if user has any of the specified roles
 */
export const useAnyRole = (roles: string[]) => {
  const { hasAnyRole } = useRBAC();
  return hasAnyRole(roles);
};
