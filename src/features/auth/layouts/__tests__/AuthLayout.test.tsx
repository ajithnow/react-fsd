import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthLayout } from '../AuthLayout';

describe('AuthLayout', () => {
  it('should render children in the layout', () => {
    render(
      <AuthLayout>
        <div>Auth Form Content</div>
      </AuthLayout>
    );

    expect(screen.getByText('Auth Form Content')).toBeInTheDocument();
  });

  it('should render the main heading in the branding section', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    expect(screen.getByText('Welcome to My App')).toBeInTheDocument();
  });

  it('should render the description text in the branding section', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    expect(
      screen.getByText('Your journey to amazing experiences starts here. Join our community today.')
    ).toBeInTheDocument();
  });

  it('should render the mobile app title', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  it('should have proper layout structure with correct CSS classes', () => {
    const { container } = render(
      <AuthLayout>
        <div data-testid="test-content">Test Content</div>
      </AuthLayout>
    );

    // Check main container has full height and flex layout
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('min-h-screen', 'flex');

    // Check branding section has correct classes (hidden on mobile, shown on large screens)
    const brandingSection = container.querySelector('.hidden.lg\\:flex');
    expect(brandingSection).toBeInTheDocument();
    expect(brandingSection).toHaveClass('lg:w-1/2', 'bg-primary', 'text-primary-foreground');

    // Check content section has correct flex classes
    const contentSection = container.querySelector('.flex-1.flex.items-center.justify-center');
    expect(contentSection).toBeInTheDocument();
  });

  it('should render content in a constrained width container', () => {
    render(
      <AuthLayout>
        <div data-testid="auth-content">Login Form</div>
      </AuthLayout>
    );

    const contentContainer = screen.getByTestId('auth-content').parentElement;
    expect(contentContainer).toHaveClass('w-full', 'max-w-md');
  });

  it('should handle multiple children correctly', () => {
    render(
      <AuthLayout>
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </AuthLayout>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
  });

  it('should render empty layout when no children provided', () => {
    const { container } = render(
      <AuthLayout>
        {null}
      </AuthLayout>
    );

    // Should still render the layout structure
    expect(screen.getByText('Welcome to My App')).toBeInTheDocument();
    expect(screen.getByText('My App')).toBeInTheDocument();
    
    // Check that the main structure is present
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('min-h-screen', 'flex');
  });

  it('should have proper responsive design classes', () => {
    const { container } = render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );

    // Mobile title should be hidden on large screens
    const mobileTitle = container.querySelector('.lg\\:hidden');
    expect(mobileTitle).toBeInTheDocument();
    expect(mobileTitle).toHaveTextContent('My App');

    // Branding section should be hidden on small screens
    const brandingSection = container.querySelector('.hidden.lg\\:flex');
    expect(brandingSection).toBeInTheDocument();
  });

  it('should maintain proper semantic structure', () => {
    render(
      <AuthLayout>
        <form data-testid="auth-form">
          <input type="email" placeholder="Email" />
        </form>
      </AuthLayout>
    );

    // Check that the form is properly rendered within the layout
    const form = screen.getByTestId('auth-form');
    expect(form).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();

    // Verify the form is in the correct container
    expect(form.closest('.w-full.max-w-md')).toBeInTheDocument();
  });
});
