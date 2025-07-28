import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { isAuthenticated } from '../../features/auth/utils';
import type { AuthGuardProps } from '../../features/auth/models/guards.model';

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


  if (isAuthenticated()) {
    return <>{children}</>;
  }


  if (isRedirecting) {
    return null;
  }

  return <>{fallback}</>;
};
