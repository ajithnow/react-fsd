import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../lib/shadcn/components/ui/table';
import { Checkbox } from '../../../lib/shadcn/components/ui/checkbox';
import { Button } from '../../../lib/shadcn/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DataTableFilters } from './DataTableFilters';
import { DataTablePagination } from './DataTablePagination';
import { DataTableProps, SortConfig, FilterValues } from './dataTable.model';

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  filters = [],
  initialFilters = {},
  initialSort,
  showPagination = true,
  showFilters = true,
  className,
  emptyMessage = undefined,
  pageSizeOptions,
  selectable = false,
  selected = undefined,
  onSelectionChange,
  rowKey,
  onRowClick,
  rowClickable,
  rowClassName
}: Readonly<DataTableProps<T>>) {
  const [currentSort, setCurrentSort] = useState<SortConfig | null>(
    initialSort || null
  );
  const [currentFilters, setCurrentFilters] =
    useState<FilterValues>(initialFilters);
  const [internalSelected, setInternalSelected] = useState<string[]>(
    selected ?? []
  );

  // Use ref to track previous initialFilters to prevent infinite loops
  const prevInitialFiltersRef = useRef<FilterValues>(initialFilters);

  // Sync filters when initialFilters prop changes (for URL persistence)
  useEffect(() => {
    // Only update if the filters actually changed (deep comparison)
    const filtersChanged =
      JSON.stringify(prevInitialFiltersRef.current) !==
      JSON.stringify(initialFilters);
    if (filtersChanged) {
      setCurrentFilters(initialFilters);
      prevInitialFiltersRef.current = initialFilters;
    }
  }, [initialFilters]);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(currentFilters);
    }
  }, [currentFilters, onFilterChange]);

  // Sync controlled selected prop
  useEffect(() => {
    if (selected !== undefined) {
      setInternalSelected(selected);
    }
  }, [selected]);

  const handleSort = (field: string) => {
    let newSort: SortConfig | null;

    if (!currentSort || currentSort.field !== field) {
      newSort = { field, direction: 'asc' };
    } else if (currentSort.direction === 'asc') {
      newSort = { field, direction: 'desc' };
    } else {
      newSort = null;
    }

    setCurrentSort(newSort);
    onSortChange?.(newSort);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setCurrentFilters(newFilters);
  };

  const handleClearFilters = () => {
    setCurrentFilters({});
  };

  const getCellValue = (
    item: T,
    column: (typeof columns)[0]
  ): React.ReactNode => {
    if (column.cell) {
      return column.cell(item);
    }

    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        const value = column.accessor(item);
        return value as React.ReactNode;
      }
      const value = item[column.accessor];
      return value as React.ReactNode;
    }

    return '';
  };

  const getRowId = (item: T, index: number) => {
    if (rowKey) {
      if (typeof rowKey === 'function') return rowKey(item as T);
      const obj = item as unknown as Record<string, unknown>;
      const val = obj[String(rowKey)];
      return val != null ? String(val) : `row-${index}`;
    }

    const obj = item as unknown as Record<string, unknown>;
    if ('id' in obj && obj.id) return String(obj.id);
    if ('key' in obj && obj.key) return String(obj.key);
    return `row-${index}`;
  };

  const isSelected = (id: string) => internalSelected.includes(id);

  const toggleSelect = (id: string) => {
    const next = isSelected(id)
      ? internalSelected.filter(s => s !== id)
      : [...internalSelected, id];
    if (selected === undefined) setInternalSelected(next);
    onSelectionChange?.(next);
  };

  const toggleSelectAll = () => {
    if (internalSelected.length === data.length) {
      if (selected === undefined) setInternalSelected([]);
      onSelectionChange?.([]);
    } else {
      const allIds = data.map((d, i) => getRowId(d, i));
      if (selected === undefined) setInternalSelected(allIds);
      onSelectionChange?.(allIds);
    }
  };

  const getSortIcon = (field: string) => {
    if (!currentSort || currentSort.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }

    return currentSort.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const { t } = useTranslation('shared');

  const resolvedEmptyMessage =
    emptyMessage ?? t('dataTable.noData', { defaultValue: 'No data available' });
  const loadingText = t('dataTable.loading', { defaultValue: 'Loading...' });

  return (
    <div className={cn('space-y-4', className)}>
      {showFilters && filters.length > 0 && (
        <DataTableFilters
          filters={filters}
          values={currentFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead>
                  <Checkbox
                    checked={
                      data.length > 0 && internalSelected.length === data.length
                    }
                    onCheckedChange={() => toggleSelectAll()}
                    aria-label={t('dataTable.selectAll', { defaultValue: 'Select all rows' })}
                  />
                </TableHead>
              )}

              {columns.map(column => (
                <TableHead
                  key={column.id}
                  className={cn(
                    column.width && `w-[${column.width}]`,
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.id)}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      {column.header}
                      {getSortIcon(column.id)}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {resolvedEmptyMessage}
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              data.length > 0 &&
              data.map((item, index) => {
                let itemKey: string;
                if ('id' in item && item.id) {
                  itemKey = String(item.id);
                } else if ('key' in item && item.key) {
                  itemKey = String(item.key);
                } else {
                  itemKey = `row-${index}-${JSON.stringify(item).slice(0, 50)}`;
                }

                const rowId = getRowId(item, index);

                return (
                  <TableRow
                    key={itemKey}
                    className={cn(
                      rowClickable === false ? 'cursor-default' : 'hover:cursor-pointer hover:bg-muted',
                      typeof rowClassName === 'function' ? rowClassName(item) : undefined
                    )}
                  >
                
                  
                
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected(rowId)}
                          onCheckedChange={() => toggleSelect(rowId)}
                          aria-label={t('dataTable.selectRow', { rowId, defaultValue: `Select row ${rowId}` })}
                        />
                      </TableCell>
                    )}

                    {columns.map(column => (
                      <TableCell
                        onClick={() => column.id !== 'actions' ? onRowClick?.(item) : undefined}
                        key={column.id}
                        className={cn(
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {getCellValue(item, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {showPagination && pagination && (
        <DataTablePagination
          pagination={pagination}
          onPageChange={onPageChange!}
          onPageSizeChange={onPageSizeChange!}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}
