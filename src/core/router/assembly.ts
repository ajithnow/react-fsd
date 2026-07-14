import { routeRegistry } from '@/core/registry';
import { appLayoutRoute, authLayoutRoute, homeRoute } from './layouts';
import { type AnyRoute } from '@tanstack/react-router';

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
    if (path?.startsWith('/auth') || path?.includes('login') || path?.includes('register'))
      return true;
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
        return true;
      }
    }
    return false;
  };

  const authRoutes = featureRoutes.filter(
    (r) => isAuthRoute(r) && !isStandaloneRoute(r)
  );
  const standaloneRoutes = featureRoutes.filter((r) => isStandaloneRoute(r));
  const appRoutes = featureRoutes.filter(
    (r) => !isAuthRoute(r) && !isStandaloneRoute(r)
  );

  const routesToRegister: AnyRoute[] = [];

  if (standaloneRoutes.length) routesToRegister.push(...standaloneRoutes);
  if (authLayoutRoute) routesToRegister.push(authLayoutRoute.addChildren(authRoutes));

  if (appLayoutRoute) {
    const hasIndexRoute = appRoutes.some((r) => {
      const route = r as unknown as RouteLike;
      return route.path === '/' || route.options?.path === '/';
    });

    // Always provide an ungated home at `/` unless a feature already owns it.
    const children = hasIndexRoute ? [...appRoutes] : [homeRoute, ...appRoutes];
    routesToRegister.push(appLayoutRoute.addChildren(children));
  }

  routeRegistry.register(routesToRegister.filter(Boolean));
}
