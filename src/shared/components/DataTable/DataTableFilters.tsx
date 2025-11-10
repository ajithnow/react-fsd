import { Input } from '../../../lib/shadcn/components/ui/input';
import { Button } from '../../../lib/shadcn/components/ui/button';
import { Badge } from '../../../lib/shadcn/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../lib/shadcn/components/ui/select';
import { FilterX } from 'lucide-react';
import { DataTableFiltersProps, FilterValues } from './dataTable.model';
import { useTranslation } from 'react-i18next';
import { MultiSelect } from '../../../lib/shadcn/components/ui/multiselect';
import { DebouncedInput } from './DebouncedInput';
import { Popover, PopoverTrigger, PopoverContent } from '../../../lib/shadcn/components/ui/popover';
import { Calendar } from '../../../lib/shadcn/components/ui/calendar';
import { format } from 'date-fns';

type DateRangePayload = { from?: string; to?: string } | null;

function DateRangePicker({
  filter,
  fromDate,
  toDate,
  onChange,
}: Readonly<{
  filter: { id: string; label: string; placeholder?: string };
  fromDate?: Date;
  toDate?: Date;
  onChange: (p: DateRangePayload) => void;
}>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] text-left">
          {fromDate && toDate
            ? `${format(fromDate, 'yyyy-MM-dd')} → ${format(toDate, 'yyyy-MM-dd')}`
            : filter.placeholder || filter.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-2">
          <Calendar
            mode="range"
            selected={fromDate || toDate ? { from: fromDate, to: toDate } : undefined}
            onSelect={(range: { from?: Date; to?: Date } | undefined) => {
              const payload: Record<string, string | undefined> = {};
              if (range?.from) payload.from = format(range.from, 'yyyy-MM-dd');
              if (range?.to) payload.to = format(range.to, 'yyyy-MM-dd');
              onChange(Object.keys(payload).length ? payload : null);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DataTableFilters({
  filters,
  values,
  onFilterChange,
  onClearFilters,
}: Readonly<DataTableFiltersProps>) {
  const { t } = useTranslation('shared');
  const handleFilterChange = (filterId: string, value: FilterValues[string]) => {
    const newFilters: FilterValues = {
      ...values,
      [filterId]: value,
    };
    
    // Remove empty values
    Object.keys(newFilters).forEach(key => {
      if (
        newFilters[key] === null ||
        newFilters[key] === undefined ||
        newFilters[key] === '' ||
        (Array.isArray(newFilters[key]) && (newFilters[key] as unknown[]).length === 0)
      ) {
        delete newFilters[key];
      }
    });
    
    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(values).filter(value => value).length;
  };

  const renderFilter = (filter: (typeof filters)[0]) => {
    const value = values[filter.id];

    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={value ? String(value) : ''}
            onValueChange={newValue => handleFilterChange(filter.id, newValue)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  filter.placeholder ||
                  t('dataTable.selectPlaceholder', {
                    label: filter.label,
                    defaultValue: `Select ${filter.label}`,
                  })
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <MultiSelect
            options={filter.options || []}
            selected={Array.isArray(value) ? value : []}
            onChange={selected => handleFilterChange(filter.id, selected)}
            placeholder={
              filter.placeholder ||
              t('dataTable.selectPlaceholder', {
                label: filter.label,
                defaultValue: `Select ${filter.label}`,
              })
            }
            className="w-[180px]"
          />
        );

      case 'text':
        return (
          <DebouncedInput
            placeholder={
              filter.placeholder ||
              t('dataTable.filterPlaceholder', {
                label: filter.label,
                defaultValue: `Filter ${filter.label}`,
              })
            }
            value={value ? String(value) : ''}
            onChange={newValue => handleFilterChange(filter.id, newValue)}
            className="w-[180px]"
            debounceMs={500}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={
              filter.placeholder ||
              t('dataTable.filterPlaceholder', {
                label: filter.label,
                defaultValue: `Filter ${filter.label}`,
              })
            }
            value={value ? String(value) : ''}
            onChange={e => handleFilterChange(filter.id, e.target.value)}
            className="w-[180px]"
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value ? String(value) : ''}
            onChange={e => handleFilterChange(filter.id, e.target.value)}
            className="w-[180px]"
          />
        );

      case 'dateRange':
        {
          const val = value as { from?: string; to?: string } | undefined;
          const fromDate = val?.from ? new Date(val.from) : undefined;
          const toDate = val?.to ? new Date(val.to) : undefined;

          return (
            <DateRangePicker
              filter={filter}
              fromDate={fromDate}
              toDate={toDate}
              onChange={(payload) => handleFilterChange(filter.id, payload as FilterValues[string])}
            />
          );
        }

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {filters.map(filter => (
          <div key={filter.id} className="flex flex-col space-y-1">
            <label className="text-sm font-medium">{filter.label}</label>
            {renderFilter(filter)}
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        {getActiveFiltersCount() > 0 && (
          <>
            <Badge variant="secondary">
              {getActiveFiltersCount() > 1
                ? t('dataTable.filtersPlural', {
                    count: getActiveFiltersCount(),
                    defaultValue: '{{count}} filters active',
                  })
                : t('dataTable.filtersSingular', {
                    count: getActiveFiltersCount(),
                    defaultValue: '{{count}} filter active',
                  })}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="h-8 px-2 lg:px-3"
            >
              <FilterX className="mr-2 h-4 w-4" />
              {t('dataTable.clear', { defaultValue: 'Clear' })}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
