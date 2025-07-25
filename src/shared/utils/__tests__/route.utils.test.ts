import {
  createModuleRoutes,
  createCrudRoutes,
} from '../route.utils';
import type { RouteValues } from '../../models/route.model';

describe('Route Utilities', () => {
  describe('createModuleRoutes', () => {
    it('should create routes with module prefix', () => {
      const routes = createModuleRoutes('admin', {
        DASHBOARD: '/dashboard',
        USERS: '/users',
        SETTINGS: '/settings',
      });

      expect(routes).toEqual({
        DASHBOARD: '/admin/dashboard',
        USERS: '/admin/users',
        SETTINGS: '/admin/settings',
      });
    });

    it('should handle paths without leading slash', () => {
      const routes = createModuleRoutes('user', {
        PROFILE: 'profile',
        SETTINGS: 'settings',
      });

      expect(routes).toEqual({
        PROFILE: '/user/profile',
        SETTINGS: '/user/settings',
      });
    });

    it('should handle paths with leading slash', () => {
      const routes = createModuleRoutes('auth', {
        LOGIN: '/login',
        LOGOUT: '/logout',
      });

      expect(routes).toEqual({
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
      });
    });

    it('should work with empty module name', () => {
      const routes = createModuleRoutes('', {
        HOME: '/home',
        ABOUT: '/about',
      });

      expect(routes).toEqual({
        HOME: '/home',
        ABOUT: '/about',
      });
    });
  });

  describe('createCrudRoutes', () => {
    it('should create standard CRUD routes using module name as resource', () => {
      const routes = createCrudRoutes('product');

      expect(routes).toEqual({
        LIST: '/product/product',
        CREATE: '/product/product/create',
        EDIT: '/product/product/edit/:id',
        VIEW: '/product/product/:id',
        DELETE: '/product/product/delete/:id',
      });
    });

    it('should create CRUD routes with custom resource name', () => {
      const routes = createCrudRoutes('admin', 'users');

      expect(routes).toEqual({
        LIST: '/admin/users',
        CREATE: '/admin/users/create',
        EDIT: '/admin/users/edit/:id',
        VIEW: '/admin/users/:id',
        DELETE: '/admin/users/delete/:id',
      });
    });

    it('should handle single-word module and resource names', () => {
      const routes = createCrudRoutes('blog', 'posts');

      expect(routes).toEqual({
        LIST: '/blog/posts',
        CREATE: '/blog/posts/create',
        EDIT: '/blog/posts/edit/:id',
        VIEW: '/blog/posts/:id',
        DELETE: '/blog/posts/delete/:id',
      });
    });
  });

  describe('RouteValues type', () => {
    it('should properly type route values', () => {
      type AuthRoutesType = ReturnType<typeof createModuleRoutes<{
        LOGIN: string;
        REGISTER: string;
      }>>;
      type AuthRouteValues = RouteValues<AuthRoutesType>;

      // This test validates that the type works correctly
      const loginRoute: AuthRouteValues = '/auth/login';
      const registerRoute: AuthRouteValues = '/auth/register';

      expect(loginRoute).toBe('/auth/login');
      expect(registerRoute).toBe('/auth/register');
    });
  });

  describe('Integration tests', () => {
    it('should work with real-world scenarios', () => {
      // E-commerce admin routes
      const adminAuthRoutes = createModuleRoutes('admin', {
        LOGIN: '/login',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
      } as const);
      
      const adminCrudRoutes = createCrudRoutes('admin', 'products');
      
      const adminGeneralRoutes = createModuleRoutes('admin', {
        DASHBOARD: '/dashboard',
        ANALYTICS: '/analytics',
        REPORTS: '/reports',
      } as const);

      const adminRoutes = {
        ...adminAuthRoutes,
        ...adminCrudRoutes,
        ...adminGeneralRoutes,
      };

      expect(adminRoutes.LOGIN).toBe('/admin/login');
      expect(adminRoutes.LIST).toBe('/admin/products');
      expect(adminRoutes.DASHBOARD).toBe('/admin/dashboard');
    });

    it('should maintain type safety across different utilities', () => {
      const userRoutes = createModuleRoutes('user', {
        PROFILE: '/profile',
        SETTINGS: '/settings',
      } as const);

      type UserRouteKeys = keyof typeof userRoutes;
      const profileKey: UserRouteKeys = 'PROFILE';
      const settingsKey: UserRouteKeys = 'SETTINGS';

      expect(userRoutes[profileKey]).toBe('/user/profile');
      expect(userRoutes[settingsKey]).toBe('/user/settings');
    });
  });
});
