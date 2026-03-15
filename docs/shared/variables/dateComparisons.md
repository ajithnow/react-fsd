[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / dateComparisons

# Variable: dateComparisons

> `const` **dateComparisons**: `object`

Defined in: [shared/utils/date.utils.ts:42](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/utils/date.utils.ts#L42)

Date comparison utilities

## Type Declaration

### isAfter()

> **isAfter**: (`date1`, `date2`) => `boolean`

Check if date1 is after date2

#### Parameters

##### date1

`string` | `number` | `Date`

##### date2

`string` | `number` | `Date`

#### Returns

`boolean`

### isBefore()

> **isBefore**: (`date1`, `date2`) => `boolean`

Check if date1 is before date2

#### Parameters

##### date1

`string` | `number` | `Date`

##### date2

`string` | `number` | `Date`

#### Returns

`boolean`

### isEqual()

> **isEqual**: (`date1`, `date2`) => `boolean`

Check if two dates are equal

#### Parameters

##### date1

`string` | `number` | `Date`

##### date2

`string` | `number` | `Date`

#### Returns

`boolean`

### isFuture()

> **isFuture**: (`date`) => `boolean`

Check if date is in the future

#### Parameters

##### date

`string` | `number` | `Date`

#### Returns

`boolean`

### isPast()

> **isPast**: (`date`) => `boolean`

Check if date is in the past

#### Parameters

##### date

`string` | `number` | `Date`

#### Returns

`boolean`

### isThisMonth()

> **isThisMonth**: (`date`) => `boolean`

Check if date is within the current month

#### Parameters

##### date

`string` | `number` | `Date`

#### Returns

`boolean`

### isThisWeek()

> **isThisWeek**: (`date`) => `boolean`

Check if date is within the current week

#### Parameters

##### date

`string` | `number` | `Date`

#### Returns

`boolean`

### isToday()

> **isToday**: (`date`) => `boolean`

Check if date is today

#### Parameters

##### date

`string` | `number` | `Date`

#### Returns

`boolean`

### isTomorrow()

> **isTomorrow**: (`date`) => `boolean`

Check if date is tomorrow

#### Parameters

##### date

`string` | `number` | `Date`

#### Returns

`boolean`

### isYesterday()

> **isYesterday**: (`date`) => `boolean`

Check if date is yesterday

#### Parameters

##### date

`string` | `number` | `Date`

#### Returns

`boolean`
