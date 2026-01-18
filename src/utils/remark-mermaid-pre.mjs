/**
 * Remark plugin to transform mermaid code blocks into styled containers
 * BEFORE Shiki syntax highlighting runs. This allows rehype-mermaid
 * to process them afterward.
 */
import { visit } from "unist-util-visit";

export default function remarkMermaidPre() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (node.lang === "mermaid") {
        // Replace code block with a styled wrapper that rehype-mermaid can process
        const value = node.value;

        // Wrap in a styled container similar to code blocks
        parent.children[index] = {
          type: "html",
          value: `<div class="mermaid-wrapper not-prose">
  <div class="mermaid-wrapper-header">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 3v18h18"/>
      <path d="m19 9-5 5-4-4-3 3"/>
    </svg>
    <span>Diagram</span>
  </div>
  <div class="mermaid-wrapper-content">
    <pre class="mermaid">${value}</pre>
  </div>
</div>`,
        };
      }
    });
  };
}
