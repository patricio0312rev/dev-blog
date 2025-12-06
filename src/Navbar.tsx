// src/Navbar.tsx
import React from "react";
import { Zap, FileText, CalendarDays, Github, Globe } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav, type NavLinkConfig } from "./MobileNav";

const navLinks: NavLinkConfig[] = [
  {
    href: "/blog",
    label: "Articles",
    Icon: FileText,
  },
  {
    href: "/calendar",
    label: "Calendar",
    Icon: CalendarDays,
  },
  {
    href: "https://github.com/patricio0312rev",
    label: "GitHub",
    Icon: Github,
    external: true,
  },
  {
    href: "https://patriciomarroquin.dev",
    label: "Portfolio",
    Icon: Globe,
    external: true,
  },
];

export const Navbar: React.FC = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200/60 bg-zinc-50/70 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: logo */}
        <a
          href="/"
          className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:text-purple-500 dark:text-zinc-50 dark:hover:text-purple-400"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 dark:bg-purple-500/15">
            <Zap className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="tracking-tight">patricio.dev</span>
        </a>

        {/* Right: nav + theme toggle + mobile menu */}
        <div className="flex items-center gap-2">
          {/* Desktop nav (lg and up) */}
          <nav className="hidden items-center gap-3 text-xs font-medium text-zinc-600 lg:flex dark:text-zinc-300">
            {navLinks.map((link) => {
              const content = (
                <>
                  <link.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{link.label}</span>
                </>
              );

              const commonClass =
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors duration-200 hover:text-sky-500 dark:hover:text-sky-400";

              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={commonClass}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <a key={link.href} href={link.href} className={commonClass}>
                  {content}
                </a>
              );
            })}
          </nav>

          {/* Theme toggle (same height as hamburger) */}
          <ThemeToggle />

          {/* Mobile hamburger + floating menu */}
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
};
