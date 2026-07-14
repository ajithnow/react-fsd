import { useMemo } from 'react';
import { DataTable } from '@/shared/components/DataTable';
import { ActionsDropdown } from '@/shared/components/ActionsDropdown';
import type { ActionItem } from '@/shared/components/ActionsDropdown/actionDropdown.types';
import type { ResourceDataTableProps } from './resourceDataTable.types';
import type { DataTableColumn } from '@/shared/components/DataTable/dataTable.types';

function ActionsCell<T>({
  item,
  getActions,
}: {
  item: T;
  getActions: (item: T) => ActionItem[];
}) {
  const actions = getActions(item);
  if (!actions.length) {
    return null;
  }
  return <ActionsDropdown actions={actions} className="hover:cursor-pointer" />;
}

export function ResourceDataTable<T>({
  data,
  columns,
  loading = false,
  pagination,
  currentFilters,
  filters,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  onRowClick,
  getActions,
  actionsHeader = 'Actions',
  actionsWidth = '120px',
  emptyMessage = 'No results found',
  pageSizeOptions = [5, 10, 20, 50],
  showPagination = true,
  showFilters = true,
  className,
  tableClassName = 'bg-white',
  testId,
  toolbar,
}: ResourceDataTableProps<T>) {
  const resolvedColumns = useMemo((): DataTableColumn<T>[] => {
    if (!getActions) {
      return columns;
    }

    const actionsColumn: DataTableColumn<T> = {
      id: 'actions',
      header: actionsHeader,
      width: actionsWidth,
      cell: item => <ActionsCell item={item} getActions={getActions} />,
    };

    return [...columns, actionsColumn];
  }, [columns, getActions, actionsHeader, actionsWidth]);

  return (
    <div data-testid={testId} className={className}>
      {toolbar}
      <DataTable<T>
        data={data}
        columns={resolvedColumns}
        loading={loading}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
        filters={filters}
        initialFilters={currentFilters}
        showPagination={showPagination}
        showFilters={showFilters}
        emptyMessage={emptyMessage}
        pageSizeOptions={pageSizeOptions}
        onRowClick={onRowClick}
        className={tableClassName}
      />
    </div>
  );
}
