// User status and types

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
} as const;

/** Assignable user roles for the users feature UI. */
export const USER_TYPES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export const USER_TYPE_LABELS: { [key in UserType]: string } = {
  [USER_TYPES.ADMIN]: 'Admin',
  [USER_TYPES.EDITOR]: 'Editor',
  [USER_TYPES.VIEWER]: 'Viewer',
};

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

export type TranslateFn = (
  key: string,
  options?: Record<string, unknown>
) => string;

export { getUserTypeData, getUserStatusData } from '@/shared/utils/role.utils';
