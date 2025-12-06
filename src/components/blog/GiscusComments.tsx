import React from "react";
import Giscus from "@giscus/react";

interface GiscusCommentsProps {
  /**
   * Optional: pass the current page pathname, otherwise
   * it will fall back to window.location.pathname on the client.
   */
  term?: string;
}

export const GiscusComments: React.FC<GiscusCommentsProps> = ({ term }) => {
  const mappingTerm =
    term ||
    (typeof window !== "undefined" ? window.location.pathname : "/blog");

  return (
    <section
      aria-label="Comments"
      className="mt-10 rounded-xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/70"
    >
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Comments
      </h2>

      <Giscus
        /* 🔐 Replace all of these with your real values from giscus.app */
        repo="patricio0312rev/dev-blog"
        repoId="R_kgDOQjmztA"
        category="General"
        categoryId="DIC_kwDOQjmztM4Czd8w"
        mapping="pathname"
        term={mappingTerm}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        lang="en"
        loading="lazy"
        theme="preferred_color_scheme"
      />
    </section>
  );
};

export default GiscusComments;
