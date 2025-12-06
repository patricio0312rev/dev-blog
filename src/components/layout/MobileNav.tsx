import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { cn } from "@/utils";

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50/80 text-zinc-700 shadow-sm transition-colors duration-200 hover:border-sky-400 hover:text-sky-500 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:border-sky-400 dark:hover:text-sky-400 lg:hidden"
        onClick={toggle}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Menu className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      {/* Floating mobile menu */}
      <div
        className="pointer-events-none fixed inset-x-0 top-16 z-30 flex justify-center lg:hidden"
        aria-hidden={!isOpen}
      >
        <div
          className={cn(
            "w-full max-w-5xl px-4 sm:px-6 lg:px-8 transition-all duration-200 ease-out",
            isOpen
              ? "pointer-events-auto opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2"
          )}
        >
          <nav className="mt-2 space-y-1 rounded-xl border border-zinc-200 bg-zinc-50/95 p-3 text-sm shadow-lg backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const commonProps = {
                className:
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-zinc-800 transition-colors duration-200 hover:bg-zinc-100 hover:text-sky-600 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-sky-400",
                onClick: close,
              };

              const content = (
                <>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{link.label}</span>
                </>
              );

              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    {...commonProps}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <a key={link.href} href={link.href} {...commonProps}>
                  {content}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};
