import { routeRegistry } from '@/core/registry';
import { appLayoutRoute, authLayoutRoute, homeRoute } from './layouts';
import { getRouteLayout } from './route-meta';
import { type AnyRoute } from '@tanstack/react-router';

export function assembleRoutes(featureRoutes: AnyRoute[]) {
  const standaloneRoutes = featureRoutes.filter(
    route => getRouteLayout(route) === 'standalone'
  );
  const authRoutes = featureRoutes.filter(
    route => getRouteLayout(route) === 'auth'
  );
  const appRoutes = featureRoutes.filter(
    route => getRouteLayout(route) === 'app'
  );

  const routesToRegister: AnyRoute[] = [];

  if (standaloneRoutes.length) routesToRegister.push(...standaloneRoutes);
  if (authLayoutRoute && authRoutes.length) {
    routesToRegister.push(authLayoutRoute.addChildren(authRoutes));
  }

  if (appLayoutRoute) {
    interface RouteLike {
      path?: string;
      options?: { path?: string };
    }

    const hasIndexRoute = appRoutes.some(r => {
      const route = r as unknown as RouteLike;
      return route.path === '/' || route.options?.path === '/';
    });

    // Always provide an ungated home at `/` unless a feature already owns it.
    const children = hasIndexRoute ? [...appRoutes] : [homeRoute, ...appRoutes];
    routesToRegister.push(appLayoutRoute.addChildren(children));
  }

  routeRegistry.register(routesToRegister.filter(Boolean));
}
