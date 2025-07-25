import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuthStore } from '../stores/auth.store';
import { useLoginMutation } from '../queries/login.query';
import { authStorage } from '../utils';

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
    const user = { id: 1, name: username, email: `${username}@demo.com` };
    authStorage.setUser(user);
    setUser(user);

    // Get return URL from search params
    const returnUrl = (searchParams as Record<string, unknown>)
      ?.returnUrl as string;
    const destination =
      returnUrl && returnUrl !== '/auth/login' ? returnUrl : '/';

    navigate({ to: destination });
  };

  return {
    handleLogin: loginUser,
    isLoading: isPending,
    error,
  };
};
