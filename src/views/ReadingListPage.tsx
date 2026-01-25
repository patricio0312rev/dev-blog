import React from "react";
import { Bookmark, Trash2, BookOpen } from "lucide-react";
import { useReadingList } from "@/hooks/useReadingList";
import { ArticleCategoryBadge } from "@/components/articles";
import type { ArticleCategory } from "@/types";

export const ReadingListPage: React.FC = () => {
  const { bookmarks, removeBookmark } = useReadingList();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Reading List
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Articles you've saved to read later. Stored locally in your browser.
        </p>
      </header>

      {bookmarks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/60">
          <Bookmark className="mx-auto mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          <h2 className="mb-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            No saved articles yet
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Click the bookmark icon on any article to save it here.
          </p>
          <a
            href="/blog"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
          >
            <BookOpen className="h-4 w-4" />
            Browse articles
          </a>
        </div>
      ) : (
        <>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {bookmarks.length} article{bookmarks.length !== 1 ? "s" : ""} saved
          </div>

          <ul className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            {bookmarks.map((article) => (
              <li key={article.slug} className="group relative">
                <a
                  href={`/blog/${article.slug}`}
                  className="flex gap-4 py-4 pr-12 transition-transform duration-200 hover:-translate-x-1"
                >
                  <div className="flex-1 space-y-1 border-l border-transparent pl-4 group-hover:border-sky-400/70">
                    <ArticleCategoryBadge
                      category={article.category as ArticleCategory}
                      iconSize="sm"
                    />
                    <h2 className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-sky-500 dark:text-zinc-50">
                      {article.title}
                    </h2>
                    <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {article.description}
                    </p>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={() => removeBookmark(article.slug)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 text-zinc-400 opacity-0 transition-all duration-200 hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  aria-label="Remove from reading list"
                  title="Remove from reading list"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ReadingListPage;
