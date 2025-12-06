// src/ArticleCategoryBadge.tsx
import React from "react";
import { Flame, BookOpen, FlaskConical } from "lucide-react";

export type ArticleCategory = "trending" | "tutorial" | "deep-dive";

export const ArticleCategoryBadge: React.FC<{ category: ArticleCategory }> = ({
  category,
}) => {
  const config: Record<
    ArticleCategory,
    {
      label: string;
      Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      classes: string;
    }
  > = {
    trending: {
      label: "Trending",
      Icon: Flame,
      classes:
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-800",
    },
    tutorial: {
      label: "Tutorial",
      Icon: BookOpen,
      classes:
        "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-800",
    },
    "deep-dive": {
      label: "Deep Dive",
      Icon: FlaskConical,
      classes:
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800",
    },
  };

  const { label, Icon, classes } = config[category];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${classes}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
