import { useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../stores/auth.slice.ts';
import { useLogoutMutation } from '../queries/logout.query';
import { authStorage } from '../utils';
import { AUTH_ROUTES } from '../constants';
import { RootState, AppDispatch } from '@/core/store';
import { logger } from '@/core/services/logger.service';

export const useLogoutManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
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
      dispatch(setUser(null));

      // Navigate to login page
      navigate({
        to: AUTH_ROUTES.LOGIN,
        replace: true,
      });
    } catch (error) {
      // Even if API call fails, clear local state and redirect
      logger.error('Logout API call failed, clearing local state', error, 'LogoutManager');

      authStorage.clearTokens();
      dispatch(setUser(null));
      navigate({
        to: AUTH_ROUTES.LOGIN,
        replace: true,
      });
    }
  };

  const quickLogout = () => {
    // For quick logout without API call (e.g., when offline)
    authStorage.clearTokens();
    dispatch(setUser(null));
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
