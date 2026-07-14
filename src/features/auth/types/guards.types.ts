import type { BaseGuardProps } from '@/shared/types';

export type AuthGuardProps = BaseGuardProps & {
  redirectTo?: string;
};

export type GuestGuardProps = BaseGuardProps & {
  redirectTo?: string;
};
