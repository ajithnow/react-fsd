import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/features/auth/stores/auth.slice';
import { hasPermission } from './utils';

export interface CanProps {
  /** Permission to check (e.g., 'users:create') */
  perform: string;
  /** Component to render if permission is granted */
  children: React.ReactNode;
  /** Optional component to render if permission is denied */
  no?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ perform, children, no = null }) => {
  const user = useSelector(selectAuthUser);

  if (hasPermission(user, perform)) {
    return <>{children}</>;
  }

  return <>{no}</>;
};

export default Can;
