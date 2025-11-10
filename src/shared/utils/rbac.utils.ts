// Application-configured RBAC utilities
// This file provides pre-configured RBAC utilities using the app's specific configuration

import { 
  hasPermission as coreHasPermission,
  hasAnyPermission as coreHasAnyPermission,
  hasAllPermissions as coreHasAllPermissions,
  hasRole,
  hasAnyRole
} from '../../core/rbac';
import { PERMISSIONS, ROLES, ROLE_PERMISSIONS } from '../../features/rbac';
import type { Role, User, Permission, RolePermissions } from '../../core/rbac';

// Convert our simplified config to the format expected by core RBAC
const createRolePermissionsConfig = (): Record<Role, RolePermissions> => {
  const config: Record<string, RolePermissions> = {};
  
  Object.entries(ROLE_PERMISSIONS).forEach(([role, permissions]) => {
    config[role] = {
      role: role,
      permissions: permissions as Permission[],
    };
  });
  
  return config;
};

const APP_ROLE_PERMISSIONS_CONFIG = createRolePermissionsConfig();

// Utility to get all permissions for a role using app config
export const getAllPermissionsForRole = (role: Role): Permission[] => {
  const permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
  return permissions ? [...permissions] : [];
};

// Utility to get all permissions for a user (role + user-specific)
export const getAllPermissionsForUser = (user: User): Permission[] => {
  const rolePermissions = getAllPermissionsForRole(user.Role);
  const userSpecificPermissions = user.permissions || [];

  // Combine role permissions with user-specific permissions (remove duplicates)
  return [...new Set([...rolePermissions, ...userSpecificPermissions])];
};

// Pre-configured permission checking functions
export const hasPermission = (
  user: User | null,
  permission: Permission
): boolean => {
  if (!user) return false;
  const userPermissions = getAllPermissionsForUser(user);
  return coreHasPermission(user, permission, userPermissions);
};

export const hasAnyPermission = (
  user: User | null,
  permissions: Permission[]
): boolean => {
  if (!user) return false;
  const userPermissions = getAllPermissionsForUser(user);
  return coreHasAnyPermission(user, permissions, userPermissions);
};

export const hasAllPermissions = (
  user: User | null,
  permissions: Permission[]
): boolean => {
  if (!user) return false;
  const userPermissions = getAllPermissionsForUser(user);
  return coreHasAllPermissions(user, permissions, userPermissions);
};

export const getRoleInfo = (role: Role): RolePermissions | undefined => {
  return APP_ROLE_PERMISSIONS_CONFIG[role];
};

// App-specific role hierarchy functions
export const isRoleHigherThan = (role1: Role, role2: Role): boolean => {
  const hierarchy: Record<string, number> = {
    [ROLES.SUPER_ADMIN]: 1,
    [ROLES.POWER_ADMIN]: 2,
    [ROLES.NORMAL_USER]: 3,
  };

  return (hierarchy[role1] || 0) > (hierarchy[role2] || 0);
};

export const canManageUser = (
  currentUser: User | null,
  targetUser: User
): boolean => {
  if (!currentUser) return false;

  // Users cannot manage other users unless they have the permission
  if (!hasPermission(currentUser, PERMISSIONS.USERS_MANAGE_ROLES)) {
    return false;
  }

  // Admin can manage everyone
  if (currentUser.Role === ROLES.SUPER_ADMIN) return true;

  // Manager can manage users but not other managers or admins
  if (currentUser.Role === ROLES.POWER_ADMIN) {
    return targetUser.Role === ROLES.NORMAL_USER;
  }

  // Regular users cannot manage anyone
  return false;
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
export { PERMISSIONS, ROLES, ROLE_PERMISSIONS };