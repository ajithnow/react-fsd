/**
 * Utility functions for creating consistent route patterns across modules
 */

import type {
  RouteRecord,
  ModuleRoutes,
  CrudRouteNames,
} from '../models/route.model';
import { AUTH_ROUTES } from '../../features/auth/constants/routes.constants';

/**
 * Creates a set of routes prefixed with the module name
 * @param moduleName - The name of the module (e.g., 'auth', 'home', 'admin')
 * @param routes - Object with route names as keys and route paths as values
 * @returns Object with module-prefixed routes
 */
export function createModuleRoutes<T extends RouteRecord>(
  moduleName: string,
  routes: T
): ModuleRoutes<T> {
  const moduleRoutes = {} as ModuleRoutes<T>;

  for (const [key, path] of Object.entries(routes)) {
    // Ensure path starts with / if not already present
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Handle empty module names gracefully
    if (moduleName === '') {
      moduleRoutes[key as keyof T] = normalizedPath;
    } else {
      moduleRoutes[key as keyof T] = `/${moduleName}${normalizedPath}`;
    }
  }

  return moduleRoutes;
}

/**
 * Creates a set of standard CRUD routes for a module
 * @param moduleName - The name of the module
 * @param resourceName - The name of the resource (optional, defaults to module name)
 * @returns Standard CRUD routes for the module
 */
export function createCrudRoutes(
  moduleName: string,
  resourceName?: string
): CrudRouteNames {
  const resource = resourceName || moduleName;
  return createModuleRoutes(moduleName, {
    LIST: `/${resource}`,
    CREATE: `/${resource}/create`,
    EDIT: `/${resource}/edit/:id`,
    VIEW: `/${resource}/:id`,
    DELETE: `/${resource}/delete/:id`,
  } as const);
}

/**
 * Check if a route path is an auth route
 * @param path - The path to check
 * @returns boolean indicating if the path is an auth route
 */
export function isAuthRoute(path: string): boolean {
  const authRoutes = Object.values(AUTH_ROUTES);
  return authRoutes.some(route => path.startsWith(route));
}
