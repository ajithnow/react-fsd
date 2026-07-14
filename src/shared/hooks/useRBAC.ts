// RBAC React hooks — identity from Redux auth; checks from pure utils

import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/features/auth/stores/auth.slice';
import {
  getAllPermissionsForUser,
  getUserRoles,
  hasPermission as sharedHasPermission,
  hasAnyPermission as sharedHasAnyPermission,
  hasAllPermissions as sharedHasAllPermissions,
  getMissingPermissions,
  canAccessFeature,
  isRbacEnabled,
} from '../lib/rbac/utils';

export const useRBAC = () => {
  const user = useSelector(selectAuthUser);
  const permissions = user ? getAllPermissionsForUser(user) : [];

  return {
    user,
    permissions,
    rbacEnabled: isRbacEnabled(),
    hasPermission: (permission: string) =>
      sharedHasPermission(user, permission),
    hasAnyPermission: (perms: string[]) => sharedHasAnyPermission(user, perms),
    hasAllPermissions: (perms: string[]) =>
      sharedHasAllPermissions(user, perms),
    hasRole: (role: string) =>
      !isRbacEnabled() || (!!user && getUserRoles(user).includes(role)),
    hasAnyRole: (roles: string[]) =>
      !isRbacEnabled() ||
      (!!user && roles.some(r => getUserRoles(user).includes(r))),
    getMissingPermissions: (required: string[]) =>
      getMissingPermissions(user, required),
    canAccessFeature: (featurePerms: string[]) =>
      canAccessFeature(user, featurePerms),
  };
};

export const usePermission = (permission: string) => {
  const { hasPermission } = useRBAC();
  return hasPermission(permission);
};

export const useAnyPermission = (permissions: string[]) => {
  const { hasAnyPermission } = useRBAC();
  return hasAnyPermission(permissions);
};

export const useAllPermissions = (permissions: string[]) => {
  const { hasAllPermissions } = useRBAC();
  return hasAllPermissions(permissions);
};

export const useRole = (role: string) => {
  const { hasRole } = useRBAC();
  return hasRole(role);
};

export const useAnyRole = (roles: string[]) => {
  const { hasAnyRole } = useRBAC();
  return hasAnyRole(roles);
};
