[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / dateRanges

# Variable: dateRanges

> `const` **dateRanges**: `object`

Defined in: [shared/utils/date.utils.ts:251](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/utils/date.utils.ts#L251)

Date range utilities

## Type Declaration

### lastNDays()

> **lastNDays**: (`days`) => `object`

Get date range for last N days

#### Parameters

##### days

`number`

#### Returns

`object`

##### end

> **end**: `Date`

##### start

> **start**: `Date`

### nextNDays()

> **nextNDays**: (`days`) => `object`

Get date range for next N days

#### Parameters

##### days

`number`

#### Returns

`object`

##### end

> **end**: `Date`

##### start

> **start**: `Date`

### thisMonth()

> **thisMonth**: () => `object`

Get start and end of this month

#### Returns

`object`

##### end

> **end**: `Date`

##### start

> **start**: `Date`

### thisWeek()

> **thisWeek**: () => `object`

Get start and end of this week

#### Returns

`object`

##### end

> **end**: `Date`

##### start

> **start**: `Date`

### today()

> **today**: () => `object`

Get start and end of today

#### Returns

`object`

##### end

> **end**: `Date`

##### start

> **start**: `Date`

### yesterday()

> **yesterday**: () => `object`

Get start and end of yesterday

#### Returns

`object`

##### end

> **end**: `Date`

##### start

> **start**: `Date`
