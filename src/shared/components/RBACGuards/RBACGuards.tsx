import { PermissionGuardProps } from '@/core/rbac/models/rbac.model';
import { useRBAC } from '@/shared/hooks/useRBAC';
import React from 'react';

/**
 * Guard component that shows children only if user has required permission(s)
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export interface RoleGuardProps {
  children: React.ReactNode;
  role?: string;
  roles?: string[];
  fallback?: React.ReactNode;
}

/**
 * Guard component that shows children only if user has required role(s)
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  role,
  roles = [],
  fallback = null,
}) => {
  const { hasRole, hasAnyRole } = useRBAC();

  let hasAccess = false;

  if (role) {
    hasAccess = hasRole(role);
  } else if (roles.length > 0) {
    hasAccess = hasAnyRole(roles);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ConditionalRenderProps {
  children: React.ReactNode;
  condition: boolean;
  fallback?: React.ReactNode;
}

/**
 * Generic conditional render component
 */
export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  condition,
  fallback = null,
}) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};
