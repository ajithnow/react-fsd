import { ROLES } from '@/shared/lib/rbac';

// User status and types

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
} as const;

/** Aligns with shared RBAC roles (`admin` | `editor` | `viewer`). */
export const USER_TYPES: { [key: string]: string } = {
  ADMIN: ROLES.ADMIN,
  EDITOR: ROLES.EDITOR,
  VIEWER: ROLES.VIEWER,
} as const;

export const USER_TYPE_LABELS: { [key in UserType]: string } = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.EDITOR]: 'Editor',
  [ROLES.VIEWER]: 'Viewer',
};

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

// Translation-aware helpers
export type TranslateFn = (
  key: string,
  options?: Record<string, unknown>
) => string;

// helpers moved to shared utils
export { getUserTypeData, getUserStatusData } from '@/shared/utils/role.utils';
