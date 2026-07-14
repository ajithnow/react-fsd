// Permission checks — identity from Redux auth; checks from pure utils

import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/features/auth/stores/auth.slice';
import {
  getAllPermissionsForUser,
  hasPermission as sharedHasPermission,
  hasAnyPermission as sharedHasAnyPermission,
  hasAllPermissions as sharedHasAllPermissions,
  getMissingPermissions,
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
    getMissingPermissions: (required: string[]) =>
      getMissingPermissions(user, required),
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
