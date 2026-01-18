# Blog Content Quality Improvements

**Date:** 2026-01-17
**Status:** Approved

## Overview

Improve blog content quality in three areas:

1. **Rewrite Claude article** - Fix inaccurate "Claude Agents vs Skills" article with factual content
2. **Better images** - Improve Unsplash queries + add Mermaid.js diagram support
3. **Better content generation** - Add prompt guardrails to prevent hallucinated APIs/code

## Problem Statement

Current issues identified:
- Hero images are generic stock photos (e.g., "laptop with tea" for AI article)
- Article content invents fictional APIs (e.g., `import { Agent } from 'claude'`)
- Claude-specific article is completely inaccurate about how agents and skills actually work

## Solution Design

### 1. Claude Article Rewrite

Replace `src/content/articles/2026-01-08-claude-agents-vs-claude-skills-complete-comparison.mdx` with accurate content:

**Accurate definitions:**
- **Agents**: Task tool subprocesses with specific toolsets (Explore, Plan, Bash, etc.)
- **Skills**: Markdown instruction files loaded via Skill tool

**Article structure:**
1. Intro - Why understanding agents vs skills matters
2. What are Claude Code Agents - Task tool, subagent types, autonomous execution
3. What are Claude Code Skills - Markdown files, Skill tool, behavior guidance
4. Key differences - Architecture comparison with Mermaid diagram
5. When to use each - Practical decision guide
6. Real examples - Actual syntax, not fictional APIs
7. Creating your own - Brief intro to custom skills

### 2. Image Generation Improvements

**Files to modify:** `scripts/suggest-article-images.mjs`

**Changes:**
- Rewrite `generateImprovedHeroQuery()` to extract actual subject matter
- Add title keyword extraction (nouns/concepts over framework names)
- Add category-specific visual styles
- Generate better alt text from article context

**Mermaid.js integration:**
- Add `rehype-mermaid` to Astro config
- Update generation prompt to output Mermaid for architecture/flow sections
- Diagrams render at build time to SVG

### 3. Content Generation Prompt Improvements

**File to modify:** `scripts/generate-article-from-plan.mjs`

**New guardrails to add:**
```
ACCURACY REQUIREMENTS:
1. Do NOT invent APIs, libraries, or syntax you're not certain exist
2. If unsure about code examples, use clearly labeled pseudocode
3. For newer technologies, focus on concepts over specific implementation
4. When comparing tools, only include features you're confident about
5. Acknowledge limitations rather than fabricating details
```

**Additional changes:**
- Add Mermaid generation instructions for diagram-worthy sections
- Add code verification hints
- Add honesty clause for uncertain topics

## Files Changed

| File | Change Type |
|------|-------------|
| `src/content/articles/2026-01-08-claude-agents-vs-claude-skills-complete-comparison.mdx` | Rewrite |
| `scripts/suggest-article-images.mjs` | Modify |
| `scripts/generate-article-from-plan.mjs` | Modify |
| `astro.config.mjs` | Modify (add Mermaid plugin) |
| `package.json` | Modify (add Mermaid dependency) |

## Implementation Order

1. Add Mermaid.js support to Astro
2. Update image query generation
3. Update article generation prompts
4. Rewrite Claude article with accurate content + Mermaid diagram
