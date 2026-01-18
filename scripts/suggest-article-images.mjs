import "dotenv/config";

/**
 * Analyzes article content and suggests where images should be placed
 */

export function analyzeArticleForImages(articleData) {
  const { title, category, tags, outline = [], codeIdeas = [] } = articleData;

  const imageRequests = [];

  // 1. Hero image (always needed)
  const heroQuery = generateImprovedHeroQuery(title, category, tags);
  imageRequests.push({
    query: heroQuery,
    purpose: "hero",
    orientation: "landscape",
    placement: "frontmatter",
    section: null,
    alt: generateAltText("hero", null, title, tags),
  });

  // 2. Analyze outline for diagram opportunities
  outline.forEach((section, idx) => {
    const sectionLower = section.toLowerCase();

    // Architecture/structure sections
    if (
      sectionLower.includes("architecture") ||
      sectionLower.includes("structure") ||
      sectionLower.includes("folder") ||
      sectionLower.includes("directory")
    ) {
      imageRequests.push({
        query: generateTechQuery(tags, section, "architecture system design"),
        purpose: "diagram",
        orientation: "landscape",
        placement: `after-section-${idx}`,
        section: section,
        alt: generateAltText("diagram", section, title, tags),
      });
    }

    // Comparison sections
    if (
      sectionLower.includes("vs") ||
      sectionLower.includes("comparison") ||
      sectionLower.includes("before and after") ||
      sectionLower.includes("differences")
    ) {
      imageRequests.push({
        query: generateTechQuery(tags, section, "comparison contrast side-by-side"),
        purpose: "comparison",
        orientation: "landscape",
        placement: `after-section-${idx}`,
        section: section,
        alt: generateAltText("comparison", section, title, tags),
      });
    }

    // Workflow sections
    if (
      sectionLower.includes("workflow") ||
      sectionLower.includes("flow") ||
      sectionLower.includes("process") ||
      sectionLower.includes("pipeline")
    ) {
      imageRequests.push({
        query: generateTechQuery(tags, section, "workflow process automation"),
        purpose: "flow-diagram",
        orientation: "landscape",
        placement: `after-section-${idx}`,
        section: section,
        alt: generateAltText("flow-diagram", section, title, tags),
      });
    }
  });

  // 3. Code-heavy articles get IDE screenshot
  if (codeIdeas.length > 2) {
    imageRequests.push({
      query: generateTechQuery(tags, null, "code editor programming workspace"),
      purpose: "screenshot",
      orientation: "landscape",
      placement: "mid-article",
      section: "Code Examples",
      alt: generateAltText("screenshot", "Code Examples", title, tags),
    });
  }

  // Limit to 4 images max
  return imageRequests.slice(0, 4);
}

function generateImprovedHeroQuery(title, category, tags) {
  // Extract meaningful keywords from title (remove stop words and common phrases)
  const stopWords = [
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "need", "dare",
    "ought", "used", "to", "of", "in", "for", "on", "with", "at", "by",
    "from", "as", "into", "through", "during", "before", "after", "above",
    "below", "between", "under", "again", "further", "then", "once", "here",
    "there", "when", "where", "why", "how", "all", "each", "few", "more",
    "most", "other", "some", "such", "no", "nor", "not", "only", "own",
    "same", "so", "than", "too", "very", "just", "and", "but", "if", "or",
    "because", "until", "while", "although", "though", "after", "before",
    "what", "which", "who", "whom", "this", "that", "these", "those", "am",
    "your", "you", "i", "my", "we", "our", "they", "their", "it", "its",
    "whats", "what's", "dont", "don't", "wont", "won't", "cant", "can't",
    "vs", "versus", "complete", "comparison", "guide", "tutorial", "now",
    "actually", "really", "new", "biggest", "best", "worst", "top"
  ];

  // Extract keywords from title
  const titleWords = title.toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));

  // Identify the core subject (first 2-3 meaningful words)
  const coreSubject = titleWords.slice(0, 3).join(" ");

  // Category-specific visual styles (focused on abstract/relevant imagery)
  const categoryVisuals = {
    trending: "abstract technology digital innovation",
    tutorial: "workspace developer tools hands-on",
    "deep-dive": "abstract architecture patterns technical",
  };

  // Topic-specific visual mappings for better relevance
  const topicVisuals = {
    "ai": "artificial intelligence neural network abstract",
    "claude": "artificial intelligence chat assistant technology",
    "machine learning": "neural network data visualization abstract",
    "react": "component interface user experience design",
    "nodejs": "server backend infrastructure network",
    "node.js": "server backend infrastructure network",
    "typescript": "code syntax structured programming",
    "testing": "quality assurance checklist verification",
    "api": "connection integration network endpoints",
    "database": "data storage structured information",
    "redis": "cache memory data speed performance",
    "docker": "container deployment infrastructure",
    "kubernetes": "orchestration cloud infrastructure",
    "nextjs": "web application framework interface",
    "next.js": "web application framework interface",
    "astro": "web static site performance",
    "microservices": "distributed architecture network services",
    "monolith": "unified architecture system design",
    "performance": "speed optimization metrics dashboard",
    "security": "protection shield encryption safety",
    "debugging": "problem solving investigation analysis",
    "memory": "optimization performance system resources",
  };

  // Find matching topic visual
  let topicVisual = "";
  const lowerTitle = title.toLowerCase();
  for (const [topic, visual] of Object.entries(topicVisuals)) {
    if (lowerTitle.includes(topic) || tags.some(t => t.toLowerCase().includes(topic))) {
      topicVisual = visual;
      break;
    }
  }

  // Build query: core subject + topic visual OR category visual
  const visual = topicVisual || categoryVisuals[category] || "software development abstract";

  return `${coreSubject} ${visual}`.trim();
}

function generateTechQuery(tags, section, fallback) {
  // Extract meaningful terms from section title if available
  const sectionKeywords = section
    ? section.toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 3)
        .slice(0, 2)
        .join(" ")
    : "";

  const primaryTag = tags[0] || "";

  // Build a more contextual query
  if (sectionKeywords && primaryTag) {
    return `${primaryTag} ${sectionKeywords} ${fallback}`;
  }

  return primaryTag ? `${primaryTag} ${fallback}` : fallback;
}

/**
 * Generate contextual alt text for images based on article and section context
 */
function generateAltText(purpose, section, title, tags) {
  const primaryTopic = tags[0] || "development";

  const altTemplates = {
    hero: `Hero image for article about ${title}`,
    diagram: section ? `Diagram illustrating ${section}` : `Architecture diagram for ${primaryTopic}`,
    comparison: section ? `Visual comparison for ${section}` : `Comparison illustration for ${primaryTopic}`,
    "flow-diagram": section ? `Workflow diagram showing ${section}` : `Process flow for ${primaryTopic}`,
    screenshot: `Code editor showing ${primaryTopic} example`,
  };

  return altTemplates[purpose] || `Illustration for ${section || title}`;
}

/**
 * Generate image insertion markers for the article
 */
export function generateImageMarkers(imageRequests) {
  return imageRequests.map((req, idx) => {
    if (req.placement === "frontmatter") {
      return null; // Hero image goes in frontmatter
    }
    
    return {
      marker: `<!-- IMAGE_${idx} -->`,
      ...req,
    };
  }).filter(Boolean);
}

export { generateImprovedHeroQuery, generateAltText };