import { useAuthStore } from '../stores/auth.store';
import { useLogoutManager } from '../managers/logout.manager';

/**
 * Simple hook for logout functionality
 * Can be used in any component that needs logout capability
 */
export const useLogout = () => {
  const { logoutUser, isPending, error } = useLogoutManager();
  const user = useAuthStore(s => s.user);

  return {
    logout: logoutUser,
    isLoading: isPending,
    error,
    isLoggedIn: !!user,
  };
};
