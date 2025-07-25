import React from 'react';
import type { GuardProps } from '../../../shared/models/common.model';

interface HomeGuardProps extends GuardProps {
  canAccess?: boolean; // Allow override for testing
}

// Example guard for home feature - could check if user is from certain region, etc.
export const HomeGuard: React.FC<HomeGuardProps> = ({ children, canAccess = true }) => {
  // Example logic - in real app this might check user location, subscription, etc.
  const canAccessHome = canAccess; // Use prop or default to true
  
  if (!canAccessHome) {
    return <div>Access to home page is restricted</div>;
  }

  return <>{children}</>;
};
