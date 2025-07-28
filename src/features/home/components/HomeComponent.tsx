import { AuthGuard } from "../../auth/guards";
import { FeatureToggle } from "../../../shared/components";
import { FeatureFlagDemo } from "./FeatureFlag.demo";
import { UserDataTableExample } from "../../../shared/components/DataTable/dataTable.demo";

export const HomeComponent = () => {
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
        
        <FeatureFlagDemo />
        
        {/* DataTable Example */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
            DataTable Demo
          </h2>
          <UserDataTableExample />
        </div>
      </div>
    </AuthGuard>
  );
};
