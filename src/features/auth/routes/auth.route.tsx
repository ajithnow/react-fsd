import { createRoute } from '@tanstack/react-router';
import { LoginPage } from '../pages/login.page';
import { AuthLayout } from '../layouts';
import { AUTH_ROUTES } from '../constants/routes.constants';
import { rootRoute } from '@/core/router/root.route';
import { requireGuest } from '@/core/router/guards';

const loginRoute = createRoute({
  path: AUTH_ROUTES.LOGIN,
  getParentRoute: () => rootRoute,
  staticData: { layout: 'standalone' },
  beforeLoad: requireGuest,
  component: () => (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  ),
});

const authRoutes = [loginRoute];

export default authRoutes;
