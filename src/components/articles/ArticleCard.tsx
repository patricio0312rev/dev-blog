import React from "react";
import type { Article } from "@/types";
import { getDayMonth, formatDate, cn } from "@/utils";
import { MAX_VISIBLE_TAGS } from "@/constants";
import { ArticleCategoryBadge } from "./ArticleCategoryBadge";
import { TagList } from "@/components/ui";

type CardVariant = "default" | "compact" | "featured";

interface ArticleCardProps extends Article {
  variant?: CardVariant;
}

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

  // Compact variant - horizontal layout with date
  if (variant === "compact") {
    const { day, month } = getDayMonth(date);

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
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-sky-500 dark:text-zinc-50 dark:group-hover:text-sky-400">
            {title}
          </h3>
        </div>
      </a>
    );
  }

  // Default and featured variants
  const cardBase =
    "h-full flex flex-col justify-between rounded-xl border border-zinc-200/70 bg-zinc-50/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-sky-400/70 dark:border-zinc-800/80 dark:bg-zinc-900/60";

  const featuredExtra =
    "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-sky-500/20 before:via-purple-500/10 before:to-transparent";

  return (
    <a
      href={href}
      className={cn("group block", variant === "featured" && "md:col-span-2")}
    >
      <article
        className={cn(cardBase, variant === "featured" && featuredExtra)}
      >
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <ArticleCategoryBadge category={category} iconSize="sm" />
            <time
              dateTime={date}
              className="text-[11px] font-mono uppercase tracking-wide text-zinc-400 dark:text-zinc-500"
            >
              {formatDate(date)}
            </time>
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-sky-500 dark:text-zinc-50 dark:group-hover:text-sky-400">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>

        <div className="mt-3">
          <TagList tags={tags} maxVisible={MAX_VISIBLE_TAGS} />
        </div>
      </article>
    </a>
  );
};
