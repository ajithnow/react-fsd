import { createRoute } from '@tanstack/react-router';
import { LoginPage } from '../pages/login.page';
import { AuthLayout } from '../layouts';
import { AUTH_ROUTES } from '../constants/routes.constants';
import { GuestGuard } from '../guards';
import { rootRoute } from '@/core/router';

const loginRoute = createRoute({
  path: AUTH_ROUTES.LOGIN,
  getParentRoute: () => rootRoute,
  component: () => (
    <GuestGuard>
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    </GuestGuard>
  ),
});

const authRoutes = [loginRoute];

export default authRoutes;
