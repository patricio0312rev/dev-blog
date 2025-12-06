/** Article category types */
export type ArticleCategory = "trending" | "tutorial" | "deep-dive";

/** Article status for content calendar */
export type ArticleStatus = "planned" | "published";

/** Theme options */
export type Theme = "light" | "dark";

/** Base article data structure */
export interface Article {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  date: string; // ISO date string
}

/** Extended article for calendar */
export interface CalendarArticle extends Article {
  status: ArticleStatus;
}

/** Navigation link configuration */
export interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  external?: boolean;
}
