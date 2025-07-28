import { BaseGuardProps } from '@/shared/models';

export interface AuthGuardProps extends BaseGuardProps {
  redirectTo?: string;
}
export interface GuestGuardProps extends BaseGuardProps {
  redirectTo?: string;
}
