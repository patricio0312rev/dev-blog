import React from "react";
import { Flame, BookOpen, FlaskConical, Sparkles } from "lucide-react";
import { usePageTitle } from "@/hooks";
import { ButtonLink, CodeContainer } from "@/components/ui";
import { ArticleCard } from "@/components/articles";
import { SAMPLE_ARTICLES, HERO_CODE, SITE_CONFIG } from "@/constants";

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
              <span className="gradient-sky-purple animate-gradient bg-clip-text text-transparent">
                {SITE_CONFIG.author}
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full gradient-sky-purple animate-gradient">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-sky-600 shadow-sm dark:bg-zinc-950 dark:text-sky-200">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
              </span>
            </span>
          </h1>

          <p className="max-w-xl text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
            Full-stack developer from {SITE_CONFIG.location}. I write about
            software development, share tutorials, and occasionally rant about
            the industry.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <ButtonLink href="/blog" variant="primary">
              Read the blog
            </ButtonLink>
            <ButtonLink href="/calendar" variant="secondary">
              Content calendar
            </ButtonLink>
          </div>
        </div>

        {/* Code block decoration */}
        <div className="flex-1">
          <CodeContainer
            fileName="patricio.ts"
            codeToCopy={HERO_CODE}
            showCopyButton={false}
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

        {SAMPLE_ARTICLES.length > 0 ? (
          <div className="grid items-stretch gap-4 md:grid-cols-3">
            {SAMPLE_ARTICLES.map((article) => (
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
          <TopicCard
            Icon={Flame}
            title="Trending"
            description="Thoughts on the industry, new tools, and what's actually worth your time."
            color="orange"
          />
          <TopicCard
            Icon={BookOpen}
            title="Tutorials"
            description="Practical, copy-pasteable guides for building things with TypeScript, React, and friends."
            color="sky"
          />
          <TopicCard
            Icon={FlaskConical}
            title="Deep Dives"
            description="Architecture, patterns, and the trade-offs behind decisions that survive real users."
            color="purple"
          />
        </div>
      </section>
    </div>
  );
};

interface TopicCardProps {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: "orange" | "sky" | "purple";
}

const TopicCard: React.FC<TopicCardProps> = ({
  Icon,
  title,
  description,
  color,
}) => {
  const colorClasses = {
    orange: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/15",
    sky: "bg-sky-500/10 text-sky-500 dark:bg-sky-500/15",
    purple: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/15",
  };

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-sm transition-colors duration-200 dark:border-zinc-800/80 dark:bg-zinc-900/60">
      <div
        className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${colorClasses[color]}`}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
};
