import { z } from 'zod';

export const notificationsSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    message: 'Please select a notification type',
  }),
  communicationEmails: z.boolean(),
  marketingEmails: z.boolean(),
  securityEmails: z.boolean(),
});

export type NotificationsFormValues = z.infer<typeof notificationsSchema>;
