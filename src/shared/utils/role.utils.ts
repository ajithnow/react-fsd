import { USER_TYPES } from '@/features/users/constants/users.constants';

export type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

export function getUserTypeData(t: TranslateFn) {
  return {
    [USER_TYPES.POWER_ADMIN]: {
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      label: t('users.powerAdmin') ?? 'PowerAdmin',
    },
    [USER_TYPES.NORMAL_USER]: {
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      label: t('users.normalUser') ?? 'NormalUser',
    },
    [USER_TYPES.SUPER_ADMIN]: {
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: t('users.superAdmin') ?? 'SuperAdmin',
    },
  } as const;
}

export function getUserStatusData(t: TranslateFn) {
  return {
    active: {
      className: 'bg-green-100 text-green-800 border-green-200',
      label: t('users.active') ?? 'Active',
    },
    deleted: {
      className: 'bg-red-100 text-red-800 border-red-200',
      label: t('users.deleted') ?? 'Deleted',
    },
    suspended: {
      className: 'bg-gray-500 text-white border-gray-500',
      label: t('users.suspended') ?? 'Suspended',
    },
  } as const;
}
