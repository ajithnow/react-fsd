// User status and types

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  DELETED:"deleted"
} as const;

export const USER_TYPES : {
  [key:string]: string
} = {
  POWER_ADMIN: 'POWER_ADMIN',
  NORMAL_USER: 'NORMAL_USER',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export const USER_TYPE_LABELS: { [key in UserType]: string } = {
  POWER_ADMIN: 'Power Admin',
  NORMAL_USER: 'Admin',
  SUPER_ADMIN: 'Super Admin',
};

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

// Translation-aware helpers
export type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

// helpers moved to shared utils
export { getUserTypeData, getUserStatusData } from '@/shared/utils/role.utils';
