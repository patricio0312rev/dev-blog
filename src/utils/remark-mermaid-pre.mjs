/**
 * Remark plugin to transform mermaid code blocks into styled containers
 * BEFORE Shiki syntax highlighting runs. This allows rehype-mermaid
 * to process them afterward.
 *
 * Supports title via:
 * - Code block meta: ```mermaid title="My Diagram"
 * - Mermaid title directive: ---\ntitle: My Diagram\n---
 */
import { visit } from "unist-util-visit";

function extractTitle(meta, mermaidCode) {
  // Try to extract from meta (e.g., title="Agent Flow")
  if (meta) {
    const match = meta.match(/title=(?:"([^"]+)"|'([^']+)'|([^\s]+))/);
    if (match) {
      return match[1] ?? match[2] ?? match[3];
    }
  }

  // Try to extract from Mermaid frontmatter
  const frontmatterMatch = mermaidCode.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/title:\s*(.+)/);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
  }

  return null;
}

export default function remarkMermaidPre() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (node.lang === "mermaid") {
        const value = node.value;
        const meta = node.meta || "";

        // Extract title from meta or mermaid frontmatter
        const title = extractTitle(meta, value);

        // Base64 encode the mermaid code to prevent HTML escaping
        const encoded = Buffer.from(value).toString("base64");

        // Wrap in a styled container similar to code blocks
        parent.children[index] = {
          type: "html",
          value: `<div class="mermaid-wrapper not-prose">
  <div class="mermaid-wrapper-header">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 3v18h18"/>
      <path d="m19 9-5 5-4-4-3 3"/>
    </svg>
    <span>${title ? `Diagram: ${title}` : "Diagram"}</span>
  </div>
  <div class="mermaid-wrapper-content">
    <pre class="mermaid" data-mermaid-src="${encoded}"></pre>
  </div>
</div>`,
        };
      }
    });
  };
}
