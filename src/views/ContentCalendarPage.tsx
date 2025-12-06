import React, { useMemo, useState } from "react";
import { ArticleCategoryBadge } from "@/components/articles";
import { Tag } from "@/components/ui";
import {
  formatDate,
  isToday,
  toISODateString,
  getCategoryColor,
  getMonthMatrix,
  cn,
} from "@/utils";
import type { CalendarArticle } from "@/types";
import { BookOpen, FlaskConical, Flame } from "lucide-react";

export interface ContentCalendarPageProps {
  articles: CalendarArticle[];
}

export const ContentCalendarPage: React.FC<ContentCalendarPageProps> = ({
  articles,
}) => {
  const today = new Date();
  const todayISO = toISODateString(today);

  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthMatrix = useMemo(
    () => getMonthMatrix(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );

  const articlesByDate = useMemo(() => {
    const map = new Map<string, CalendarArticle[]>();
    for (const article of articles) {
      const key = article.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(article);
    }
    return map;
  }, [articles]);

  const selectedKey = selectedDate && toISODateString(selectedDate);
  const selectedArticles = selectedKey
    ? articlesByDate.get(selectedKey) ?? []
    : [];

  // Upcoming = only planned + today or future
  const upcoming = [...articles]
    .filter(
      (article) => article.status !== "published" && article.date >= todayISO
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);

  const goMonth = (delta: number) => {
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );
    setSelectedDate(null);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Content Calendar
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          See what&apos;s coming up! Click on any day with an article to see the
          preview.
        </p>
      </header>

      {/* Calendar card */}
      <section className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/70">
        {/* Month navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            className="rounded-full border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700 transition-colors hover:border-sky-400 hover:text-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-sky-400 dark:hover:text-sky-400"
            aria-label="Previous month"
          >
            ←
          </button>
          <div className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
            {viewDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <button
            type="button"
            onClick={() => goMonth(1)}
            className="rounded-full border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700 transition-colors hover:border-sky-400 hover:text-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-sky-400 dark:hover:text-sky-400"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="inline-flex h-2 w-2 rounded-full bg-orange-500" />{" "}
            <Flame className="h-2.5 w-2.5" /> Trending
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-flex h-2 w-2 rounded-full bg-sky-500" />{" "}
            <BookOpen className="h-2.5 w-2.5" /> Tutorial
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-flex h-2 w-2 rounded-full bg-purple-500" />{" "}
            <FlaskConical className="h-2.5 w-2.5" /> Deep Dive
          </span>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-[11px]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="py-1 text-center font-mono text-[10px] text-zinc-400 dark:text-zinc-500"
            >
              {d}
            </div>
          ))}

          {monthMatrix.map((week, i) =>
            week.map((date, j) => {
              if (!date) {
                return (
                  <div
                    key={`${i}-${j}`}
                    className="h-10 rounded-lg border border-transparent"
                  />
                );
              }

              const key = toISODateString(date);
              const hasArticles = articlesByDate.has(key);
              const isSelected = selectedDate && key === selectedKey;

              const baseClasses =
                "flex h-10 flex-col items-center justify-center rounded-lg border text-[11px] transition-all";
              const defaultClasses =
                "border-zinc-200 bg-white text-zinc-700 hover:border-sky-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200";
              const todayClasses =
                "border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-900/30 dark:text-amber-200";
              const selectedClasses = "border-sky-500 ring-1 ring-sky-500/60";

              const dotColor =
                hasArticles &&
                getCategoryColor(articlesByDate.get(key)![0].category);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => hasArticles && setSelectedDate(date)}
                  className={cn(
                    baseClasses,
                    isToday(date) ? todayClasses : defaultClasses,
                    isSelected && selectedClasses
                  )}
                >
                  <span className="text-xs font-medium">{date.getDate()}</span>
                  {hasArticles && (
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-1.5 w-1.5 rounded-full",
                        dotColor
                      )}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* Article preview panel */}
      <section aria-label="Selected day articles">
        {selectedArticles.length > 0 ? (
          <div className="space-y-2 rounded-xl border-l-4 border-sky-500 bg-zinc-50/80 p-2 text-sm dark:border-sky-500 dark:bg-zinc-900/70">
            {selectedArticles.map((article) => {
              const isPublished =
                article.status === "published" && Boolean(article.slug);
              const href = isPublished ? `/blog/${article.slug}` : undefined;

              const cardBaseClasses =
                "block -mx-1 rounded-lg px-3 py-2 transition-colors duration-150";
              const cardHoverClasses =
                "hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70";

              const statusBadgeClasses = cn(
                "rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide",
                isPublished
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-200"
                  : "border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
              );

              const inner = (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <ArticleCategoryBadge
                      category={article.category}
                      iconSize="sm"
                    />
                    <span>•</span>
                    <time dateTime={article.date} className="font-mono">
                      {formatDate(article.date)}
                    </time>
                    <span>•</span>
                    <span className={statusBadgeClasses}>
                      {article.status === "planned"
                        ? "Coming soon"
                        : "Published"}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {article.title}
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>
                  {isPublished && (
                    <span className="inline-flex text-xs font-medium text-sky-600 underline-offset-4 hover:underline dark:text-sky-400">
                      Read article →
                    </span>
                  )}
                </div>
              );

              if (isPublished) {
                return (
                  <a
                    key={article.slug ?? article.title}
                    href={href}
                    className={cn(
                      cardBaseClasses,
                      cardHoverClasses,
                      "cursor-pointer"
                    )}
                  >
                    {inner}
                  </a>
                );
              }

              return (
                <div
                  key={article.slug ?? article.title}
                  className={cn(
                    cardBaseClasses,
                    cardHoverClasses,
                    "cursor-default"
                  )}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select a day with an article to see the details.
          </p>
        )}
      </section>

      {/* Upcoming list */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Upcoming Articles
        </h2>
        {upcoming.length > 0 ? (
          <div className="divide-y divide-zinc-200 text-xs dark:divide-zinc-800">
            {upcoming.map((article) => (
              <div key={article.title} className="flex items-center gap-3 py-2">
                <time
                  dateTime={article.date}
                  className="w-24 font-mono text-[11px] text-zinc-500 dark:text-zinc-400"
                >
                  {formatDate(article.date, { month: "short", day: "2-digit" })}
                </time>
                <span
                  className={cn(
                    "inline-flex h-2 w-2 rounded-full",
                    getCategoryColor(article.category)
                  )}
                  aria-hidden="true"
                />
                <span className="text-zinc-700 dark:text-zinc-200">
                  {article.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No upcoming articles scheduled.
          </p>
        )}
      </section>
    </div>
  );
};

export default ContentCalendarPage;
