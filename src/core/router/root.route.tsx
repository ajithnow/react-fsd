import { createRootRoute, Outlet } from '@tanstack/react-router';
import { LayoutWrapper } from '@/core/layouts';

/**
 * Root route definition extracted to a separate file to avoid circular dependencies
 * when feature layouts or routes need to reference it during registration.
 */
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
