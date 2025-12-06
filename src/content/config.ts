import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["trending", "tutorial", "deep-dive"]),
    tags: z.array(z.string()),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // SEO
    ogImage: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
  }),
});

export const collections = { articles };
