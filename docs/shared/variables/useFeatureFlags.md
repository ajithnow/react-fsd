[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / useFeatureFlags

# Variable: useFeatureFlags()

> `const` **useFeatureFlags**: () => `object` = `useCoreFeatureFlags`

Defined in: [shared/utils/featureFlags.ts:4](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/utils/featureFlags.ts#L4)

## Returns

`object`

### flags

> **flags**: [`FeatureFlags`](../../core/interfaces/FeatureFlags.md)

### getAllFlags()

> **getAllFlags**: () => [`FeatureFlags`](../../core/interfaces/FeatureFlags.md)

#### Returns

[`FeatureFlags`](../../core/interfaces/FeatureFlags.md)

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
