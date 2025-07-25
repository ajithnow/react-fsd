export { AuthGuard } from './AuthGuard';
export { GuestGuard } from './GuestGuard';

import { AuthGuard } from './AuthGuard';
import { GuestGuard } from './GuestGuard';

const authGuards = {
  AuthGuard,
  GuestGuard,
};

export default authGuards;
