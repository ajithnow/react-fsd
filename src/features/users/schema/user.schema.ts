import { z } from 'zod';
import { useValidationSchemas } from '@/shared/hooks/useValidation';
import { useTranslation } from 'react-i18next';

// User creation schema
export function UserFormSchema() {
  const { validateName, validateEmail } = useValidationSchemas();
  const { t } = useTranslation('users');

  const userSchema = z.object({
    firstName: validateName(t('users.form.firstName')),
    lastName: validateName(t('users.form.lastName')),
    email: validateEmail(),
    // password: validatePassword(),
    role: z.enum(['NORMAL_USER', 'POWER_ADMIN', 'SUPER_ADMIN']),
  });

  return { userSchema };
}
