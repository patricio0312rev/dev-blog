import type { ArticleCategory } from "@/types";

/**
 * Formats a date string to a readable format
 */
export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }
): string {
  return new Date(date).toLocaleDateString("en-US", options);
}

/**
 * Gets the day and month from a date string
 */
export function getDayMonth(date: string): { day: string; month: string } {
  const d = new Date(date);
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "short" }),
  };
}

/**
 * Checks if a date is today
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
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Generates a calendar month matrix
 */
export function getMonthMatrix(year: number, month: number): (Date | null)[][] {
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
