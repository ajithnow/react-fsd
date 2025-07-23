import { z } from 'zod';

const useAuthSchema = (t: (key: string) => string) => {
  const createLoginSchema = z.object({
    username: z.string().min(1, t('login.usernameRequired')),
    password: z.string().min(1, t('login.passwordRequired')),
  });

  return {
    login: createLoginSchema,
  };
};

export default useAuthSchema;
