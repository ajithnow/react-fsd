import React from 'react';
import { useLoginManager } from '../managers/login.manager';
import { LoginForm } from '../components/LoginForm/loginForm';

export const LoginPage: React.FC = () => {
  const { handleLogin, isLoading, error } = useLoginManager();

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </div>
  );
};