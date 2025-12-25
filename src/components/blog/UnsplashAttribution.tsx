import React from "react";

interface UnsplashAttributionProps {
  author: string;
  authorUrl: string;
  unsplashUrl: string;
}

export const UnsplashAttribution: React.FC<UnsplashAttributionProps> = ({
  author,
  authorUrl,
  unsplashUrl,
}) => {
  return (
    <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
      Photo by{" "}
      <a
        href={`${authorUrl}?utm_source=patriciomarroquin_dev&utm_medium=referral`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        {author}
      </a>{" "}
      on{" "}
      <a
        href={`${unsplashUrl}?utm_source=patriciomarroquin_dev&utm_medium=referral`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        Unsplash
      </a>
    </p>
  );
};

export default UnsplashAttribution;
