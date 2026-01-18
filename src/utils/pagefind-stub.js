/**
 * Pagefind stub for development mode.
 * The real pagefind.js is only generated during build.
 */
export async function search() {
  console.warn("[Pagefind] Search is only available after running a build.");
  return { results: [] };
}

export async function init() {
  console.warn("[Pagefind] Running in dev mode - search disabled.");
}

export default { search, init };
