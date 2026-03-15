[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / ButtonProps

# Interface: ButtonProps

Defined in: [shared/components/Button/Button.model.ts:5](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/Button/Button.model.ts#L5)

## Extends

- `ComponentProps`\<`"button"`\>.`VariantProps`\<*typeof* `buttonVariants`\>

## Properties

### asChild?

> `optional` **asChild**: `boolean`

Defined in: [shared/components/Button/Button.model.ts:39](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/Button/Button.model.ts#L39)

Whether to render the button as a child component (using Radix Slot)

***

### children

> **children**: `ReactNode`

Defined in: [shared/components/Button/Button.model.ts:9](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/Button/Button.model.ts#L9)

The content to display inside the button

#### Overrides

`React.ComponentProps.children`

***

### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [shared/components/Button/Button.model.ts:34](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/Button/Button.model.ts#L34)

Whether the button should take the full width of its container

***

### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [shared/components/Button/Button.model.ts:14](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/Button/Button.model.ts#L14)

Whether the button is in a loading state

***

### leftIcon?

> `optional` **leftIcon**: `ReactNode`

Defined in: [shared/components/Button/Button.model.ts:24](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/Button/Button.model.ts#L24)

Icon to display on the left side of the button

***

### loadingText?

> `optional` **loadingText**: `string`

Defined in: [shared/components/Button/Button.model.ts:19](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/Button/Button.model.ts#L19)

Text to display when the button is loading

***

### rightIcon?

> `optional` **rightIcon**: `ReactNode`

Defined in: [shared/components/Button/Button.model.ts:29](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/Button/Button.model.ts#L29)

Icon to display on the right side of the button

***

### size?

> `optional` **size**: `"default"` \| `"sm"` \| `"lg"` \| `"icon"` \| `null`

Defined in: [lib/shadcn/components/ui/var/button-variants.ts:19](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/lib/shadcn/components/ui/var/button-variants.ts#L19)

#### Inherited from

`VariantProps.size`

***

### variant?

> `optional` **variant**: `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"` \| `"link"` \| `null`

Defined in: [lib/shadcn/components/ui/var/button-variants.ts:7](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/lib/shadcn/components/ui/var/button-variants.ts#L7)

#### Inherited from

`VariantProps.variant`
