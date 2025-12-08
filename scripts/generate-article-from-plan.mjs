import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

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
  // GitHub Actions runs in UTC; using UTC date keeps it consistent
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function monthKeyFromDate(dateStr) {
  // dateStr: "YYYY-MM-DD" → "YYYY-MM"
  return dateStr.slice(0, 7);
}

// ---------- OpenAI client --------------------------------------------------

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      `ℹ️ No content plan file found for month ${monthKey} in content-plans/. Exiting.`
    );
    return;
  }

  const planned = getPlannedArticleForDate(plan, today);
  if (!planned) {
    console.log(
      `ℹ️ No article scheduled for ${today} in content-plans/${monthKey}.json. Exiting.`
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
      `ℹ️ Article already exists for ${today} at ${outPath}. Skipping generation.`
    );
  
    // Make sure the content plan reflects that this article is published
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
          `🗂 Updated content plan ${monthKey}.json: marked existing article as published (entrySlug: ${entrySlug}).`
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
  ].join("\n");

  const tagsList = tags.join(", ");

  const outlineText = outline
    .map((item, idx) => `${idx + 1}. ${item}`)
    .join("\n");

  const codeIdeasText = codeIdeas.map((c) => `- ${c}`).join("\n") || "- (none)";
  const mediaIdeasText =
    mediaIdeas.map((m) => `- ${m}`).join("\n") || "- (none)";

    const articlePrompt = [
      `Today is ${today}.`,
      "",
      `You must write a **complete MDX article** based on this planning info:`,
      "",
      `Title: ${title}`,
      `Category: ${category}   (one of "tutorial" | "trending" | "deep-dive")`,
      `Slug (base, without date): ${baseSlug}`,
      `Planned publication date: ${date}`,
      `Description (meta): ${description}`,
      `Tags: ${tagsList}`,
      "",
      "Value angle (what makes this worth reading):",
      angle || "(no angle provided, define a strong one yourself)",
      "",
      "Outline / section ideas (you can adapt slightly, but follow the spirit):",
      outlineText || "(no outline provided, design a clear structure)",
      "",
      "Code ideas (snippets you MUST incorporate, adapted as needed):",
      codeIdeasText,
      "",
      "Media ideas (use as MDX image/diagram placeholders where it helps):",
      mediaIdeasText,
      "",
      "MDX and structure requirements:",
      "1) Start with YAML frontmatter exactly like this shape:",
      "",
      "---",
      `title: "${frontmatterEscape(title)}"`,
      `description: "${frontmatterEscape(description)}"`,
      `category: "${category}"`,
      `publishDate: "${date}"`,
      "tags:",
      tags.length
        ? tags.map((t) => `  - ${t}`).join("\n")
        : "  - dev\n  - blog",
      `slug: "${baseSlug}"`,
      "---",
      "",
      "2) After frontmatter, write the article body:",
      "- Start with a short intro that hooks the reader and restates the value in your own words.",
      "- Use `##` headings that roughly align with the outline above.",
      "- You can add `###` sub-sections where it makes sense.",
      "- Use bullet lists and numbered lists for steps.",
      "- Keep paragraphs fairly short and readable.",
      "",
      "3) Code blocks:",
      "- Use fenced code blocks with language identifiers: ```ts, ```tsx, ```js, etc.",
      "- For any non-trivial code snippet (more than ~5 lines), include a filename in the fence meta so my Astro code block can show it.",
      "  Examples:",
      "  ```ts filename=\"Profile.server.tsx\"",
      "  // Profile.server.tsx",
      "  import { fetchUserProfile } from \"../lib/api\";",
      "",
      "  export default async function Profile() {",
      "    const user = await fetchUserProfile();",
      "    return (",
      "      <div>",
      "        <h2>{user.name}</h2>",
      "        <p>{user.bio}</p>",
      "      </div>",
      "    );",
      "  }",
      "  ```",
      "",
      "  ```tsx filename=\"src/app/page.tsx\"",
      "  // ...",
      "  ```",
      "",
      "- Short inline examples (1–3 lines) can be plain fenced code without a filename.",
      "- At least 2–3 real code snippets that a dev could copy and run/adapt.",
      "- Tie the code to the explanation: don't throw random snippets.",
      "- At least one snippet should show some configuration or project setup (Astro, React, Node, TypeScript, tooling, etc.).",
      "",
      "4) Images / diagrams:",
      "- Use markdown image syntax where it adds value, for example:",
      '  ![diagram comparing CSR vs SSR](https://example.com/placeholder-ssr-csr.png)',
      "- Alt text must describe the diagram/idea clearly.",
      "- URLs can be placeholders; the important part is the description.",
      "",
      "5) Depth & originality:",
      "- Do not just restate docs; focus on real-world problems and trade-offs.",
      "- Include your own commentary: when something is overkill, what you’d do first in a new project, etc.",
      "- Assume the reader is an intermediate dev: they know the basics but want sharper judgment.",
      "",
      "6) Ending signature:",
      "- The article MUST end with exactly this two-line signature:",
      "Until next time, happy coding 👨‍💻  ",
      "– Patricio Marroquin 💜",
      "",
      "Return ONLY the MDX (frontmatter + body).",
      "No extra explanations, no markdown fences around the whole output.",
    ].join("\n");
  

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    instructions,
    input: articlePrompt,
    max_output_tokens: 4000,
  });

  const mdx =
    response.output_text ??
    response.output?.[0]?.content?.[0]?.text ??
    null;

  if (!mdx) {
    console.error("❌ No MDX text returned from model:");
    console.dir(response, { depth: 4 });
    process.exit(1);
  }

  fs.writeFileSync(outPath, mdx, "utf8");

  console.log(`✅ Article generated at: ${outPath}`);
  console.log(`   Slug: ${entrySlug}`);

  // Update content plan to mark this article as published
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
        `🗂 Updated content plan ${monthKey}.json: marked article for ${date} as published (entrySlug: ${entrySlug}).`
      );
    } else {
      console.warn(
        `⚠️ Could not find matching article in plan for ${date} to update status.`
      );
    }
  }
}

main().catch((err) => {
  console.error("❌ Error generating article from plan:");
  console.error(err);
  process.exit(1);
});
