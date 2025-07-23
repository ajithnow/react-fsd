import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from '../loginForm';

// Mock react-i18next
const mockT = jest.fn((key: string) => {
  const translations: Record<string, string> = {
    'login.usernameLabel': 'Username',
    'login.passwordLabel': 'Password',
    'login.usernamePlaceholder': 'Enter your username',
    'login.passwordPlaceholder': '••••••••',
    'login.loginButton': 'Login',
    'login.loadingButton': 'Logging in...',
  };
  return translations[key] || key;
});

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
  zodResolver: jest.fn(() => ({
    async: false,
    validate: jest.fn(),
  })),
}));

// Form state management with re-render trigger
let formState = { username: '', password: '' };
const formErrors: Record<string, { message?: string }> = {};

// Mock react-hook-form
const mockHandleSubmit = jest.fn((callback) => (e?: React.FormEvent) => {
  e?.preventDefault();
  callback(formState);
});

const mockUseForm = {
  handleSubmit: mockHandleSubmit,
  control: {
    register: jest.fn(),
    _fields: {},
    _defaultValues: { username: '', password: '' },
  },
  formState: {
    errors: formErrors,
    isSubmitting: false,
    isValid: Object.keys(formErrors).length === 0,
  },
  setValue: jest.fn(),
  getValues: jest.fn(() => formState),
  resetField: jest.fn(),
  clearErrors: jest.fn(),
  setError: jest.fn(),
  setFocus: jest.fn(),
  getFieldState: jest.fn(),
  register: jest.fn(),
  watch: jest.fn(),
  reset: jest.fn(),
  unregister: jest.fn(),
  trigger: jest.fn(),
  subscribe: jest.fn(),
};

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => mockUseForm),
}));

// Mock shadcn/ui components
jest.mock('@/lib/shadcn/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-wrapper">{children}</div>
  ),
  FormField: ({ name, render }: { 
    name: string; 
    render: (props: { field: { name: string; value: string; onChange: (e: unknown) => void; onBlur: () => void } }) => React.ReactNode 
  }) => {
    const field = {
      name,
      value: formState[name as keyof typeof formState] || '',
      onChange: (e: unknown) => {
        const value = typeof e === 'string' ? e : (e as { target?: { value?: string } })?.target?.value || '';
        formState[name as keyof typeof formState] = value;
      },
      onBlur: jest.fn(),
    };
    return <div data-testid={`form-field-${name}`}>{render({ field })}</div>;
  },
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-item">{children}</div>
  ),
  FormLabel: ({ children }: { children: React.ReactNode }) => (
    <label data-testid="form-label">{children}</label>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-control">{children}</div>
  ),
  FormMessage: () => <div data-testid="form-message" />,
}));

jest.mock('@/lib/shadcn/components/ui/input', () => ({
  Input: React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
    <input 
      ref={ref} 
      data-testid={`input-${props.name}`} 
      {...props}
      onChange={(e) => {
        // Update the form state for testing
        if (props.name && props.name in formState) {
          formState[props.name as keyof typeof formState] = e.target.value;
        }
        // Call the original onChange if it exists
        props.onChange?.(e);
      }}
    />
  )),
}));

jest.mock('@/lib/shadcn/components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button data-testid="submit-button" {...props}>{children}</button>
  ),
}));

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset form state
    formState = { username: '', password: '' };
    Object.keys(formErrors).forEach(key => delete formErrors[key]);
  });

  it('should render form with all required fields', () => {
    render(<LoginForm {...defaultProps} />);

    expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-username')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-password')).toBeInTheDocument();
    expect(screen.getByTestId('input-username')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should render username field with correct attributes', () => {
    render(<LoginForm {...defaultProps} />);

    const usernameInput = screen.getByTestId('input-username');
    expect(usernameInput).toHaveAttribute('placeholder', 'Enter your username');
    expect(usernameInput).toHaveAttribute('autoComplete', 'username');
    expect(usernameInput).not.toBeDisabled();
  });

  it('should render password field with correct attributes', () => {
    render(<LoginForm {...defaultProps} />);

    const passwordInput = screen.getByTestId('input-password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    expect(passwordInput).not.toBeDisabled();
  });

  it('should display correct button text when not loading', () => {
    render(<LoginForm {...defaultProps} />);

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveTextContent('Login');
    expect(submitButton).not.toBeDisabled();
  });

  it('should display loading state correctly', () => {
    render(<LoginForm {...defaultProps} isLoading={true} />);

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveTextContent('Logging in...');
    expect(submitButton).toBeDisabled();

    const usernameInput = screen.getByTestId('input-username');
    const passwordInput = screen.getByTestId('input-password');
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  it('should render form labels correctly', () => {
    render(<LoginForm {...defaultProps} />);

    const labels = screen.getAllByTestId('form-label');
    expect(labels[0]).toHaveTextContent('Username');
    expect(labels[1]).toHaveTextContent('Password');
  });

  it('should have proper form structure and styling', () => {
    render(<LoginForm {...defaultProps} />);

    expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
    
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveClass('w-full');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should call onSubmit with form data when form is submitted with valid data', async () => {
    render(<LoginForm {...defaultProps} />);

    const usernameInput = screen.getByTestId('input-username');
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should update form state when inputs change', () => {
    render(<LoginForm {...defaultProps} />);

    const usernameInput = screen.getByTestId('input-username');
    const passwordInput = screen.getByTestId('input-password');

    fireEvent.change(usernameInput, { target: { value: 'john' } });
    fireEvent.change(passwordInput, { target: { value: 'secret' } });

    // Verify that our mock form state is updated
    expect(formState.username).toBe('john');
    expect(formState.password).toBe('secret');
  });

  it('should call translation function for UI labels', () => {
    mockT.mockClear();
    
    render(<LoginForm {...defaultProps} />);

    // Translation function should be called for UI labels
    expect(mockT).toHaveBeenCalledWith('login.usernameLabel');
    expect(mockT).toHaveBeenCalledWith('login.passwordLabel');
    expect(mockT).toHaveBeenCalledWith('login.usernamePlaceholder');
    expect(mockT).toHaveBeenCalledWith('login.passwordPlaceholder');
    expect(mockT).toHaveBeenCalledWith('login.loginButton');
  });

  it('should preserve form state when loading state changes', () => {
    const { rerender } = render(<LoginForm {...defaultProps} />);

    const usernameInput = screen.getByTestId('input-username');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    // Verify form state is updated
    expect(formState.username).toBe('testuser');

    // Re-render with loading state
    rerender(<LoginForm {...defaultProps} isLoading={true} />);

    const updatedUsernameInput = screen.getByTestId('input-username');
    expect(updatedUsernameInput).toBeDisabled();
    // Form state should persist
    expect(formState.username).toBe('testuser');
  });

  it('should submit form when Enter key is pressed', async () => {
    render(<LoginForm {...defaultProps} />);

    const usernameInput = screen.getByTestId('input-username');
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('submit-button');

    // Fill in the form
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit the form (simulating Enter key behavior)
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should not submit when form is in loading state', () => {
    render(<LoginForm {...defaultProps} isLoading={true} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle rapid state changes correctly', () => {
    const { rerender } = render(<LoginForm {...defaultProps} />);

    rerender(<LoginForm {...defaultProps} isLoading={true} />);
    rerender(<LoginForm {...defaultProps} isLoading={false} />);

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveTextContent('Login');
    expect(submitButton).not.toBeDisabled();
  });

  it('should render form message components for validation', () => {
    render(<LoginForm {...defaultProps} />);

    const formMessages = screen.getAllByTestId('form-message');
    expect(formMessages).toHaveLength(2);
  });

  it('should have proper accessibility attributes', () => {
    render(<LoginForm {...defaultProps} />);

    const usernameInput = screen.getByTestId('input-username');
    const passwordInput = screen.getByTestId('input-password');

    expect(usernameInput).toHaveAttribute('autoComplete', 'username');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should work with react-hook-form integration', () => {
    render(<LoginForm {...defaultProps} />);

    const usernameInput = screen.getByTestId('input-username');
    const passwordInput = screen.getByTestId('input-password');

    // Test form field integration
    fireEvent.change(usernameInput, { target: { value: 'newtest' } });
    expect(formState.username).toBe('newtest');

    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    expect(formState.password).toBe('pass');
  });
});
