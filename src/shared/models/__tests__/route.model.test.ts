import type {
  RouteValues,
  RouteRecord,
  CrudRouteNames,
  ModuleRoutes,
} from '../route.model';

describe('Route Model Types', () => {
  describe('RouteValues', () => {
    it('should extract route values from a routes object', () => {
      type TestRoutes = {
        readonly HOME: '/home';
        readonly ABOUT: '/about';
        readonly CONTACT: '/contact';
      };

      type TestRouteValues = RouteValues<TestRoutes>;
      
      // These should all be valid RouteValues
      const homeRoute: TestRouteValues = '/home';
      const aboutRoute: TestRouteValues = '/about';
      const contactRoute: TestRouteValues = '/contact';

      expect(homeRoute).toBe('/home');
      expect(aboutRoute).toBe('/about');
      expect(contactRoute).toBe('/contact');
    });
  });

  describe('RouteRecord', () => {
    it('should accept string key-value pairs', () => {
      const validRouteRecord: RouteRecord = {
        HOME: '/home',
        ABOUT: '/about',
        CONTACT: '/contact',
      };

      expect(validRouteRecord.HOME).toBe('/home');
      expect(validRouteRecord.ABOUT).toBe('/about');
      expect(validRouteRecord.CONTACT).toBe('/contact');
    });
  });

  describe('CrudRouteNames', () => {
    it('should have all required CRUD operations', () => {
      const crudRoutes: CrudRouteNames = {
        LIST: '/users',
        CREATE: '/users/create',
        EDIT: '/users/edit/:id',
        VIEW: '/users/:id',
        DELETE: '/users/delete/:id',
      };

      expect(crudRoutes.LIST).toBe('/users');
      expect(crudRoutes.CREATE).toBe('/users/create');
      expect(crudRoutes.EDIT).toBe('/users/edit/:id');
      expect(crudRoutes.VIEW).toBe('/users/:id');
      expect(crudRoutes.DELETE).toBe('/users/delete/:id');
    });
  });

  describe('ModuleRoutes', () => {
    it('should preserve key types from input', () => {
      type TestRoutes = {
        LOGIN: string;
        REGISTER: string;
        PROFILE: string;
      };

      const moduleRoutes: ModuleRoutes<TestRoutes> = {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
      };

      expect(moduleRoutes.LOGIN).toBe('/auth/login');
      expect(moduleRoutes.REGISTER).toBe('/auth/register');
      expect(moduleRoutes.PROFILE).toBe('/auth/profile');
    });

    it('should work with const assertions', () => {
      type InputRoutes = {
        readonly HOME: '/home';
        readonly DASHBOARD: '/dashboard';
      };

      type TestModuleRoutes = ModuleRoutes<InputRoutes>;

      const moduleRoutes: TestModuleRoutes = {
        HOME: '/admin/home',
        DASHBOARD: '/admin/dashboard',
      };

      expect(moduleRoutes.HOME).toBe('/admin/home');
      expect(moduleRoutes.DASHBOARD).toBe('/admin/dashboard');
    });
  });
});
