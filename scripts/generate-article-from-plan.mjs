import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";
import { analyzeArticleForImages } from "./suggest-article-images.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, "..");
const PLAN_DIR = path.join(ROOT_DIR, "content-plans");
const ARTICLES_DIR = path.join(ROOT_DIR, "src", "content", "articles");

if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
}

// ---------- Date helpers ---------------------------------------------------

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function monthKeyFromDate(dateStr) {
  return dateStr.slice(0, 7);
}

// ---------- OpenAI client --------------------------------------------------

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---------- Image fetching helpers -----------------------------------------

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
      const errorText = await response.text();
      console.error(`  ❌ Unsplash API error (${response.status}): ${errorText}`);
      return null;
    }

    const data = await response.json();

    if (data.links?.download_location) {
      try {
        await fetch(data.links.download_location, {
          headers: { Authorization: `Client-ID ${accessKey}` },
        });
      } catch (err) {
        console.warn("  ⚠️  Failed to trigger download tracking");
      }
    }

    return {
      url: data.urls.regular,
      alt: data.alt_description || data.description || query,
      author: data.user.name,
      authorUrl: data.user.links.html,
    };
  } catch (error) {
    console.error(`  ❌ Failed to fetch from Unsplash:`, error.message);
    return null;
  }
}

function getPicsumImage(query) {
  const seed = query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50);
  
  const url = `https://picsum.photos/seed/${seed}/1200/630`;
  
  return {
    url,
    alt: `Illustration for ${query}`,
    author: null,
    authorUrl: null,
  };
}

async function fetchArticleImages(imageRequests) {
  console.log(`🖼️  Fetching ${imageRequests.length} images...`);
  
  const images = [];
  
  for (const request of imageRequests) {
    console.log(`  🔍 Searching for: "${request.query}" (${request.purpose})`);
    
    const imageData = await fetchUnsplashImage(request.query);
    
    if (imageData) {
      console.log(`  ✅ Found image by ${imageData.author || "unknown"}`);
      images.push({
        ...imageData,
        ...request,
      });
    } else {
      console.log(`  📸 Using Picsum fallback`);
      const fallback = getPicsumImage(request.query);
      images.push({
        ...fallback,
        ...request,
      });
    }
    
    // Rate limiting
    if (process.env.UNSPLASH_ACCESS_KEY) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return images;
}

// ---------- Helpers --------------------------------------------------------

function loadPlanForMonth(monthKey) {
  const planPath = path.join(PLAN_DIR, `${monthKey}.json`);
  if (!fs.existsSync(planPath)) {
    return null;
  }
  const raw = fs.readFileSync(planPath, "utf8");
  return JSON.parse(raw);
}

function savePlanForMonth(monthKey, plan) {
  const planPath = path.join(PLAN_DIR, `${monthKey}.json`);
  fs.writeFileSync(planPath, JSON.stringify(plan, null, 2) + "\n", "utf8");
}

function getPlannedArticleForDate(plan, date) {
  if (!plan || !Array.isArray(plan.articles)) return null;
  return plan.articles.find((a) => a.date === date) || null;
}

function buildEntrySlug(date, baseSlug) {
  if (!baseSlug) return date;
  return `${date}-${baseSlug}`;
}

function frontmatterEscape(str) {
  if (!str) return "";
  return String(str).replace(/"/g, '\\"');
}

function buildFrontmatter(planned, heroImage) {
  const { date, category, baseSlug, title, description, tags = [] } = planned;
  
  const lines = [
    "---",
    `title: "${frontmatterEscape(title)}"`,
    `description: "${frontmatterEscape(description)}"`,
    `category: "${category}"`,
    `publishDate: "${date}"`,
    "tags:",
  ];
  
  if (tags.length > 0) {
    tags.forEach((t) => lines.push(`  - ${t}`));
  } else {
    lines.push("  - dev");
    lines.push("  - blog");
  }
  
  lines.push(`slug: "${baseSlug}"`);
  
  // Add hero image with full Unsplash metadata
  if (heroImage) {
    lines.push(`heroImage: "${heroImage.url}"`);
    lines.push(`heroImageAlt: "${frontmatterEscape(heroImage.alt)}"`);
    
    // Unsplash compliance fields
    if (heroImage.author) {
      lines.push(`heroImageAuthor: "${frontmatterEscape(heroImage.author)}"`);
    }
    if (heroImage.authorUrl) {
      lines.push(`heroImageAuthorUrl: "${heroImage.authorUrl}"`);
    }
    if (heroImage.unsplashUrl) {
      lines.push(`heroImageUnsplashUrl: "${heroImage.unsplashUrl}"`);
    }
    if (heroImage.downloadLocation) {
      lines.push(`heroImageDownloadLocation: "${heroImage.downloadLocation}"`);
    }
  }
  
  lines.push("---");
  
  return lines.join("\n");
}

function insertImagesIntoArticle(articleBody, inArticleImages) {
  if (!inArticleImages || inArticleImages.length === 0) {
    return articleBody;
  }
  
  let updatedBody = articleBody;
  
  // Insert images at strategic points based on section headers
  inArticleImages.forEach((image, idx) => {
    let insertionPoint = "";
    
    // Try to find the section header
    if (image.section) {
      const sectionRegex = new RegExp(`(##\\s+${image.section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
      const match = updatedBody.match(sectionRegex);
      
      if (match) {
        // Insert after the section and its first paragraph
        const afterSection = updatedBody.indexOf('\n\n', match.index + match[0].length);
        if (afterSection !== -1) {
          insertionPoint = afterSection;
        }
      }
    }
    
    // Fallback: insert at specific positions
    if (!insertionPoint) {
      const sections = updatedBody.split(/##\s+/);
      if (image.placement === "mid-article" && sections.length > 2) {
        const midPoint = Math.floor(sections.length / 2);
        insertionPoint = updatedBody.indexOf(`## ${sections[midPoint]}`);
      } else if (image.placement === "before-conclusion") {
        const conclusionIndex = updatedBody.toLowerCase().lastIndexOf('## conclusion') ||
                               updatedBody.toLowerCase().lastIndexOf('## wrapping up') ||
                               updatedBody.toLowerCase().lastIndexOf('## final thoughts');
        if (conclusionIndex !== -1) {
          insertionPoint = conclusionIndex;
        }
      }
    }
    
    // Generate markdown for the image
    const imageMarkdown = `\n\n![${image.alt}](${image.url})\n${image.author ? `*Image by ${image.author} on Unsplash*` : ''}\n\n`;
    
    if (insertionPoint && insertionPoint > 0) {
      updatedBody = 
        updatedBody.slice(0, insertionPoint) + 
        imageMarkdown + 
        updatedBody.slice(insertionPoint);
    } else {
      // Fallback: add before the signature
      const signatureIndex = updatedBody.indexOf('Until next time, happy coding');
      if (signatureIndex !== -1) {
        updatedBody = 
          updatedBody.slice(0, signatureIndex) + 
          imageMarkdown + 
          updatedBody.slice(signatureIndex);
      }
    }
  });
  
  return updatedBody;
}

// ---------- Main -----------------------------------------------------------

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY in environment.");
    process.exit(1);
  }

  const today = todayISO();
  const monthKey = monthKeyFromDate(today);

  console.log(`📝 Generating article for ${today} (month: ${monthKey})`);

  const plan = loadPlanForMonth(monthKey);
  if (!plan) {
    console.log(
      `ℹ️  No content plan file found for month ${monthKey} in content-plans/. Exiting.`
    );
    return;
  }

  const planned = getPlannedArticleForDate(plan, today);
  if (!planned) {
    console.log(
      `ℹ️  No article scheduled for ${today} in content-plans/${monthKey}.json. Exiting.`
    );
    return;
  }

  const {
    date,
    category,
    slug: baseSlug,
    title,
    description,
    tags = [],
    angle,
    outline = [],
    codeIdeas = [],
    mediaIdeas = [],
  } = planned;

  const entrySlug = buildEntrySlug(date, baseSlug);
  const outPath = path.join(ARTICLES_DIR, `${entrySlug}.mdx`);

  if (fs.existsSync(outPath)) {
    console.log(
      `ℹ️  Article already exists for ${today} at ${outPath}. Skipping generation.`
    );
  
    if (plan && Array.isArray(plan.articles)) {
      const idx = plan.articles.findIndex(
        (a) =>
          a.date === date &&
          (a.slug === baseSlug || a.slug === planned.slug || a.entrySlug === entrySlug)
      );
  
      if (idx !== -1) {
        plan.articles[idx] = {
          ...plan.articles[idx],
          status: "published",
          entrySlug,
        };
        savePlanForMonth(monthKey, plan);
        console.log(
          `🗂  Updated content plan ${monthKey}.json: marked existing article as published (entrySlug: ${entrySlug}).`
        );
      }
    }
  
    return;
  }

  console.log(`Planned article found:`);
  console.log(`  [${category}] ${title}`);
  console.log(`  Base slug: ${baseSlug}`);
  console.log(`  Entry slug: ${entrySlug}`);
  console.log(`  Output file: ${outPath}`);

  // ---------- Analyze and fetch images ------------------------------------

  const imageRequests = analyzeArticleForImages(planned);
  console.log(`\n📊 Image analysis: ${imageRequests.length} images recommended`);
  
  const images = await fetchArticleImages(imageRequests);
  
  const heroImage = images.find(img => img.purpose === "hero");
  const inArticleImages = images.filter(img => img.purpose !== "hero");
  
  if (heroImage) {
    console.log(`\n✅ Hero image: ${heroImage.url}`);
    if (heroImage.author) {
      console.log(`   Credit: ${heroImage.author}`);
    }
  }
  
  if (inArticleImages.length > 0) {
    console.log(`\n📷 In-article images: ${inArticleImages.length}`);
    inArticleImages.forEach((img, idx) => {
      console.log(`   ${idx + 1}. ${img.purpose}: ${img.section || 'General'}`);
    });
  }

  // ---------- Build prompt for the article --------------------------------

  const instructions = [
    "You are writing a full MDX article for a personal dev blog.",
    "Author: Juan Patricio Marroquin Gavelan, a Peruvian full-stack engineer.",
    "Voice:",
    "- Friendly, dev-to-dev, slightly informal.",
    "- Technically sharp and honest about trade-offs.",
    "- Focused on practical value, not SEO fluff.",
    "- Explains WHY things matter, not only HOW.",
    "",
    "The blog uses Astro + MDX. Articles are long-form but readable, with real code and concrete examples.",
    "",
    "ACCURACY REQUIREMENTS (CRITICAL):",
    "1. Do NOT invent APIs, libraries, classes, or syntax that you are not certain exist.",
    "2. If you are unsure about specific code examples for a newer technology, use pseudocode",
    "   and clearly label it as such, or describe the concept without fabricating exact syntax.",
    "3. For technologies released after your knowledge cutoff, focus on explaining concepts",
    "   and general patterns rather than specific implementation details you might get wrong.",
    "4. When comparing tools or frameworks, only include features and behaviors you are confident about.",
    "5. It is better to acknowledge limitations ('implementation details may vary', 'check the",
    "   official docs for current syntax') than to fabricate specific details.",
    "6. Use established, well-documented patterns. Do not invent new API methods or classes.",
    "7. If a code example requires imports, only use import paths you are certain are correct.",
  ].join("\n");

  const tagsList = tags.join(", ");
  const outlineText = outline.map((item, idx) => `${idx + 1}. ${item}`).join("\n");
  const codeIdeasText = codeIdeas.map((c) => `- ${c}`).join("\n") || "- (none)";
  const mediaIdeasText = mediaIdeas.map((m) => `- ${m}`).join("\n") || "- (none)";

  // Generate image placement hints for the AI
  const imagePlacementHints = inArticleImages.map((img, idx) => 
    `- After section "${img.section || 'mid-article'}": Add a placeholder for ${img.purpose} image`
  ).join("\n");

  const articlePrompt = [
    `Today is ${today}.`,
    "",
    `You must write a **complete MDX article** based on this planning info:`,
    "",
    `Title: ${title}`,
    `Category: ${category}`,
    `Slug (base, without date): ${baseSlug}`,
    `Planned publication date: ${date}`,
    `Description (meta): ${description}`,
    `Tags: ${tagsList}`,
    "",
    "Value angle (what makes this worth reading):",
    angle || "(no angle provided, define a strong one yourself)",
    "",
    "Outline / section ideas:",
    outlineText || "(no outline provided, design a clear structure)",
    "",
    "Code ideas (snippets you MUST incorporate):",
    codeIdeasText,
    "",
    "Media ideas:",
    mediaIdeasText,
    "",
    "Image placeholders (will be inserted automatically):",
    imagePlacementHints || "- No specific image placements needed",
    "",
    "CRITICAL INSTRUCTIONS:",
    "DO NOT include the frontmatter - it will be added automatically.",
    "DO NOT add image markdown - images will be inserted automatically.",
    "DO NOT use placeholder image URLs like https://example.com/placeholder-*.png",
    "",
    "DIAGRAMS WITH MERMAID.JS:",
    "For architecture, flow, or comparison diagrams, use Mermaid.js code blocks.",
    "The blog supports Mermaid and will render these as SVG at build time.",
    "",
    "When to use Mermaid diagrams:",
    "- Architecture overviews showing component relationships",
    "- Flow diagrams showing data or process flow",
    "- Sequence diagrams for API or service interactions",
    "- Simple comparison structures",
    "",
    "Example Mermaid flowchart:",
    "```mermaid",
    "graph LR",
    "    A[User Request] --> B[API Gateway]",
    "    B --> C{Auth Check}",
    "    C -->|Valid| D[Service]",
    "    C -->|Invalid| E[401 Error]",
    "```",
    "",
    "Example Mermaid sequence diagram:",
    "```mermaid",
    "sequenceDiagram",
    "    Client->>Server: Request",
    "    Server->>Database: Query",
    "    Database-->>Server: Results",
    "    Server-->>Client: Response",
    "```",
    "",
    "Keep Mermaid diagrams simple and readable. Use them sparingly - only when",
    "a visual truly helps explain a concept better than text or tables.",
    "",
    "For simple comparisons, prefer tables over diagrams:",
    "",
    "MDX and structure requirements:",
    "1) Start with a compelling intro paragraph",
    "2) Use ## headings that align with the outline",
    "3) Use ### sub-sections where needed",
    "4) Use bullet lists and numbered lists for clarity",
    "5) Keep paragraphs short and readable (3-5 sentences max)",
    "",
    "Code blocks:",
    "- Use fenced code blocks: ```ts, ```tsx, ```js, etc.",
    "- Include filename for non-trivial snippets: ```ts filename=\"example.ts\"",
    "- At least 2-3 real, runnable code examples",
    "- Tie code to explanations - no random snippets",
    "",
    "For comparisons:",
    "- Use side-by-side code blocks (before/after)",
    "- Use tables for feature comparisons",
    "- Use descriptive bullet lists",
    "",
    "Example comparison (GOOD):",
    "**Before (React 18):**",
    "```tsx",
    "// Complex manual handling",
    "const [loading, setLoading] = useState(false);",
    "```",
    "",
    "**After (React 19):**",
    "```tsx",
    "// Simplified with useTransition",
    "const [isPending, startTransition] = useTransition();",
    "```",
    "",
    "Depth & originality:",
    "- Focus on real-world problems and trade-offs",
    "- Include your commentary and judgment",
    "- Assume intermediate developer audience",
    "",
    "Ending signature (REQUIRED):",
    "Until next time, happy coding 👨‍💻  ",
    "– Patricio Marroquin 💜",
    "",
    "Return ONLY the article body.",
    "No frontmatter, no placeholder images, no extra explanations.",
  ].join("\n");

  console.log("\n🤖 Generating article content with AI...\n");

  const response = await client.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: articlePrompt }
    ],
    max_tokens: 4000,
    temperature: 0.7,
  });

  const articleBody = response.choices[0]?.message?.content;

  if (!articleBody) {
    console.error("❌ No article text returned from model:");
    console.dir(response, { depth: 4 });
    process.exit(1);
  }

  // Insert images into article body
  const articleWithImages = insertImagesIntoArticle(articleBody, inArticleImages);

  // Build complete MDX with frontmatter + body
  const frontmatter = buildFrontmatter(
    { date, category, baseSlug, title, description, tags },
    heroImage
  );
  
  const completeMdx = `${frontmatter}\n\n${articleWithImages.trim()}\n`;

  fs.writeFileSync(outPath, completeMdx, "utf8");

  console.log(`\n✅ Article generated at: ${outPath}`);
  console.log(`   Slug: ${entrySlug}`);
  console.log(`   Images: ${images.length} (1 hero + ${inArticleImages.length} in-article)`);

  // Update content plan
  if (plan && Array.isArray(plan.articles)) {
    const idx = plan.articles.findIndex(
      (a) =>
        a.date === date &&
        (a.slug === baseSlug || a.slug === planned.slug || a.entrySlug === entrySlug)
    );

    if (idx !== -1) {
      plan.articles[idx] = {
        ...plan.articles[idx],
        status: "published",
        entrySlug,
        heroImage: heroImage?.url,
        imageCount: images.length,
      };
      savePlanForMonth(monthKey, plan);
      console.log(
        `\n🗂  Updated content plan ${monthKey}.json: marked article for ${date} as published.`
      );
    }
  }
}

main().catch((err) => {
  console.error("❌ Error generating article from plan:");
  console.error(err);
  process.exit(1);
});
