/**
 * Remark plugin to transform mermaid code blocks into raw HTML divs
 * BEFORE Shiki syntax highlighting runs. This allows rehype-mermaid
 * to process them afterward.
 */
import { visit } from "unist-util-visit";

export default function remarkMermaidPre() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (node.lang === "mermaid") {
        // Replace code block with HTML that rehype-mermaid can process
        const value = node.value;
        parent.children[index] = {
          type: "html",
          value: `<pre class="mermaid">${value}</pre>`,
        };
      }
    });
  };
}
