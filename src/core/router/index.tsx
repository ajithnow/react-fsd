import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router';
import { loginRoute } from '../../features/auth/routes/auth.route';

export const rootRoute = createRootRoute({
  component: () => <div><Outlet /></div>,
});

const routeTree = rootRoute.addChildren([loginRoute]);

export const router = createRouter({ routeTree });
