[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / RouteValues

# Type Alias: RouteValues\<T\>

> **RouteValues**\<`T`\> = `T`\[keyof `T`\]

Defined in: [shared/models/route.model.ts:11](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/models/route.model.ts#L11)

Utility type for extracting route values from a routes object

## Type Parameters

### T

`T`

## Example

```ts
const routes = { HOME: '/home', ABOUT: '/about' };
type RouteValues = RouteValues<typeof routes>; // '/home' | '/about'
```
