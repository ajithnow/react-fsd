jest.mock('@/lib/shadcn/components/ui/select', () => ({
  Select: ({
    children,
    id,
    onValueChange,
    onChange,
    ...props
  }: {
    children?: React.ReactNode;
    id?: string;
    onValueChange?: (value: string) => void;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  } & Record<string, unknown>) => (
    <select
      id={id}
      {...props}
      onChange={e => {
        onChange?.(e);
        onValueChange?.(e.target.value);
      }}
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children?: React.ReactNode;
  }) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectValue: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  ),
}));

import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomerForm } from './../CustomerForm';
import { Customer } from '../../../models/customer.model';

describe('CustomerForm', () => {
  const defaultProps = {
    initialData: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      status: 'active' as const,
      createdAt: '',
      updatedAt: '',
    },
    onSubmit: jest.fn(),
    isLoading: false,
    mode: 'create' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<CustomerForm {...defaultProps} />);
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
  });

  it('renders address fields', () => {
    render(<CustomerForm {...defaultProps} />);
    expect(screen.getByLabelText(/Street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ZIP Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
  });

  it('populates form with initial data', () => {
    const initialData: Partial<Customer> = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      status: 'inactive',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
      },
    };

    act(() => {
      render(<CustomerForm {...defaultProps} initialData={initialData} />);
    });

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Anytown')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CA')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
    expect(screen.getByDisplayValue('USA')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<CustomerForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');

    await user.click(screen.getByRole('button', { name: /Create Customer/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: undefined,
        company: undefined,
        status: 'active',
        address: undefined,
      });
    });
  });

  it('trims whitespace from form data on submission', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<CustomerForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/First Name/i), '  John  ');
    await user.type(screen.getByLabelText(/Last Name/i), '  Doe  ');
    await user.type(screen.getByLabelText(/Email/i), '  john@example.com  ');
    await user.type(screen.getByLabelText(/Phone/i), '  +1234567890  ');
    await user.type(screen.getByLabelText(/Company/i), '  Test Company  ');

    await user.click(screen.getByRole('button', { name: /Create Customer/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        company: 'Test Company',
        status: 'active',
        address: undefined,
      });
    });
  });

  it('handles address data with some empty fields', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<CustomerForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Street/i), '123 Main St');
    await user.type(screen.getByLabelText(/City/i), 'Anytown');
    // Leave state, zipCode, and country empty

    await user.click(screen.getByRole('button', { name: /Create Customer/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: undefined,
        company: undefined,
        status: 'active',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: undefined,
          zipCode: undefined,
          country: undefined,
        },
      });
    });
  });

  it('excludes address when all fields are empty or whitespace', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<CustomerForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Street/i), '   ');
    await user.type(screen.getByLabelText(/City/i), '   ');

    await user.click(screen.getByRole('button', { name: /Create Customer/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: undefined,
        company: undefined,
        status: 'active',
        address: undefined,
      });
    });
  });

  it('changes status via select', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<CustomerForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');

    // Use a more specific selector for the status select
    const statusSelect = screen.getByRole('combobox');
    await act(async () => {
      await user.selectOptions(statusSelect, 'inactive');
    });

    await user.click(screen.getByRole('button', { name: /Create Customer/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: undefined,
        company: undefined,
        status: 'inactive',
        address: undefined,
      });
    });
  });

  it('displays different button text for edit mode', () => {
    act(() => {
      render(<CustomerForm {...defaultProps} mode="edit" />);
    });

    expect(
      screen.getByRole('button', { name: /Update Customer/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Create Customer/i })
    ).not.toBeInTheDocument();
  });

  it('displays loading state for create mode', () => {
    act(() => {
      render(<CustomerForm {...defaultProps} isLoading={true} />);
    });

    expect(
      screen.getByRole('button', { name: /Creating.../i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Creating.../i })).toBeDisabled();
  });

  it('displays loading state for edit mode', () => {
    act(() => {
      render(<CustomerForm {...defaultProps} mode="edit" isLoading={true} />);
    });

    expect(
      screen.getByRole('button', { name: /Updating.../i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Updating.../i })).toBeDisabled();
  });

  it('disables submit button when form is invalid', () => {
    render(<CustomerForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', {
      name: /Create Customer/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup();

    render(<CustomerForm {...defaultProps} />);

    // Fill in some data
    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');

    // Reset button should now be enabled
    const resetButton = screen.getByRole('button', { name: /Reset Form/i });
    expect(resetButton).not.toBeDisabled();

    await act(async () => {
      await user.click(resetButton);
    });

    // Form should be cleared
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('');
  });

  it('disables reset button when form is not dirty', () => {
    render(<CustomerForm {...defaultProps} />);

    const resetButton = screen.getByRole('button', { name: /Reset Form/i });
    expect(resetButton).toBeDisabled();
  });

  it('shows unsaved changes message when form is dirty', async () => {
    const user = userEvent.setup();

    render(<CustomerForm {...defaultProps} />);

    await act(async () => {
      await user.type(screen.getByLabelText(/First Name/i), 'John');
    });

    expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    act(() => {
      render(<CustomerForm {...defaultProps} isLoading={true} />);
    });

    expect(screen.getByRole('button', { name: /Creating.../i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Reset Form/i })).toBeDisabled();
  });
});
