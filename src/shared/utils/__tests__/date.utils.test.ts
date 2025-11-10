import { describe, it, expect } from '@jest/globals';
import {
  dateComparisons,
  dateDifferences,
  dateFormatters,
  dateRanges,
  dateValidators,
  businessDateUtils,
} from '../date.utils';

describe('Date Utils', () => {
  const testDate = new Date('2025-08-28T10:00:00Z'); // Yesterday in UTC
  const now = new Date();

  describe('dateComparisons', () => {
    it('should check if date is today', () => {
      expect(dateComparisons.isToday(now)).toBe(true);
      expect(dateComparisons.isToday(testDate)).toBe(false);
    });

    it('should check if date is yesterday', () => {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      expect(dateComparisons.isYesterday(yesterday)).toBe(true);
    });

    it('should check if date is in the past', () => {
      expect(dateComparisons.isPast(testDate)).toBe(true);
      expect(dateComparisons.isPast(now)).toBe(false);
    });
  });

  describe('dateDifferences', () => {
    it('should calculate difference in days', () => {
      const futureDate = new Date(now);
      futureDate.setDate(futureDate.getDate() + 5);
      expect(dateDifferences.inDays(futureDate, now)).toBe(5);
    });
  });

  describe('dateFormatters', () => {
    it('should format date with timezone', () => {
      const formatted = dateFormatters.formatWithTimezone(testDate, 'PP', 'Europe/Berlin');
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });

    it('should format billing date', () => {
      const formatted = dateFormatters.formatBillingDate(testDate);
      expect(typeof formatted).toBe('string');
    });

    it('should handle invalid dates gracefully', () => {
      expect(dateFormatters.formatBillingDate('0001-01-01T00:00:00')).toBe('-');
      expect(dateFormatters.formatWithLocale('0001-01-01T00:00:00')).toBe('-');
      expect(dateFormatters.formatTableDate('')).toBe('-');
      expect(dateFormatters.formatInputDate('')).toBe('');
      expect(dateFormatters.formatRelative('invalid')).toBe('-');
    });
  });

  describe('dateRanges', () => {
    it('should return today range', () => {
      const range = dateRanges.today();
      expect(range.start).toBeInstanceOf(Date);
      expect(range.end).toBeInstanceOf(Date);
      expect(range.start.getTime()).toBeLessThanOrEqual(range.end.getTime());
    });

    it('should return last N days range', () => {
      const range = dateRanges.lastNDays(7);
      expect(range.start).toBeInstanceOf(Date);
      expect(range.end).toBeInstanceOf(Date);
    });
  });

  describe('dateValidators', () => {
    it('should validate dates', () => {
      expect(dateValidators.isValid(new Date())).toBe(true);
      expect(dateValidators.isValid('invalid')).toBe(false);
      expect(dateValidators.isValid(null)).toBe(false);
      expect(dateValidators.isValid('')).toBe(false);
      expect(dateValidators.isValid('0001-01-01T00:00:00')).toBe(false);
      expect(dateValidators.isValid('0001-01-01T00:00:00Z')).toBe(false);
      expect(dateValidators.isValid('1900-01-01T00:00:00')).toBe(false);
    });

    it('should check ISO date format', () => {
      expect(dateValidators.isISODate('2025-08-29T10:00:00Z')).toBe(true);
      expect(dateValidators.isISODate('invalid')).toBe(false);
    });
  });

  describe('businessDateUtils', () => {
    it('should check if date is business day', () => {
      const monday = new Date('2025-09-01'); // Monday
      const sunday = new Date('2025-08-31'); // Sunday

      expect(businessDateUtils.isBusinessDay(monday)).toBe(true);
      expect(businessDateUtils.isBusinessDay(sunday)).toBe(false);
    });
  });
});
