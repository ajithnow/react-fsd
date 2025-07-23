import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from '../LoginForm';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Lock: () => <svg data-testid="lock-icon" />,
  User: () => <svg data-testid="user-icon" />,
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eye-off-icon" />,
  Loader2: () => <svg data-testid="loader-icon" />,
}));

// Mock react-i18next
const mockT = jest.fn((key: string, fallback?: string) => fallback || key);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

// Mock the auth schema hook
jest.mock('../../../schema/auth.schema', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    login: {
      parse: jest.fn(),
      safeParse: jest.fn(),
    }
  })),
}));

// Mock zodResolver
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(() => jest.fn()),
}));

// Mock react-hook-form
const mockHandleSubmit = jest.fn((callback) => (e?: React.FormEvent) => {
  e?.preventDefault();
  callback({ username: 'testuser', password: 'password123' });
});

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    handleSubmit: mockHandleSubmit,
    control: {},
  })),
}));

// Mock shadcn/ui components
jest.mock('@/lib/shadcn/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormField: ({ render }: { render: (props: { field: { name: string; value: string; onChange: jest.Mock; onBlur: jest.Mock } }) => React.ReactNode }) => {
    const field = {
      name: 'test',
      value: '',
      onChange: jest.fn(),
      onBlur: jest.fn(),
    };
    return <div>{render({ field })}</div>;
  },
  FormItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  FormControl: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormMessage: () => <div />,
}));

jest.mock('@/lib/shadcn/components/ui/input', () => ({
  Input: React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
    <input ref={ref} data-testid={`input-${props.name || 'input'}`} {...props} />
  )),
}));

jest.mock('@/lib/shadcn/components/ui/button', () => ({
  Button: ({ children, type, ...props }: { children: React.ReactNode; type?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button 
      data-testid={type === 'submit' ? 'submit-button' : 'forgot-password-button'} 
      type={type}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/lib/shadcn/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form', () => {
    render(<LoginForm {...defaultProps} />);
    
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    render(<LoginForm {...defaultProps} isLoading={true} />);

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeDisabled();
  });

  it('should call onSubmit when form is submitted', async () => {
    render(<LoginForm {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should use translation function', () => {
    render(<LoginForm {...defaultProps} />);
    
    expect(mockT).toHaveBeenCalled();
  });

  it('should toggle password visibility when eye button is clicked', () => {
    render(<LoginForm {...defaultProps} />);

    // Find the password input - it should initially be type="password"
    const passwordInputs = screen.getAllByTestId('input-test');
    const passwordInput = passwordInputs[1]; // Second input is password
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Initially should show Eye icon (password hidden)
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('eye-off-icon')).not.toBeInTheDocument();

    // Find and click the eye button
    const eyeButton = screen.getByRole('button', { name: '' }); // The button without name
    fireEvent.click(eyeButton);

    // Password input should now be type="text"
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Should now show EyeOff icon (password visible)
    expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('eye-icon')).not.toBeInTheDocument();

    // Click again to toggle back
    fireEvent.click(eyeButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('eye-off-icon')).not.toBeInTheDocument();
  });
});
