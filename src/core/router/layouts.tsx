import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { rootRoute } from './root.route';
import { isAuthenticated } from '@/features/auth/utils/auth.utils';
import { AUTH_ROUTES, ROUTE_PREFIX } from '@/features/auth/constants/routes.constants';
import ROUTE_CONSTANTS from '@/shared/constants/route.constants';
import { AppLayoutWrapper } from '@/shared/components/AppLayout/AppLayoutWrapper';

const checkAuthentication = ({
  location,
}: {
  location: { pathname: string };
}) => {
  if (!isAuthenticated()) {
    const currentPath = location.pathname;
    const isAuthPage = currentPath.startsWith(ROUTE_PREFIX);
    const isRootPage = currentPath === ROUTE_CONSTANTS.ROOT;
    const shouldStoreReturnUrl = !isAuthPage && !isRootPage;

    throw redirect({
      to: AUTH_ROUTES.LOGIN,
      replace: true,
      ...(shouldStoreReturnUrl && { search: { returnUrl: currentPath } }),
    });
  }
};

/** Authenticated home — no permission gate (avoids / ↔ /users redirect loops). */
function HomePage() {
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        You are signed in. Use the sidebar to open a feature you have access to.
      </p>
    </div>
  );
}

export const appLayoutRoute = createRoute({
  id: 'app-layout',
  getParentRoute: () => rootRoute,
  beforeLoad: checkAuthentication,
  component: AppLayoutWrapper,
});

export const homeRoute = createRoute({
  path: '/',
  getParentRoute: () => appLayoutRoute,
  component: HomePage,
});

export const authLayoutRoute = createRoute({
  path: ROUTE_PREFIX,
  getParentRoute: () => rootRoute,
  component: () => <Outlet />,
});
