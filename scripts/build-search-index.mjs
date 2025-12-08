/**
 * Post-build script to generate Pagefind search index
 * Works both locally and on Vercel
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

// Vercel adapter output dir
const VERCEL_STATIC_DIR = join(process.cwd(), ".vercel", "output", "static");
// Default Astro static output
const DIST_DIR = join(process.cwd(), "dist");

// Use Vercel output if present, otherwise fallback to dist
const SITE_DIR = existsSync(VERCEL_STATIC_DIR) ? VERCEL_STATIC_DIR : DIST_DIR;

async function buildSearchIndex() {
  console.log("🔍 Building Pagefind search index...\n");
  console.log(`📁 Using site directory: ${SITE_DIR}`);

  if (!existsSync(SITE_DIR)) {
    console.error(
      `❌ Error: site directory not found at ${SITE_DIR}. Did 'astro build' run correctly?`
    );
    process.exit(1);
  }

  try {
    execSync(
      // Let Pagefind default output be `${SITE_DIR}/pagefind`
      `npx pagefind --site "${SITE_DIR}"`,
      { stdio: "inherit" }
    );

    console.log("\n✅ Search index built successfully!");
  } catch (error) {
    console.error(
      "\n❌ Error building search index:",
      error?.message ?? error
    );
    process.exit(1);
  }
}

buildSearchIndex();
