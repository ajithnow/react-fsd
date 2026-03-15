import { createRouter } from '@tanstack/react-router';
import { routeRegistry } from '@/core/registry';
import { rootRoute } from './root.route';

/**
 * Router assembly and initialization.
 * Consumes all routes from the routeRegistry which is populated during
 * the features registration phase.
 */

const routeTree = rootRoute.addChildren(routeRegistry.getAll());


export const router = createRouter({ 
  routeTree,
  defaultViewTransition:true,
  defaultNotFoundComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Page not found</p>
      </div>
    </div>
  ),
});

// Freeze the registry to ensure router stability
routeRegistry.freeze();

export { rootRoute };
export default router;
