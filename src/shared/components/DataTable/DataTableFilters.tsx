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
import { MultiSelect } from '../../../lib/shadcn/components/ui/multiselect';

export function DataTableFilters({
  filters,
  values,
  onFilterChange,
  onClearFilters,
}: DataTableFiltersProps) {
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

  const renderFilter = (filter: typeof filters[0]) => {
    const value = values[filter.id];

    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={value ? String(value) : ''}
            onValueChange={(newValue) => handleFilterChange(filter.id, newValue)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
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
            selected={Array.isArray(value) ? (value as string[]) : []}
            onChange={(selected) => handleFilterChange(filter.id, selected)}
            placeholder={filter.placeholder || `Select ${filter.label}`}
            className="w-[180px]"
          />
        );

      case 'text':
        return (
          <Input
            placeholder={filter.placeholder || `Filter ${filter.label}`}
            value={value ? String(value) : ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-[180px]"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={filter.placeholder || `Filter ${filter.label}`}
            value={value ? String(value) : ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-[180px]"
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value ? String(value) : ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-[180px]"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {filters.map((filter) => (
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
              {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="h-8 px-2 lg:px-3"
            >
              <FilterX className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
