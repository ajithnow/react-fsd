// Application RBAC Configuration
// This file aggregates permissions from all features and defines roles

// Import feature-specific permissions
import { AUTH_PERMISSIONS } from './auth/constants/permissions.constants';
import { HOME_PERMISSIONS } from './home/constants/permissions.constants';

// Aggregate all permissions
export const PERMISSIONS = {
  ...AUTH_PERMISSIONS,
  ...HOME_PERMISSIONS,
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
    // Manager permissions - limited user management + content
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.CONTENT_DELETE,
  ],
  
  [ROLES.USER]: [
    // Basic user permissions - profile + read content
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.CONTENT_READ,
  ],
} as const;

