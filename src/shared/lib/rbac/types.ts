export type Permission = string;

export type Role = string;

export type RolePermissions = {
  role: Role;
  permissions: Permission[];
};

/** Session identity used by RBAC. */
export type User = {
  role: Role;
  roles: Role[];
  permissions: Permission[];
};

export type RBACProviderProps = {
  children: React.ReactNode;
  user?: User | null;
  onUserChange?: (user: User | null) => void;
};

export type PermissionGuardProps = {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
};
