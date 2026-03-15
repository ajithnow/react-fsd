[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / USAGE\_ENDPOINTS

# Variable: USAGE\_ENDPOINTS

> `const` **USAGE\_ENDPOINTS**: `object`

Defined in: [shared/constants/endPoints.constants.ts:17](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/constants/endPoints.constants.ts#L17)

USAGE_ENDPOINTS

Shared API endpoint  used by both Dashboard and Customer modules
to fetch usage data (daily, monthly, yearly).

These endpoints are dynamic — they handle both individual customer data
and overall customer power usage.

- If "id" is provided then fetch usage for that individual customer.
- If "id" is omitted  then fetch total usage of all customers.

## Type Declaration

### CUSTOMER

> **CUSTOMER**: `object`

#### CUSTOMER.DAILY()

> **DAILY**: (`id`, `date`) => `string`

##### Parameters

###### id

`string`

###### date

`string`

##### Returns

`string`

#### CUSTOMER.MONTHLY()

> **MONTHLY**: (`id`, `year`, `month`) => `string`

##### Parameters

###### id

`string`

###### year

`number`

###### month

`number`

##### Returns

`string`

#### CUSTOMER.YEARLY()

> **YEARLY**: (`id`, `year`) => `string`

##### Parameters

###### id

`string`

###### year

`number`

##### Returns

`string`

### GLOBAL

> **GLOBAL**: `object`

#### GLOBAL.DAILY()

> **DAILY**: (`date`) => `string`

##### Parameters

###### date

`string`

##### Returns

`string`

#### GLOBAL.MONTHLY()

> **MONTHLY**: (`year`, `month`) => `string`

##### Parameters

###### year

`number`

###### month

`number`

##### Returns

`string`

#### GLOBAL.YEARLY()

> **YEARLY**: (`year`) => `string`

##### Parameters

###### year

`number`

##### Returns

`string`
