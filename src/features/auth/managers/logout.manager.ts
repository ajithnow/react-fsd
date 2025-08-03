import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../stores/auth.store';
import { useLogoutMutation } from '../queries/logout.query';
import { authStorage } from '../utils';
import { AUTH_ROUTES } from '../constants';

export const useLogoutManager = () => {
  const setUser = useAuthStore(s => s.setUser);
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();
  const { mutateAsync: logout, isPending, error } = useLogoutMutation();

  const logoutUser = async () => {
    try {
      // Get current tokens
      const refreshToken = authStorage.getRefreshToken();

      // Call logout API to invalidate tokens on server
      await logout(refreshToken || '');

      // Clear local storage and auth state
      authStorage.clearTokens();
      setUser(null);

      // Navigate to login page
      navigate({
        to: AUTH_ROUTES.LOGIN,
        replace: true,
      });
    } catch (error) {
      // Even if API call fails, clear local state and redirect
      console.error('Logout API call failed, clearing local state:', error);

      authStorage.clearTokens();
      setUser(null);
      navigate({
        to: AUTH_ROUTES.LOGIN,
        replace: true,
      });
    }
  };

  const quickLogout = () => {
    // For quick logout without API call (e.g., when offline)
    authStorage.clearTokens();
    setUser(null);
    navigate({
      to: AUTH_ROUTES.LOGIN,
      replace: true,
    });
  };

  return {
    logoutUser,
    quickLogout,
    isPending,
    error,
    canLogout: !!user,
  };
};
