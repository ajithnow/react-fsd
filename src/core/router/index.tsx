import { createRouter } from '@tanstack/react-router';
import { routeRegistry } from '@/core/registry';
import { rootRoute } from './root.route';

/**
 * Router assembly and initialization.
 * 
 * We use a lazy initialization pattern to ensure that the router is only 
 * created after all features have been registered during the bootstrap phase.
 */

let routerInstance: ReturnType<typeof createRouter> | null = null;

export const getRouter = () => {
  if (!routerInstance) {
    const routeTree = rootRoute.addChildren(routeRegistry.getAll());
    
    routerInstance = createRouter({ 
      routeTree,
      defaultViewTransition: true,
      defaultNotFoundComponent: () => (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">404</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Page not found</p>
          </div>
        </div>
      ),
    });

    // Freeze the registry once the router is initialized to ensure stability
    routeRegistry.freeze();
  }
  
  return routerInstance;
};

// For backward compatibility and ease of use in App.tsx
export const router = new Proxy({} as object, {
  get: (_target, prop) => {
    const r = getRouter();
    return (r as Record<string, unknown>)[prop as string];
  }
}) as ReturnType<typeof createRouter>;

export { rootRoute };
export default router;
