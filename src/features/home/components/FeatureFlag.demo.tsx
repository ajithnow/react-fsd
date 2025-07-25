import React from 'react';
import { useFeatureFlags, useFeatureFlag } from '../../../shared/utils/featureFlags';

export const FeatureFlagDemo: React.FC = () => {
  // Using the full hook
  const { getAllFlags, isEnabled } = useFeatureFlags();
  
  // Using individual flag hook
  const newUI = useFeatureFlag<boolean>('newUI');
  const buttonColor = useFeatureFlag<string>('experiments.buttonColor');
  
  const allFlags = getAllFlags();
  
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h2>Feature Flags Demo</h2>
      
      <div>
        <h3>Individual Flags:</h3>
        <p>New UI: {newUI ? '✅ Enabled' : '❌ Disabled'}</p>
        <p>Analytics: {isEnabled('analytics') ? '✅ Enabled' : '❌ Disabled'}</p>
        <p>Button Color: <span style={{ color: buttonColor }}>{buttonColor}</span></p>
      </div>
      
      <div>
        <h3>All Flags:</h3>
        <pre>{JSON.stringify(allFlags, null, 2)}</pre>
      </div>
      
      <div>
        <p>💡 Edit your <code>.env.local</code> file to override flags:</p>
        <code>{`VITE_FEATURE_FLAGS={"newUI":true,"experiments":{"buttonColor":"red"}}`}</code>
      </div>
    </div>
  );
};
