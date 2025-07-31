// RBAC React Context definition

import { createContext } from 'react';
import { User } from '../models/rbac.model';

export interface RBACContextType {
  user: User | null;
  permissions: string[];
}

export const RBACContext = createContext<RBACContextType | undefined>(undefined);
