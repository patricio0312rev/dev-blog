import React from "react";
import { Linkedin, Instagram, Twitter, GithubIcon, Globe } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants";

const socialLinks = [
  { href: SOCIAL_LINKS.twitter, label: "Twitter / X", Icon: Twitter },
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: Instagram },
  { href: SOCIAL_LINKS.github, label: "Github", Icon: GithubIcon },
  { href: SOCIAL_LINKS.portfolio, label: "Portfolio", Icon: Globe },
];

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50/80 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-950/80 dark:text-zinc-400">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-xs">Built with ☕ and 💜 from Lima, Peru</p>

        <div className="flex items-center gap-3">
          {socialLinks.map((link, index) => (
            <React.Fragment key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs transition-colors duration-200 hover:text-sky-500 dark:hover:text-sky-400"
                aria-label={link.label}
              >
                <link.Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </a>
              {index < socialLinks.length - 1 && (
                <span aria-hidden="true">·</span>
              )}
            </React.Fragment>
          ))}

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
