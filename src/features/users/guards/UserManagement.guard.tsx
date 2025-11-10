import React from 'react';
import { useRBAC } from '../../../shared/hooks';
import { USER_PERMISSIONS } from '../constants';

interface UserManagementGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Guard component that restricts access to user management features
 * Only users with appropriate permissions can access these features
 */
export const UserManagementGuard: React.FC<UserManagementGuardProps> = ({
  children,
  fallback = <div className="p-8 text-center text-red-600">Access denied. You don't have permission to manage users.</div>,
}) => {
  const { hasPermission } = useRBAC();

  // Check if user has any user management permissions
  const canManageUsers =
    hasPermission(USER_PERMISSIONS.USER_READ) ||
    hasPermission(USER_PERMISSIONS.USER_CREATE) ||
    hasPermission(USER_PERMISSIONS.USER_UPDATE) ||
    hasPermission(USER_PERMISSIONS.USER_DELETE);

  if (!canManageUsers) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};