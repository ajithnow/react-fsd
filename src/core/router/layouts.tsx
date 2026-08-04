import { createRoute, Outlet } from '@tanstack/react-router';
import { rootRoute } from './root.route';
import { ROUTE_PREFIX } from '@/features/auth/constants/routes.constants';
import { AppLayoutWrapper } from '@/shared/components/AppLayout/AppLayoutWrapper';
import { requireAuth } from './guards';

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
  beforeLoad: requireAuth,
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
