// src/ArticleDetailPage.tsx
import React, { useEffect, useState } from "react";
import { Linkedin, Instagram, Twitter } from "lucide-react";
import {
  ArticleCategoryBadge,
  type ArticleCategory,
} from "./ArticleCategoryBadge";
import { usePageTitle } from "./usePageTitle";

export interface ArticleDetailProps {
  title: string;
  description: string;
  category: ArticleCategory;
  date: string; // ISO or parseable string
  tags: string[];
  // Optional: you can later add `content` as ReactNode or MDX component
}

export const ArticleDetailPage: React.FC<ArticleDetailProps> = ({
  title,
  description,
  category,
  date,
  tags,
}) => {
  usePageTitle(title);

  const [progress, setProgress] = useState(0);

  // Reading progress bar logic
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const current = window.scrollY;
      const value = total > 0 ? (current / total) * 100 : 0;
      setProgress(value);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="relative mx-auto max-w-content space-y-10">
      {/* Reading progress bar (sits under navbar) */}
      <div
        className="fixed inset-x-0 top-16 z-30 h-0.5 bg-sky-500/80 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="pt-4 space-y-4">
        {/* Breadcrumb-style meta */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <ArticleCategoryBadge category={category} />
          <span className="text-zinc-400 dark:text-zinc-500">•</span>
          <time dateTime={date} className="font-mono">
            {formattedDate}
          </time>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {title}
        </h1>

        <p className="text-base text-zinc-600 dark:text-zinc-300">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        <hr className="mt-4 border-zinc-200 dark:border-zinc-800" />
      </header>

      {/* Article content */}
      <article className="prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert prose-code:font-mono prose-pre:bg-zinc-900 prose-pre:text-zinc-50 prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-800 prose-blockquote:border-l-2 prose-blockquote:border-sky-500 prose-blockquote:text-zinc-700 dark:prose-blockquote:text-zinc-200 prose-img:rounded-xl">
        {/* Example content – replace with MDX / real content later */}
        <p>
          This is a placeholder for your article content. You can swap this
          section with MDX, a markdown renderer, or pass in custom React nodes
          once you wire your content pipeline.
        </p>

        <h2>Section heading</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Integer in vulputate magna.
        </p>

        <pre>
          <code className="language-ts">
            {`type User = {
  id: string;
  name: string;
  role: "admin" | "editor" | "reader";
};`}
          </code>
        </pre>

        <blockquote>
          <p>
            Good code is written for humans to read and for machines to execute
            — in that order.
          </p>
        </blockquote>

        <h3>Another section</h3>
        <ul>
          <li>Reasonable line length (~70 characters)</li>
          <li>Comfortable line height</li>
          <li>Accessible color contrast</li>
        </ul>

        <p>
          External link example:{" "}
          <a
            href="https://github.com/patricio0312rev"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-4 decoration-sky-400/70"
          >
            GitHub
            <span aria-hidden="true">↗</span>
          </a>
        </p>
      </article>

      {/* Share section */}
      <section className="mt-8 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-medium text-zinc-600 dark:text-zinc-300">
            Share:
          </span>

          <a
            href="#"
            className="inline-flex items-center gap-1 underline-offset-4 hover:text-sky-500 hover:underline dark:hover:text-sky-400"
            aria-label="Share on X (Twitter)"
          >
            <Twitter className="h-3.5 w-3.5" />
            <span>Twitter / X</span>
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-1 underline-offset-4 hover:text-sky-500 hover:underline dark:hover:text-sky-400"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-3.5 w-3.5" />
            <span>LinkedIn</span>
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-1 underline-offset-4 hover:text-sky-500 hover:underline dark:hover:text-sky-400"
            aria-label="Share on Instagram"
          >
            <Instagram className="h-3.5 w-3.5" />
            <span>Instagram</span>
          </a>
        </div>
      </section>

      {/* Related Articles */}
      <section className="mt-8 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Related Articles
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <a
              key={i}
              href="#"
              className="group rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/70 dark:border-zinc-800/80 dark:bg-zinc-900/60"
            >
              <span className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
                🔬 Deep Dive
              </span>
              <h3 className="font-medium text-zinc-900 group-hover:text-sky-500 dark:text-zinc-50 dark:group-hover:text-sky-400">
                Another article title {i}
              </h3>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
