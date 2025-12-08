import type { ArticleCategory } from "@/types";

/**
 * Normalize incoming date (string or Date) to a Date in UTC.
 * - "YYYY-MM-DD" is treated as a pure UTC calendar date.
 */
export function normalizeDateInput(date: string | Date): Date {
  if (date instanceof Date) return date;

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  return new Date(date);
}

/**
 * Returns an ISO timestamp string (for meta tags, JSON-LD) from a calendar date.
 */
export function toISODateTimeUTC(date: string | Date): string {
  return normalizeDateInput(date).toISOString();
}

/**
 * Formats a date to a readable string, always in UTC.
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }
): string {
  const d = normalizeDateInput(date);

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    ...options,
  }).format(d);
}

/**
 * Gets the day and month from a date, always in UTC.
 */
export function getDayMonth(
  date: string | Date
): { day: string; month: string } {
  const d = normalizeDateInput(date);

  const day = d.getUTCDate().toString().padStart(2, "0");
  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(d);

  return { day, month };
}

/**
 * Checks if a date is today (still fine in local time)
 */
export function isToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString();
}

/**
 * Converts a date to ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Gets the Tailwind color classes for a category
 */
export function getCategoryColor(category: ArticleCategory): string {
  const colors: Record<ArticleCategory, string> = {
    trending: "bg-orange-500",
    tutorial: "bg-sky-500",
    "deep-dive": "bg-purple-500",
  };
  return colors[category];
}

/**
 * Combines class names, filtering out falsy values
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Generates a calendar month matrix
 */
export function getMonthMatrix(
  year: number,
  month: number
): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks: (Date | null)[][] = [];
  let current = 1 - startDay;

  while (current <= daysInMonth) {
    const week: (Date | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (current < 1 || current > daysInMonth) {
        week.push(null);
      } else {
        week.push(new Date(year, month, current));
      }
      current++;
    }
    weeks.push(week);
  }
  return weeks;
}
