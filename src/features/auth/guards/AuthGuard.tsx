import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { isAuthenticated } from '../utils/auth.utils';
import type { AuthGuardProps } from '../models/guards.model';
import { AUTH_ROUTES, ROUTE_PREFIX } from '../constants';
import ROUTE_CONSTANTS from '@/shared/constants/route.constants';

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = null,
  redirectTo = AUTH_ROUTES.LOGIN
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated() && !isRedirecting) {
      setIsRedirecting(true);
      
      const isAuthPage = location.pathname.startsWith(ROUTE_PREFIX);
      const isRootPage = location.pathname === ROUTE_CONSTANTS.ROOT;
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
