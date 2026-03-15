[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / useRBAC

# Function: useRBAC()

> **useRBAC**(): `object`

Defined in: [shared/hooks/useRBAC.ts:15](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/hooks/useRBAC.ts#L15)

## Returns

`object`

### canAccessFeature()

> **canAccessFeature**: (`featurePerms`) => `boolean`

#### Parameters

##### featurePerms

`string`[]

#### Returns

`boolean`

### getMissingPermissions()

> **getMissingPermissions**: (`required`) => `string`[]

#### Parameters

##### required

`string`[]

#### Returns

`string`[]

### getRoleInfo()

> **getRoleInfo**: (`role`) => [`RolePermissions`](../../core/interfaces/RolePermissions.md) \| `undefined`

#### Parameters

##### role

`string`

#### Returns

[`RolePermissions`](../../core/interfaces/RolePermissions.md) \| `undefined`

### hasAllPermissions()

> **hasAllPermissions**: (`perms`) => `boolean`

#### Parameters

##### perms

`string`[]

#### Returns

`boolean`

### hasAnyPermission()

> **hasAnyPermission**: (`perms`) => `boolean`

#### Parameters

##### perms

`string`[]

#### Returns

`boolean`

### hasAnyRole()

> **hasAnyRole**: (`roles`) => `boolean`

#### Parameters

##### roles

`string`[]

#### Returns

`boolean`

### hasPermission()

> **hasPermission**: (`permission`) => `boolean`

#### Parameters

##### permission

`string`

#### Returns

`boolean`

### hasRole()

> **hasRole**: (`role`) => `boolean`

#### Parameters

##### role

`string`

#### Returns

`boolean`

### isRoleHigherThan()

> **isRoleHigherThan**: (`role1`, `role2`) => `boolean`

#### Parameters

##### role1

`string`

##### role2

`string`

#### Returns

`boolean`

### permissions

> **permissions**: `string`[]

### user

> **user**: [`User`](../../core/interfaces/User.md) \| `null`
