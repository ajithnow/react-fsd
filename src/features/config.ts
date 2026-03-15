import {
  routeRegistry,
  localeRegistry,
  mockRegistry,
  permissionRegistry,
} from '@/core/registry';
import type { FeatureConfig } from '@/core/registry';
import { appLayoutRoute, authLayoutRoute } from './layout';
import sharedLocales from '@/shared/locales';

import type { AnyRoute } from '@tanstack/react-router';

/**
 * AUTO-DISCOVERY AGGREGATOR
 * Uses Vite's import.meta.glob to discover and register all features.
 */

// Step 1: Eagerly discover all feature configs
const modules = import.meta.glob<{ default: FeatureConfig }>(
  './*/config.ts',
  { eager: true }
);

// Step 2: Register shared/common locales first
localeRegistry.register([{ ns: 'common', resources: sharedLocales }]);

const featureRoutes: AnyRoute[] = [];

// Step 3: Iterate modules and populate registries
Object.entries(modules).forEach(([path, module]) => {
  const config = (module as { default: FeatureConfig }).default;

  if (!config) return;

  try {
    if (config.routes?.length) featureRoutes.push(...config.routes);
    if (config.locales) localeRegistry.register(config.locales);
    if (config.handlers?.length) mockRegistry.register(config.handlers);
    if (config.permissions) permissionRegistry.register(config.permissions);
  } catch (e) {
    console.error(`[FeatureRegistry] Failed to register feature from ${path}`, e);
  }
});

/**
 * Step 4: Preserve Layout Wrapping Logic
 * We group routes based on their intended parent using path heuristics.
 * Direct object reference and ID checks often fail during early bootstrap/HMR.
 */
interface RouteLike { 
  path?: string; 
  options?: { path?: string; getParentRoute?: () => { id?: string } };
  getParentRoute?: () => { id?: string };
}

const isAuthRoute = (r: AnyRoute): boolean => {
  const route = r as unknown as RouteLike;
  const path = route.path || route.options?.path;
  // Auth routes usually have /auth in path or are children of auth layout
  if (path?.startsWith('/auth') || path?.includes('login') || path?.includes('register')) return true;
  return false;
};

const isStandaloneRoute = (r: AnyRoute): boolean => {
  // Login route in this app specifically uses getParentRoute: () => rootRoute
  // We check if the path is /auth/login and it wants rootRoute
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
if (appLayoutRoute) routesToRegister.push(appLayoutRoute.addChildren(appRoutes));
if (authLayoutRoute) routesToRegister.push(authLayoutRoute.addChildren(authRoutes));

routeRegistry.register(routesToRegister.filter(Boolean));

export {};
