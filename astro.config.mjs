import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";

export default defineConfig({
  site: "https://patriciomarroquin.dev",
  output: "static",
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/draft/"),
    }),
    pagefind(),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: [/^\/pagefind\//],
      },
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-dark",
        dark: "github-dark",
      },
      transformers: [
        {
          pre(hast) {
            hast.properties["data-meta"] = this.options.meta?.__raw;
          },
        },
      ],
    },
  },
});
