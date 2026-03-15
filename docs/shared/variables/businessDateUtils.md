[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / businessDateUtils

# Variable: businessDateUtils

> `const` **businessDateUtils**: `object`

Defined in: [shared/utils/date.utils.ts:397](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/utils/date.utils.ts#L397)

Business logic utilities

## Type Declaration

### getNextBusinessDay()

> **getNextBusinessDay**: (`date`) => `Date`

Get next business day

#### Parameters

##### date?

`string` | `number` | `Date`

#### Returns

`Date`

### getWorkingDays()

> **getWorkingDays**: (`start`, `end`) => `number`

Calculate working days between two dates

#### Parameters

##### start

`string` | `number` | `Date`

##### end

`string` | `number` | `Date`

#### Returns

`number`

### isBusinessDay()

> **isBusinessDay**: (`date`) => `boolean`

Check if date is a business day (Monday-Friday)

#### Parameters

##### date

`string` | `number` | `Date`

#### Returns

`boolean`
