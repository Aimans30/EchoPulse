/**
 * Markdown -> Sanity Portable Text converter for EchoPulse blog posts.
 *
 * Walks the `marked` lexer token tree (no HTML in between) and emits the exact
 * block shapes that blog-for-echopulse/schemaTypes/blog.ts accepts and
 * components/BlogContent.tsx renders:
 *
 *   paragraph / heading / blockquote  -> { _type: 'block', style, children, markDefs }
 *   bullet / numbered lists           -> blocks with listItem + level
 *   ![alt](https://...)               -> { _type: 'imageUrl', url, alt, caption }
 *   bare YouTube / Vimeo / Loom URL   -> { _type: 'video', url }
 *   | pipe | tables |                 -> { _type: 'table', rows: [{ cells }], hasHeader }
 *   `code` / **bold** / _italic_ / [link](href) -> span marks
 *
 * Usage:
 *   import { markdownToPortableText } from './markdown-to-portable-text.mjs';
 *   const blocks = markdownToPortableText(markdownString);
 *
 * Runnable standalone for a quick look:
 *   node scripts/markdown-to-portable-text.mjs path/to/post.md
 */

import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Lexer } from 'marked';

/** Random 12-char key, the format Sanity Studio itself generates. */
export function makeKey() {
  return randomBytes(9).toString('base64url').slice(0, 12);
}

const VIDEO_URL_RE =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[\w-]{11}(?:&\S*)?|youtu\.be\/[\w-]{11}\S*|youtube\.com\/embed\/[\w-]{11}\S*|vimeo\.com\/(?:video\/)?\d+\S*|loom\.com\/share\/[a-f0-9]+\S*)$/i;

/** True when a trimmed line is just a YouTube / Vimeo / Loom URL. */
export function isVideoUrl(text) {
  return VIDEO_URL_RE.test(text.trim());
}

// ─── inline (span) handling ──────────────────────────────────────────────────

/**
 * Convert marked inline tokens into Portable Text spans.
 * `marks` is the inherited set of active marks (e.g. ['strong']).
 * Link marks are added as markDefs and referenced by their _key.
 */
function inlineTokensToSpans(tokens, marks, markDefs, warnings) {
  const spans = [];
  for (const t of tokens ?? []) {
    switch (t.type) {
      case 'text':
        // `text` tokens inside lists/paragraphs may themselves carry nested
        // inline tokens (marked wraps them when they contain markup).
        if (t.tokens && t.tokens.length) {
          spans.push(...inlineTokensToSpans(t.tokens, marks, markDefs, warnings));
        } else {
          spans.push(span(t.text, marks));
        }
        break;
      case 'escape':
        spans.push(span(t.text, marks));
        break;
      case 'strong':
        spans.push(...inlineTokensToSpans(t.tokens, addMark(marks, 'strong'), markDefs, warnings));
        break;
      case 'em':
        spans.push(...inlineTokensToSpans(t.tokens, addMark(marks, 'em'), markDefs, warnings));
        break;
      case 'del':
        // Strike-through has no renderer in BlogContent; keep the text plain.
        spans.push(...inlineTokensToSpans(t.tokens, marks, markDefs, warnings));
        break;
      case 'codespan':
        spans.push(span(t.text, addMark(marks, 'code')));
        break;
      case 'link': {
        const href = t.href;
        if (!/^(https?:\/\/|mailto:|\/|#)/i.test(href)) {
          warnings.push(`Link skipped (unsupported href "${href}")`);
          spans.push(...inlineTokensToSpans(t.tokens, marks, markDefs, warnings));
          break;
        }
        const key = makeKey();
        markDefs.push({ _type: 'link', _key: key, href });
        spans.push(...inlineTokensToSpans(t.tokens, addMark(marks, key), markDefs, warnings));
        break;
      }
      case 'image':
        // An inline image inside a paragraph cannot become a block here; keep
        // its alt text so nothing silently disappears. Put images on their own
        // line to get a real image block.
        warnings.push(`Inline image "${t.href}" inside a paragraph was flattened to its alt text. Put images on their own line.`);
        spans.push(span(t.text || t.href, marks));
        break;
      case 'br':
        spans.push(span('\n', marks));
        break;
      case 'html':
        // Raw HTML is not supported by the schema. Keep its text content.
        warnings.push(`Raw HTML "${t.raw.trim().slice(0, 40)}" was emitted as plain text.`);
        spans.push(span(t.text, marks));
        break;
      default:
        spans.push(span(t.raw ?? '', marks));
    }
  }
  return spans;
}

function addMark(marks, mark) {
  return marks.includes(mark) ? marks : [...marks, mark];
}

function span(text, marks) {
  return { _type: 'span', _key: makeKey(), text: String(text ?? ''), marks: [...marks] };
}

/** Collapse adjacent spans with identical marks so the output stays compact. */
function mergeSpans(spans) {
  const out = [];
  for (const s of spans) {
    const prev = out[out.length - 1];
    if (prev && sameMarks(prev.marks, s.marks)) {
      prev.text += s.text;
    } else {
      out.push(s);
    }
  }
  return out.filter((s) => s.text.length > 0);
}

function sameMarks(a, b) {
  return a.length === b.length && a.every((m, i) => m === b[i]);
}

function textBlock(style, inlineTokens, warnings, listProps = null) {
  const markDefs = [];
  const children = mergeSpans(inlineTokensToSpans(inlineTokens, [], markDefs, warnings));
  const block = {
    _type: 'block',
    _key: makeKey(),
    style,
    markDefs,
    children: children.length ? children : [span('', [])],
  };
  if (listProps) {
    block.listItem = listProps.listItem;
    block.level = listProps.level;
  }
  return block;
}

/** Plain text of an inline token list (used for video detection). */
function plainText(tokens) {
  return (tokens ?? [])
    .map((t) => (t.tokens ? plainText(t.tokens) : t.text ?? t.raw ?? ''))
    .join('');
}

// ─── block handling ──────────────────────────────────────────────────────────

function convertTokens(tokens, out, warnings, ctx) {
  for (const t of tokens) {
    switch (t.type) {
      case 'space':
        break;

      case 'heading': {
        // h1 inside the body would duplicate the page title; BlogContent
        // already downgrades h1 -> h2, so we normalise here as well.
        const depth = Math.min(Math.max(t.depth, 2), 4);
        if (t.depth === 1) warnings.push(`"# ${t.text}" was downgraded to an h2 (the post title is the page's only h1).`);
        out.push(textBlock(`h${depth}`, t.tokens, warnings));
        break;
      }

      case 'paragraph': {
        // A paragraph that is just one image -> imageUrl block.
        const inner = (t.tokens ?? []).filter((x) => !(x.type === 'text' && x.text.trim() === ''));
        if (inner.length === 1 && inner[0].type === 'image') {
          const img = inner[0];
          if (!/^https?:\/\//i.test(img.href)) {
            throw new Error(`Image "${img.href}" must be an absolute https:// URL (upload it somewhere public first).`);
          }
          const block = { _type: 'imageUrl', _key: makeKey(), url: img.href, alt: img.text || '' };
          if (img.title) block.caption = img.title;
          out.push(block);
          break;
        }
        // A paragraph that is just a video URL -> video block.
        const txt = plainText(t.tokens).trim();
        if (isVideoUrl(txt)) {
          out.push({ _type: 'video', _key: makeKey(), url: txt });
          break;
        }
        // A bare autolinked video URL comes through as a single link token.
        if (inner.length === 1 && inner[0].type === 'link' && isVideoUrl(inner[0].href) && plainText(inner[0].tokens).trim() === inner[0].href) {
          out.push({ _type: 'video', _key: makeKey(), url: inner[0].href });
          break;
        }
        out.push(textBlock('normal', t.tokens, warnings));
        break;
      }

      case 'blockquote': {
        // Each paragraph inside the quote becomes its own blockquote block.
        const sub = [];
        convertTokens(t.tokens, sub, warnings, ctx);
        for (const b of sub) {
          if (b._type === 'block' && b.style === 'normal' && !b.listItem) b.style = 'blockquote';
          out.push(b);
        }
        break;
      }

      case 'list': {
        const listItem = t.ordered ? 'number' : 'bullet';
        const level = (ctx.listLevel ?? 0) + 1;
        for (const item of t.items) {
          convertListItem(item, listItem, level, out, warnings, ctx);
        }
        break;
      }

      case 'table': {
        const rows = [];
        const headerCells = t.header.map((c) => cellText(c));
        rows.push({ _type: 'tableRow', _key: makeKey(), cells: headerCells });
        for (const r of t.rows) {
          rows.push({ _type: 'tableRow', _key: makeKey(), cells: r.map((c) => cellText(c)) });
        }
        out.push({ _type: 'table', _key: makeKey(), hasHeader: true, rows });
        break;
      }

      case 'code': {
        // No code block type in the schema; emit as a normal block with a code
        // mark so the content survives and is still readable.
        warnings.push('A fenced code block was emitted as an inline-code paragraph (the schema has no code block type).');
        out.push({
          _type: 'block',
          _key: makeKey(),
          style: 'normal',
          markDefs: [],
          children: [span(t.text, ['code'])],
        });
        break;
      }

      case 'hr':
        // No divider type; drop it. Headings already provide structure.
        break;

      case 'html': {
        const raw = t.raw.trim();
        if (raw.startsWith('<!--')) break; // comments are silently dropped
        warnings.push(`Raw HTML block "${raw.slice(0, 40)}" was emitted as plain text.`);
        out.push({ _type: 'block', _key: makeKey(), style: 'normal', markDefs: [], children: [span(raw, [])] });
        break;
      }

      case 'text':
        out.push(textBlock('normal', t.tokens ?? [{ type: 'text', text: t.text }], warnings));
        break;

      default:
        warnings.push(`Unhandled markdown token "${t.type}" was emitted as plain text.`);
        out.push({ _type: 'block', _key: makeKey(), style: 'normal', markDefs: [], children: [span(t.raw ?? '', [])] });
    }
  }
}

function cellText(cell) {
  // Cells are plain strings in the schema; strip markup but keep the words.
  return plainText(cell.tokens ?? []).replace(/\s+/g, ' ').trim();
}

function convertListItem(item, listItem, level, out, warnings, ctx) {
  // marked gives list items as a `text` token (the line) followed by any
  // nested lists / paragraphs. The first text/paragraph is the item itself.
  const own = [];
  const nested = [];
  for (const tok of item.tokens ?? []) {
    if (tok.type === 'list') nested.push(tok);
    else own.push(tok);
  }

  // Merge the item's own inline content (usually one `text` token).
  const inlineTokens = [];
  for (const tok of own) {
    if (tok.type === 'text' || tok.type === 'paragraph') {
      if (inlineTokens.length) inlineTokens.push({ type: 'text', text: ' ' });
      inlineTokens.push(...(tok.tokens ?? [{ type: 'text', text: tok.text ?? tok.raw ?? '' }]));
    } else if (tok.type === 'space') {
      // ignore
    } else {
      warnings.push(`Unsupported "${tok.type}" inside a list item was flattened to text.`);
      inlineTokens.push({ type: 'text', text: tok.raw ?? '' });
    }
  }
  out.push(textBlock('normal', inlineTokens, warnings, { listItem, level }));

  for (const sub of nested) {
    const subItem = sub.ordered ? 'number' : 'bullet';
    for (const it of sub.items) {
      convertListItem(it, subItem, level + 1, out, warnings, ctx);
    }
  }
}

// ─── public API ──────────────────────────────────────────────────────────────

/**
 * @param {string} markdown  post body (frontmatter already removed)
 * @returns {{ blocks: object[], warnings: string[], wordCount: number }}
 */
export function markdownToPortableText(markdown) {
  const warnings = [];
  const lexer = new Lexer({ gfm: true, breaks: false });
  const tokens = lexer.lex(markdown.replace(/\r\n/g, '\n'));
  const blocks = [];
  convertTokens(tokens, blocks, warnings, { listLevel: 0 });

  const wordCount = blocks
    .filter((b) => b._type === 'block')
    .flatMap((b) => b.children.map((c) => c.text))
    .concat(
      blocks.filter((b) => b._type === 'table').flatMap((b) => b.rows.flatMap((r) => r.cells)),
    )
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return { blocks, warnings, wordCount };
}

/** Light structural check that the output is valid Portable Text. Throws on error. */
export function assertPortableText(blocks) {
  const keys = new Set();
  const check = (k, where) => {
    if (typeof k !== 'string' || k.length < 6) throw new Error(`Missing _key on ${where}`);
    if (keys.has(k)) throw new Error(`Duplicate _key "${k}" on ${where}`);
    keys.add(k);
  };
  blocks.forEach((b, i) => {
    check(b._key, `block ${i}`);
    if (b._type === 'block') {
      if (!['normal', 'h2', 'h3', 'h4', 'blockquote'].includes(b.style)) throw new Error(`Bad style "${b.style}" on block ${i}`);
      if (!Array.isArray(b.children) || !b.children.length) throw new Error(`Block ${i} has no children`);
      b.children.forEach((c, j) => {
        check(c._key, `block ${i} span ${j}`);
        if (c._type !== 'span' || typeof c.text !== 'string') throw new Error(`Bad span on block ${i}`);
        for (const m of c.marks) {
          if (!['strong', 'em', 'code'].includes(m) && !b.markDefs.some((d) => d._key === m)) {
            throw new Error(`Span on block ${i} references unknown mark "${m}"`);
          }
        }
      });
      b.markDefs.forEach((d) => check(d._key, `markDef on block ${i}`));
    } else if (b._type === 'table') {
      if (!Array.isArray(b.rows) || !b.rows.length) throw new Error(`Table block ${i} has no rows`);
      b.rows.forEach((r, j) => {
        check(r._key, `table ${i} row ${j}`);
        if (!Array.isArray(r.cells)) throw new Error(`Table ${i} row ${j} has no cells`);
      });
    } else if (b._type === 'imageUrl' || b._type === 'video') {
      if (!/^https?:\/\//.test(b.url)) throw new Error(`${b._type} block ${i} has an invalid url`);
    } else {
      throw new Error(`Unknown block type "${b._type}" at ${i}`);
    }
  });
  return true;
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/markdown-to-portable-text.mjs <file.md>');
    process.exit(1);
  }
  let src = readFileSync(file, 'utf8');
  // Strip frontmatter if present so the file can be a real post.
  src = src.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const { blocks, warnings, wordCount } = markdownToPortableText(src);
  assertPortableText(blocks);
  console.log(JSON.stringify(blocks, null, 2));
  console.error(`\n${blocks.length} blocks, ${wordCount} words`);
  for (const w of warnings) console.error(`warning: ${w}`);
}
