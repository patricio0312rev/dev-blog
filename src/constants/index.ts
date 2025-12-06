import { FileText, CalendarDays, Github, Globe } from "lucide-react";
import type { NavLink, Article } from "@/types";

/** Site metadata - Used for SEO */
export const SITE_CONFIG = {
  name: "patricioMarroquin.dev",
  title: "patricioMarroquin.dev",
  description:
    "Personal developer blog by Patricio Marroquin — full-stack dev from Lima, Peru. Software development insights, tutorials, and hot takes.",
  author: "Juan Patricio Marroquin Gavelan",
  location: "Lima, Peru",
  twitterHandle: "@patricio0312rev",
  repo: "https://github.com/patricio0312rev/dev-blog",
} as const;

/** Social links */
export const SOCIAL_LINKS = {
  twitter: "https://x.com/patricio0312rev",
  linkedin: "https://www.linkedin.com/in/patricio0312rev",
  instagram: "https://www.instagram.com/patricio0312rev",
  github: "https://github.com/patricio0312rev",
  portfolio: "https://patriciomarroquin.dev",
} as const;

/** Navigation links */
export const NAV_LINKS: NavLink[] = [
  { href: "/blog", label: "Articles", icon: FileText },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: SOCIAL_LINKS.github, label: "GitHub", icon: Github, external: true },
  { href: SOCIAL_LINKS.portfolio, label: "Portfolio", icon: Globe, external: true },
];

/** Hero code block */
export const HERO_CODE = `const patricio = {
  role: "Senior Full-Stack Dev",
  location: "Lima, Peru 🇵🇪",
  stack: ["TypeScript", "React", "Node", "Next.js", "Python", "PHP", "AWS"],
  coffee: Infinity,
};`;

/** Maximum visible tags */
export const MAX_VISIBLE_TAGS = 3;
