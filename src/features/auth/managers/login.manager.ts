import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuthStore } from '../stores/auth.store';
import { useLoginMutation } from '../queries/login.query';
import { authStorage } from '../utils';
import { AUTH_ROUTES } from '../constants';
import ROUTE_CONSTANTS from '@/shared/constants/route.constants';

export const useLoginManager = () => {
  const setUser = useAuthStore(s => s.setUser);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });

  const { mutateAsync: login, isPending, error } = useLoginMutation();

  const loginUser = async (credentials: {
    username: string;
    password: string;
  }) => {
    const { username, password } = credentials;
    const { token, user: apiUser } = await login({ username, password });

    // Use the centralized auth storage
    authStorage.setToken(token);

    // Use the user data from API response and add email if not present
    const user = {
      ...apiUser,
      email: apiUser.username || `${username}@example.com`, // Add email field for compatibility
      status: 'active' as const,
    };
    authStorage.setUser(user);
    setUser(user);

    // Get return URL from search params
    const returnUrl = (searchParams as Record<string, unknown>)
      ?.returnUrl as string;
    const destination =
      returnUrl && returnUrl !== AUTH_ROUTES.LOGIN
        ? returnUrl
        : ROUTE_CONSTANTS.ROOT;

    navigate({ to: destination });
  };

  return {
    handleLogin: loginUser,
    isLoading: isPending,
    error,
  };
};
