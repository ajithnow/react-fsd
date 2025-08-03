import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router';
import routes from '@/features/routes';
import { LayoutWrapper } from '@/core/layouts';

export const rootRoute = createRootRoute({
  component: () => (
    <LayoutWrapper>
      <Outlet />
    </LayoutWrapper>
  ),
  notFoundComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Page not found</p>
      </div>
    </div>
  ),
});

const routeTree = rootRoute.addChildren(routes);

export const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Page not found</p>
      </div>
    </div>
  ),
});
