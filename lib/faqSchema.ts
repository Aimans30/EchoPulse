import type { PortableTextBlock } from '@portabletext/types';
import { blockToPlainText } from './toc';

/**
 * FAQPage schema extraction for blog posts.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Blog posts carry an FAQ section in their Sanity body (an H2 like "Frequently
 * asked questions", then H3 questions each followed by prose answers), but that
 * section was never expressed as structured data, so none of the ~67 posts that
 * have one were eligible for an FAQ rich result. This derives the schema from
 * the SAME portable-text blocks the page renders, so the two cannot drift.
 *
 * THE RULE THAT DRIVES EVERY DECISION BELOW
 * -----------------------------------------
 * FAQPage markup must mirror content that is VISIBLE on the page, one-to-one.
 * Claiming Q&A that a reader cannot see is a structured-data violation and can
 * earn a manual action. components/FAQ.tsx carries a comment about exactly this
 * failure mode (an earlier version unmounted collapsed answers, so the served
 * HTML held one answer while the schema claimed eight). Two consequences:
 *
 *   1. We only emit what we can prove is rendered. components/BlogContent.tsx
 *      renders every portable-text block unconditionally — nothing is collapsed,
 *      truncated, or client-gated — so a block present in `content` is present
 *      in the served HTML. That is what makes this safe here and was not safe
 *      in the accordion.
 *   2. When parsing is not confident, we return [] and the caller emits only
 *      BlogPosting. A missed rich result costs nothing. A false one costs the
 *      whole domain.
 *
 * HEADING MATCHING IS DELIBERATELY STRICT
 * ---------------------------------------
 * Real FAQ headings in the corpus are: "Frequently asked questions", "FAQ",
 * "Common questions", "Common questions about podcast editing cost".
 *
 * These look similar and are NOT FAQ sections — they are ordinary prose or
 * checklists, and matching any of them would fabricate Q&A:
 *   "Questions about scope" / "Questions about price and terms"
 *   "Questions to answer before you brief anyone"
 *   "9 questions to ask before you sign with any content agency"
 *   "Why are none of these openers questions?"
 *   "Or skip the questions and look at the work"
 * A bare substring test on "question" matches all of them. Hence the anchored
 * prefix/exact test in isFaqHeading() rather than a loose `includes`.
 */

export type FaqPair = { question: string; answer: string };

/** Lowercase, strip punctuation, collapse whitespace — for heading comparison. */
function normalizeHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * True only for a heading that genuinely introduces a Q&A block. Anchored at
 * the start of the string (or an exact match) so the decoy headings listed in
 * the file header cannot match.
 */
function isFaqHeading(text: string): boolean {
  const n = normalizeHeading(text);
  if (n === 'faq' || n === 'faqs') return true;
  return (
    n.startsWith('frequently asked question') || // covers "...question" / "...questions"
    n.startsWith('common questions')             // covers "common questions about X"
  );
}

/**
 * BlogContent renders body `h1` blocks as DOM <h2> (several older Sanity posts
 * open the body with an h1). So for "where does this section end", h1 and h2 are
 * both top-level boundaries.
 */
function isSectionBoundary(style: string | undefined): boolean {
  return style === 'h1' || style === 'h2';
}

/**
 * Blocks whose text is rendered as ordinary visible prose, and are therefore
 * legitimate answer content. h4+ is excluded on purpose: BlogContent has no
 * explicit renderer for it, so we cannot assert how (or whether) it paints.
 */
function isAnswerBlock(style: string | undefined): boolean {
  return style === 'normal' || style === 'blockquote' || style === undefined;
}

// Validity gates. A pair failing any of these is dropped, not repaired.
const MIN_QUESTION_LEN = 10;
const MAX_QUESTION_LEN = 300;
const MIN_ANSWER_LEN = 30;
const MAX_PAIRS = 20;

/**
 * Pull Q&A pairs out of a post's FAQ section. Returns [] when the post has no
 * FAQ section or when the section does not parse cleanly, which the caller must
 * treat as "emit no FAQPage".
 */
export function extractFaqPairs(content: PortableTextBlock[] | undefined): FaqPair[] {
  if (!Array.isArray(content) || content.length === 0) return [];

  // Locate the FAQ heading. First strict match wins: a post can contain decoy
  // "Questions about ..." H2s BEFORE its real "Frequently asked questions" one
  // (how-to-choose-a-personal-branding-agency does exactly that), and those
  // never satisfy isFaqHeading, so scanning forward is correct.
  let start = -1;
  for (let i = 0; i < content.length; i++) {
    const block = content[i];
    if (block?._type !== 'block') continue;
    if (!isSectionBoundary(block.style as string | undefined)) continue;
    if (isFaqHeading(blockToPlainText(block))) {
      start = i;
      break;
    }
  }
  if (start === -1) return [];

  // Walk forward to the next top-level heading, gathering H3 questions and the
  // prose that follows each one.
  type Draft = { question: string; parts: string[] };
  const drafts: Draft[] = [];
  let current: Draft | null = null;

  for (let i = start + 1; i < content.length; i++) {
    const block = content[i];
    // Non-block content (the custom `imageUrl` type) is not text; skip it
    // without ending the section.
    if (block?._type !== 'block') continue;

    const style = block.style as string | undefined;
    if (isSectionBoundary(style)) break;

    if (style === 'h3') {
      current = { question: blockToPlainText(block), parts: [] };
      drafts.push(current);
      continue;
    }

    // Prose before the first H3 belongs to the section intro, not to an answer,
    // so it is discarded (current is still null).
    if (current && isAnswerBlock(style)) {
      const text = blockToPlainText(block);
      if (text) current.parts.push(text);
    }
  }

  const pairs: FaqPair[] = [];
  for (const draft of drafts) {
    const question = draft.question.trim();
    const answer = draft.parts.join(' ').replace(/\s+/g, ' ').trim();

    // Must actually be a question. Every FAQ H3 in the corpus ends in "?", and
    // requiring it is what stops a grouping subhead ("Pricing", "Reviews and
    // ranking") from being published as a Question node.
    if (!question.endsWith('?')) continue;
    if (question.length < MIN_QUESTION_LEN || question.length > MAX_QUESTION_LEN) continue;
    if (answer.length < MIN_ANSWER_LEN) continue;

    pairs.push({ question, answer });
    if (pairs.length >= MAX_PAIRS) break;
  }

  // One lone Q&A is more likely a parse artifact than a real FAQ section, and
  // it is not worth the risk for a rich result Google rarely grants on one item.
  return pairs.length >= 2 ? pairs : [];
}

/**
 * Build the FAQPage JSON-LD node, or null when there is nothing safe to emit.
 * `pageUrl` ties the node to the page it describes so it is not read as a
 * standalone FAQ document.
 */
export function buildFaqPageLd(pairs: FaqPair[], pageUrl: string) {
  if (pairs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: pairs.map((pair) => ({
      '@type': 'Question',
      name: pair.question,
      acceptedAnswer: { '@type': 'Answer', text: pair.answer },
    })),
  };
}
