import type z from 'zod';
import type { AUTH_ROUTES } from '../constants/routes.constants';
import type useAuthSchema from '../schema/auth.schema';
import type { User as RBACUser } from '@/core';

export type LoginFormValues = z.infer<
  ReturnType<typeof useAuthSchema>['login']
>;

export interface LoginFormProps {
  onSubmit: (credentials: LoginFormValues) => void;
  isLoading: boolean;
}

export interface User extends RBACUser {
  Name: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  /** Optional stable id from the me/profile API */
  Id?: string;
  /** Account lifecycle status from the me/profile API */
  Status?: string;
}

/** Tokens-only login result — identity comes from getProfile / me. */
export interface LoginTokens {
  token: string;
  refreshToken: string;
  expiresIn?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type AuthRoutes = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];

export interface AuthLayoutProps {
  children: React.ReactNode;
}
