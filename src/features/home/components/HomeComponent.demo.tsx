import { AuthGuard } from '../../auth/guards';
import { FeatureToggle, UserSelector } from '../../../shared/components';
import { PermissionGuard } from '../../../core/rbac';
import { useUsersManager } from '../managers/users.manager.demo';
import { UserDataTable } from './UserDataTable';
import { FilterValues } from '../../../shared/components/DataTable';
import { Link } from '@tanstack/react-router';
import SidebarLayout from '../Layout/SidebarLayout';
import { Header } from './Header/Header';

export const HomeComponent = () => {
  // Initialize filters from URL
  const getInitialFilters = (): FilterValues => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters: FilterValues = {};
    const roleParam = params.get('role');
    if (roleParam) initialFilters.role = roleParam.split(',');
    const statusParam = params.get('status');
    if (statusParam) initialFilters.status = statusParam;
    const nameParam = params.get('name');
    if (nameParam) initialFilters.name = nameParam;
    return initialFilters;
  };

  // Use the users manager hook at page level
  const {
    users,
    pagination,
    loading,
    currentFilters,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleFilterChange,
  } = useUsersManager(getInitialFilters());

  return (
    <AuthGuard>
      <SidebarLayout>
        <Header />
        <div style={{ padding: '20px' }}>
          <div className="flex justify-between items-center mb-6">
            <h1>Home Page</h1>
            <Link
              to="/rbac-demo"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              🔐 RBAC Demo
            </Link>
          </div>

          {/* User Selector for RBAC Demo */}
          <div className="mb-6">
            <UserSelector />
          </div>

          <FeatureToggle feature="auth.enabled">
            <div
              style={{
                border: '2px solid green',
                padding: '10px',
                margin: '10px 0',
              }}
            >
              Authentication Module is enabled!
            </div>
          </FeatureToggle>

          <FeatureToggle
            feature="auth.features.login"
            fallback={<p>Login feature is disabled</p>}
          >
            <button
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '10px 0',
              }}
            >
              Login Available
            </button>
          </FeatureToggle>

          <FeatureToggle
            feature="auth.features.register"
            fallback={<p>Registration is currently disabled</p>}
          >
            <button
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '10px 0',
              }}
            >
              Register Now
            </button>
          </FeatureToggle>

          {/* User Management DataTable */}
          <div style={{ marginTop: '40px' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
              <PermissionGuard
                permission="users:create"
                fallback={
                  <div className="text-sm text-gray-500">
                    ❌ No permission to create users
                  </div>
                }
              >
                <button
                  onClick={() =>
                    alert('Create user functionality would go here')
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ➕ Create User
                </button>
              </PermissionGuard>
            </div>
            <UserDataTable
              users={users}
              loading={loading}
              pagination={pagination}
              currentFilters={currentFilters}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </SidebarLayout>
    </AuthGuard>
  );
};
