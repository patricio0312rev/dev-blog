import React, { useState, useMemo } from "react";
import { Hash } from "lucide-react";
import { ArticleCategoryBadge } from "@/components/articles";
import { TagList } from "@/components/ui";
import { MAX_VISIBLE_TAGS } from "@/constants";
import { getDayMonth } from "@/utils";
import type { Article } from "@/types";

interface TagInfo {
  name: string;
  count: number;
}

export interface TagsPageProps {
  articles: Article[];
  tags: TagInfo[];
}

export const TagsPage: React.FC<TagsPageProps> = ({ articles, tags }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    if (!selectedTag) return [];
    return articles.filter((a) => a.tags.includes(selectedTag));
  }, [articles, selectedTag]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tags
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Browse articles by topic. Click a tag to see related posts.
        </p>
      </header>

      {/* Tags cloud */}
      <div className="flex flex-wrap gap-2">
        {tags.map(({ name, count }) => (
          <button
            key={name}
            onClick={() => setSelectedTag(selectedTag === name ? null : name)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              selectedTag === name
                ? "border-sky-500 bg-sky-500 text-white"
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-sky-400 hover:text-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-sky-400 dark:hover:text-sky-400"
            }`}
          >
            <Hash className="h-3 w-3" />
            <span>{name}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                selectedTag === name
                  ? "bg-sky-400/30 text-white"
                  : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Selected tag articles */}
      {selectedTag && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Articles tagged with{" "}
              <span className="text-sky-500">#{selectedTag}</span>
            </h2>
            <span className="text-xs text-zinc-500">
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""}
            </span>
          </div>

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
                      <ArticleCategoryBadge
                        category={article.category}
                        iconSize="sm"
                      />
                      <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-sky-500 dark:text-zinc-50">
                        {article.title}
                      </h3>
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
        </div>
      )}

      {/* No tag selected state */}
      {!selectedTag && (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60">
          <Hash className="mx-auto mb-2 h-8 w-8 text-zinc-400" />
          <p>Select a tag above to see related articles.</p>
        </div>
      )}
    </div>
  );
};

export default TagsPage;
