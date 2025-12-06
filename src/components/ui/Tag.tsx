import React from "react";
import { cn } from "@/utils";

interface TagProps {
  label: string;
  variant?: "default" | "accent";
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  label,
  variant = "default",
  className,
}) => {
  const variantStyles = {
    default:
      "border border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400",
    accent:
      "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
  };

  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px]",
        variantStyles[variant],
        className
      )}
    >
      #{label}
    </span>
  );
};

interface TagListProps {
  tags: string[];
  maxVisible?: number;
  variant?: "default" | "accent";
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  maxVisible = 3,
  variant = "default",
}) => {
  const visibleTags = tags.slice(0, maxVisible);
  const hiddenTags = tags.slice(maxVisible);

  return (
    <div className="flex flex-wrap gap-1.5 overflow-hidden">
      {visibleTags.map((tag) => (
        <Tag key={tag} label={tag} variant={variant} />
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
  );
};
