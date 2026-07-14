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
import type { LoginTokens } from '../models/auth.model';
import authService from '../services';

export const useLoginManager = () => {
  const { t } = useTranslation('auth');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as { returnUrl?: string };
  const { notify } = useToast();
  const { getProfile } = authService.useProfileService();

  const onLoginSuccess = async ({ token, refreshToken }: LoginTokens) => {
    // Persist tokens first so the me/profile request is authenticated
    authStorage.setToken(token);
    authStorage.setRefreshToken(refreshToken);

    try {
      const user = await getProfile();
      authStorage.setUser(user);
      dispatch(setUser(user));
    } catch (error) {
      authStorage.clearTokens();
      dispatch(setUser(null));
      throw error;
    }

    const returnUrl = searchParams.returnUrl;
    const destination =
      returnUrl && returnUrl !== AUTH_ROUTES.LOGIN
        ? returnUrl
        : ROUTE_CONSTANTS.ROOT;

    notify(t('login.successLogin'), { position: 'bottom-right' }, 'success');
    await navigate({ to: destination });
  };

  const onLoginError = (error: unknown) => {
    const errorMessage =
      error instanceof AxiosError
        ? error.message
        : t('login.loginFailedError');
    logger.error('Login failed in manager', error, 'LoginManager');
    notify(errorMessage, { position: 'bottom-right' }, 'error');
  };

  return {
    onLoginSuccess,
    onLoginError,
  };
};
