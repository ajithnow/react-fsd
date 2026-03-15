// Application RBAC Configuration
// This file aggregates permissions from all features and defines roles
// It uses Proxies to ensure the configuration is dynamic and reflects
// the current state of the permission registry, even if features are 
// registered after this module is evaluated.

import { permissionRegistry } from '@/core/registry';

// Define application roles
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  POWER_ADMIN: 'POWER_ADMIN',
  NORMAL_USER: 'NORMAL_USER',
} as const;

/**
 * Dynamic PERMISSIONS object that proxies to the permissionRegistry.
 */
export const PERMISSIONS = new Proxy({} as Record<string, string>, {
  get: (_target, prop) => {
    return permissionRegistry.getAll()[prop as string];
  },
  ownKeys: () => {
    return Object.keys(permissionRegistry.getAll());
  },
  getOwnPropertyDescriptor: (_, prop) => {
    return {
      enumerable: true,
      configurable: true,
      value: permissionRegistry.getAll()[prop as string],
    };
  },
});

/**
 * Dynamic ROLE_PERMISSIONS object that proxies to the permissionRegistry
 * to provide role-to-permission mappings.
 */
export const ROLE_PERMISSIONS = new Proxy({} as Record<string, string[]>, {
  get: (_target, role) => {
    const p = permissionRegistry.getAll();
    
    if (role === ROLES.SUPER_ADMIN) {
      return Object.values(p);
    }
    
    if (role === ROLES.POWER_ADMIN) {
      return [
        p.PROFILE_READ,
        p.PROFILE_UPDATE,
        p.DASHBOARD_VIEW,
        p.DASHBOARD_ANALYTICS_VIEW,
        p.DASHBOARD_SALES_VIEW,
        p.DASHBOARD_TRAFFIC_VIEW,
        p.DASHBOARD_REPORTS_VIEW,
        p.SETTINGS_READ,
        p.SETTINGS_UPDATE,
        p.USERS_READ,
        p.USERS_CREATE,
        p.USERS_UPDATE,
        p.USERS_DELETE,
      ].filter(Boolean);
    }
    
    if (role === ROLES.NORMAL_USER) {
      return [
        p.PROFILE_READ,
        p.PROFILE_UPDATE,
        p.DASHBOARD_VIEW,
        p.SETTINGS_READ,
      ].filter(Boolean);
    }
    
    return undefined;
  },
  ownKeys: () => {
    return Object.values(ROLES);
  },
  getOwnPropertyDescriptor: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
