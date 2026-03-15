import { routeRegistry } from '@/core/registry';
import { appLayoutRoute, authLayoutRoute } from './layouts';
import { type AnyRoute, createRoute, redirect } from '@tanstack/react-router';

export function assembleRoutes(featureRoutes: AnyRoute[]) {
  /**
   * Preserve Layout Wrapping Logic
   * We group routes based on their intended parent using path heuristics.
   */
  interface RouteLike {
    path?: string;
    options?: { path?: string; getParentRoute?: () => { id?: string } };
    getParentRoute?: () => { id?: string };
  }

  const isAuthRoute = (r: AnyRoute): boolean => {
    const route = r as unknown as RouteLike;
    const path = route.path || route.options?.path;
    if (path?.startsWith('/auth') || path?.includes('login') || path?.includes('register')) return true;
    return false;
  };

  const isStandaloneRoute = (r: AnyRoute): boolean => {
    const route = r as unknown as RouteLike;
    const path = route.path || route.options?.path;
    const parentFunc = route.getParentRoute || route.options?.getParentRoute;
    if (path === '/auth/login' || path === 'login') {
       try {
         const parent = parentFunc?.();
         return parent?.id === '__root__';
       } catch {
         return true; // Assume standalone if it's the login page
       }
    }
    return false;
  };

  const authRoutes = featureRoutes.filter(r => isAuthRoute(r) && !isStandaloneRoute(r));
  const standaloneRoutes = featureRoutes.filter(r => isStandaloneRoute(r));
  const appRoutes = featureRoutes.filter(r => !isAuthRoute(r) && !isStandaloneRoute(r));

  // Final registration of the assembled route tree nodes
  const routesToRegister: AnyRoute[] = [];

  if (standaloneRoutes.length) routesToRegister.push(...standaloneRoutes);
  if (authLayoutRoute) routesToRegister.push(authLayoutRoute.addChildren(authRoutes));
  
  // Add a default redirect from root if no index route is defined in appRoutes
  const hasIndexRoute = appRoutes.some(r => {
    const route = r as unknown as RouteLike;
    return route.path === '/' || route.options?.path === '/';
  });
  
  if (appLayoutRoute) {
    const children = [...appRoutes];
    if (!hasIndexRoute) {
      children.push(createRoute({
        path: '/',
        getParentRoute: () => appLayoutRoute,
        beforeLoad: () => {
          throw redirect({ to: '/users', replace: true });
        },
      }));
    }
    routesToRegister.push(appLayoutRoute.addChildren(children));
  }

  routeRegistry.register(routesToRegister.filter(Boolean));
}
