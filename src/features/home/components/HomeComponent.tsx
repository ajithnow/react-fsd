import { AuthGuard } from '../../auth/guards';
import { FeatureToggle } from '../../../shared/components';
import { useUsersManager } from '../managers/users.manager';
import { UserDataTable } from './UserDataTable';
import { FilterValues } from '../../../shared/components/DataTable';
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
        <Header>
          <h1 className="text-3xl font-bold">Home Page</h1>
        </Header>
        <div>
          <FeatureToggle feature="auth.enabled">
            <div className="border-2 border-green-500 p-4 mb-4 rounded-lg bg-green-50">
              Authentication Module is enabled!
            </div>
          </FeatureToggle>

          <FeatureToggle
            feature="auth.features.login"
            fallback={<p>Login feature is disabled</p>}
          >
            <button className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-colors mb-4">
              Login Available
            </button>
          </FeatureToggle>

          <FeatureToggle
            feature="auth.features.register"
            fallback={<p>Registration is currently disabled</p>}
          >
            <button className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition-colors mb-4">
              Register Now
            </button>
          </FeatureToggle>

          {/* User Management DataTable */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
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
