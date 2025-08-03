// Application RBAC Configuration
// This file aggregates permissions from all features and defines roles

// Import feature-specific permissions
import { AUTH_PERMISSIONS } from './auth/constants/permissions.constants';
import { CUSTOMERS_PERMISSIONS } from './customers/constants/permissions.constants';
import { DASHBOARD_PERMISSIONS } from './dashboard/constants/permissions.constants';

// Aggregate all permissions
export const PERMISSIONS = {
  ...AUTH_PERMISSIONS,
  ...CUSTOMERS_PERMISSIONS,
  ...DASHBOARD_PERMISSIONS,
} as const;

// Define application roles
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

// Role-permission mapping
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS),
  ],

  [ROLES.MANAGER]: [
    // Manager permissions - limited user management + content + customers + dashboard + settings
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_UPDATE,
    PERMISSIONS.CUSTOMERS_REPORTS_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_ANALYTICS_VIEW,
    PERMISSIONS.DASHBOARD_SALES_VIEW,
    PERMISSIONS.DASHBOARD_TRAFFIC_VIEW,
    PERMISSIONS.DASHBOARD_REPORTS_VIEW,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE,
  ],

  [ROLES.USER]: [
    // Basic user permissions - profile + read content + basic dashboard + basic settings
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.SETTINGS_READ,
  ],
} as const;
