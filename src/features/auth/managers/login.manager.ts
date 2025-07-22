import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth.store";
import { useLoginMutation } from "../queries/login.query";

export const useLoginManager = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const { mutateAsync: login, isPending, error } = useLoginMutation();

  const loginUser = async (credentials: {
    username: string;
    password: string;
  }) => {
    const { username, password } = credentials;
    const { token } = await login({ username, password });
    localStorage.setItem("authToken", token);
    setUser({ id: 1, name: username, email: `${username}@demo.com` });
    navigate({ to: "/dashboard" });
  };

  return {
    handleLogin: loginUser,
    isLoading: isPending,
    error,
  };
};
