# [blog.patriciomarroquin.dev](https://blog.patriciomarroquin.dev) – Personal Developer Blog

A modern, fast developer blog built with **Astro**, **React**, **TypeScript**, **Tailwind 4**, and an **AI-powered content pipeline**.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Astro](https://img.shields.io/badge/Astro-4-ff5d01)
![React](https://img.shields.io/badge/React-19-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000)

---

## ✨ Features

- 🌗 **Dark / Light mode**
  - Respects system preference (`prefers-color-scheme`)
  - Manual toggle powered by a `data-theme` attribute

- 📰 **MDX-powered blog**
  - Articles live in `src/content/articles/*.mdx`
  - Custom `BlogPost.astro` layout with consistent typography and spacing
  - Reading time, publication meta, tags, and category badges

- 🔊 **Reading experience upgrades**
  - Reading progress bar (top of the article)
  - Estimated reading time
  - **Text-to-speech mode**: “Listen / Stop listening” button that reads:
    - Title
    - Description
    - Full article body

- 🧑‍💻 **Beautiful code blocks**
  - Shiki-based syntax highlighting via Astro’s markdown pipeline
  - Custom `CodeBlock.astro` wrapper for MDX
  - “Traffic light” header + language label + **Copy** button
  - Optional `filename="yourfile.tsx"` meta support in code fences

- 📅 **Content calendar**
  - `src/pages/calendar.astro` + `ContentCalendarPage.tsx`
  - Reads monthly plans from `content-plans/*.json`
  - Shows:
    - Planned vs **Published** articles
    - Category color dots (🔥 Trending, 📚 Tutorial, 🔬 Deep Dive)
    - Upcoming articles list
  - Published entries link directly to `/blog/[slug]`

- 🤖 **AI-powered content pipeline**
  - Monthly **content plan** generator (JSON under `content-plans/`)
  - Daily **article** generator (MDX under `src/content/articles/`)
  - Uses OpenAI’s Responses API
  - GitHub Actions open PRs so content can be reviewed before publishing

- 🌐 **Production ready**
  - Astro static site generation
  - Deployed on Vercel
  - Vercel Web Analytics enabled
  - SEO-friendly structure + sitemap

---

## 🚀 Quick Start

This project uses **pnpm**.

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production (static output)
pnpm build

# Preview the production build
pnpm preview
```

### Linting (if configured)

```bash
pnpm lint
```

---

## 🤖 Content Automation

Two scripts handle content planning and generation.

### 1) Generate monthly content plan

Creates/updates a JSON file in `content-plans/YYYY-MM.json` with a schedule of articles for the month (category, title, slug, angle, outline, etc.).

```bash
pnpm generate:plan
```

- Looks at the current month (e.g. `"2025-12"`)
- Keeps existing months; doesn’t overwrite unrelated data
- Used by the **Content Calendar** page

### 2) Generate today’s article from the plan

Reads the month’s plan, finds today’s entry, and generates a full MDX article file (with frontmatter + body):

```bash
pnpm generate:article
```

- Output: `src/content/articles/YYYY-MM-DD-slug-from-plan.mdx`
- Uses:
  - Your outlined sections
  - Code ideas
  - Media ideas (images/diagrams)
- Enforces:
  - Real, useful content (not fluff)
  - Multiple code snippets
  - Optional `filename="..."` in code fences for better code block headers
  - Final signature:

    ```md
    Until next time, happy coding 👨‍💻  
    – Juan Patricio 💜
    ```

> ⚠️ These scripts require `OPENAI_API_KEY` in your `.env`.

---

## 🔁 GitHub Actions (Automation Overview)

> (File names are suggestions; adjust if you named them differently.)

### `.github/workflows/content-plan.yml`

- **Runs:** monthly, on the **1st** (e.g. `0 9 1 * *`)
- **Does:**
  - Checks out the repo
  - Runs `pnpm generate:plan`
  - Commits the updated `content-plans/YYYY-MM.json`
  - Opens a PR with a conventional commit-style message, e.g.:
    - `feat(content): add content plan for 2025-12`

### `.github/workflows/generate-article.yml`

- **Runs:** daily around **midday** (UTC / chosen TZ)
- **Does:**
  - Checks out the repo
  - Runs `pnpm generate:article`
  - If a new article is generated:
    - Commits the MDX file under `src/content/articles/`
    - Opens a PR, e.g.:
      - `feat(article): add post for 2025-12-06`

This keeps you in the loop: **AI proposes**, you **review & merge**.

---

## 📁 Project Structure

> High-level overview of the Astro + React + MDX setup.

```txt
src/
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Tag.tsx
│   │   ├── CodeContainer.tsx  # React version (for non-MDX usage)
│   │   └── ThemeToggle.tsx
│   ├── articles/
│   │   ├── ArticleCard.tsx
│   │   └── ArticleCategoryBadge.tsx
│   └── layout/
│       ├── Navbar.tsx
│       ├── MobileNav.tsx
│       └── Footer.tsx
├── content/
│   └── articles/              # MDX blog posts
│       ├── 2025-12-06-react-19-....mdx
│       └── ...
├── layouts/
│   ├── BaseLayout.astro       # Shared shell for pages
│   └── BlogPost.astro         # Article layout (reading UX, TTS, etc.)
├── pages/
│   ├── index.astro            # Home / landing
│   ├── blog/
│   │   ├── index.astro        # Blog index
│   │   └── [slug].astro       # Article detail route
│   └── calendar.astro         # Content calendar page
├── views/
│   ├── HomePage.tsx           # React "view" components
│   ├── BlogIndexPage.tsx
│   ├── ArticleListPage.tsx
│   └── ContentCalendarPage.tsx
├── hooks/
│   ├── useReadingProgress.ts  # Scroll → progress bar value
│   └── useTheme.tsx           # ThemeProvider + useTheme
├── utils/
│   ├── index.ts               # cn(), formatDate(), etc.
│   └── calendar.ts            # getMonthMatrix(), helpers for calendar
├── styles/
│   └── global.css             # Tailwind base + custom prose styles
├── types/
│   └── index.d.ts             # Article & calendar types
└── env.d.ts                   # Astro env typing
```

There’s also:

```txt
content-plans/
└── YYYY-MM.json               # AI-generated content plan per month

scripts/
├── generate-content-plan.mjs        # pnpm generate:plan
└── generate-article-from-plan.mjs   # pnpm generate:article
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Astro](https://astro.build) | Static site generator / HTML-first framework |
| [React 19](https://react.dev) | Interactive islands and UI components |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling (via `@tailwindcss/vite`) |
| [Shiki](https://shiki.matsu.io/) | Syntax highlighting for MDX code blocks |
| [Lucide React](https://lucide.dev) | Icon set for UI + calendar legend |
| [Vercel](https://vercel.com) | Hosting + analytics |
| [OpenAI Responses API](https://platform.openai.com/docs) | Content planning & article generation |

---

## 🎨 Design System

### Colors

- **Primary**: Sky (`sky-500`)
- **Neutrals**: Zinc palette
- **Categories**:
  - 🔥 Trending: Orange
  - 📚 Tutorial: Sky Blue
  - 🔬 Deep Dive: Purple
- **Status**:
  - ✅ Published: Emerald badge
  - ⏳ Coming soon: Neutral gray badge

### Typography

- **Sans**: `Plus Jakarta Sans`
- **Mono**: `JetBrains Mono`

---

## 🧩 Code Blocks in MDX

Code blocks in MDX are rendered by `CodeBlock.astro` and Shiki.

Example with filename:

```mdx
```ts filename="Profile.server.tsx"
// Profile.server.tsx
import { fetchUserProfile } from "../lib/api";

export default async function Profile() {
  const user = await fetchUserProfile();
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </div>
  );
}
```
```

- `language` is picked from the fence (`ts`, `tsx`, etc.)
- `filename` is parsed from the meta string and displayed in the header
- The copy button uses a delegated click handler + `navigator.clipboard`

---

## 📝 Content Types

```ts
export type ArticleCategory = "trending" | "tutorial" | "deep-dive";

export interface Article {
  slug: string;                // e.g. "react-19-biggest-features-i-am-excited-about"
  title: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  date: string;                // ISO date, e.g. "2025-12-06"
}

export interface CalendarArticle extends Article {
  status: "planned" | "published";
}
```

On the calendar page:

- **Published** articles:
  - Green “Published” badge
  - Clickable card → navigates to `/blog/[slug]`
- **Planned** articles:
  - Gray “Coming soon” badge
  - Non-clickable card

---

## 🌗 Theme System

Dark mode is handled via `data-theme` on `<html>` plus a small React provider:

```ts
type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}
```

Flow:

1. Check `localStorage` for a saved theme.
2. Otherwise, read `window.matchMedia("(prefers-color-scheme: dark)")`.
3. Apply `data-theme="light" | "dark"` on `<html>`.
4. Persist user choice when toggled.

---

## 🔮 Roadmap

- [x] MDX support for article content
- [x] Migrate to Astro for SSG and SEO
- [x] Content calendar view
- [x] AI-generated monthly plan + daily article script
- [x] RSS feed generation
- [ ] Full-text search (Pagefind / Algolia)
- [ ] Comments (Giscus)
- [ ] View counter per article
- [ ] Related articles recommendations

---

## 📄 License

This project is licensed under the **MIT License**. See the [`LICENSE`](./LICENSE) file for details.

MIT © Juan Patricio Marroquín

---

Built with ☕ and 💜 from Lima, Peru.
