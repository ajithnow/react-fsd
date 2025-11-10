import {
  format,
  parseISO,
  isAfter,
  isBefore,
  isEqual,
  isValid,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
} from 'date-fns';
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { de, enUS } from 'date-fns/locale';

/**
 * Supported locales for date formatting
 */
export const DATE_LOCALES = {
  en: enUS,
  de: de,
} as const;

export type SupportedLanguage = keyof typeof DATE_LOCALES;

/**
 * Default timezone for the application
 */
export const DEFAULT_TIMEZONE = 'Europe/Berlin';

/**
 * Date comparison utilities
 */
export const dateComparisons = {
  /**
   * Check if date1 is after date2
   */
  isAfter: (date1: Date | string | number, date2: Date | string | number): boolean => {
    return isAfter(parseDate(date1), parseDate(date2));
  },

  /**
   * Check if date1 is before date2
   */
  isBefore: (date1: Date | string | number, date2: Date | string | number): boolean => {
    return isBefore(parseDate(date1), parseDate(date2));
  },

  /**
   * Check if two dates are equal
   */
  isEqual: (date1: Date | string | number, date2: Date | string | number): boolean => {
    return isEqual(parseDate(date1), parseDate(date2));
  },

  /**
   * Check if date is today
   */
  isToday: (date: Date | string | number): boolean => {
    const today = new Date();
    const targetDate = parseDate(date);
    return isEqual(startOfDay(targetDate), startOfDay(today));
  },

  /**
   * Check if date is yesterday
   */
  isYesterday: (date: Date | string | number): boolean => {
    const yesterday = subDays(new Date(), 1);
    const targetDate = parseDate(date);
    return isEqual(startOfDay(targetDate), startOfDay(yesterday));
  },

  /**
   * Check if date is tomorrow
   */
  isTomorrow: (date: Date | string | number): boolean => {
    const tomorrow = addDays(new Date(), 1);
    const targetDate = parseDate(date);
    return isEqual(startOfDay(targetDate), startOfDay(tomorrow));
  },

  /**
   * Check if date is within the current week
   */
  isThisWeek: (date: Date | string | number): boolean => {
    const now = new Date();
    const targetDate = parseDate(date);
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    return targetDate >= weekStart && targetDate <= weekEnd;
  },

  /**
   * Check if date is within the current month
   */
  isThisMonth: (date: Date | string | number): boolean => {
    const now = new Date();
    const targetDate = parseDate(date);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    return targetDate >= monthStart && targetDate <= monthEnd;
  },

  /**
   * Check if date is in the past
   */
  isPast: (date: Date | string | number): boolean => {
    const now = new Date();
    const targetDate = parseDate(date);
    // Consider dates within 1 second of now as "current" (not past)
    const oneSecondAgo = new Date(now.getTime() - 1000);
    return isBefore(targetDate, oneSecondAgo);
  },

  /**
   * Check if date is in the future
   */
  isFuture: (date: Date | string | number): boolean => {
    const now = new Date();
    const targetDate = parseDate(date);
    // Consider dates within 1 second of now as "current" (not future)
    const oneSecondFromNow = new Date(now.getTime() + 1000);
    return isAfter(targetDate, oneSecondFromNow);
  },
};

/**
 * Date difference utilities
 */
export const dateDifferences = {
  /**
   * Get difference in days
   */
  inDays: (date1: Date | string | number, date2: Date | string | number): number => {
    return differenceInDays(parseDate(date1), parseDate(date2));
  },

  /**
   * Get difference in hours
   */
  inHours: (date1: Date | string | number, date2: Date | string | number): number => {
    return differenceInHours(parseDate(date1), parseDate(date2));
  },

  /**
   * Get difference in minutes
   */
  inMinutes: (date1: Date | string | number, date2: Date | string | number): number => {
    return differenceInMinutes(parseDate(date1), parseDate(date2));
  },

  /**
   * Get difference in seconds
   */
  inSeconds: (date1: Date | string | number, date2: Date | string | number): number => {
    return differenceInSeconds(parseDate(date1), parseDate(date2));
  },
};

/**
 * Date formatting utilities
 */
export const dateFormatters = {
  /**
   * Format date with timezone support
   */
  formatWithTimezone: (
    date: Date | string | number,
    formatStr: string = 'PP p',
    timezone: string = DEFAULT_TIMEZONE
  ): string => {
    return formatInTimeZone(parseDate(date), timezone, formatStr);
  },

  /**
   * Format date with locale support
   */
  formatWithLocale: (
    date: Date | string | number,
    formatStr: string = 'PP',
    language: SupportedLanguage = 'en'
  ): string => {
    if (!dateValidators.isValid(date)) {
      return '-';
    }
    return format(parseDate(date), formatStr, { locale: DATE_LOCALES[language] });
  },

  /**
   * Format relative time (e.g., "2 days ago", "in 3 hours")
   */
  formatRelative: (date: Date | string | number): string => {
    if (!dateValidators.isValid(date)) {
      return '-';
    }

    const now = new Date();
    const targetDate = parseDate(date);
    const diffInDays = differenceInDays(targetDate, now);

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays > 0) return `In ${diffInDays} days`;
    return `${Math.abs(diffInDays)} days ago`;
  },

  /**
   * Format for billing/invoice dates
   */
  formatBillingDate: (date: Date | string | number, timezone: string = DEFAULT_TIMEZONE): string => {
    if (!dateValidators.isValid(date)) {
      return '-';
    }
    return formatInTimeZone(parseDate(date), timezone, 'PP');
  },

  /**
   * Format for display in tables/lists
   */
  formatTableDate: (date: Date | string | number, timezone: string = DEFAULT_TIMEZONE): string => {
    if (!dateValidators.isValid(date)) {
      return '-';
    }
    return formatInTimeZone(parseDate(date), timezone, 'P');
  },

  /**
   * Format for input fields
   */
  formatInputDate: (date: Date | string | number): string => {
    if (!dateValidators.isValid(date)) {
      return '';
    }
    return format(parseDate(date), 'yyyy-MM-dd');
  },
};

/**
 * Date range utilities
 */
export const dateRanges = {
  /**
   * Get start and end of today
   */
  today: (): { start: Date; end: Date } => ({
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  }),

  /**
   * Get start and end of yesterday
   */
  yesterday: (): { start: Date; end: Date } => {
    const yesterday = subDays(new Date(), 1);
    return {
      start: startOfDay(yesterday),
      end: endOfDay(yesterday),
    };
  },

  /**
   * Get start and end of this week
   */
  thisWeek: (): { start: Date; end: Date } => ({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date()),
  }),

  /**
   * Get start and end of this month
   */
  thisMonth: (): { start: Date; end: Date } => ({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  }),

  /**
   * Get date range for last N days
   */
  lastNDays: (days: number): { start: Date; end: Date } => ({
    start: startOfDay(subDays(new Date(), days)),
    end: endOfDay(new Date()),
  }),

  /**
   * Get date range for next N days
   */
  nextNDays: (days: number): { start: Date; end: Date } => ({
    start: startOfDay(new Date()),
    end: endOfDay(addDays(new Date(), days)),
  }),
};

/**
 * Timezone utilities
 */
export const timezoneUtils = {
  /**
   * Convert local time to UTC
   */
  toUTC: (date: Date | string | number, timezone: string = DEFAULT_TIMEZONE): Date => {
    return fromZonedTime(parseDate(date), timezone);
  },

  /**
   * Convert UTC to local timezone
   */
  fromUTC: (date: Date | string | number, timezone: string = DEFAULT_TIMEZONE): Date => {
    return toZonedTime(parseDate(date), timezone);
  },

  /**
   * Get current time in specific timezone
   */
  nowInTimezone: (timezone: string = DEFAULT_TIMEZONE): Date => {
    return toZonedTime(new Date(), timezone);
  },
};

/**
 * Validation utilities
 */
export const dateValidators = {
  /**
   * Check if date is valid
   */
  isValid: (date: unknown): boolean => {
    try {
      // Check for null/empty dates that appear as "0001-01-01T00:00:00"
      if (typeof date === 'string') {
        const dateStr = date.trim();
        // Common null date patterns
        if (dateStr === '' ||
            dateStr === '0001-01-01T00:00:00' ||
            dateStr === '0001-01-01T00:00:00Z' ||
            dateStr === '0001-01-01' ||
            dateStr === '1900-01-01T00:00:00' ||
            dateStr === '1900-01-01T00:00:00Z' ||
            dateStr === '1900-01-01') {
          return false;
        }
      }

      const parsedDate = parseDate(date as string | number | Date);
      return isValid(parsedDate) && !isNaN(parsedDate.getTime());
    } catch {
      return false;
    }
  },

  /**
   * Check if date string is in ISO format
   */
  isISODate: (dateString: string): boolean => {
    const date = parseISO(dateString);
    return isValid(date) && !isNaN(date.getTime());
  },

  /**
   * Check if date is within range
   */
  isWithinRange: (
    date: Date | string | number,
    start: Date | string | number,
    end: Date | string | number
  ): boolean => {
    const targetDate = parseDate(date);
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    return targetDate >= startDate && targetDate <= endDate;
  },
};

/**
 * Helper function to parse various date inputs
 */
function parseDate(date: Date | string | number): Date {
  if (date instanceof Date) return date;
  if (typeof date === 'string') return parseISO(date);
  if (typeof date === 'number') return new Date(date);
  throw new Error('Invalid date input');
}

/**
 * Business logic utilities
 */
export const businessDateUtils = {
  /**
   * Check if date is a business day (Monday-Friday)
   */
  isBusinessDay: (date: Date | string | number): boolean => {
    const targetDate = parseDate(date);
    const dayOfWeek = targetDate.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday = 1, Friday = 5
  },

  /**
   * Get next business day
   */
  getNextBusinessDay: (date: Date | string | number = new Date()): Date => {
    let targetDate = parseDate(date);
    do {
      targetDate = addDays(targetDate, 1);
    } while (!businessDateUtils.isBusinessDay(targetDate));
    return targetDate;
  },

  /**
   * Calculate working days between two dates
   */
  getWorkingDays: (start: Date | string | number, end: Date | string | number): number => {
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    let workingDays = 0;
    let currentDate = startDate;

    while (currentDate <= endDate) {
      if (businessDateUtils.isBusinessDay(currentDate)) {
        workingDays++;
      }
      currentDate = addDays(currentDate, 1);
    }

    return workingDays;
  },
};
