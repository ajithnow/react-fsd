import { z } from "zod";

export const createLoginSchema = (t: (key: string) => string) => {
  return z.object({
    username: z.string().min(1, t("login.usernameRequired")),
    password: z.string().min(1, t("login.passwordRequired")),
  });
};