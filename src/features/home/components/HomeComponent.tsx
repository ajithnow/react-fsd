import { AuthGuard } from "../../auth/guards";
import { FeatureToggle } from "../../../shared/components";
import { useUsersManager } from "../managers/users.manager";
import { UserDataTable } from "./UserDataTable";
import { FilterValues } from "../../../shared/components/DataTable";

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
      <div style={{ padding: '20px' }}>
        <h1>Home Page</h1>
        
        <FeatureToggle feature="auth.enabled">
          <div style={{ border: '2px solid green', padding: '10px', margin: '10px 0' }}>
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
              margin: '10px 0'
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
              margin: '10px 0'
            }}
          >
            Register Now
          </button>
        </FeatureToggle>
        
        {/* User Management DataTable */}
        <div style={{ marginTop: '40px' }}>
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
    </AuthGuard>
  );
};
