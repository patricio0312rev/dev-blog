import React from "react";
import { Linkedin, Instagram, Twitter, GithubIcon, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50/80 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-950/80 dark:text-zinc-400">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-xs">Built with ☕ and 💜 from Lima, Peru</p>
        <div className="flex items-center gap-3">
          <a
            href="https://x.com/patricio0312rev"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs transition-colors duration-200 hover:text-sky-500 dark:hover:text-sky-400"
            aria-label="X (Twitter)"
          >
            <Twitter className="h-4 w-4" />
            <span className="hidden sm:inline">Twitter / X</span>
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://www.linkedin.com/in/patricio0312rev"
            className="flex items-center gap-1 text-xs transition-colors duration-200 hover:text-sky-500 dark:hover:text-sky-400"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin className="h-4 w-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://www.instagram.com/patricio0312rev"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs transition-colors duration-200 hover:text-sky-500 dark:hover:text-sky-400"
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/patricio0312rev"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs transition-colors duration-200 hover:text-sky-500 dark:hover:text-sky-400"
            aria-label="Github"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Github</span>
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://patriciomarroquin.dev"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs transition-colors duration-200 hover:text-sky-500 dark:hover:text-sky-400"
            aria-label="Portfolio"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Portfolio</span>
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="/rss.xml"
            className="text-xs transition-colors duration-200 hover:text-sky-500 dark:hover:text-sky-400"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
};
