import type z from 'zod';
import type { AUTH_ROUTES } from '../constants/routes.constants';
import type useAuthSchema from '../schema/auth.schema';
import type { Permission, Role } from '@/shared/lib/rbac';

/** `POST /api/auth/login` and `POST /api/auth/refresh` body. */
export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
};

/** `GET /api/auth/me` payload (inside `{ data }` if your API wraps it). */
export type MeResponse = {
  id: string;
  email: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
};

/** Session user after `/me` (permissions always resolved). */
export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  roles: Role[];
  permissions: Permission[];
  firstName?: string;
  lastName?: string;
  status: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginFormValues = z.infer<
  ReturnType<typeof useAuthSchema>['login']
>;

export type LoginFormProps = {
  onSubmit: (credentials: LoginFormValues) => void;
  isLoading: boolean;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type AuthRoutes = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];

export type AuthLayoutProps = {
  children: React.ReactNode;
};
