import React from "react";
import { Flame, BookOpen, FlaskConical, Sparkles } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import type { ArticleCategory } from "./ArticleCategoryBadge";
import { CodeContainer } from "./CodeContainer";
import { usePageTitle } from "./usePageTitle";

const recentArticles: {
  title: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  date: string;
  slug: string;
}[] = [
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

const HERO_CODE = `const patricio = {
  role: "Full-Stack Dev",
  location: "Lima 🇵🇪",
  stack: ["TS", "React", "Node"],
  coffee: Infinity,
};`;

export const HomePage: React.FC = () => {
  usePageTitle("Home");

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col items-start gap-10 md:flex-row md:items-center">
        <div className="flex-1 space-y-5">
          <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            PERSONAL DEV BLOG
          </p>

          <h1 className="flex flex-wrap items-center gap-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl dark:text-zinc-50">
            <span>Hey, I&apos;m</span>
            <span className="inline-flex items-center gap-3">
              {/* Animated gradient text */}
              <span className="gradient-sky-purple animate-gradient bg-clip-text text-transparent">
                Juan&nbsp;Patricio
              </span>

              {/* Animated gradient icon capsule */}
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full gradient-sky-purple animate-gradient">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-sky-600 shadow-sm dark:bg-zinc-950 dark:text-sky-200">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
              </span>
            </span>
          </h1>

          <p className="max-w-xl text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
            Full-stack developer from Lima, Peru. I write about software
            development, share tutorials, and occasionally rant about the
            industry.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="/blog"
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
            >
              Read the blog
            </a>
            <a
              href="/calendar"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-transparent px-4 py-2 text-sm font-medium text-zinc-800 transition-colors duration-200 hover:border-sky-400 hover:text-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-sky-400 dark:hover:text-sky-400 dark:focus-visible:ring-offset-zinc-950"
            >
              Content calendar
            </a>
          </div>
        </div>

        {/* Right side: stylized code block with optional copy */}
        <div className="flex-1">
          <CodeContainer
            fileName="patricio.ts"
            codeToCopy={HERO_CODE}
            showCopyButton={false} // hide on welcome
          >
            <pre className="font-mono text-[11px] leading-relaxed">
              <code>
                <span className="text-sky-300">const</span>{" "}
                <span className="text-sky-100">patricio</span>{" "}
                <span className="text-sky-300">=</span>{" "}
                <span className="text-sky-100">&#123;</span>
                {"\n"}
                &nbsp;&nbsp;<span className="text-purple-300">role</span>
                <span className="text-sky-300">:</span>{" "}
                <span className="text-emerald-300">
                  &quot;Full-Stack Dev&quot;
                </span>
                ,{"\n"}
                &nbsp;&nbsp;<span className="text-purple-300">location</span>
                <span className="text-sky-300">:</span>{" "}
                <span className="text-emerald-300">&quot;Lima 🇵🇪&quot;</span>,
                {"\n"}
                &nbsp;&nbsp;<span className="text-purple-300">stack</span>
                <span className="text-sky-300">:</span>{" "}
                <span className="text-sky-200">[</span>
                <span className="text-emerald-300">&quot;TS&quot;</span>,{" "}
                <span className="text-emerald-300">&quot;React&quot;</span>,{" "}
                <span className="text-emerald-300">&quot;Node&quot;</span>
                <span className="text-sky-200">]</span>,{"\n"}
                &nbsp;&nbsp;<span className="text-purple-300">coffee</span>
                <span className="text-sky-300">:</span>{" "}
                <span className="text-amber-300">Infinity</span>
                {"\n"}
                <span className="text-sky-100">&#125;</span>
                {"\n"}
              </code>
            </pre>
          </CodeContainer>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Recent Articles
          </h2>
          <a
            href="/blog"
            className="text-xs text-zinc-500 underline-offset-4 hover:text-sky-500 hover:underline dark:text-zinc-400 dark:hover:text-sky-400"
          >
            View all
          </a>
        </div>
        {recentArticles.length ? (
          <div className="grid items-stretch gap-4 md:grid-cols-3">
            {recentArticles.map((article) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
            🚧 Articles coming soon! Check the{" "}
            <a
              href="/calendar"
              className="font-medium text-sky-600 underline-offset-4 hover:underline dark:text-sky-400"
            >
              content calendar
            </a>
            .
          </div>
        )}
      </section>

      {/* Topics Section */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          What I Write About
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-sm transition-colors duration-200 dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div
              className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/15"
              aria-hidden="true"
            >
              <Flame className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Trending
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Thoughts on the industry, new tools, and what&apos;s actually
              worth your time.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-sm transition-colors duration-200 dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div
              className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500 dark:bg-sky-500/15"
              aria-hidden="true"
            >
              <BookOpen className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Tutorials
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Practical, copy-pasteable guides for building things with
              TypeScript, React, and friends.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-sm transition-colors duration-200 dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div
              className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 dark:bg-purple-500/15"
              aria-hidden="true"
            >
              <FlaskConical className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Deep Dives
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Architecture, patterns, and the trade-offs behind decisions that
              survive real users.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
