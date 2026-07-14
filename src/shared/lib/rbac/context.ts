import { createContext, useContext } from 'react';
import type { User } from './types';

export interface RBACContextType {
  user: User | null;
  permissions: string[];
}

export const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
