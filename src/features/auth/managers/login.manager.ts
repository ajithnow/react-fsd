import { useNavigate, useSearch } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { setUser } from '../stores/auth.slice.ts';
import { authStorage } from '../utils';
import { AUTH_ROUTES } from '../constants';
import ROUTE_CONSTANTS from '@/shared/constants/route.constants';
import { AppDispatch } from '@/core/store';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/shared/hooks/useToast';
import { AxiosError } from 'axios';
import { logger } from '@/core/services/logger.service';
import type { User } from '../models/auth.model';

export const useLoginManager = () => {
  const { t } = useTranslation('auth');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as { returnUrl?: string };
  const { notify } = useToast();

  const onLoginSuccess = async ({
    token,
    user: apiUser,
    refreshToken,
  }: {
    token: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: Record<string, any>;
    refreshToken: string;
  }) => {
    // Use the centralized auth storage
    authStorage.setToken(token);
    authStorage.setRefreshToken(refreshToken);

    // Use the user data from API response and add email if not present
    const user = {
      ...apiUser,
      Email: apiUser.Email,
      Status: 'active' as const,
      // Ensure permissions are set from the API response safely without `any`
      permissions: (apiUser as unknown as { permissions?: string[] }).permissions || [],
    } as unknown as User;
    
    authStorage.setUser(user);
    dispatch(setUser(user));

    // Get return URL from search params
    const returnUrl = searchParams.returnUrl;
    const destination =
      returnUrl && returnUrl !== AUTH_ROUTES.LOGIN
        ? returnUrl
        : ROUTE_CONSTANTS.ROOT;

    notify(t('login.successLogin'), { position: 'bottom-right' }, "success");
    await navigate({ to: destination });
  };

  const onLoginError = (error: unknown) => {
    const errorMessage = error instanceof AxiosError ? error.message : t('login.loginFailedError');
    logger.error('Login failed in manager', error, 'LoginManager');
    notify(errorMessage, { position: 'bottom-right' }, "error");
  };

  return {
    onLoginSuccess,
    onLoginError,
  };
};
