import React from 'react';
import { useLoginManager } from '../managers/login.manager';
import { LoginForm } from '../components';

export const LoginPage: React.FC = () => {
  const { handleLogin, isLoading, error } = useLoginManager();

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
      </div>
      
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
          {error.message}
        </div>
      )}
      
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </>
  );
};