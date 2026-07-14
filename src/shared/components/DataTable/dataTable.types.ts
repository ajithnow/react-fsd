import { ReactNode } from 'react';

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'dateRange' | 'multiselect' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export type FilterValues = Record<
  string,
  string | number | boolean | Date | string[] | null | undefined
>;

export interface DataTableColumn<T = Record<string, unknown>> {
  id: string;
  header: string;
  accessor?: keyof T | ((item: T) => unknown);
  cell?: (item: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** If true, show row selection checkboxes */
  selectable?: boolean;
  /** Controlled selected ids (string keys) */
  selected?: string[];
  /** Called when selection changes with array of selected ids */
  onSelectionChange?: (selected: string[]) => void;
  /** Key or accessor to use for row identity (defaults to 'id'|'key' fallback) */
  rowKey?: keyof T | ((item: T) => string);
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sort: SortConfig | null) => void;
  onFilterChange?: (filters: FilterValues) => void;
  filters?: FilterConfig[];
  initialFilters?: FilterValues;
  initialSort?: SortConfig;
  showPagination?: boolean;
  showFilters?: boolean;
  className?: string;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  onRowClick?: (item: T) => void;
  rowClickable?: boolean;
  /** Optional function to compute a className for a specific row item */
  rowClassName?: (item: T) => string;

}

export interface DataTableFiltersProps {
  filters: FilterConfig[];
  values: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  onClearFilters: () => void;
}

export interface DataTablePaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}
