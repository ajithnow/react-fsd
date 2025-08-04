import { z } from 'zod';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateZipCode,
  validateOptionalText,
  customerStatusEnum,
} from './validation.utils';

export const customerFormSchema = z.object({
  firstName: validateName('First name'),
  lastName: validateName('Last name'),
  email: validateEmail(),
  phone: validatePhone(),
  company: validateOptionalText('Company name'),
  status: z.enum(customerStatusEnum, {
    message: 'Please select a valid status',
  }),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: validateZipCode(),
      country: z.string().optional(),
    })
    .optional(),
});

// Additional schemas for other customer operations
export const customerIdSchema = z.object({
  id: z.string().min(1, 'Customer ID is required'),
});

export const customerFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(customerStatusEnum).optional(),
  company: z.string().optional(),
});

export const customerListParamsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  status: z.enum(customerStatusEnum).optional(),
  sortBy: z
    .enum(['firstName', 'lastName', 'email', 'createdAt', 'totalSpent'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CustomerIdData = z.infer<typeof customerIdSchema>;
export type CustomerFilterData = z.infer<typeof customerFilterSchema>;
export type CustomerListParamsData = z.infer<typeof customerListParamsSchema>;
