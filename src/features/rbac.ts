// Application RBAC Configuration
// This file aggregates permissions from all features and defines roles

// Import feature-specific permissions
import { AUTH_PERMISSIONS } from '@/features/auth/constants';
import { DASHBOARD_PERMISSIONS } from './dashboard/constants/permissions.constants';
import { USER_PERMISSIONS } from './users/constants';

// Aggregate all permissions
export const PERMISSIONS = {
  ...AUTH_PERMISSIONS,
  ...DASHBOARD_PERMISSIONS,
  ...USER_PERMISSIONS,
} as const;

// Define application roles
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  POWER_ADMIN: 'POWER_ADMIN',
  NORMAL_USER: 'NORMAL_USER',
} as const;

// Role-permission mapping
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS),
  ],

  [ROLES.POWER_ADMIN]: [
    // Manager permissions - limited user management + content + dashboard + settings
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_ANALYTICS_VIEW,
    PERMISSIONS.DASHBOARD_SALES_VIEW,
    PERMISSIONS.DASHBOARD_TRAFFIC_VIEW,
    PERMISSIONS.DASHBOARD_REPORTS_VIEW,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
  ],

  [ROLES.NORMAL_USER]: [
    // Basic user permissions - profile + read content + basic dashboard + basic settings
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SETTINGS_READ,
  ],
} as const;
