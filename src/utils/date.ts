import { format, isAfter, isBefore, isSameDay, parseISO } from 'date-fns';

/**
 * Date format options
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  API: 'yyyy-MM-dd',
  FULL: 'PPpp',
} as const;

/**
 * Format a date string for display
 */
export const formatDate = (date: string | Date, formatStr = DATE_FORMATS.DISPLAY): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Check if a date is overdue
 */
export const isOverdue = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(dateObj, today);
};

/**
 * Check if a date is today
 */
export const isToday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isSameDay(dateObj, new Date());
}; 