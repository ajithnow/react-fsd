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
  };
};
