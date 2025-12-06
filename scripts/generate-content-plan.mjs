import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All month plans live here (root/content-plans/*.json)
const PLAN_DIR = path.join(__dirname, "..", "content-plans");
if (!fs.existsSync(PLAN_DIR)) {
  fs.mkdirSync(PLAN_DIR, { recursive: true });
}

// -------- Date helpers ----------------------------------------------------

function getMonthInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const monthIndex = now.getMonth(); // 0-based
  const month = String(monthIndex + 1).padStart(2, "0");
  const monthKey = `${year}-${month}`;

  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 0);

  const monthStartStr = monthStart.toISOString().slice(0, 10);
  const monthEndStr = monthEnd.toISOString().slice(0, 10);

  const monthName = monthStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return { year, monthKey, monthName, monthStartStr, monthEndStr };
}

const { monthKey, monthName, monthStartStr, monthEndStr } = getMonthInfo();
const todayISO = new Date().toISOString().slice(0, 10);

// -------- OpenAI client ---------------------------------------------------

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// -------- Main ------------------------------------------------------------

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY in environment.");
    process.exit(1);
  }

  console.log(
    `Generating content plan for ${monthName} (${monthStartStr} → ${monthEndStr})`
  );

  const instructions = [
    "You are helping Juan Patricio (Peruvian full-stack dev) plan content for his personal dev blog.",
    "Tone: friendly, clear, slightly informal, opinionated, but still serious enough for professional devs.",
    "The blog focuses on modern web dev, Node.js, React, TypeScript, Astro, architecture, testing, and dev career topics.",
    "",
    "You are generating a content plan for ONE MONTH.",
    "Rules:",
    "- Plan about 2–3 posts per week (roughly 8–12 posts total).",
    "- Mix the following categories across the month:",
    "  * 'trending'   → things happening now in the industry, relevant releases, patterns gaining traction.",
    "  * 'tutorial'   → practical how-to guides with concrete code examples.",
    "  * 'deep-dive'  → conceptual/architectural pieces (SOLID, testing strategy, performance, system design, etc.).",
    "- All dates must be within the month.",
    "- Distribute posts across the month (not all in week one).",
    "- Prefer weekdays; avoid weekends unless it really fits.",
    "",
    "Style guidelines:",
    "- Titles should sound like a real dev on Twitter/LinkedIn, not corporate.",
    "- Avoid generic 101 titles; be specific and helpful.",
    "- Summaries must clearly explain what value the reader gets.",
    "",
    "Trending posts:",
    "- Use recent topics relative to the current date.",
    "- These can include new framework features, platform changes, AI/devtools trends, etc.",
    "",
    "Deep dives & tutorials:",
    "- Focus on concrete problems devs run into in real projects.",
    "- Things like debugging patterns, refactoring strategies, architecture trade-offs.",
    "",
    "Output format is VERY important:",
    "- You MUST return a single JSON object, no markdown, no backticks, no comments.",
    "- It MUST match this TypeScript-like type exactly:",
    "",
    "type ContentPlan = {",
    '  month: string;              // e.g. "2025-12"',
    '  startDate: string;          // "YYYY-MM-DD" (first day of month)',
    '  endDate: string;            // "YYYY-MM-DD" (last day of month)',
    "  articles: {",
    '    date: string;             // "YYYY-MM-DD" within this month',
    '    category: "tutorial" | "trending" | "deep-dive";',
    "    slug: string;             // kebab-case slug, WITHOUT date prefix",
    "    title: string;",
    "    description: string;      // 1–2 sentence meta description",
    "    tags: string[];           // 3–7 useful tags",
    '    status: "planned" | "draft" | "published";',
    "    angle: string;            // what makes this article interesting / valuable",
    "    outline: string[];        // 3–7 section ideas",
    "    codeIdeas: string[];      // 2–4 concrete code examples to show",
    "    mediaIdeas: string[];     // 1–3 ideas for diagrams/images/gifs",
    "  }[];",
    "};",
    "",
    "Important:",
    "- `month`, `startDate` and `endDate` should still be filled, but I will override them with the real values on my side.",
    "- Make sure all `date` values are valid days in the target month.",
    "- Set `status` to `planned` by default.",
  ].join("\n");

  const prompt = [
    `Today is ${todayISO}.`,
    `Create a content plan for my dev blog for ${monthName} (${monthStartStr} → ${monthEndStr}).`,
    "",
    "Return between 8 and 12 articles.",
    "- Use only dates within this month.",
    "- Use my voice: candid, honest, dev-to-dev, not corporate.",
    "- Titles, descriptions, angles and notesForAuthor should clearly show the value.",
    "",
    "Return ONLY the JSON object of type ContentPlan, no explanation, no markdown.",
  ].join("\n");

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    instructions,
    input: prompt,
    max_output_tokens: 3000,
  });

  // Try to get the raw text from the response
  const raw =
    response.output_text ??
    response.output?.[0]?.content?.[0]?.text ??
    null;

  if (!raw) {
    console.error("❌ No text returned from model:");
    console.dir(response, { depth: 4 });
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Failed to parse JSON from model:", err);
    console.log("Raw output was:");
    console.log(raw);
    process.exit(1);
  }

  if (!Array.isArray(parsed.articles)) {
    console.error("❌ Parsed JSON does not contain `articles` array:");
    console.dir(parsed, { depth: 3 });
    process.exit(1);
  }

  // Normalize metadata to our known values
  parsed.month = monthKey;
  parsed.startDate = monthStartStr;
  parsed.endDate = monthEndStr;

  const outPath = path.join(PLAN_DIR, `${monthKey}.json`);

  // ✅ One file per month; re-running only updates this month’s plan
  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), "utf8");

  console.log(`✅ Content plan written to: ${outPath}`);
  console.log(`Planned articles: ${parsed.articles.length}`);
}

main().catch((err) => {
  console.error("❌ Error generating content plan:");
  console.error(err);
  process.exit(1);
});
