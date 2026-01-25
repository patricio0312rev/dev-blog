import React from "react";
import { Bookmark } from "lucide-react";
import { useReadingList, type BookmarkedArticle } from "@/hooks/useReadingList";

interface BookmarkButtonProps {
  article: Omit<BookmarkedArticle, "addedAt">;
  variant?: "icon" | "full";
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  article,
  variant = "full",
}) => {
  const { isBookmarked, toggleBookmark } = useReadingList();
  const bookmarked = isBookmarked(article.slug);

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => toggleBookmark(article)}
        className={`rounded-full p-2 transition-colors duration-200 ${
          bookmarked
            ? "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400"
            : "bg-zinc-100 text-zinc-500 hover:bg-sky-100 hover:text-sky-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-sky-900/40 dark:hover:text-sky-400"
        }`}
        aria-label={bookmarked ? "Remove from reading list" : "Add to reading list"}
        title={bookmarked ? "Remove from reading list" : "Add to reading list"}
      >
        <Bookmark
          className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(article)}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors duration-150 ${
        bookmarked
          ? "border-sky-500 bg-sky-500 text-white"
          : "border-zinc-300 text-zinc-700 hover:border-sky-500 hover:text-sky-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-sky-400 dark:hover:text-sky-400"
      }`}
      aria-label={bookmarked ? "Remove from reading list" : "Add to reading list"}
    >
      <Bookmark
        className={`h-3 w-3 ${bookmarked ? "fill-current" : ""}`}
      />
      <span>{bookmarked ? "Saved" : "Save"}</span>
    </button>
  );
};

export default BookmarkButton;
