import React from "react";
import { ArticleCategoryBadge } from "@/components/articles";
import { Tag } from "@/components/ui";
import { cn, formatDate } from "@/utils";
import type { ArticleCategory } from "@/types";

export interface RelatedArticleItem {
  slug: string;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  publishDate?: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticleItem[];
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section
      aria-label="Related articles"
      className="mt-10 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/70"
    >
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Related articles
      </h2>

      <div className="space-y-3">
        {articles.map((article) => (
          <a
            key={article.slug}
            href={`/blog/${article.slug}`}
            className={cn(
              "block rounded-lg px-3 py-2 transition-colors",
              "hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60"
            )}
          >
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <ArticleCategoryBadge
                category={article.category as ArticleCategory}
                iconSize="sm"
              />
              {article.publishDate && (
                <>
                  <span>•</span>
                  <time
                    dateTime={article.publishDate}
                    className="font-mono text-[10px]"
                  >
                    {formatDate(article.publishDate)}
                  </time>
                </>
              )}
            </div>

            <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {article.title}
            </h3>

            {article.description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">
                {article.description}
              </p>
            )}

            {article.tags && article.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {article.tags.slice(0, 4).map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
