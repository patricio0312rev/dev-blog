// src/ArticleCard.tsx
import React from "react";
import {
  ArticleCategoryBadge,
  type ArticleCategory,
} from "./ArticleCategoryBadge";

type Variant = "default" | "compact" | "featured";

export interface ArticleCardProps {
  title: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  date: string; // ISO or formatted string
  slug: string;
  variant?: Variant;
}

const TagPill: React.FC<{ label: string }> = ({ label }) => (
  <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
    #{label}
  </span>
);

export const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  description,
  category,
  tags,
  date,
  slug,
  variant = "default",
}) => {
  const href = `/blog/${slug}`;

  // Shared tag logic: show first 3, then "+N more" with tooltip
  const MAX_VISIBLE_TAGS = 3;
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTags = tags.slice(MAX_VISIBLE_TAGS);

  if (variant === "compact") {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });

    return (
      <a
        href={href}
        className="group flex items-start gap-4 rounded-xl border border-zinc-200/70 bg-zinc-50/70 px-4 py-3 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/70 dark:border-zinc-800/80 dark:bg-zinc-900/60"
      >
        <div className="flex flex-col items-center font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {day}
          </span>
          <span>{month}</span>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <ArticleCategoryBadge category={category} />
          <h3 className="text-sm font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-sky-500 dark:text-zinc-50 dark:group-hover:text-sky-400 line-clamp-2">
            {title}
          </h3>
        </div>
      </a>
    );
  }

  const cardBase =
    "h-full flex flex-col justify-between rounded-xl border border-zinc-200/70 bg-zinc-50/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-sky-400/70 dark:border-zinc-800/80 dark:bg-zinc-900/60";

  const featuredExtra =
    "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-sky-500/20 before:via-purple-500/10 before:to-transparent";

  const titleClass =
    "text-sm font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-sky-500 dark:text-zinc-50 dark:group-hover:text-sky-400 line-clamp-2";

  return (
    <a
      href={href}
      className={`group block ${variant === "featured" ? "md:col-span-2" : ""}`}
    >
      <article
        className={`${cardBase} ${variant === "featured" ? featuredExtra : ""}`}
      >
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <ArticleCategoryBadge category={category} />
            <time
              dateTime={date}
              className="text-[11px] font-mono uppercase tracking-wide text-zinc-400 dark:text-zinc-500"
            >
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </time>
          </div>
          <h3 className={titleClass}>{title}</h3>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3">
            {description}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5 overflow-hidden">
          {visibleTags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}

          {hiddenTags.length > 0 && (
            <span
              className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              title={hiddenTags.map((t) => `#${t}`).join(", ")}
            >
              +{hiddenTags.length} more
            </span>
          )}
        </div>
      </article>
    </a>
  );
};
