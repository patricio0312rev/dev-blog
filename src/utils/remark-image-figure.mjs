/**
 * Remark plugin to transform markdown images with captions into styled figures.
 *
 * Detects patterns like:
 * ![Alt text](url)
 * *Caption by Author on Unsplash*
 *
 * And transforms them into styled figure elements matching the blog aesthetic.
 */
import { visit } from "unist-util-visit";

function parseCaption(text) {
  // Try to parse "Caption by Author on Unsplash" or "Image by Author on Unsplash"
  const unsplashPattern = /^(?:Image |Photo )?by\s+(.+?)\s+on\s+Unsplash$/i;
  const match = text.match(unsplashPattern);

  if (match) {
    return {
      type: "unsplash",
      author: match[1].trim(),
    };
  }

  // Generic caption
  return {
    type: "caption",
    text: text,
  };
}

function extractAuthorUrl(authorName) {
  // Convert author name to potential Unsplash URL
  const slug = authorName.toLowerCase().replace(/\s+/g, "");
  return `https://unsplash.com/@${slug}`;
}

export default function remarkImageFigure() {
  return (tree) => {
    const nodesToTransform = [];

    // Helper to extract text from a node tree
    const extractText = (node) => {
      if (node.type === "text") return node.value;
      if (node.children) return node.children.map(extractText).join("");
      return "";
    };

    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) return;

      // Filter out whitespace-only text nodes
      const children = node.children.filter(
        (child) => !(child.type === "text" && !child.value.trim())
      );

      // Check if first meaningful child is an image
      if (children.length >= 1 && children[0].type === "image") {
        const imageNode = children[0];
        let captionText = null;

        // Case 1: Image and emphasis in same paragraph (no blank line)
        // Structure: [image, text(whitespace), emphasis]
        if (children.length === 2 && children[1].type === "emphasis") {
          captionText = extractText(children[1]);
        }
        // Case 2: Just an image, caption in next paragraph
        else if (children.length === 1) {
          const nextNode = parent.children[index + 1];
          if (nextNode && nextNode.type === "paragraph") {
            const nextChildren = nextNode.children.filter(
              (child) => !(child.type === "text" && !child.value.trim())
            );
            if (nextChildren.length === 1 && nextChildren[0].type === "emphasis") {
              captionText = extractText(nextChildren[0]);
              // Mark next node for removal
              nodesToTransform.push({
                parent,
                index: index + 1,
                removeOnly: true,
              });
            }
          }
        }

        nodesToTransform.push({
          parent,
          index,
          imageNode,
          captionText,
        });
      }
    });

    // Process in reverse order to maintain correct indices
    nodesToTransform.reverse().forEach(({ parent, index, imageNode, captionText, removeOnly }) => {
      // Handle removal of separate caption paragraph
      if (removeOnly) {
        parent.children.splice(index, 1);
        return;
      }

      const { url, alt } = imageNode;
      const caption = captionText ? parseCaption(captionText) : null;

      // Build the HTML
      let captionHtml = "";

      if (caption) {
        if (caption.type === "unsplash") {
          const authorUrl = extractAuthorUrl(caption.author);
          captionHtml = `
    <figcaption class="figure-caption">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="figure-caption-icon">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>
      <span>Photo by <a href="${authorUrl}?utm_source=patriciomarroquin_dev&utm_medium=referral" target="_blank" rel="noopener noreferrer">${caption.author}</a> on <a href="https://unsplash.com/?utm_source=patriciomarroquin_dev&utm_medium=referral" target="_blank" rel="noopener noreferrer">Unsplash</a></span>
    </figcaption>`;
        } else {
          captionHtml = `
    <figcaption class="figure-caption">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="figure-caption-icon">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>
      <span>${caption.text}</span>
    </figcaption>`;
        }
      }

      const figureHtml = `<figure class="article-figure not-prose">
  <div class="figure-image-wrapper">
    <img src="${url}" alt="${alt || ""}" loading="lazy" decoding="async" />
  </div>${captionHtml}
</figure>`;

      // Replace the image paragraph with the figure
      parent.children[index] = {
        type: "html",
        value: figureHtml,
      };
    });
  };
}
