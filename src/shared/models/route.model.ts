/**
 * Type definitions for route utilities
 */

/**
 * Utility type for extracting route values from a routes object
 * @example
 * const routes = { HOME: '/home', ABOUT: '/about' };
 * type RouteValues = RouteValues<typeof routes>; // '/home' | '/about'
 */
export type RouteValues<T> = T[keyof T];

/**
 * Type for a record of route names to route paths
 */
export type RouteRecord = Record<string, string>;

/**
 * Type for standard CRUD route names
 */
export type CrudRouteNames = {
  LIST: string;
  CREATE: string;
  EDIT: string;
  VIEW: string;
  DELETE: string;
};

/**
 * Type for module routes with proper key preservation
 */
export type ModuleRoutes<T extends RouteRecord> = {
  [K in keyof T]: string;
};
