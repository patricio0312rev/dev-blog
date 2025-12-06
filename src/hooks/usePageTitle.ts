import { useLayoutEffect } from "react";

const BASE_TITLE = "patricio.dev";

/**
 * Sets the document title with the site name suffix
 */
export function usePageTitle(title?: string) {
  useLayoutEffect(() => {
    if (typeof document === "undefined") return;

    const trimmed = title?.trim();

    if (!trimmed) {
      document.title = BASE_TITLE;
    } else {
      document.title = `${trimmed} · ${BASE_TITLE}`;
    }
  }, [title]);
}