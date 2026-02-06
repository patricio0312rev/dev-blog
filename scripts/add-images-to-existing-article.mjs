import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeArticleForImages } from "./suggest-article-images.mjs";

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
    const url = new URL("https://api.unsplash.com/photos/random");
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("content_filter", "high");
    url.searchParams.set("client_id", accessKey);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.links?.download_location) {
      try {
        await fetch(data.links.download_location, {
          headers: { Authorization: `Client-ID ${accessKey}` },
        });
      } catch (err) {
        console.warn("Failed to trigger download tracking");
      }
    }

    return {
      url: data.urls.regular,
      alt: data.alt_description || data.description || query,
      author: data.user.name,
      authorUrl: data.user.links.html,
      unsplashUrl: data.links.html,
      downloadLocation: data.links.download_location,
    };
  } catch (error) {
    console.error("Failed to fetch from Unsplash:", error.message);
    return null;
  }
}

function getPicsumImage(query) {
  const seed = query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50);
  
  return {
    url: `https://picsum.photos/seed/${seed}/1200/630`,
    alt: `Illustration for ${query}`,
    author: null,
    authorUrl: null,
  };
}

function escapeYamlString(str) {
  if (!str) return "";
  return String(str).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function parseArticleFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const frontmatter = match[1];
  const body = content.slice(match[0].length);
  
  const data = {};
  
  // Parse frontmatter fields
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

async function addImagesToArticle(filepath) {
  console.log(`\n📄 Processing: ${path.basename(filepath)}`);
  
  const content = fs.readFileSync(filepath, "utf8");
  const parsed = parseArticleFrontmatter(content);
  
  if (!parsed) {
    console.error("❌ Could not parse frontmatter");
    return;
  }
  
  const { frontmatter, body, data } = parsed;
  
  // Check if hero image already exists
  if (frontmatter.includes("heroImage:")) {
    console.log("ℹ️  Hero image already exists, skipping");
    return;
  }
  
  // Analyze what images are needed
  const imageRequests = analyzeArticleForImages({
    title: data.title,
    category: data.category,
    tags: data.tags || [],
    outline: [], // We'd need to parse this from body
  });
  
  console.log(`📊 Suggested ${imageRequests.length} images`);
  
  // Fetch images
  const images = [];
  for (const request of imageRequests) {
    console.log(`  🔍 Fetching: ${request.query}`);
    
    const imageData = await fetchUnsplashImage(request.query) || getPicsumImage(request.query);
    images.push({ ...imageData, ...request });
    
    if (process.env.UNSPLASH_ACCESS_KEY) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  const heroImage = images.find(img => img.purpose === "hero");
  
  if (!heroImage) {
    console.error("❌ No hero image generated");
    return;
  }
  
  // Add hero image to frontmatter
  let updatedFrontmatter = frontmatter +
    `\nheroImage: "${escapeYamlString(heroImage.url)}"` +
    `\nheroImageAlt: "${escapeYamlString(heroImage.alt)}"`;

  if (heroImage.author) {
    updatedFrontmatter += `\nheroImageAuthor: "${escapeYamlString(heroImage.author)}"`;
  }
  if (heroImage.authorUrl) {
    updatedFrontmatter += `\nheroImageAuthorUrl: "${escapeYamlString(heroImage.authorUrl)}"`;
  }
  if (heroImage.unsplashUrl) {
    updatedFrontmatter += `\nheroImageUnsplashUrl: "${escapeYamlString(heroImage.unsplashUrl)}"`;
  }
  if (heroImage.downloadLocation) {
    updatedFrontmatter += `\nheroImageDownloadLocation: "${escapeYamlString(heroImage.downloadLocation)}"`;
  }
  
  const updatedContent = `---\n${updatedFrontmatter}\n---${body}`;
  
  // Backup original
  fs.writeFileSync(filepath + ".backup", content, "utf8");
  
  // Write updated version
  fs.writeFileSync(filepath, updatedContent, "utf8");
  
  console.log(`✅ Added hero image to ${path.basename(filepath)}`);
  console.log(`   Backup saved as ${path.basename(filepath)}.backup`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("Usage: node add-images-to-existing-article.mjs <article-file.mdx>");
    console.log("\nOr process all articles:");
    console.log("node add-images-to-existing-article.mjs --all");
    return;
  }
  
  if (args[0] === "--all") {
    const files = fs.readdirSync(ARTICLES_DIR)
      .filter(f => f.endsWith(".mdx"))
      .map(f => path.join(ARTICLES_DIR, f));
    
    console.log(`Found ${files.length} articles`);
    
    for (const file of files) {
      await addImagesToArticle(file);
    }
  } else {
    const filepath = path.isAbsolute(args[0]) 
      ? args[0] 
      : path.join(ARTICLES_DIR, args[0]);
    
    if (!fs.existsSync(filepath)) {
      console.error(`❌ File not found: ${filepath}`);
      process.exit(1);
    }
    
    await addImagesToArticle(filepath);
  }
}

main().catch(console.error);
