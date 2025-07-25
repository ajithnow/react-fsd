import React from 'react';
import { AuthLayoutProps } from '../models/auth.model';


export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
          <p className="text-lg opacity-90">
            Your journey to amazing experiences starts here. Join our community today.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold">My App</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
