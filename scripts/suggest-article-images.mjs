import "dotenv/config";

/**
 * Analyzes article content and suggests where images should be placed
 */

export function analyzeArticleForImages(articleData) {
  const { title, category, tags } = articleData;

  // Only generate hero image - in-article images should be Mermaid diagrams
  // Stock photos of "code on laptop" don't add value to technical articles
  const heroQuery = generateImprovedHeroQuery(title, category, tags);

  return [{
    query: heroQuery,
    purpose: "hero",
    orientation: "landscape",
    placement: "frontmatter",
    section: null,
    alt: generateAltText("hero", null, title, tags),
  }];
}

function generateImprovedHeroQuery(title, category, tags) {
  const lowerTitle = title.toLowerCase();

  // Simple, focused queries that work well with Unsplash
  // Priority: specific tech topic > primary tag > category fallback
  const topicQueries = {
    "react": "react javascript code",
    "next.js": "web development code",
    "nextjs": "web development code",
    "node.js": "nodejs server code",
    "nodejs": "nodejs server code",
    "typescript": "typescript code programming",
    "javascript": "javascript code programming",
    "ai": "artificial intelligence technology",
    "claude": "artificial intelligence robot",
    "machine learning": "machine learning data",
    "testing": "software testing quality",
    "api": "api programming code",
    "database": "database technology",
    "redis": "database server technology",
    "docker": "containers cloud technology",
    "kubernetes": "cloud infrastructure",
    "microservices": "cloud architecture",
    "monolith": "software architecture",
    "performance": "performance optimization",
    "security": "cybersecurity technology",
    "debugging": "debugging code programming",
    "memory": "computer memory technology",
    "astro": "web development code",
    "front-end": "frontend development ui",
    "backend": "backend server code",
  };

  // Check title and tags for matching topics
  for (const [topic, query] of Object.entries(topicQueries)) {
    if (lowerTitle.includes(topic) || tags.some(t => t.toLowerCase().includes(topic))) {
      return query;
    }
  }

  // Fallback based on primary tag
  const primaryTag = tags[0]?.toLowerCase();
  if (primaryTag && topicQueries[primaryTag]) {
    return topicQueries[primaryTag];
  }

  // Category fallbacks
  const categoryQueries = {
    trending: "technology innovation",
    tutorial: "coding programming laptop",
    "deep-dive": "technology abstract",
  };

  return categoryQueries[category] || "software development code";
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