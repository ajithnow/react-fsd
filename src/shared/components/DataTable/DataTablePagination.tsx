import { Button } from '../../../lib/shadcn/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../lib/shadcn/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { DataTablePaginationProps } from './dataTable.model';
import { useTranslation } from 'react-i18next';

export function DataTablePagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: DataTablePaginationProps) {
  const { t } = useTranslation('shared');
  const { page, pageSize, total, totalPages } = pagination;
  
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const rowsPerPageLabel = t('dataTable.rowsPerPage', { defaultValue: 'Rows per page' });
  const showingLabel = t('dataTable.showing', { start: startItem, end: endItem, total, defaultValue: `Showing ${startItem} to ${endItem} of ${total} entries` });

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {showingLabel}
      </div>
      
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{rowsPerPageLabel}</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t('dataTable.pageOf', { page, totalPages, defaultValue: `Page {{page}} of {{totalPages}}` })}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
          >
            <span className="sr-only">{t('dataTable.goToFirst', { defaultValue: 'Go to first page' })}</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(page - 1)}
            disabled={!canGoPrevious}
          >
            <span className="sr-only">{t('dataTable.goToPrevious', { defaultValue: 'Go to previous page' })}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoNext}
          >
            <span className="sr-only">{t('dataTable.goToNext', { defaultValue: 'Go to next page' })}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
          >
            <span className="sr-only">{t('dataTable.goToLast', { defaultValue: 'Go to last page' })}</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
