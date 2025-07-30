// RBAC React Context definition

import { createContext } from 'react';
import { User } from '../models/rbac.model';

export interface RBACContextType {
  user: User | null;
  permissions: string[];
  
  // Permission checking methods
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;

  // Role checking methods
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;

  // User state management
  setUser: (user: User | null) => void;
  
  // Utility methods
  isAuthenticated: () => boolean;
  getUserRole: () => string | null;
  getUserPermissions: () => string[];
}

export const RBACContext = createContext<RBACContextType | undefined>(undefined);
