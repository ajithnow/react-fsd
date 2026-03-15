[**FSD Admin Documentation v0.0.1**](../../README.md)

***

[FSD Admin Documentation](../../modules.md) / [shared](../README.md) / DataTableProps

# Interface: DataTableProps\<T\>

Defined in: [shared/components/DataTable/dataTable.model.ts:39](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L39)

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Properties

### className?

> `optional` **className**: `string`

Defined in: [shared/components/DataTable/dataTable.model.ts:61](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L61)

***

### columns

> **columns**: [`DataTableColumn`](DataTableColumn.md)\<`T`\>[]

Defined in: [shared/components/DataTable/dataTable.model.ts:41](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L41)

***

### data

> **data**: `T`[]

Defined in: [shared/components/DataTable/dataTable.model.ts:40](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L40)

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [shared/components/DataTable/dataTable.model.ts:62](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L62)

***

### filters?

> `optional` **filters**: [`FilterConfig`](FilterConfig.md)[]

Defined in: [shared/components/DataTable/dataTable.model.ts:56](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L56)

***

### initialFilters?

> `optional` **initialFilters**: [`FilterValues`](../type-aliases/FilterValues.md)

Defined in: [shared/components/DataTable/dataTable.model.ts:57](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L57)

***

### initialSort?

> `optional` **initialSort**: [`SortConfig`](SortConfig.md)

Defined in: [shared/components/DataTable/dataTable.model.ts:58](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L58)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [shared/components/DataTable/dataTable.model.ts:50](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L50)

***

### onFilterChange()?

> `optional` **onFilterChange**: (`filters`) => `void`

Defined in: [shared/components/DataTable/dataTable.model.ts:55](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L55)

#### Parameters

##### filters

[`FilterValues`](../type-aliases/FilterValues.md)

#### Returns

`void`

***

### onPageChange()?

> `optional` **onPageChange**: (`page`) => `void`

Defined in: [shared/components/DataTable/dataTable.model.ts:52](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L52)

#### Parameters

##### page

`number`

#### Returns

`void`

***

### onPageSizeChange()?

> `optional` **onPageSizeChange**: (`pageSize`) => `void`

Defined in: [shared/components/DataTable/dataTable.model.ts:53](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L53)

#### Parameters

##### pageSize

`number`

#### Returns

`void`

***

### onRowClick()?

> `optional` **onRowClick**: (`item`) => `void`

Defined in: [shared/components/DataTable/dataTable.model.ts:64](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L64)

#### Parameters

##### item

`T`

#### Returns

`void`

***

### onSelectionChange()?

> `optional` **onSelectionChange**: (`selected`) => `void`

Defined in: [shared/components/DataTable/dataTable.model.ts:47](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L47)

Called when selection changes with array of selected ids

#### Parameters

##### selected

`string`[]

#### Returns

`void`

***

### onSortChange()?

> `optional` **onSortChange**: (`sort`) => `void`

Defined in: [shared/components/DataTable/dataTable.model.ts:54](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L54)

#### Parameters

##### sort

[`SortConfig`](SortConfig.md) | `null`

#### Returns

`void`

***

### pageSizeOptions?

> `optional` **pageSizeOptions**: `number`[]

Defined in: [shared/components/DataTable/dataTable.model.ts:63](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L63)

***

### pagination?

> `optional` **pagination**: [`PaginationInfo`](PaginationInfo.md)

Defined in: [shared/components/DataTable/dataTable.model.ts:51](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L51)

***

### rowClassName()?

> `optional` **rowClassName**: (`item`) => `string`

Defined in: [shared/components/DataTable/dataTable.model.ts:67](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L67)

Optional function to compute a className for a specific row item

#### Parameters

##### item

`T`

#### Returns

`string`

***

### rowClickable?

> `optional` **rowClickable**: `boolean`

Defined in: [shared/components/DataTable/dataTable.model.ts:65](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L65)

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`item`) => `string`

Defined in: [shared/components/DataTable/dataTable.model.ts:49](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L49)

Key or accessor to use for row identity (defaults to 'id'|'key' fallback)

***

### selectable?

> `optional` **selectable**: `boolean`

Defined in: [shared/components/DataTable/dataTable.model.ts:43](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L43)

If true, show row selection checkboxes

***

### selected?

> `optional` **selected**: `string`[]

Defined in: [shared/components/DataTable/dataTable.model.ts:45](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L45)

Controlled selected ids (string keys)

***

### showFilters?

> `optional` **showFilters**: `boolean`

Defined in: [shared/components/DataTable/dataTable.model.ts:60](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L60)

***

### showPagination?

> `optional` **showPagination**: `boolean`

Defined in: [shared/components/DataTable/dataTable.model.ts:59](https://github.com/ajithnow/react-fsd/blob/f6d5d93d977318dc75105d605f12ba0adbd0fb5d/src/shared/components/DataTable/dataTable.model.ts#L59)
