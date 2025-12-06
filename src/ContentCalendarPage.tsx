// src/ContentCalendarPage.tsx
import React, { useMemo, useState } from "react";
import type { ArticleCategory } from "./ArticleCategoryBadge";
import { ArticleCategoryBadge } from "./ArticleCategoryBadge";
import { usePageTitle } from "./usePageTitle";

type CalendarArticle = {
  date: string; // ISO
  title: string;
  category: ArticleCategory;
  tags: string[];
  status: "planned" | "published";
  slug?: string;
};

const calendarArticles: CalendarArticle[] = [
  {
    date: "2025-12-10",
    title: "React Performance in the Real World",
    category: "deep-dive",
    tags: ["react", "performance"],
    status: "planned",
  },
  {
    date: "2025-12-15",
    title: "Building Accessible Components with Tailwind",
    category: "tutorial",
    tags: ["accessibility", "tailwind"],
    status: "planned",
  },
];

const getMonthMatrix = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay(); // 0-6
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
};

export const ContentCalendarPage: React.FC = () => {
  usePageTitle("Content Calendar");

  const today = new Date();
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
    for (const article of calendarArticles) {
      const key = article.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(article);
    }
    return map;
  }, []);

  const selectedKey = selectedDate && selectedDate.toISOString().slice(0, 10);

  const selectedArticles = selectedKey
    ? articlesByDate.get(selectedKey) ?? []
    : [];

  const upcoming = [...calendarArticles]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);

  const goMonth = (delta: number) => {
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );
    setSelectedDate(null);
  };

  const isToday = (d: Date) => d.toDateString() === today.toDateString();

  const legendDot = "inline-flex h-2 w-2 rounded-full";

  const categoryColor = (c: ArticleCategory) =>
    c === "trending"
      ? "bg-orange-500"
      : c === "tutorial"
      ? "bg-sky-500"
      : "bg-purple-500";

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="text-center space-y-2">
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
        {/* Month header */}
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
            <span className={`${legendDot} bg-orange-500`} /> 🔥 Trending
          </span>
          <span className="flex items-center gap-1">
            <span className={`${legendDot} bg-sky-500`} /> 📚 Tutorial
          </span>
          <span className="flex items-center gap-1">
            <span className={`${legendDot} bg-purple-500`} /> 🔬 Deep Dive
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
              const key = date.toISOString().slice(0, 10);
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
                categoryColor(articlesByDate.get(key)![0].category);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => hasArticles && setSelectedDate(date)}
                  className={`${baseClasses} ${
                    isToday(date) ? todayClasses : defaultClasses
                  } ${isSelected ? selectedClasses : ""}`}
                >
                  <span className="text-xs font-medium">{date.getDate()}</span>
                  {hasArticles && (
                    <span
                      className={`mt-0.5 inline-flex h-1.5 w-1.5 rounded-full ${dotColor}`}
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
          <div className="space-y-4 rounded-xl border-l-4 border-sky-500 bg-zinc-50/80 p-4 text-sm dark:border-sky-500 dark:bg-zinc-900/70">
            {selectedArticles.map((article) => (
              <div key={article.title} className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <ArticleCategoryBadge category={article.category} />
                  <span>•</span>
                  <time dateTime={article.date} className="font-mono">
                    {new Date(article.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </time>
                  <span>•</span>
                  <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                    {article.status === "planned" ? "Coming soon" : "Published"}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {article.title}
                </h2>
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {article.status === "published" && article.slug && (
                  <a
                    href={`/blog/${article.slug}`}
                    className="inline-flex text-xs font-medium text-sky-600 underline-offset-4 hover:underline dark:text-sky-400"
                  >
                    Read article →
                  </a>
                )}
              </div>
            ))}
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
        <div className="divide-y divide-zinc-200 text-xs dark:divide-zinc-800">
          {upcoming.map((article) => (
            <div key={article.title} className="flex items-center gap-3 py-2">
              <time
                dateTime={article.date}
                className="w-24 font-mono text-[11px] text-zinc-500 dark:text-zinc-400"
              >
                {new Date(article.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })}
              </time>
              <span
                className={`${legendDot} ${categoryColor(article.category)}`}
                aria-hidden="true"
              />
              <span className="text-zinc-700 dark:text-zinc-200">
                {article.title}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
