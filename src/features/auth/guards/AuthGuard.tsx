import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { isAuthenticated } from '../utils/auth.utils';
import type { AuthGuardProps } from '../models/guards.model';

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = null,
  redirectTo = '/auth/login'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated() && !isRedirecting) {
      setIsRedirecting(true);
      
      // Don't store auth-related pages or root as return URL to avoid redirect loops
      const isAuthPage = location.pathname.startsWith('/auth/');
      const isRootPage = location.pathname === '/';
      const shouldStoreReturnUrl = !isAuthPage && !isRootPage;
      
      const returnUrl = shouldStoreReturnUrl ? location.pathname : undefined;
      
      navigate({ 
        to: redirectTo,
        search: returnUrl ? { returnUrl } : undefined,
        replace: true 
      });
    }
  }, [navigate, location.pathname, redirectTo, isRedirecting]);

  // If user is authenticated, render children
  if (isAuthenticated()) {
    return <>{children}</>;
  }

  // If redirecting, don't render anything to avoid flicker
  if (isRedirecting) {
    return null;
  }

  // If not authenticated and not redirecting yet, show fallback
  return <>{fallback}</>;
};
