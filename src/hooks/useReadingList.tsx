import { useEffect, useState, useCallback } from "react";

export interface BookmarkedArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  addedAt: string;
}

const STORAGE_KEY = "reading-list";

function getStoredList(): BookmarkedArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveList(list: BookmarkedArticle[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("reading-list-updated"));
}

export function useReadingList() {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);

  useEffect(() => {
    setBookmarks(getStoredList());

    const handleUpdate = () => setBookmarks(getStoredList());
    window.addEventListener("reading-list-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("reading-list-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const addBookmark = useCallback(
    (article: Omit<BookmarkedArticle, "addedAt">) => {
      const list = getStoredList();
      if (list.some((b) => b.slug === article.slug)) return;

      const newBookmark: BookmarkedArticle = {
        ...article,
        addedAt: new Date().toISOString(),
      };
      const newList = [newBookmark, ...list];
      saveList(newList);
      setBookmarks(newList);
    },
    []
  );

  const removeBookmark = useCallback((slug: string) => {
    const list = getStoredList();
    const newList = list.filter((b) => b.slug !== slug);
    saveList(newList);
    setBookmarks(newList);
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.some((b) => b.slug === slug),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (article: Omit<BookmarkedArticle, "addedAt">) => {
      if (isBookmarked(article.slug)) {
        removeBookmark(article.slug);
      } else {
        addBookmark(article);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  };
}
