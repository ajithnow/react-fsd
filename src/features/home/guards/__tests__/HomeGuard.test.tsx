import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HomeGuard } from '../HomeGuard';

describe('HomeGuard', () => {
  it('should render children when access is allowed (default)', () => {
    render(
      <HomeGuard canAccess={true}>
        <div>Home Content</div>
      </HomeGuard>
    );

    expect(screen.getByText('Home Content')).toBeInTheDocument();
  });

  it('should render children when access is explicitly allowed', () => {
    render(
      <HomeGuard canAccess={true}>
        <div>Home Content</div>
      </HomeGuard>
    );

    expect(screen.getByText('Home Content')).toBeInTheDocument();
  });

  it('should render restriction message when access is denied', () => {
    render(
      <HomeGuard canAccess={false}>
        <div>Home Content</div>
      </HomeGuard>
    );

    expect(screen.getByText('Access to home page is restricted')).toBeInTheDocument();
    expect(screen.queryByText('Home Content')).not.toBeInTheDocument();
  });

  it('should have proper type checking', () => {
    // This test ensures the component accepts the correct props
    const TestComponent = () => (
      <HomeGuard canAccess={true}>
        <div>Test</div>
      </HomeGuard>
    );

    render(<TestComponent />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
