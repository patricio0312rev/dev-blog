import { useEffect } from "react";

const BASE_TITLE = "patricio.dev";

export function usePageTitle(title?: string) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!title || title.trim().length === 0) {
      document.title = BASE_TITLE;
      return;
    }

    document.title = `${title} · ${BASE_TITLE}`;
  }, [title]);
}
