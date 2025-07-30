import React from 'react';
import { useAuthStore } from '../features/auth/stores/auth.store';
import { 
  useRBAC,
  PermissionGuard, 
  RoleGuard
} from '../core/rbac';
import type { Permission, Role } from '../core/rbac';
import { getRoleInfo, PERMISSIONS, ROLES } from '../shared/utils/rbac.utils';
import { UserSelector } from '../shared/components/UserSelector/UserSelector.demo';

export const RBACDemo: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { user, permissions } = useRBAC();

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">RBAC Demo</h1>
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">Select a user role to see different permissions in action:</p>
          <UserSelector />
        </div>
      </div>
    );
  }

  const roleInfo = getRoleInfo(user.role);
  const allPermissions: Permission[] = Object.values(PERMISSIONS);
  const allRoles: Role[] = Object.values(ROLES);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">RBAC Demo</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* User Selector */}
      <div className="mb-8">
        <UserSelector />
      </div>

      {/* User Info */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Current User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                user.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.status}
              </span>
            </p>
          </div>
          <div>
            <p><strong>Role Description:</strong></p>
            <p className="text-sm text-gray-600">{roleInfo?.description || 'No description available'}</p>
            <p className="mt-2"><strong>Permissions Count:</strong> {permissions.length}</p>
          </div>
        </div>
      </div>

      {/* Permissions Overview */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {permissions.map((permission: Permission) => (
            <span 
              key={permission}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {permission}
            </span>
          ))}
        </div>
      </div>

      {/* Permission-based Guards Demo */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Permission-Based Access Control</h2>
        <div className="space-y-4">
          
          <PermissionGuard 
            permission="users:read"
            fallback={<div className="p-3 bg-red-50 text-red-600 rounded">❌ You don't have permission to view users</div>}
          >
            <div className="p-3 bg-green-50 text-green-600 rounded">✅ You can view users</div>
          </PermissionGuard>

          <PermissionGuard 
            permission="users:delete"
            fallback={<div className="p-3 bg-red-50 text-red-600 rounded">❌ You don't have permission to delete users</div>}
          >
            <div className="p-3 bg-green-50 text-green-600 rounded">✅ You can delete users</div>
          </PermissionGuard>

          <PermissionGuard 
            permission="admin:settings"
            fallback={<div className="p-3 bg-red-50 text-red-600 rounded">❌ You don't have permission to access admin settings</div>}
          >
            <div className="p-3 bg-green-50 text-green-600 rounded">✅ You can access admin settings</div>
          </PermissionGuard>

          <PermissionGuard 
            permissions={['analytics:view', 'analytics:export']}
            requireAll={false}
            fallback={<div className="p-3 bg-red-50 text-red-600 rounded">❌ You don't have any analytics permissions</div>}
          >
            <div className="p-3 bg-green-50 text-green-600 rounded">✅ You have at least one analytics permission</div>
          </PermissionGuard>

        </div>
      </div>

      {/* Role-based Guards Demo */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Role-Based Access Control</h2>
        <div className="space-y-4">
          
          <RoleGuard 
            role="admin"
            fallback={<div className="p-3 bg-red-50 text-red-600 rounded">❌ Admin only section</div>}
          >
            <div className="p-3 bg-green-50 text-green-600 rounded">✅ Welcome Admin! You have full access</div>
          </RoleGuard>

          <RoleGuard 
            roles={['admin', 'manager']}
            fallback={<div className="p-3 bg-red-50 text-red-600 rounded">❌ Management only section</div>}
          >
            <div className="p-3 bg-green-50 text-green-600 rounded">✅ Management section - Admin or Manager access</div>
          </RoleGuard>

          <RoleGuard 
            role="user"
            fallback={<div className="p-3 bg-red-50 text-red-600 rounded">❌ Regular user only section</div>}
          >
            <div className="p-3 bg-green-50 text-green-600 rounded">✅ Regular user section</div>
          </RoleGuard>

        </div>
      </div>

      {/* System Overview */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <h3 className="font-medium mb-2">Available Roles ({allRoles.length})</h3>
            <div className="space-y-2">
              {allRoles.map(role => {
                const info = getRoleInfo(role);
                return (
                  <div key={role} className="p-2 border rounded">
                    <div className="font-medium capitalize">{role}</div>
                    <div className="text-sm text-gray-600">{info?.description || 'No description available'}</div>
                    <div className="text-xs text-gray-500">{info?.permissions.length || 0} permissions</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">All Permissions ({allPermissions.length})</h3>
            <div className="max-h-60 overflow-y-auto">
              <div className="grid grid-cols-1 gap-1">
                {allPermissions.map(permission => (
                  <span 
                    key={permission}
                    className={`px-2 py-1 rounded text-xs ${
                      permissions.includes(permission)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {permissions.includes(permission) ? '✅' : '❌'} {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
