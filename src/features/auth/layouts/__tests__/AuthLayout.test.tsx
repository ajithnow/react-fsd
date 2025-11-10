import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthLayout } from '../AuthLayout';

// Mock image imports
jest.mock('@/assets/images/logo.png', () => 'test-logo.png');

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'login.welcomeText': 'Welcome to My App',
        'login.welcomeSubText': 'Your journey to amazing experiences starts here. Join our community today.'
      };
      return translations[key] || key;
    }
  })
}));

describe('AuthLayout (fresh)', () => {
  it('renders both desktop and mobile headings', () => {
    render(
      <AuthLayout>
        <div>Login Form</div>
      </AuthLayout>
    );
    // Both headings should be present
    expect(screen.getAllByText('Welcome to My App').length).toBeGreaterThanOrEqual(2);
  });

  it('renders the branding section with logo and description', () => {
    render(
      <AuthLayout>
        <div>Login Form</div>
      </AuthLayout>
    );
    expect(screen.getByAltText('Application Logo')).toBeInTheDocument();
    expect(screen.getByText('Your journey to amazing experiences starts here. Join our community today.')).toBeInTheDocument();
  });

  it('renders children inside the content container', () => {
    render(
      <AuthLayout>
        <div data-testid="auth-form">Login Form</div>
      </AuthLayout>
    );
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });

  it('has correct layout classes for main container', () => {
    const { container } = render(
      <AuthLayout>
        <div>Login Form</div>
      </AuthLayout>
    );
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('min-h-screen');
    expect(mainContainer).toHaveClass('flex');
  });

  
});
