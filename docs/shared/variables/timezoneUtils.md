[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / timezoneUtils

# Variable: timezoneUtils

> `const` **timezoneUtils**: `object`

Defined in: [shared/utils/date.utils.ts:307](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/utils/date.utils.ts#L307)

Timezone utilities

## Type Declaration

### fromUTC()

> **fromUTC**: (`date`, `timezone`) => `Date`

Convert UTC to local timezone

#### Parameters

##### date

`string` | `number` | `Date`

##### timezone?

`string` = `DEFAULT_TIMEZONE`

#### Returns

`Date`

### nowInTimezone()

> **nowInTimezone**: (`timezone`) => `Date`

Get current time in specific timezone

#### Parameters

##### timezone?

`string` = `DEFAULT_TIMEZONE`

#### Returns

`Date`

### toUTC()

> **toUTC**: (`date`, `timezone`) => `Date`

Convert local time to UTC

#### Parameters

##### date

`string` | `number` | `Date`

##### timezone?

`string` = `DEFAULT_TIMEZONE`

#### Returns

`Date`
