import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImprovedHeroQuery, generateAltText } from "./suggest-article-images.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_DIR = path.join(__dirname, "..", "src", "content", "articles");

async function fetchUnsplashImage(query) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    console.warn("⚠️  UNSPLASH_ACCESS_KEY not configured");
    return null;
  }

  try {
    // Use search endpoint for more relevant results
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("content_filter", "high");
    url.searchParams.set("per_page", "10");
    url.searchParams.set("client_id", accessKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`   Unsplash API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.error(`   No images found for query: ${query}`);
      return null;
    }

    // Pick a random image from top 5 results for variety
    const topResults = data.results.slice(0, 5);
    const photo = topResults[Math.floor(Math.random() * topResults.length)];

    // Trigger download tracking (required by Unsplash API guidelines)
    if (photo.links?.download_location) {
      try {
        await fetch(photo.links.download_location, {
          headers: { Authorization: `Client-ID ${accessKey}` },
        });
      } catch (err) {
        // Silently fail tracking
      }
    }

    return {
      url: photo.urls.regular,
      alt: photo.alt_description || photo.description || query,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
    };
  } catch (error) {
    console.error("   Failed to fetch from Unsplash:", error.message);
    return null;
  }
}

function parseArticleFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = match[1];
  const body = content.slice(match[0].length);

  const data = {};

  const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
  if (titleMatch) data.title = titleMatch[1];

  const categoryMatch = frontmatter.match(/category:\s*"([^"]+)"/);
  if (categoryMatch) data.category = categoryMatch[1];

  const tagsMatch = frontmatter.match(/tags:\s*\n((?:\s+-\s+.+\n?)+)/);
  if (tagsMatch) {
    data.tags = tagsMatch[1]
      .split('\n')
      .map(line => line.trim().replace(/^-\s+/, ''))
      .filter(Boolean);
  }

  return { frontmatter, body, data };
}

function updateFrontmatterField(frontmatter, field, value) {
  const regex = new RegExp(`^${field}:.*$`, 'm');
  if (regex.test(frontmatter)) {
    return frontmatter.replace(regex, `${field}: "${value}"`);
  }
  return frontmatter + `\n${field}: "${value}"`;
}

async function updateArticleHeroImage(filepath) {
  const filename = path.basename(filepath);
  console.log(`\n📄 ${filename}`);

  const content = fs.readFileSync(filepath, "utf8");
  const parsed = parseArticleFrontmatter(content);

  if (!parsed) {
    console.error("   ❌ Could not parse frontmatter");
    return false;
  }

  const { frontmatter, body, data } = parsed;

  // Generate improved query
  const query = generateImprovedHeroQuery(data.title, data.category, data.tags || []);
  console.log(`   🔍 Query: "${query}"`);

  // Fetch new image
  const imageData = await fetchUnsplashImage(query);

  if (!imageData) {
    console.error("   ❌ Failed to fetch image");
    return false;
  }

  console.log(`   ✅ Found: ${imageData.author}`);

  // Generate alt text
  const altText = generateAltText("hero", null, data.title, data.tags || []);

  // Update frontmatter fields
  let updatedFrontmatter = frontmatter;
  updatedFrontmatter = updateFrontmatterField(updatedFrontmatter, "heroImage", imageData.url);
  updatedFrontmatter = updateFrontmatterField(updatedFrontmatter, "heroImageAlt", altText);
  updatedFrontmatter = updateFrontmatterField(updatedFrontmatter, "heroImageAuthor", imageData.author);
  updatedFrontmatter = updateFrontmatterField(updatedFrontmatter, "heroImageAuthorUrl", imageData.authorUrl);

  const updatedContent = `---\n${updatedFrontmatter}\n---${body}`;

  fs.writeFileSync(filepath, updatedContent, "utf8");

  return true;
}

async function main() {
  console.log("🖼️  Updating hero images for all articles\n");

  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error("❌ UNSPLASH_ACCESS_KEY not found in environment");
    process.exit(1);
  }

  const files = fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith(".mdx"))
    .sort()
    .map(f => path.join(ARTICLES_DIR, f));

  console.log(`Found ${files.length} articles`);

  let updated = 0;
  let failed = 0;

  for (const file of files) {
    const success = await updateArticleHeroImage(file);
    if (success) {
      updated++;
    } else {
      failed++;
    }

    // Rate limit: 1 request per second
    await new Promise(resolve => setTimeout(resolve, 1100));
  }

  console.log(`\n📊 Summary: ${updated} updated, ${failed} failed`);
}

main().catch(console.error);
