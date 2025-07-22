import { LoginPage } from '../pages/login.page';
import { rootRoute } from '../../../core/router';

import { createRoute } from '@tanstack/react-router';
import { AUTH_ROUTES } from '../constants/routes.constants';

export const loginRoute = createRoute({
  path: AUTH_ROUTES.LOGIN,
  getParentRoute: () => rootRoute,
  component: LoginPage,
});
