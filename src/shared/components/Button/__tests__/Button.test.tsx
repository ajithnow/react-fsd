import { render, screen, fireEvent } from '@testing-library/react';
import { User, Settings } from 'lucide-react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeTruthy();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button.getAttribute('disabled')).toBe('');
  });

  it('shows loading text when provided', () => {
    render(
      <Button isLoading loadingText="Please wait...">
        Submit
      </Button>
    );
    
    expect(screen.getByText('Please wait...')).toBeTruthy();
    expect(screen.queryByText('Submit')).toBeNull();
  });

  it('renders left icon correctly', () => {
    render(
      <Button leftIcon={<User data-testid="user-icon" />}>
        Profile
      </Button>
    );
    
    expect(screen.getByTestId('user-icon')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('renders right icon correctly', () => {
    render(
      <Button rightIcon={<Settings data-testid="settings-icon" />}>
        Settings
      </Button>
    );
    
    expect(screen.getByTestId('settings-icon')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('applies full width class when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    
    const button = screen.getByRole('button');
    expect(button.className).toContain('w-full');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button.getAttribute('disabled')).toBe('');
  });

  it('is disabled when loading', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button.getAttribute('disabled')).toBe('');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });

  it('passes through additional props', () => {
    render(<Button data-testid="custom-button" type="submit">Submit</Button>);
    
    const button = screen.getByTestId('custom-button');
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('does not show icons when loading', () => {
    render(
      <Button 
        isLoading 
        leftIcon={<User data-testid="user-icon" />}
        rightIcon={<Settings data-testid="settings-icon" />}
      >
        Loading
      </Button>
    );
    
    expect(screen.queryByTestId('user-icon')).toBeNull();
    expect(screen.queryByTestId('settings-icon')).toBeNull();
  });
});
