#!/usr/bin/env node

/**
 * Post-build script to generate Pagefind search index
 * This runs after `astro build` to index all HTML files
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const DIST_DIR = join(process.cwd(), "dist");

async function buildSearchIndex() {
  console.log("🔍 Building Pagefind search index...\n");

  // Check if dist directory exists
  if (!existsSync(DIST_DIR)) {
    console.error("❌ Error: dist directory not found. Please run 'pnpm build' first.");
    process.exit(1);
  }

  try {
    // Run Pagefind indexer
    execSync(
      `npx pagefind --site "${DIST_DIR}" --output-path "${join(DIST_DIR, "pagefind")}"`,
      { stdio: "inherit" }
    );

    console.log("\n✅ Search index built successfully!");
  } catch (error) {
    console.error("\n❌ Error building search index:", error.message);
    process.exit(1);
  }
}

buildSearchIndex();
