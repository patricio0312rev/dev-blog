// src/BlogListPage.tsx
import React, { useState } from "react";
import { Flame, BookOpen, FlaskConical } from "lucide-react";
import {
  ArticleCategoryBadge,
  type ArticleCategory,
} from "./ArticleCategoryBadge";
import { usePageTitle } from "./usePageTitle";

type ArticleListItem = {
  title: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  date: string;
  slug: string;
};

const allArticles: ArticleListItem[] = [
  {
    title: "TypeScript for People Who Are Tired of Any",
    description:
      "A practical tour of TypeScript from the perspective of a JS dev shipping products.",
    category: "tutorial",
    tags: ["typescript", "best-practices", "refactoring", "dx"],
    date: "2025-11-20",
    slug: "typescript-for-tired-js-devs",
  },
  {
    title: "React Architecture for Solo Developers",
    description:
      "Patterns that scale from side project to serious product without over-engineering.",
    category: "deep-dive",
    tags: ["react", "architecture", "state-management", "scaling"],
    date: "2025-11-18",
    slug: "react-architecture-solo-devs",
  },
  {
    title: "What Nobody Tells You About Going from Junior to Senior",
    description:
      "Notes on responsibility, ownership, and the unglamorous parts of career growth.",
    category: "trending",
    tags: ["career", "industry", "growth", "mentorship", "seniority"],
    date: "2025-11-10",
    slug: "junior-to-senior-notes",
  },
];

type Filter = "all" | ArticleCategory;

const filters: Filter[] = ["all", "trending", "tutorial", "deep-dive"];

export const BlogListPage: React.FC = () => {
  usePageTitle("Articles");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all"
      ? allArticles
      : allArticles.filter((a) => a.category === filter);

  return (
    <div className="mx-auto max-w-blog space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Blog
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Software development insights, tutorials, and occasional hot takes.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 text-xs">
        {filters.map((f) => {
          const isActive = f === filter;

          const label =
            f === "all"
              ? "All"
              : f === "trending"
              ? "Trending"
              : f === "tutorial"
              ? "Tutorials"
              : "Deep Dives";

          const Icon =
            f === "trending"
              ? Flame
              : f === "tutorial"
              ? BookOpen
              : f === "deep-dive"
              ? FlaskConical
              : null;

          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium transition-colors duration-200 ${
                isActive
                  ? "border-sky-500 bg-sky-500 text-white dark:border-sky-500 dark:bg-sky-500"
                  : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-sky-400 hover:text-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-sky-400 dark:hover:text-sky-400"
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
              <span>{f === "all" ? label : label}</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
          <h2 className="mb-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            🚧 Coming Soon
          </h2>
          <p>
            No articles yet. Check the{" "}
            <a
              href="/calendar"
              className="font-medium text-sky-600 underline-offset-4 hover:underline dark:text-sky-400"
            >
              content calendar
            </a>{" "}
            for what&apos;s planned.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
          {filtered.map((article) => {
            const d = new Date(article.date);
            const day = d.getDate().toString().padStart(2, "0");
            const month = d.toLocaleString("en-US", { month: "short" });

            const MAX_TAGS = 3;
            const visibleTags = article.tags.slice(0, MAX_TAGS);
            const hiddenTags = article.tags.slice(MAX_TAGS);

            return (
              <li key={article.slug}>
                <a
                  href={`/blog/${article.slug}`}
                  className="group flex gap-4 py-4 transition-transform duration-200 hover:-translate-x-1"
                >
                  {/* Date */}
                  <div className="flex w-12 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-[11px] leading-tight text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {day}
                    </span>
                    <span>{month}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1 border-l border-transparent pl-4 group-hover:border-sky-400/70">
                    <ArticleCategoryBadge category={article.category} />
                    <h2 className="text-sm font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-sky-500 dark:text-zinc-50 dark:group-hover:text-sky-400 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-xs text-zinc-500 line-clamp-2 dark:text-zinc-400">
                      {article.description}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1 overflow-hidden">
                      {visibleTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700 dark:bg-sky-900/40 dark:text-sky-200"
                        >
                          #{tag}
                        </span>
                      ))}

                      {hiddenTags.length > 0 && (
                        <span
                          className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700 dark:bg-sky-900/40 dark:text-sky-200"
                          title={hiddenTags.map((t) => `#${t}`).join(", ")}
                        >
                          +{hiddenTags.length} more
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
