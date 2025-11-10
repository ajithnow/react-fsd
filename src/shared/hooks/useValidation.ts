import { z } from 'zod';
import { useTranslation } from 'react-i18next';

// Common validation patterns
const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s\-()]{10,}$/,
  zipCode: /^(?=.*\d)[A-Za-z0-9 -]{4,10}$/,
  name: /^[a-zA-ZäöüÄÖÜß\s'.-]{2,}$/,
  address: /^[a-zA-ZäöüÄÖÜß0-9\s,'-.#/]*$/,
} as const;

export const customerStatusEnum = ['active', 'inactive', 'pending'] as const;
export type CustomerStatus = (typeof customerStatusEnum)[number];

export function useValidationSchemas() {
  const { t } = useTranslation('shared');
  const validateName = (fieldName: string, min = 2, max = 50) =>
    z
      .string()
      .min(1, t('required', { fieldName }))
      .min(min, t('validation.min', { fieldName, min }))
      .max(max, t('validation.max', { fieldName, max }))
      .trim()
      .refine(val => validationPatterns.name.test(val), {
        message: t('validation.allowedCharacters', { fieldName }),
      });

  const validateEmail = () =>
    z
      .string()
      .min(1, t('validation.email'))
      .email(t('validation.emailaddress'))
      .max(100, t('validation.email.maxLength'));

  const validateAddress = (fieldName: string, min = 5, max = 100) =>
    z
      .string()
      .min(1, t('required', { fieldName }))
      .min(min, t('validation.min', { fieldName, min }))
      .max(max, t('validation.max', { fieldName, max }))
      .trim()
      .refine(val => validationPatterns.address.test(val), {
        message: t('validation.invalidCharacters', { fieldName }),
      });

      const validateZipCode = (fieldName: string, min = 4, max = 10) =>
        z
          .string()
          .min(1, { message: t('required', { fieldName }) })
          .min(min, { message: t('validation.min', { fieldName, min }) })
          .max(max, { message: t('validation.max', { fieldName, max }) })
          .refine(val => validationPatterns.zipCode.test(val.trim()), {
            message: t('validation.postalCode'),
          });

  const validatePassword = () =>
    z
      .string()
      .min(8, t('validation.password'))
      .refine(val => /[A-Z]/.test(val), {
        message: t('validation.password.uppercase'),
      })
      .refine(val => /[a-z]/.test(val), {
        message: t('validation.password.lowercase'),
      })
      .refine(val => /[0-9]/.test(val), {
        message: t('validation.password.number'),
      });

  const validateOptionalText = (fieldName: string, minLength = 2) =>
    z
      .string()
      .optional()
      .refine(val => !val || val.trim().length >= minLength, {
        message: t('validation.optional', {
          fieldName,
          minLength,
          defaultValue:
            '{{fieldName}} must be at least {{minLength}} characters if provided',
        }),
      });

  return {
    validateName,
    validateEmail,
    validateAddress,
    validateZipCode,
    validateOptionalText,
    validatePassword,
    customerStatusEnum,
  };
}
