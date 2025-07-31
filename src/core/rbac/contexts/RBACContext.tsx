// RBAC React Context Provider for providing authentication and permission state

import React, { useMemo } from 'react';
import { RBACProviderProps, User } from '../models/rbac.model';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  hasRole, 
  hasAnyRole,
  getAllPermissionsForUser 
} from '../../../shared/utils/rbac.utils';
import { RBACContext, RBACContextType } from './context';

export const RBACProvider: React.FC<RBACProviderProps> = ({ 
  children, 
  user = null,
  onUserChange 
}) => {
  const contextValue: RBACContextType = useMemo(() => {
    const permissions = user ? getAllPermissionsForUser(user) : [];
    
    return {
      user,
      permissions,
      
      // Permission checking methods
      hasPermission: (permission) => hasPermission(user, permission),
      hasAnyPermission: (permissions) => hasAnyPermission(user, permissions),
      hasAllPermissions: (permissions) => hasAllPermissions(user, permissions),
      
      // Role checking methods
      hasRole: (role) => hasRole(user, role),
      hasAnyRole: (roles) => hasAnyRole(user, roles),
      
      // User state management
      setUser: (newUser: User | null) => {
        onUserChange?.(newUser);
      },
      
      // Utility methods
      isAuthenticated: () => user !== null,
      getUserRole: () => user?.role || null,
      getUserPermissions: () => permissions,
    };
  }, [user, onUserChange]);

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};
