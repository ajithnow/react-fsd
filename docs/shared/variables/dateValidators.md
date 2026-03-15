[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / dateValidators

# Variable: dateValidators

> `const` **dateValidators**: `object`

Defined in: [shared/utils/date.utils.ts:333](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/utils/date.utils.ts#L333)

Validation utilities

## Type Declaration

### isISODate()

> **isISODate**: (`dateString`) => `boolean`

Check if date string is in ISO format

#### Parameters

##### dateString

`string`

#### Returns

`boolean`

### isValid()

> **isValid**: (`date`) => `boolean`

Check if date is valid

#### Parameters

##### date

`unknown`

#### Returns

`boolean`

### isWithinRange()

> **isWithinRange**: (`date`, `start`, `end`) => `boolean`

Check if date is within range

#### Parameters

##### date

`string` | `number` | `Date`

##### start

`string` | `number` | `Date`

##### end

`string` | `number` | `Date`

#### Returns

`boolean`
