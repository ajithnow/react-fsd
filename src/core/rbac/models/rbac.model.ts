// RBAC (Role-Based Access Control) models and types

export type Permission = string;

export type Role = string;

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
}

export interface User {
  role: Role;
  permissions?: Permission[];
}

export interface RBACProviderProps {
  children: React.ReactNode;
  user?: User | null;
  onUserChange?: (user: User | null) => void;
}

export interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}
