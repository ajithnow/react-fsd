/** Re-export shared role→permission map helpers for the auth feature. */
export {
  DEFAULT_ROLE_PERMISSIONS,
  setRolePermissions,
  mergeRolePermissions,
  getRolePermissionsMap,
  resolvePermissions,
} from '@/shared/lib/rbac/rolePermissions';
