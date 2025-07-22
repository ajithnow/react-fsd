import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router';
import routes from '@/features/routes';

export const rootRoute = createRootRoute({
  component: () => <div><Outlet /></div>,
});

const routeTree = rootRoute.addChildren(routes);

export const router = createRouter({ routeTree });
