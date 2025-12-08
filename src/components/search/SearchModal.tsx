import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, FileText } from "lucide-react";
import { cn } from "@/utils";
import { ArticleCategoryBadge } from "@/components/articles";
import { TagList } from "@/components/ui";
import type { ArticleCategory } from "@/types";

interface SearchResult {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  meta?: {
    category?: string;
    tags?: string[];
    publishDate?: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to strip HTML tags from text
const stripHtml = (html: string): string => {
  if (typeof window === "undefined") return html;
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [pagefindLoaded, setPagefindLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const pagefindRef = useRef<any>(null);

  // Load Pagefind library
  useEffect(() => {
    const loadPagefind = async () => {
      if (typeof window === "undefined" || pagefindRef.current) return;

      try {
        console.log("🔍 Loading Pagefind...");

        // Dynamically import pagefind as a module
        const pagefind = await import(
          /* @ts-ignore - Pagefind is not typed */
          /* @vite-ignore */ "/pagefind/pagefind.js"
        );

        pagefindRef.current = pagefind;
        setPagefindLoaded(true);
        console.log("✅ Pagefind loaded successfully");
      } catch (error) {
        console.error("❌ Error loading Pagefind:", error);
      }
    };

    if (isOpen && !pagefindRef.current) {
      loadPagefind();
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recent-searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse recent searches:", e);
        }
      }
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const updated = [
        searchQuery,
        ...prev.filter((s) => s !== searchQuery),
      ].slice(0, 5);

      if (typeof window !== "undefined") {
        localStorage.setItem("recent-searches", JSON.stringify(updated));
      }

      return updated;
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("recent-searches");
    }
  }, []);

  // Perform search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      if (!pagefindRef.current) {
        return;
      }

      setIsLoading(true);
      try {
        const search = await pagefindRef.current.search(searchQuery);

        const searchResults = await Promise.all(
          search.results.map(async (result: any) => {
            const data = await result.data();

            // Strip HTML tags from excerpt
            const cleanExcerpt = stripHtml(data.excerpt || "");

            return {
              id: result.id,
              url: data.url,
              title: data.meta?.title || "Untitled",
              excerpt: cleanExcerpt,
              meta: {
                category: data.meta?.category,
                tags: data.meta?.tags ? data.meta.tags.split(",") : [],
                publishDate: data.meta?.publish_date,
              },
            };
          })
        );

        setResults(searchResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error("❌ Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [pagefindLoaded]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;

        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;

        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            saveRecentSearch(query);
            window.location.href = results[selectedIndex].url;
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex, query, saveRecentSearch]);

  // Auto-scroll selected result into view
  useEffect(() => {
    if (resultsRef.current) {
      const selected = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selected) {
        selected.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Handle clicking outside modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/50 backdrop-blur-sm pt-[10vh] px-4 sm:px-6"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-zinc-50 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <Search
            className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles by title, content, or tags..."
            className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-50 dark:placeholder-zinc-500"
            aria-label="Search articles"
            id="search-modal-title"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline-block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results / Recent Searches */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Pagefind not loaded warning */}
          {!pagefindLoaded && query && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-sky-500 border-t-transparent mx-auto" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Loading search...
                </p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && pagefindLoaded && (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
            </div>
          )}

          {/* No query - show recent searches */}
          {!query && !isLoading && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Recent searches</span>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentSearchClick(search)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Search className="h-4 w-4 text-zinc-400" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query && !isLoading && pagefindLoaded && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                <Search className="h-6 w-6 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                No articles found
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Try a different search term
              </p>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && pagefindLoaded && results.length > 0 && (
            <div ref={resultsRef} className="p-2" role="listbox">
              {results.map((result, idx) => (
                <a
                  key={result.id}
                  href={result.url}
                  onClick={() => saveRecentSearch(query)}
                  className={cn(
                    "group block rounded-lg p-3 transition-colors",
                    selectedIndex === idx
                      ? "bg-sky-50 dark:bg-sky-900/20"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                  role="option"
                  aria-selected={selectedIndex === idx}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3
                      className={cn(
                        "text-sm font-medium leading-tight",
                        selectedIndex === idx
                          ? "text-sky-700 dark:text-sky-300"
                          : "text-zinc-900 group-hover:text-sky-600 dark:text-zinc-50 dark:group-hover:text-sky-400"
                      )}
                    >
                      {result.title}
                    </h3>
                    <FileText
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        selectedIndex === idx
                          ? "text-sky-500"
                          : "text-zinc-400 dark:text-zinc-500"
                      )}
                    />
                  </div>

                  {result.excerpt && (
                    <p className="mb-2 text-xs text-zinc-600 line-clamp-2 dark:text-zinc-400">
                      {result.excerpt}
                    </p>
                  )}

                  {(result.meta?.category ||
                    (result.meta?.tags && result.meta.tags.length > 0)) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {result.meta.category && (
                        <ArticleCategoryBadge
                          category={result.meta.category as ArticleCategory}
                          iconSize="sm"
                        />
                      )}
                      {result.meta.tags && result.meta.tags.length > 0 && (
                        <TagList
                          tags={result.meta.tags}
                          maxVisible={3}
                          variant="search"
                        />
                      )}
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 text-[10px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 dark:border-zinc-700 dark:bg-zinc-800">
                ↑
              </kbd>
              <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 dark:border-zinc-700 dark:bg-zinc-800">
                ↓
              </kbd>
              <span className="ml-1">navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 dark:border-zinc-700 dark:bg-zinc-800">
                ↵
              </kbd>
              <span className="ml-1">select</span>
            </span>
          </div>
          <span>Powered by Pagefind</span>
        </div>
      </div>
    </div>
  );
};
