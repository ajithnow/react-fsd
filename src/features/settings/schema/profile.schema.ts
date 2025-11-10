import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be no more than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be no more than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.string(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
