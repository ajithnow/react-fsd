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

