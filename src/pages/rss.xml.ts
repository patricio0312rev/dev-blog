import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { SITE_CONFIG } from "@/constants";
import { normalizeDateInput } from "@/utils";

export async function GET(context: APIContext) {
  // Load all non-draft articles from the content collection
  const articles = await getCollection("articles", ({ data }) => !data.draft);

  // Sort newest → oldest by publishDate
  const sorted = articles.sort((a, b) => {
    const da = normalizeDateInput(a.data.publishDate).getTime();
    const db = normalizeDateInput(b.data.publishDate).getTime();

    return db - da;
  });

  return rss({
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    site: context.site!,
    stylesheet: "/rss-styles.xsl",
    items: sorted.map((entry) => {
      const { title, description, publishDate, category, tags = [] } = entry.data;
      const slug = entry.slug; 
      const pubDate = normalizeDateInput(publishDate);

      return {
        title,
        link: `/blog/${slug}`,
        description,
        pubDate,
        categories: [category, ...tags],
        customData: `
          <category>${category}</category>
          ${tags.map((t) => `<category>${t}</category>`).join("")}
        `,
      };
    }),
  });
}
