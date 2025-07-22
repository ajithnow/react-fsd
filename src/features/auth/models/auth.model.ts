import type z from "zod";
import type { AUTH_ROUTES } from "../constants/routes.constants";
import type { createLoginSchema } from "../schema/auth.schema";

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export interface LoginFormProps {
  onSubmit: (credentials: LoginFormValues) => void;
  isLoading: boolean;
}

export type User = { id: number; name: string; email: string };

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export type AuthRoutes = typeof AUTH_ROUTES[keyof typeof AUTH_ROUTES];