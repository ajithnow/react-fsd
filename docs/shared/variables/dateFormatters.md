[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / dateFormatters

# Variable: dateFormatters

> `const` **dateFormatters**: `object`

Defined in: [shared/utils/date.utils.ts:172](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/utils/date.utils.ts#L172)

Date formatting utilities

## Type Declaration

### formatBillingDate()

> **formatBillingDate**: (`date`, `timezone`) => `string`

Format for billing/invoice dates

#### Parameters

##### date

`string` | `number` | `Date`

##### timezone?

`string` = `DEFAULT_TIMEZONE`

#### Returns

`string`

### formatInputDate()

> **formatInputDate**: (`date`) => `string`

Format for input fields

#### Parameters

##### date

`string` | `number` | `Date`

#### Returns

`string`

### formatRelative()

> **formatRelative**: (`date`) => `string`

Format relative time (e.g., "2 days ago", "in 3 hours")

#### Parameters

##### date

`string` | `number` | `Date`

#### Returns

`string`

### formatTableDate()

> **formatTableDate**: (`date`, `timezone`) => `string`

Format for display in tables/lists

#### Parameters

##### date

`string` | `number` | `Date`

##### timezone?

`string` = `DEFAULT_TIMEZONE`

#### Returns

`string`

### formatWithLocale()

> **formatWithLocale**: (`date`, `formatStr`, `language`) => `string`

Format date with locale support

#### Parameters

##### date

`string` | `number` | `Date`

##### formatStr?

`string` = `'PP'`

##### language?

`"en"` | `"de"`

#### Returns

`string`

### formatWithTimezone()

> **formatWithTimezone**: (`date`, `formatStr`, `timezone`) => `string`

Format date with timezone support

#### Parameters

##### date

`string` | `number` | `Date`

##### formatStr?

`string` = `'PP p'`

##### timezone?

`string` = `DEFAULT_TIMEZONE`

#### Returns

`string`
