# Customer Schema

This folder contains all Zod validation schemas and validation utilities for the customers feature.

## Files

### `customer.schema.ts`

Contains the main Zod schemas for customer-related operations:

- `customerFormSchema` - Validation for customer create/edit forms
- `customerIdSchema` - Validation for customer ID parameters
- `customerFilterSchema` - Validation for customer filtering
- `customerListParamsSchema` - Validation for customer list pagination and sorting

### `validation.utils.ts`

Contains reusable validation functions and patterns:

- `validateName()` - Name validation with customizable min/max lengths
- `validateEmail()` - Email validation with proper format checking
- `validatePhone()` - Phone number validation with international format support
- `validateZipCode()` - ZIP/postal code validation
- `validateOptionalText()` - Generic optional text field validation
- `customerStatusEnum` - Predefined customer status values

### `index.ts`

Exports all schemas and validation utilities for easy importing.

## Usage

```typescript
// Import specific schemas
import { customerFormSchema, CustomerFormData } from '../schema';

// Import validation utilities
import { validateName, customerStatusEnum } from '../schema';

// Import everything
import * from '../schema';
```

## Benefits

1. **Centralized Validation**: All validation logic is in one place
2. **Reusability**: Common validation patterns can be reused across components
3. **Type Safety**: TypeScript types are automatically generated from Zod schemas
4. **Consistency**: Ensures consistent validation rules across the feature
5. **Maintainability**: Easy to update validation rules in one location
