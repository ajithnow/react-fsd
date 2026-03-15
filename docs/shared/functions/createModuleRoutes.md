[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / createModuleRoutes

# Function: createModuleRoutes()

> **createModuleRoutes**\<`T`\>(`moduleName`, `routes`): [`ModuleRoutes`](../type-aliases/ModuleRoutes.md)\<`T`\>

Defined in: [shared/utils/route.utils.ts:18](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/utils/route.utils.ts#L18)

Creates a set of routes prefixed with the module name

## Type Parameters

### T

`T` *extends* [`RouteRecord`](../type-aliases/RouteRecord.md)

## Parameters

### moduleName

`string`

The name of the module (e.g., 'auth', 'home', 'admin')

### routes

`T`

Object with route names as keys and route paths as values

## Returns

[`ModuleRoutes`](../type-aliases/ModuleRoutes.md)\<`T`\>

Object with module-prefixed routes
