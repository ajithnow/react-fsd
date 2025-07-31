import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../lib/shadcn/components/ui/table';
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
  emptyMessage = 'No data available',
  pageSizeOptions,
}: Readonly<DataTableProps<T>>) {
  const [currentSort, setCurrentSort] = useState<SortConfig | null>(initialSort || null);
  const [currentFilters, setCurrentFilters] = useState<FilterValues>(initialFilters);
  
  // Use ref to track previous initialFilters to prevent infinite loops
  const prevInitialFiltersRef = useRef<FilterValues>(initialFilters);
  
  // Sync filters when initialFilters prop changes (for URL persistence)
  useEffect(() => {
    // Only update if the filters actually changed (deep comparison)
    const filtersChanged = JSON.stringify(prevInitialFiltersRef.current) !== JSON.stringify(initialFilters);
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

  const getCellValue = (item: T, column: typeof columns[0]): React.ReactNode => {
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

  const getSortIcon = (field: string) => {
    if (!currentSort || currentSort.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    return currentSort.direction === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

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
              {columns.map((column) => (
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
            
            {!loading && data.length > 0 && data.map((item, index) => {
              let itemKey: string;
              if ('id' in item && item.id) {
                itemKey = String(item.id);
              } else if ('key' in item && item.key) {
                itemKey = String(item.key);
              } else {
                itemKey = `row-${index}-${JSON.stringify(item).slice(0, 50)}`;
              }
              
              return (
                <TableRow key={itemKey}>
                  {columns.map((column) => (
                    <TableCell
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
