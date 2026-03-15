import { useNavigate, useSearch } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { setUser } from '../stores/auth.slice.ts';
import { useLoginMutation } from '../queries/login.query';
import { authStorage } from '../utils';
import { AUTH_ROUTES } from '../constants';
import ROUTE_CONSTANTS from '@/shared/constants/route.constants';
import { AppDispatch } from '@/core/store';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/shared/hooks/useToast';
import { AxiosError } from 'axios';
import { logger } from '@/core/services/logger.service';

export const useLoginManager = () => {
  const { t } = useTranslation('auth');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as { returnUrl?: string };
  const { notify } = useToast();

  const { mutateAsync: login, isPending, error } = useLoginMutation();

  const loginUser = async (credentials: {
    username: string;
    password: string;
  }) => {
    try {
      const { username, password } = credentials;
      const {
        token,
        user: apiUser,
        refreshToken,
      } = await login({ username, password });

      // Use the centralized auth storage
      authStorage.setToken(token);
      authStorage.setRefreshToken(refreshToken);

      // Use the user data from API response and add email if not present
      const user = {
        ...apiUser,
        Email: apiUser.Email,
        Status: 'active' as const,
      };
      authStorage.setUser(user);
      dispatch(setUser(user));

      // Get return URL from search params
      const returnUrl = searchParams.returnUrl;
      const destination =
        returnUrl && returnUrl !== AUTH_ROUTES.LOGIN
          ? returnUrl
          : ROUTE_CONSTANTS.ROOT;

      notify(t('login.successLogin'), {position: 'bottom-right'} , "success")
      await navigate({ to: destination });
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError ? error.message : t('login.loginFailedError');
      logger.error('Login failed in manager', error, 'LoginManager');
      notify(errorMessage, {position: 'bottom-right'}, "error")
    }
  };

  return {
    handleLogin: loginUser,
    isLoading: isPending,
    error,
  };
};
