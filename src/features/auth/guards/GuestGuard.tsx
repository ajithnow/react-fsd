import React, { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { isAuthenticated } from '../utils/auth.utils';
import type { GuestGuardProps } from '../../../shared/models/common.model';

export const GuestGuard: React.FC<GuestGuardProps> = ({ 
  children, 
  fallback = null,
  redirectTo = '/'
}) => {
  const navigate = useNavigate();
  const search = useSearch({ from: '__root__' }) as Record<string, unknown>;
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated() && !isRedirecting) {
      setIsRedirecting(true);
      
      // Check if there's a return URL from auth guard
      const returnUrl = search?.returnUrl as string;
      // Don't redirect to auth pages if they're specified as return URL
      const isAuthReturnUrl = returnUrl && returnUrl.startsWith('/auth/');
      const destination = returnUrl && !isAuthReturnUrl ? returnUrl : redirectTo;
      
      navigate({ 
        to: destination,
        replace: true 
      });
    }
  }, [navigate, search, redirectTo, isRedirecting]);

  // If user is authenticated, redirect them away
  if (isAuthenticated()) {
    if (isRedirecting) {
      return null;
    }
    return <>{fallback}</>;
  }

  // If not authenticated, render children (guest content)
  return <>{children}</>;
};
