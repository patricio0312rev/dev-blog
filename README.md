# patriciomarroquin.dev - Personal Developer Blog

A modern, fast developer blog built with React, TypeScript, and Tailwind CSS.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8)
![Vite](https://img.shields.io/badge/Vite-7-646cff)

## ✨ Features

- 🌗 **Dark/Light mode** - System preference detection + manual toggle
- 📱 **Fully responsive** - Mobile-first design
- ⚡ **Fast** - Vite for instant HMR and optimized builds
- 🎨 **Modern UI** - Tailwind CSS with custom design system
- 📅 **Content Calendar** - Visual planning for upcoming articles
- 🔍 **SEO ready** - Structured for search engines

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── Button.tsx         # Primary/Secondary/Ghost variants
│   │   ├── Tag.tsx            # Tag + TagList components
│   │   ├── CodeContainer.tsx  # Code block with copy button
│   │   └── ThemeToggle.tsx    # Light/Dark toggle
│   ├── layout/                # App shell components
│   │   ├── Navbar.tsx
│   │   ├── MobileNav.tsx
│   │   └── Footer.tsx
│   └── articles/              # Article-specific components
│       ├── ArticleCard.tsx    # Default/Compact/Featured variants
│       └── ArticleCategoryBadge.tsx
├── pages/                     # Page components
│   ├── HomePage.tsx
│   ├── BlogListPage.tsx
│   ├── ArticleDetailPage.tsx
│   └── ContentCalendarPage.tsx
├── hooks/                     # Custom React hooks
│   ├── usePageTitle.ts
│   ├── useTheme.tsx           # ThemeProvider + useTheme
│   └── useReadingProgress.ts
├── utils/                     # Utility functions
│   └── index.ts               # cn(), formatDate(), etc.
├── constants/                 # App constants & config
│   └── index.ts
├── types/                     # TypeScript definitions
│   └── index.d.ts
├── styles/                    # Global CSS
│   └── global.css
├── main.tsx                   # App entry point
└── AppShell.tsx               # Root layout with routing
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Vite](https://vite.dev) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling |
| [React Router](https://reactrouter.com) | Client-side routing |
| [Lucide React](https://lucide.dev) | Icons |

## 🎨 Design System

### Colors

- **Primary**: Sky blue (`sky-500`)
- **Neutrals**: Zinc palette
- **Categories**:
  - 🔥 Trending: Orange
  - 📚 Tutorial: Sky blue
  - 🔬 Deep Dive: Purple

### Typography

- **Sans**: Plus Jakarta Sans
- **Mono**: JetBrains Mono

### Components

```tsx
// Buttons
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>

// Button as link
<ButtonLink href="/blog" variant="primary">Read Blog</ButtonLink>

// Tags
<Tag label="typescript" />
<TagList tags={["react", "node", "typescript"]} maxVisible={3} />

// Article Cards
<ArticleCard {...article} variant="default" />
<ArticleCard {...article} variant="compact" />
<ArticleCard {...article} variant="featured" />
```

## 📝 Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```tsx
// Instead of
import { Button } from "../../../components/ui/Button";

// Use
import { Button } from "@/components/ui";
```

Available aliases:
- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/pages/*` → `src/pages/*`
- `@/hooks/*` → `src/hooks/*`
- `@/utils/*` → `src/utils/*`
- `@/constants/*` → `src/constants/*`
- `@/types/*` → `src/types/*`

## 🌗 Theme System

Dark mode is handled via a `data-theme` attribute on `<html>`:

```tsx
// Use the hook
const { theme, toggleTheme } = useTheme();

// Theme values: "light" | "dark"
```

The theme:
1. Checks localStorage for saved preference
2. Falls back to system preference (`prefers-color-scheme`)
3. Persists user choice to localStorage

## 📅 Content Types

```typescript
// Article category
type ArticleCategory = "trending" | "tutorial" | "deep-dive";

// Base article
interface Article {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  date: string; // ISO format
}

// Calendar article (with status)
interface CalendarArticle extends Article {
  status: "planned" | "published";
}
```

## 🔜 Roadmap

- [ ] MDX support for article content
- [ ] RSS feed generation
- [ ] Search functionality (Pagefind)
- [ ] Comments (Giscus)
- [ ] View counter
- [ ] Related articles algorithm
- [ ] Migrate to Astro for SSG/SEO

## 📄 License

MIT © Patricio Marroquin

---

Built with ☕ and 💜 from Lima, Peru