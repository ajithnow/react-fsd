import { AuthGuard } from "../../auth/guards";
import { FeatureToggle } from "../../../shared/components";
import { useFeatureFlag } from "../../../shared/utils/featureFlags";
import { FeatureFlagDemo } from "./FeatureFlag.demo";

export const HomeComponent = () => {
  const authEnabled = useFeatureFlag<boolean>('auth.enabled');
  const loginEnabled = useFeatureFlag<boolean>('auth.features.login');
  
  return (
    <AuthGuard>
      <div style={{ padding: '20px' }}>
        <h1>Home Page</h1>
        
        <FeatureToggle feature="auth.enabled">
          <div style={{ border: '2px solid green', padding: '10px', margin: '10px 0' }}>
            ✨ Authentication Module is enabled!
          </div>
        </FeatureToggle>
        
        <div style={{ margin: '20px 0' }}>
          <h3>Auth Features Status:</h3>
          <p>Auth Module: {authEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
          <p>Login Feature: {loginEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
        </div>
        
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
            🔐 Login Available
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
            📝 Register Now
          </button>
        </FeatureToggle>
        
        <FeatureFlagDemo />
      </div>
    </AuthGuard>
  );
};
