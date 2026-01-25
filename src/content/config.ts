import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["trending", "tutorial", "deep-dive"]),
    tags: z.array(z.string()),
    publishDate: z.string(),
    updatedDate: z.string().optional(),
    draft: z.boolean().default(false),

    // Hero image fields
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),

    // Unsplash-specific fields
    heroImageAuthor: z.string().optional(),
    heroImageAuthorUrl: z.string().optional(),
    heroImageUnsplashUrl: z.string().optional(),
    heroImageDownloadLocation: z.string().optional(),

    // SEO
    ogImage: z.string().optional(),
    canonicalUrl: z.string().url().optional(),

    // Series support
    series: z.string().optional(), // Series identifier (e.g., "react-fundamentals")
    seriesOrder: z.number().optional(), // Order within the series (1, 2, 3...)
  }),
});

export const collections = { articles };
