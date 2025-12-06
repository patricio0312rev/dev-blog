import { useEffect } from "react";
import { SITE_CONFIG } from "@/constants";

/**
 * Sets the document title with the site name suffix
 */
export function usePageTitle(title?: string): void {
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!title || title.trim().length === 0) {
      document.title = SITE_CONFIG.title;
      return;
    }

    document.title = `${title} · ${SITE_CONFIG.title}`;
  }, [title]);
}
