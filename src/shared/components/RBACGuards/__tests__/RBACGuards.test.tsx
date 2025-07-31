import { render, screen } from '@testing-library/react';
import { PermissionGuard, RoleGuard, ConditionalRender } from '../RBACGuards';

// Mock useRBAC for all guards
jest.mock('../../../hooks/useRBAC.ts', () => ({
  useRBAC: () => ({
    hasPermission: (perm: string) => perm === 'allowed',
    hasAnyPermission: (perms: string[]) => perms.includes('allowed'),
    hasAllPermissions: (perms: string[]) => perms.every((p) => p === 'allowed'),
    hasRole: (role: string) => role === 'admin',
    hasAnyRole: (roles: string[]) => roles.includes('admin'),
    isAuthenticated: () => true,
  }),
}));

describe('RBACGuards', () => {
  it('PermissionGuard renders children if has permission', () => {
    render(
      <PermissionGuard permission="allowed">
        <div>Permitted</div>
      </PermissionGuard>
    );
    expect(screen.getByText('Permitted')).toBeInTheDocument();
  });

  it('PermissionGuard renders fallback if no permission', () => {
    render(
      <PermissionGuard permission="denied" fallback={<span>Denied</span>}>
        <div>Permitted</div>
      </PermissionGuard>
    );
    expect(screen.getByText('Denied')).toBeInTheDocument();
  });

  it('RoleGuard renders children if has role', () => {
    render(
      <RoleGuard role="admin">
        <div>Admin</div>
      </RoleGuard>
    );
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('RoleGuard renders fallback if no role', () => {
    render(
      <RoleGuard role="user" fallback={<span>Nope</span>}>
        <div>Admin</div>
      </RoleGuard>
    );
    expect(screen.getByText('Nope')).toBeInTheDocument();
  });

  it('ConditionalRender renders children if condition is true', () => {
    render(
      <ConditionalRender condition={true}>
        <div>Show</div>
      </ConditionalRender>
    );
    expect(screen.getByText('Show')).toBeInTheDocument();
  });

  it('ConditionalRender renders fallback if condition is false', () => {
    render(
      <ConditionalRender condition={false} fallback={<span>Hidden</span>}>
        <div>Show</div>
      </ConditionalRender>
    );
    expect(screen.getByText('Hidden')).toBeInTheDocument();
  });
});
