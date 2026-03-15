import React from 'react';

export interface CanProps {
  /** Permission to check (e.g., 'users:create') */
  perform: string;
  /** Component to render if permission is granted */
  children: React.ReactNode;
  /** Optional component to render if permission is denied */
  no?: React.ReactNode;
}
