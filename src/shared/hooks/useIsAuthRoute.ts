import { useRouter } from '@tanstack/react-router';
import { isAuthRoute } from '../utils/route.utils';

/**
 * Hook to determine if the current route is an authentication route
 * @returns boolean indicating if current route is an auth route
 */
export const useIsAuthRoute = (): boolean => {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return isAuthRoute(currentPath);
};
