import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { CUSTOMER_ROUTES } from '../constants';
import { appLayoutRoute } from '../../layout';

const customersListRoute = createRoute({
  path: CUSTOMER_ROUTES.LIST,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.CustomersListPage }))
  ),
});

const customerCreateRoute = createRoute({
  path: CUSTOMER_ROUTES.CREATE,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.CustomerCreatePage }))
  ),
});

const customerDetailRoute = createRoute({
  path: CUSTOMER_ROUTES.DETAIL,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.CustomerDetailPage }))
  ),
});

const customerEditRoute = createRoute({
  path: CUSTOMER_ROUTES.EDIT,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.CustomerEditPage }))
  ),
});

const customerRoutes = [
  customersListRoute,
  customerCreateRoute,
  customerDetailRoute,
  customerEditRoute,
];

export default customerRoutes;
