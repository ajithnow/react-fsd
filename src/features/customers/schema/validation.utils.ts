import { z } from 'zod';

// Common validation patterns that can be reused
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s\-()]{10,}$/,
  zipCode: /^[\d\w\s-]{3,}$/,
  name: /^[a-zA-Z\s'.-]{2,}$/,
} as const;

// Reusable validation functions
export const validateName = (fieldName: string, min = 2, max = 50) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .min(min, `${fieldName} must be at least ${min} characters`)
    .max(max, `${fieldName} must be less than ${max} characters`)
    .trim()
    .refine(val => validationPatterns.name.test(val), {
      message: `${fieldName} can only contain letters, spaces, apostrophes, dots, and hyphens`,
    });

export const validateEmail = () =>
  z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters');

export const validatePhone = () =>
  z
    .string()
    .optional()
    .refine(val => !val || val.trim().length >= 10, {
      message: 'Phone number must be at least 10 characters if provided',
    })
    .refine(val => !val || validationPatterns.phone.test(val.trim()), {
      message: 'Please enter a valid phone number format',
    });

export const validateZipCode = () =>
  z
    .string()
    .optional()
    .refine(val => !val || validationPatterns.zipCode.test(val.trim()), {
      message: 'Please enter a valid ZIP code',
    });

export const validateOptionalText = (fieldName: string, minLength = 2) =>
  z
    .string()
    .optional()
    .refine(val => !val || val.trim().length >= minLength, {
      message: `${fieldName} must be at least ${minLength} characters if provided`,
    });

// Status enum for reuse
export const customerStatusEnum = ['active', 'inactive', 'pending'] as const;
export type CustomerStatus = (typeof customerStatusEnum)[number];
