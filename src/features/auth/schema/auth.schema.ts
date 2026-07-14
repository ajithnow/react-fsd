import { z } from 'zod';

const useAuthSchema = (t: (key: string) => string) => {
  const createLoginSchema = z.object({
    email: z
      .string()
      .min(1, t('login.emailRequired'))
      .email(t('login.emailInvalid')),
    password: z.string().min(1, t('login.passwordRequired')),
  });

  return {
    login: createLoginSchema,
  };
};

export default useAuthSchema;
