# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal developer blog built with Astro 5, React 19, TypeScript, and Tailwind CSS 4. Features AI-powered content generation via OpenAI, full-text search via Pagefind, and GitHub-backed comments via Giscus. Deployed on Vercel as a static site.

## Commands

```bash
pnpm dev              # Start dev server with hot reload
pnpm build            # Build site + generate Pagefind search index
pnpm preview          # Preview production build locally
pnpm lint             # Run ESLint on TypeScript/React files

# Content generation (requires OPENAI_API_KEY)
pnpm generate:plan    # Generate monthly content plan
pnpm generate:article # Generate today's article from plan
```

## Architecture

### Rendering Model

- **Astro components** (`.astro`): Server-rendered, static HTML
- **React islands** (`.tsx`): Interactive components hydrated client-side
- **MDX content**: Blog articles with embedded React components

### Key Directories

```
src/
├── components/       # UI components (ui/, layout/, articles/, blog/, search/)
├── views/            # Smart React components for page sections
├── pages/            # File-based routing (Astro)
├── layouts/          # BaseLayout.astro, ArticleLayout.astro
├── hooks/            # useTheme, useSearch, useReadingProgress, usePageTitle
├── content/articles/ # MDX blog posts (YYYY-MM-DD-slug.mdx)
├── utils/            # Helpers, remark plugins, image providers
├── constants/        # Site config, nav links, social links
└── styles/           # Tailwind global.css with custom layers

scripts/              # Build automation and AI content generation
content-plans/        # AI-generated monthly content plans (JSON)
```

### Content Collections

Articles are defined in `src/content/config.ts` with this schema:

```yaml
---
title: "Article Title"
description: "Short description"
category: "trending" | "tutorial" | "deep-dive"
publishDate: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
heroImage: "https://..."
heroImageAlt: "Alt text"
heroImageAuthor: "Author Name"
heroImageAuthorUrl: "https://..."
draft: false
slug: "url-slug"
---
```

### Theme System

- Theme stored in `<html data-theme="light|dark">`
- Persisted in localStorage, falls back to `prefers-color-scheme`
- Managed via React context (`useTheme` hook in `src/hooks/useTheme.tsx`)

### Design Tokens

- **Category colors**: Trending (orange-500), Tutorial (sky-500), Deep Dive (purple-500)
- **Fonts**: Plus Jakarta Sans (sans), JetBrains Mono (mono)
- **Custom CSS vars**: `--max-w-blog: 48rem`, `--max-w-content: 45rem`

### Code Blocks

Use the `filename` attribute for titled code blocks:

````markdown
```typescript filename="example.ts"
const foo = "bar";
```
````

### Custom Remark Plugins

- `remark-mermaid-pre.mjs`: Transforms Mermaid code blocks to base64-encoded diagrams
- `remark-image-figure.mjs`: Wraps images in `<figure>` elements with captions

## Content Automation

GitHub Actions workflows automate content generation:
- **Monthly plan** (1st of month, 8:00 UTC): Creates PR with content outline
- **Daily article** (17:00 UTC): Generates article from plan, creates PR for review

Both require `OPENAI_API_KEY` secret in repository settings.

## Environment Variables

```bash
OPENAI_API_KEY=       # Required for content generation
UNSPLASH_ACCESS_KEY=  # Optional: Hero image sourcing
PEXELS_API_KEY=       # Optional: Image fallback
```

## Build Pipeline

1. `astro build` generates static HTML in `dist/` (or `.vercel/output/static`)
2. `build-search-index.mjs` runs Pagefind to create client-side search index

## Agent Rules

### Git Workflow

- **One file per commit**: Each commit should contain changes to a single file
- **No co-authors**: Do not add `Co-Authored-By` or any other co-author to commits
- **Never push**: Do not push to remote unless explicitly asked
- **Conventional commits** with this format:
  ```
  docs|refactor|feat|fix: description in lowercase (except acronyms)
  ```
  Examples: `feat: add RSS feed`, `fix: MDX parsing error`, `docs: update API reference`

### Before Closing Session

1. Verify `pnpm dev` runs without errors
2. Verify `pnpm build` completes successfully
3. Delete any planning documents created during the session (e.g., `plan.md`, `TODO.md`)

### MCP Tools

- **Context7**: Use for fetching up-to-date library documentation
- **GitHub MCP**: Use when working on repositories not cloned in `~/Sites`
