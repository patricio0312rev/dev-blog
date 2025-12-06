import { FileText, CalendarDays, Github, Globe } from "lucide-react";
import type { NavLink, Article, CalendarArticle } from "@/types";

/** Site metadata */
export const SITE_CONFIG = {
  name: "patricio.dev",
  title: "patricio.dev",
  description: "Personal developer blog by Patricio — full-stack dev from Lima, Peru.",
  author: "Juan Patricio",
  location: "Lima, Peru",
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
  {
    href: "/blog",
    label: "Articles",
    icon: FileText,
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
  {
    href: SOCIAL_LINKS.github,
    label: "GitHub",
    icon: Github,
    external: true,
  },
  {
    href: SOCIAL_LINKS.portfolio,
    label: "Portfolio",
    icon: Globe,
    external: true,
  },
];

/** Hero code block content */
export const HERO_CODE = `const patricio = {
  role: "Full-Stack Dev",
  location: "Lima 🇵🇪",
  stack: ["TS", "React", "Node"],
  coffee: Infinity,
};`;

/** Sample articles data (replace with real data source later) */
export const SAMPLE_ARTICLES: Article[] = [
  {
    title: "TypeScript for People Who Are Tired of Any",
    description:
      "A practical tour of TypeScript from the perspective of a JS dev shipping products in the real world.",
    category: "tutorial",
    tags: ["typescript", "best-practices", "refactoring", "dx"],
    date: "2025-11-20",
    slug: "typescript-for-tired-js-devs",
  },
  {
    title: "React Architecture for Solo Developers",
    description:
      "Patterns that scale from side project to serious product without over-engineering your app.",
    category: "deep-dive",
    tags: ["react", "architecture", "state-management", "scaling"],
    date: "2025-11-18",
    slug: "react-architecture-solo-devs",
  },
  {
    title: "What Nobody Tells You About Going from Junior to Senior",
    description:
      "Notes on responsibility, ownership, and the unglamorous parts of growing as a developer.",
    category: "trending",
    tags: ["career", "industry", "growth", "mentorship", "seniority"],
    date: "2025-11-10",
    slug: "junior-to-senior-notes",
  },
];

/** Sample calendar articles */
export const SAMPLE_CALENDAR_ARTICLES: CalendarArticle[] = [
  {
    date: "2025-12-10",
    title: "React Performance in the Real World",
    description: "Practical tips for optimizing React applications.",
    category: "deep-dive",
    tags: ["react", "performance"],
    status: "planned",
    slug: "react-performance-real-world",
  },
  {
    date: "2025-12-15",
    title: "Building Accessible Components with Tailwind",
    description: "How to create accessible UI components using Tailwind CSS.",
    category: "tutorial",
    tags: ["accessibility", "tailwind"],
    status: "planned",
    slug: "accessible-components-tailwind",
  },
];

/** Maximum visible tags in article cards */
export const MAX_VISIBLE_TAGS = 3;
