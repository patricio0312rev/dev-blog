import React, { useEffect } from "react";
import { trackUnsplashDownload } from "@/utils/image-providers";

interface ArticleImageProps {
  src: string;
  alt: string;
  author?: string;
  authorUrl?: string;
  unsplashUrl?: string;
  downloadLocation?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({
  src,
  alt,
  author,
  authorUrl,
  unsplashUrl,
  downloadLocation,
  caption,
  width = 1200,
  height = 630,
}) => {
  // Track Unsplash download when image is displayed
  useEffect(() => {
    if (downloadLocation) {
      trackUnsplashDownload(downloadLocation);
    }
  }, [downloadLocation]);

  const isUnsplash = author && authorUrl && unsplashUrl;

  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="w-full rounded-xl shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-800"
      />
      {(caption || isUnsplash) && (
        <figcaption className="mt-3 text-center text-xs italic text-zinc-500 dark:text-zinc-400">
          {caption && <span className="block">{caption}</span>}
          {isUnsplash && (
            <span className="block mt-1">
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
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export default ArticleImage;
