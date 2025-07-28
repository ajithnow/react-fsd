import { BaseGuardProps } from '../../../shared/models/guard.model';

export interface AuthGuardProps extends BaseGuardProps {
  redirectTo?: string;
}

export interface GuestGuardProps extends BaseGuardProps {
  redirectTo?: string;
}
