import { rootRoute } from '../core/router';
import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { isAuthenticated } from './auth/utils/auth.utils';
import { AUTH_ROUTES, ROUTE_PREFIX } from './auth/constants/routes.constants';
import ROUTE_CONSTANTS from '../shared/constants/route.constants';
import { AppLayoutWrapper } from '../shared/components/AppLayout/AppLayoutWrapper';

// Authentication check function for app routes
const checkAuthentication = ({
  location,
}: {
  location: { pathname: string };
}) => {
  if (!isAuthenticated()) {
    const currentPath = location.pathname;

    // Check if we should store the return URL
    const isAuthPage = currentPath.startsWith(ROUTE_PREFIX);
    const isRootPage = currentPath === ROUTE_CONSTANTS.ROOT;
    const shouldStoreReturnUrl = !isAuthPage && !isRootPage;

    // Prepare redirect options
    const redirectOptions = {
      to: AUTH_ROUTES.LOGIN,
      replace: true,
      ...(shouldStoreReturnUrl && { search: { returnUrl: currentPath } }),
    };

    throw redirect(redirectOptions);
  }
};

// Main app layout route - contains sidebar and top bar
export const appLayoutRoute = createRoute({
  id: 'app-layout',
  getParentRoute: () => rootRoute,
  beforeLoad: checkAuthentication,
  component: AppLayoutWrapper,
});

// Auth layout route - no app layout, just outlet for auth pages
export const authLayoutRoute = createRoute({
  path: '/auth',
  getParentRoute: () => rootRoute,
  component: () => <Outlet />,
});
