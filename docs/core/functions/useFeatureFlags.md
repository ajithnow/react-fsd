[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [core](../README.md) / useFeatureFlags

# Function: useFeatureFlags()

> **useFeatureFlags**(): `object`

Defined in: [core/featureFlags/features.ts:5](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/core/featureFlags/features.ts#L5)

## Returns

`object`

### flags

> **flags**: [`FeatureFlags`](../interfaces/FeatureFlags.md)

### getAllFlags()

> **getAllFlags**: () => [`FeatureFlags`](../interfaces/FeatureFlags.md)

#### Returns

[`FeatureFlags`](../interfaces/FeatureFlags.md)

### getFeatureFlag()

> **getFeatureFlag**: \<`T`\>(`path`) => `T`

#### Type Parameters

##### T

`T` = `boolean`

#### Parameters

##### path

`string`

#### Returns

`T`

### isEnabled()

> **isEnabled**: (`flagName`) => `boolean`

#### Parameters

##### flagName

`string`

#### Returns

`boolean`
