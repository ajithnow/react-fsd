import { useSelector } from 'react-redux';
import { useLogoutManager } from '../managers/logout.manager';
import { RootState } from '@/core/store';

/**
 * Simple hook for logout functionality
 * Can be used in any component that needs logout capability
 */
export const useLogout = () => {
  const { logoutUser, isPending, error } = useLogoutManager();
  const user = useSelector((state: RootState) => state.auth.user);

  return {
    logout: logoutUser,
    isLoading: isPending,
    error,
    isLoggedIn: !!user,
  };
};
