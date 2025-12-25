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
        query: generateTechQuery(tags, "architecture diagram code"),
        purpose: "diagram",
        orientation: "landscape",
        placement: `after-section-${idx}`,
        section: section,
        alt: `Architecture diagram for ${section}`,
      });
    }
    
    // Comparison sections
    if (
      sectionLower.includes("vs") ||
      sectionLower.includes("comparison") ||
      sectionLower.includes("before and after")
    ) {
      imageRequests.push({
        query: generateTechQuery(tags, "code comparison developer"),
        purpose: "comparison",
        orientation: "landscape",
        placement: `after-section-${idx}`,
        section: section,
        alt: `Comparison for ${section}`,
      });
    }
    
    // Workflow sections
    if (
      sectionLower.includes("workflow") ||
      sectionLower.includes("flow") ||
      sectionLower.includes("process")
    ) {
      imageRequests.push({
        query: generateTechQuery(tags, "workflow diagram development"),
        purpose: "flow-diagram",
        orientation: "landscape",
        placement: `after-section-${idx}`,
        section: section,
        alt: `Workflow diagram for ${section}`,
      });
    }
  });
  
  // 3. Code-heavy articles get IDE screenshot
  if (codeIdeas.length > 2) {
    imageRequests.push({
      query: generateTechQuery(tags, "code editor IDE screen"),
      purpose: "screenshot",
      orientation: "landscape",
      placement: "mid-article",
      section: "Code Examples",
      alt: `Code editor showing ${tags[0] || "development"} example`,
    });
  }
  
  // Limit to 4 images max
  return imageRequests.slice(0, 4);
}

function generateImprovedHeroQuery(title, category, tags) {
  // Extract main technical term
  const techTerms = [
    "react", "nodejs", "node.js", "typescript", "javascript", 
    "python", "api", "astro", "next.js", "vue", "angular",
    "testing", "ai", "machine learning", "docker", "kubernetes"
  ];
  
  let mainTech = "";
  const lowerTitle = title.toLowerCase();
  const lowerTags = tags.map(t => t.toLowerCase());
  
  for (const term of techTerms) {
    if (lowerTitle.includes(term) || lowerTags.includes(term)) {
      mainTech = term;
      break;
    }
  }
  
  // Category-specific contexts
  const categoryContext = {
    trending: "modern technology laptop screen",
    tutorial: "learning coding development",
    "deep-dive": "technical code architecture",
  };
  
  const context = categoryContext[category] || "software development";
  
  // Build query: tech term + context + "programming"
  return `${mainTech} ${context} programming`.trim();
}

function generateTechQuery(tags, fallback) {
  const firstTag = tags[0] || "";
  return firstTag ? `${firstTag} ${fallback}` : fallback;
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

export { generateImprovedHeroQuery };