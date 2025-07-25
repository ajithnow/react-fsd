import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router';
import routes from '@/features/routes';
import { LayoutWrapper } from '@/core/layouts';

export const rootRoute = createRootRoute({
  component: () => (
    <LayoutWrapper>
      <Outlet />
    </LayoutWrapper>
  ),
});

const routeTree = rootRoute.addChildren(routes);

export const router = createRouter({ routeTree });
