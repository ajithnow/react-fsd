// RBAC React Context Provider for providing authentication and permission state

import React, { useMemo } from 'react';
import { RBACProviderProps } from '../models/rbac.model';
import { RBACContext, RBACContextType } from './context';

export const RBACProvider: React.FC<RBACProviderProps> = ({ 
  children, 
  user = null,
}) => {
  const contextValue: RBACContextType = useMemo(() => {
    const permissions = user?.permissions || [];

    return {
      user,
      permissions
    };
  }, [user]);

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};
