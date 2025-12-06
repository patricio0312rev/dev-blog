import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export const ThemeToggle: React.FC = () => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setThemeState(getTheme());

    // Listen for changes from other components/tabs
    const observer = new MutationObserver(() => {
      setThemeState(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setThemeState(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 transition-colors dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 transition-colors hover:border-sky-400 hover:text-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-sky-400 dark:hover:text-sky-400"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
};

export default ThemeToggle;
