import React, { useSyncExternalStore } from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils";

interface SearchButtonProps {
  onClick: () => void;
  variant?: "navbar" | "inline";
  className?: string;
}

const getIsMac = () => navigator.platform.toUpperCase().indexOf("MAC") >= 0;
const subscribe = () => () => {};

export const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  variant = "navbar",
  className,
}) => {
  const isMac = useSyncExternalStore(subscribe, getIsMac, () => false);
  const shortcutKey = isMac ? "⌘" : "Ctrl";

  if (variant === "navbar") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/80 px-3 text-xs font-medium text-zinc-600 shadow-sm transition-all duration-200 hover:border-sky-400 hover:text-sky-600 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-sky-400 dark:hover:text-sky-400",
          className
        )}
        aria-label="Open search"
      >
        <Search className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 transition-colors group-hover:border-sky-300 group-hover:bg-sky-50 group-hover:text-sky-600 md:inline-block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:border-sky-600 dark:group-hover:bg-sky-900/40 dark:group-hover:text-sky-300">
          {shortcutKey} K
        </kbd>
      </button>
    );
  }

  // Inline variant - larger button for hero/content areas
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-500 shadow-sm transition-all duration-200 hover:border-sky-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-sky-500",
        className
      )}
      aria-label="Open search"
    >
      <Search
        className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
        aria-hidden="true"
      />
      <span className="flex-1">Search articles...</span>
      <kbd className="rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-medium text-zinc-500 transition-colors group-hover:border-sky-300 group-hover:bg-sky-50 group-hover:text-sky-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:border-sky-600 dark:group-hover:bg-sky-900/40 dark:group-hover:text-sky-300">
        {shortcutKey} K
      </kbd>
    </button>
  );
};
