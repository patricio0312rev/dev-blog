import { useEffect, useState } from "react";

/**
 * Tracks reading progress as user scrolls
 * Returns a value between 0 and 100
 */
export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const current = window.scrollY;
      const value = total > 0 ? (current / total) * 100 : 0;
      setProgress(value);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}
