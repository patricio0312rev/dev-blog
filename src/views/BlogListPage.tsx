import React, { useState } from "react";
import { Flame, BookOpen, FlaskConical } from "lucide-react";
import { ArticleCategoryBadge } from "@/components/articles";
import { TagList } from "@/components/ui";
import { MAX_VISIBLE_TAGS } from "@/constants";
import { getDayMonth } from "@/utils";
import type { Article, ArticleCategory } from "@/types";

type Filter = "all" | ArticleCategory;

const filters: {
  value: Filter;
  label: string;
  Icon?: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "all", label: "All" },
  { value: "trending", label: "Trending", Icon: Flame },
  { value: "tutorial", label: "Tutorials", Icon: BookOpen },
  { value: "deep-dive", label: "Deep Dives", Icon: FlaskConical },
];

export interface BlogListPageProps {
  articles: Article[];
}

export const BlogListPage: React.FC<BlogListPageProps> = ({ articles }) => {
  const [filter, setFilter] = useState<Filter>("all");

  const filteredArticles =
    filter === "all" ? articles : articles.filter((a) => a.category === filter);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
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
        {filters.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium transition-colors duration-200 ${
              value === filter
                ? "border-sky-500 bg-sky-500 text-white"
                : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-sky-400 hover:text-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            }`}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Articles */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60">
          <h2 className="mb-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            🚧 Coming Soon
          </h2>
          <p>
            Check the{" "}
            <a href="/calendar" className="text-sky-600 hover:underline">
              content calendar
            </a>
            .
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
          {filteredArticles.map((article) => {
            const { day, month } = getDayMonth(article.date);
            return (
              <li key={article.slug}>
                <a
                  href={`/blog/${article.slug}`}
                  className="group flex gap-4 py-4 transition-transform duration-200 hover:-translate-x-1"
                >
                  <div className="flex w-12 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {day}
                    </span>
                    <span className="text-zinc-500">{month}</span>
                  </div>
                  <div className="flex-1 space-y-1 border-l border-transparent pl-4 group-hover:border-sky-400/70">
                    <ArticleCategoryBadge category={article.category} />
                    <h2 className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-sky-500 dark:text-zinc-50">
                      {article.title}
                    </h2>
                    <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {article.description}
                    </p>
                    <TagList
                      tags={article.tags}
                      maxVisible={MAX_VISIBLE_TAGS}
                      variant="accent"
                    />
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

export default BlogListPage;
