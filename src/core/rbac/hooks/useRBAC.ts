// RBAC React hooks for permission and role checking

import { useContext } from 'react';
import { RBACContext, RBACContextType } from '../contexts/context';

export const useRBACContext = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBACContext must be used within an RBACProvider');
  }
  return context;
};

/**
 * Hook for checking permissions
 */
export const useRBAC = () => {
  const context = useRBACContext();
  
  return {
    user: context.user,
    permissions: context.permissions,
    
    // Permission checking methods
    hasPermission: context.hasPermission,
    hasAnyPermission: context.hasAnyPermission,
    hasAllPermissions: context.hasAllPermissions,
    
    // Role checking methods
    hasRole: context.hasRole,
    hasAnyRole: context.hasAnyRole,
    
    // User state management
    setUser: context.setUser,
    
    // Utility methods
    isAuthenticated: context.isAuthenticated,
    getUserRole: context.getUserRole,
    getUserPermissions: context.getUserPermissions,
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
