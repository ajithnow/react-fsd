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

export interface User extends RBACUser{ id: number; name: string };

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export type AuthRoutes = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];

export interface AuthLayoutProps {
  children: React.ReactNode;
}
