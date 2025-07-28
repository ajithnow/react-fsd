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
