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
    const { token } = await login({ username, password });

    // Use the centralized auth storage
    authStorage.setToken(token);
    const user = { 
      id: 1, 
      name: username,
      email: `${username}@example.com`,
      role: 'user' as const,
      status: 'active' as const,
      createdAt: new Date().toISOString()
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
