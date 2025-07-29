import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeComponent } from '../HomeComponent';
import { useFeatureFlag } from '../../../../shared/utils/featureFlags';

// Mock the users service
jest.mock('../../services/users.service', () => ({
  usersService: {
    getUsers: jest.fn()
  }
}));

// Get the mocked function
const { usersService } = jest.requireMock('../../services/users.service');
const mockGetUsers = usersService.getUsers;

// Mock the auth guards
jest.mock('../../../auth/guards', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-guard">{children}</div>
  )
}));

// Mock the feature flags hook
jest.mock('../../../../shared/utils/featureFlags', () => ({
  useFeatureFlag: jest.fn().mockReturnValue(true)
}));

// Mock the feature toggle component
jest.mock('../../../../shared/components', () => ({
  FeatureToggle: ({ feature, children, fallback }: { 
    feature: string; 
    children: React.ReactNode; 
    fallback?: React.ReactNode;
  }) => {
    // We'll use the actual mock from the imported module
    const { useFeatureFlag } = jest.requireMock('../../../../shared/utils/featureFlags');
    const isEnabled = useFeatureFlag(feature);
    
    return (
      <div data-testid={`feature-toggle-${feature}`}>
        {isEnabled ? children : fallback}
      </div>
    );
  }
}));

// Get the mocked function
const mockUseFeatureFlag = useFeatureFlag as jest.MockedFunction<typeof useFeatureFlag>;

describe('HomeComponent', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Set default return values
    mockUseFeatureFlag.mockReturnValue(true);
    
    // Mock API response
    mockGetUsers.mockResolvedValue({
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive' }
      ],
      total: 2,
      page: 1,
      pageSize: 10
    });
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('should render the home page title', () => {
    renderWithQueryClient(<HomeComponent />);
    
    expect(screen.getByText('Home Page')).toBeTruthy();
  });

  it('should be wrapped in AuthGuard', () => {
    renderWithQueryClient(<HomeComponent />);
    
    expect(screen.getByTestId('auth-guard')).toBeTruthy();
  });

  it('should render auth enabled message when auth is enabled', () => {
    mockUseFeatureFlag.mockImplementation((flag: string) => {
      if (flag === 'auth.enabled') return true;
      return false;
    });
    
    renderWithQueryClient(<HomeComponent />);
    
    expect(screen.getByText('Authentication Module is enabled!')).toBeTruthy();
  });

  it('should show login button when login feature is enabled', () => {
    mockUseFeatureFlag.mockImplementation((flag: string) => {
      if (flag === 'auth.enabled') return false;  
      if (flag === 'auth.features.login') return true;
      if (flag === 'auth.features.register') return false;
      return false;
    });
    
    renderWithQueryClient(<HomeComponent />);
    
    expect(screen.getByText('Login Available')).toBeTruthy();
  });

  it('should show login disabled message when login feature is disabled', () => {
    mockUseFeatureFlag.mockImplementation((flag: string) => {
      if (flag === 'auth.enabled') return true;
      if (flag === 'auth.features.login') return false;
      if (flag === 'auth.features.register') return false;
      return false;
    });
    
    renderWithQueryClient(<HomeComponent />);
    
    expect(screen.getByText('Login feature is disabled')).toBeTruthy();
  });

  it('should show register button when register feature is enabled', () => {
    mockUseFeatureFlag.mockImplementation((flag: string) => {
      if (flag === 'auth.enabled') return false;
      if (flag === 'auth.features.login') return false;
      if (flag === 'auth.features.register') return true;
      return false;
    });
    
    renderWithQueryClient(<HomeComponent />);
    
    expect(screen.getByText('Register Now')).toBeTruthy();
  });

  it('should show register disabled message when register feature is disabled', () => {
    mockUseFeatureFlag.mockImplementation((flag: string) => {
      if (flag === 'auth.enabled') return false;
      if (flag === 'auth.features.login') return false;
      if (flag === 'auth.features.register') return false;
      return false;
    });
    
    renderWithQueryClient(<HomeComponent />);
    
    expect(screen.getByText('Registration is currently disabled')).toBeTruthy();
  });

  it('should call useFeatureFlag with correct auth flags', () => {
    renderWithQueryClient(<HomeComponent />);
    
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('auth.enabled');
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('auth.features.login');
  });

  it('should render all feature toggles with correct feature flags', () => {
    renderWithQueryClient(<HomeComponent />);
    
    expect(screen.getByTestId('feature-toggle-auth.enabled')).toBeTruthy();
    expect(screen.getByTestId('feature-toggle-auth.features.login')).toBeTruthy();
    expect(screen.getByTestId('feature-toggle-auth.features.register')).toBeTruthy();
  });

  it('should have proper styling for buttons', () => {
    mockUseFeatureFlag.mockImplementation((flag: string) => {
      if (flag === 'auth.enabled') return true;
      if (flag === 'auth.features.login') return true;
      if (flag === 'auth.features.register') return true;
      return true;
    });
    
    renderWithQueryClient(<HomeComponent />);
    
    const loginButton = screen.getByText('Login Available');
    const registerButton = screen.getByText('Register Now');
    
    expect(loginButton.tagName).toBe('BUTTON');
    expect(registerButton.tagName).toBe('BUTTON');
  });

  it('should handle mixed feature flag states', () => {
    mockUseFeatureFlag.mockImplementation((flag: string) => {
      if (flag === 'auth.enabled') return true;
      if (flag === 'auth.features.login') return true;
      if (flag === 'auth.features.register') return false;
      return false;
    });
    
    renderWithQueryClient(<HomeComponent />);
    
    // Auth enabled and login enabled
    expect(screen.getByText('Authentication Module is enabled!')).toBeTruthy();
    expect(screen.getByText('Login Available')).toBeTruthy();
    
    // But register disabled
    expect(screen.getByText('Registration is currently disabled')).toBeTruthy();
  });

  it('should render the UserDataTable component', () => {
    renderWithQueryClient(<HomeComponent />);
    
    expect(screen.getByTestId('user-data-table')).toBeTruthy();
  });
});
