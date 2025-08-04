import { Customer } from './customer.model';

export interface CustomerFormProps {
  initialData?: Partial<Customer>;
  onSubmit: (data: CustomerFormData) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface CustomerFormAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export type CustomerFormMode = 'create' | 'edit';

export type CustomerFormStatus = 'active' | 'inactive' | 'pending';

// Form field names for easier reference
export const CUSTOMER_FORM_FIELDS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PHONE: 'phone',
  COMPANY: 'company',
  STATUS: 'status',
  ADDRESS: {
    STREET: 'address.street',
    CITY: 'address.city',
    STATE: 'address.state',
    ZIP_CODE: 'address.zipCode',
    COUNTRY: 'address.country',
  },
} as const;

// Status options for the form select
export const CUSTOMER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
] as const;
