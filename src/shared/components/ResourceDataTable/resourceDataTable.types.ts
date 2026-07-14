import type { ReactNode } from 'react';
import type {
  DataTableColumn,
  FilterConfig,
  FilterValues,
  PaginationInfo,
  SortConfig,
} from '@/shared/components/DataTable/dataTable.types';
import type { ActionItem } from '@/shared/components/ActionsDropdown/actionDropdown.types';

export type ResourceDataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  pagination: PaginationInfo;
  currentFilters?: FilterValues;
  filters?: FilterConfig[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: SortConfig | null) => void;
  onFilterChange: (filters: FilterValues) => void;
  onRowClick?: (item: T) => void;
  /** Per-row actions; when provided, an actions column is appended. */
  getActions?: (item: T) => ActionItem[];
  actionsHeader?: string;
  actionsWidth?: string;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  showFilters?: boolean;
  className?: string;
  tableClassName?: string;
  testId?: string;
  /** Optional leading / trailing slot above or beside the table chrome */
  toolbar?: ReactNode;
};
