import type { PortableTextBlock } from '@portabletext/types';

/**
 * Heading entry for the blog table-of-contents.
 */
export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/**
 * Turn heading text into a URL-safe anchor id. MUST stay in lockstep with the
 * id generation in BlogContent so the sidebar links resolve to the right
 * heading. Single source of truth — both callers import this.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // drop punctuation
    .replace(/\s+/g, '-')        // spaces → hyphens
    .replace(/-+/g, '-')         // collapse repeats
    .replace(/^-|-$/g, '');      // trim leading/trailing hyphens
}

/**
 * Flatten the inline spans of a Portable Text block into plain text — used to
 * derive the visible heading label (and from it, the anchor id).
 */
export function blockToPlainText(block: PortableTextBlock): string {
  if (!Array.isArray(block.children)) return '';
  return block.children
    .map((child) => (typeof (child as { text?: unknown }).text === 'string' ? (child as { text: string }).text : ''))
    .join('')
    .trim();
}

/**
 * Walk a post's Portable Text content and pull out every H2 and H3 as TOC
 * entries. H1/H4 are skipped — H1 is the post title, H4 is too granular for a
 * sidebar. Duplicate slugs get a numeric suffix so anchors stay unique.
 */
export function extractHeadings(content: PortableTextBlock[] | undefined): TocHeading[] {
  if (!content) return [];
  const seen = new Map<string, number>();
  const headings: TocHeading[] = [];

  for (const block of content) {
    if (block._type !== 'block') continue;
    const style = block.style;
    if (style !== 'h2' && style !== 'h3') continue;

    const text = blockToPlainText(block);
    if (!text) continue;

    let id = slugifyHeading(text);
    // De-dupe: "Utilities" appearing twice → utilities, utilities-2
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    headings.push({ id, text, level: style === 'h2' ? 2 : 3 });
  }

  return headings;
}
