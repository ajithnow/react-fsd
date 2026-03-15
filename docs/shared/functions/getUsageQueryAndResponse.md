[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / getUsageQueryAndResponse

# Function: getUsageQueryAndResponse()

> **getUsageQueryAndResponse**(`usageMode`, `dailyUsageQuery`, `monthlyUsageQuery`, `yearlyUsageQuery`): `object`

Defined in: [shared/utils/usage.utils.ts:4](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/utils/usage.utils.ts#L4)

## Parameters

### usageMode

`string`

### dailyUsageQuery

`UseQueryResult`\<`UsageResponse`\>

### monthlyUsageQuery

`UseQueryResult`\<`UsageResponse`\>

### yearlyUsageQuery

`UseQueryResult`\<`UsageResponse`\>

## Returns

`object`

### usageQuery

> **usageQuery**: `UseQueryResult`\<`UsageResponse`\>

### usageResp

> **usageResp**: \{ `points?`: `object`[] \| `null`; `totalDayUsage?`: `number` \| `null`; `totalMonthlyUsage?`: `number` \| `null`; `totalYearUsage?`: `number` \| `null`; \} \| `null`
