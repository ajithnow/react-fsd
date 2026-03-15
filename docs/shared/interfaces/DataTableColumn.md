[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / DataTableColumn

# Interface: DataTableColumn\<T\>

Defined in: [shared/components/DataTable/dataTable.model.ts:28](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L28)

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Properties

### accessor?

> `optional` **accessor**: keyof `T` \| (`item`) => `unknown`

Defined in: [shared/components/DataTable/dataTable.model.ts:31](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L31)

***

### align?

> `optional` **align**: `"center"` \| `"left"` \| `"right"`

Defined in: [shared/components/DataTable/dataTable.model.ts:36](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L36)

***

### cell()?

> `optional` **cell**: (`item`) => `ReactNode`

Defined in: [shared/components/DataTable/dataTable.model.ts:32](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L32)

#### Parameters

##### item

`T`

#### Returns

`ReactNode`

***

### filterable?

> `optional` **filterable**: `boolean`

Defined in: [shared/components/DataTable/dataTable.model.ts:34](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L34)

***

### header

> **header**: `string`

Defined in: [shared/components/DataTable/dataTable.model.ts:30](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L30)

***

### id

> **id**: `string`

Defined in: [shared/components/DataTable/dataTable.model.ts:29](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L29)

***

### sortable?

> `optional` **sortable**: `boolean`

Defined in: [shared/components/DataTable/dataTable.model.ts:33](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L33)

***

### width?

> `optional` **width**: `string`

Defined in: [shared/components/DataTable/dataTable.model.ts:35](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L35)
