#!/usr/bin/env node
/**
 * EchoPulse blog publisher.
 *
 * Takes markdown posts from content/blog-queue/, converts them to Portable
 * Text, renders a 1200x630 thumbnail, uploads it to Sanity, creates the
 * published `blog` document, then moves the markdown file to
 * content/blog-published/ and appends to LOG.md.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=sk... node scripts/publish-blog.mjs            # oldest due post
 *   node scripts/publish-blog.mjs --max 3                             # up to 3 posts
 *   node scripts/publish-blog.mjs --file content/blog-queue/x.md      # one specific file
 *   node scripts/publish-blog.mjs --dry-run [--file ...]              # no network, no moves
 *   node scripts/publish-blog.mjs --validate                          # check every queued file
 *   node scripts/publish-blog.mjs --force                             # overwrite an existing slug
 *
 * Env:
 *   SANITY_WRITE_TOKEN   required unless --dry-run / --validate (Editor token)
 *   SANITY_PROJECT_ID    optional, default qkz53g2a
 *   SANITY_DATASET       optional, default production
 *
 * Exit codes: 0 ok (including "nothing due"), 1 on any error.
 * Nothing is deleted on failure: a file is only moved after Sanity confirms
 * the document exists.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync, appendFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { markdownToPortableText, assertPortableText } from './markdown-to-portable-text.mjs';
import { renderThumbnail, pickIcon } from './render-thumbnail.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE_DIR = join(ROOT, 'content', 'blog-queue');
const PUBLISHED_DIR = join(ROOT, 'content', 'blog-published');
const LOG_FILE = join(PUBLISHED_DIR, 'LOG.md');
const THUMBS_DIR = join(ROOT, '.thumbs');
const SITE_URL = 'https://echopulse.media';

const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qkz53g2a';
const DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const API_VERSION = '2024-01-01';

/** Mirrors CATEGORY_RULES labels in lib/blog.ts (plus the "Insights" fallback). */
export const CATEGORIES = [
  'Real Estate', 'AI Marketing', 'Funnels', 'Video', 'Authority', 'Content Ops',
  'SEO', 'Social', 'Automation', 'Strategy', 'Company', 'Insights',
];
/** ICP keys used by lib/icpData.ts. */
export const ICPS = ['real-estate', 'founders', 'coaches', 'dtc', 'business-owners', 'saas', 'home-services'];
/** Service slugs from lib/serviceData.ts. */
export const SERVICES = [
  'video-editing', 'linkedin-ghostwriting', 'blog-production', 'ad-creatives',
  'websites-funnels', 'automations', 'apps-software',
];
export const DEFAULT_AUTHOR = 'Lakshya Soni';
const EXCERPT_MAX = 160;

// ─── CLI args ────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { dryRun: false, validate: false, force: false, max: 1, file: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--validate') args.validate = true;
    else if (a === '--force') args.force = true;
    else if (a === '--max') args.max = Number(argv[++i]);
    else if (a.startsWith('--max=')) args.max = Number(a.slice(6));
    else if (a === '--file') args.file = argv[++i];
    else if (a.startsWith('--file=')) args.file = a.slice(7);
    else if (a === '--help' || a === '-h') {
      console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0]);
      process.exit(0);
    } else throw new Error(`Unknown argument "${a}"`);
  }
  if (!Number.isInteger(args.max) || args.max < 1) throw new Error('--max must be a positive integer');
  return args;
}

// ─── frontmatter + validation ────────────────────────────────────────────────

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
    .replace(/-+$/g, '');
}

function splitFrontmatter(src) {
  const m = src.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('Missing YAML frontmatter (file must start with a --- block)');
  let data;
  try {
    data = yaml.load(m[1]) ?? {};
  } catch (e) {
    throw new Error(`Invalid YAML frontmatter: ${e.message}`);
  }
  if (typeof data !== 'object' || Array.isArray(data)) throw new Error('Frontmatter must be a YAML mapping');
  return { data, body: m[2] };
}

/**
 * Parse + validate one post file. Returns the fully-resolved post (never
 * touches the network). Throws with a message that names the problem.
 */
export function parsePost(filePath) {
  const src = readFileSync(filePath, 'utf8');
  let parsed;
  try {
    parsed = splitFrontmatter(src);
  } catch (e) {
    const err = new Error(`${basename(filePath)}:\n  - ${e.message}`);
    err.validation = true;
    throw err;
  }
  const { data, body } = parsed;
  const errors = [];
  const str = (v) => (v == null ? '' : String(v).trim());

  const title = str(data.title);
  if (!title) errors.push('title is required');
  if (title.length > 120) errors.push('title should be 120 characters or fewer');

  const excerpt = str(data.excerpt);
  if (!excerpt) errors.push('excerpt is required');
  else if (excerpt.length > EXCERPT_MAX) errors.push(`excerpt is ${excerpt.length} chars; max ${EXCERPT_MAX}`);

  const category = str(data.category);
  if (!category) errors.push(`category is required (one of: ${CATEGORIES.join(', ')})`);
  else if (!CATEGORIES.includes(category)) errors.push(`category "${category}" is not one of: ${CATEGORIES.join(', ')}`);

  const slug = data.slug ? slugify(data.slug) : slugify(title);
  if (!slug) errors.push('slug could not be derived; set slug: explicitly');
  else if (data.slug && slug !== str(data.slug)) errors.push(`slug "${data.slug}" is not URL-safe; use "${slug}"`);

  const author = str(data.author) || DEFAULT_AUTHOR;

  let publishAt = null;
  if (data.publishAt != null && data.publishAt !== '') {
    const d = data.publishAt instanceof Date ? data.publishAt : new Date(String(data.publishAt));
    if (Number.isNaN(d.getTime())) errors.push(`publishAt "${data.publishAt}" is not a valid ISO date`);
    else publishAt = d;
  }

  // postType: 'asset' (evergreen, written once, refreshed when stale) or
  // 'trending' (news-driven; must carry updateBy, the date by which the engine
  // rewrites it into an asset or folds it into one). Default 'asset'.
  const postType = str(data.postType) || 'asset';
  if (!['asset', 'trending'].includes(postType)) errors.push(`postType "${postType}" must be asset or trending`);
  let updateBy = null;
  if (data.updateBy != null && data.updateBy !== '') {
    const d = data.updateBy instanceof Date ? data.updateBy : new Date(String(data.updateBy));
    if (Number.isNaN(d.getTime())) errors.push(`updateBy "${data.updateBy}" is not a valid ISO date`);
    else updateBy = d;
  }
  if (postType === 'trending' && !updateBy) errors.push('trending posts must set updateBy (the date to rewrite it into an asset)');
  const icp = str(data.icp);
  if (icp && !ICPS.includes(icp)) errors.push(`icp "${icp}" is not one of: ${ICPS.join(', ')}`);
  const service = str(data.service);
  if (service && !SERVICES.includes(service)) errors.push(`service "${service}" is not one of: ${SERVICES.join(', ')}`);

  let tags = [];
  if (data.tags != null) {
    tags = Array.isArray(data.tags) ? data.tags.map(str).filter(Boolean) : str(data.tags).split(',').map((t) => t.trim()).filter(Boolean);
  }

  const thumbnailText = str(data.thumbnailText) || title;
  if (thumbnailText.length > 140) errors.push('thumbnailText should be 140 characters or fewer');
  const thumbnailSub = str(data.thumbnailSub);
  if (thumbnailSub.length > 40) errors.push(`thumbnailSub is ${thumbnailSub.length} chars; max 40`);

  let readTime = null;
  if (data.readTime != null && data.readTime !== '') {
    readTime = Number(data.readTime);
    if (!Number.isInteger(readTime) || readTime < 1) errors.push('readTime must be a positive integer (minutes)');
  }

  if (!body.trim()) errors.push('post body is empty');

  const known = new Set(['title', 'slug', 'excerpt', 'category', 'author', 'publishAt', 'icp', 'service', 'tags', 'thumbnailText', 'thumbnailSub', 'readTime', 'postType', 'updateBy']);
  const warnings = [];
  for (const k of Object.keys(data)) if (!known.has(k)) warnings.push(`unknown frontmatter key "${k}" ignored`);

  let blocks = [];
  let wordCount = 0;
  if (!errors.length) {
    try {
      const r = markdownToPortableText(body);
      blocks = r.blocks;
      wordCount = r.wordCount;
      warnings.push(...r.warnings);
      assertPortableText(blocks);
      if (!blocks.length) errors.push('post body produced no content blocks');
    } catch (e) {
      errors.push(`body conversion failed: ${e.message}`);
    }
  }

  if (errors.length) {
    const err = new Error(`${basename(filePath)}:\n  - ${errors.join('\n  - ')}`);
    err.validation = true;
    throw err;
  }

  if (readTime == null) readTime = Math.max(1, Math.round(wordCount / 220));

  return {
    filePath,
    title, slug, excerpt, category, author, publishAt, icp, service, tags,
    thumbnailText, thumbnailSub, readTime, wordCount, blocks, warnings, postType, updateBy,
  };
}

/** Build the Sanity document (without the mainImage asset ref). */
export function buildDocument(post, publishedAt) {
  const doc = {
    _id: `blog-${post.slug}`,
    _type: 'blog',
    title: post.title,
    slug: { _type: 'slug', current: post.slug },
    publishedAt: publishedAt.toISOString(),
    category: post.category,
    excerpt: post.excerpt,
    author: post.author,
    readTime: post.readTime,
    postType: post.postType || 'asset',
    updateBy: post.updateBy ? post.updateBy.toISOString() : undefined,
    icp: post.icp || undefined,
    service: post.service || undefined,
    content: post.blocks,
  };
  return doc;
}

// ─── queue selection ─────────────────────────────────────────────────────────

function listQueue() {
  if (!existsSync(QUEUE_DIR)) return [];
  return readdirSync(QUEUE_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_') && !f.startsWith('.') && f.toLowerCase() !== 'readme.md')
    .sort()
    .map((f) => join(QUEUE_DIR, f));
}

/** Oldest due posts first: by publishAt when set, else by filename order. */
function pickDue(posts, now, max) {
  const due = posts.filter((p) => !p.publishAt || p.publishAt.getTime() <= now.getTime());
  due.sort((a, b) => {
    const ta = a.publishAt ? a.publishAt.getTime() : Number.POSITIVE_INFINITY;
    const tb = b.publishAt ? b.publishAt.getTime() : Number.POSITIVE_INFINITY;
    if (ta !== tb) return ta - tb;
    return basename(a.filePath).localeCompare(basename(b.filePath));
  });
  return due.slice(0, max);
}

// ─── publishing ──────────────────────────────────────────────────────────────

async function makeClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      'SANITY_WRITE_TOKEN is not set.\n' +
        '  Create one at sanity.io/manage > project qkz53g2a > API > Tokens (Editor role),\n' +
        '  then: SANITY_WRITE_TOKEN=sk... npm run blog:publish\n' +
        '  In GitHub Actions, add it as a repository secret named SANITY_WRITE_TOKEN.',
    );
  }
  const { createClient } = await import('@sanity/client');
  return createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, token, useCdn: false, perspective: 'raw' });
}

async function publishOne(post, { client, dryRun, force, now }) {
  const publishedAt = post.publishAt ?? now;
  const doc = buildDocument(post, publishedAt);
  const url = `${SITE_URL}/blog/${post.slug}`;

  console.log(`\n▶ ${basename(post.filePath)}`);
  console.log(`  title:     ${post.title}`);
  console.log(`  slug:      ${post.slug}`);
  console.log(`  category:  ${post.category}  |  author: ${post.author}  |  ${post.wordCount} words, ${post.readTime} min`);
  for (const w of post.warnings) console.log(`  warning:   ${w}`);

  // 1. thumbnail
  const png = await renderThumbnail({
    title: post.thumbnailText,
    category: post.category,
    subtitle: post.thumbnailSub || undefined,
    icon: pickIcon({ category: post.category, icp: post.icp, service: post.service, title: post.title }),
  });
  mkdirSync(THUMBS_DIR, { recursive: true });
  const thumbPath = join(THUMBS_DIR, `${post.slug}.png`);
  writeFileSync(thumbPath, png);
  console.log(`  thumbnail: ${thumbPath} (${(png.length / 1024).toFixed(0)} KB)`);

  if (dryRun) {
    doc.mainImage = { _type: 'image', asset: { _type: 'reference', _ref: 'image-<uploaded-at-publish>-1200x630-png' } };
    console.log('  document:');
    console.log(JSON.stringify(doc, null, 2).replace(/^/gm, '    '));
    console.log(`  dry run: nothing uploaded, file not moved. Would publish at ${url}`);
    return { url, dryRun: true };
  }

  // 2. refuse to overwrite an existing post unless --force
  const existing = await client.fetch(
    `*[_type == "blog" && slug.current == $slug]{ _id, title }`,
    { slug: post.slug },
  );
  if (existing.length && !force) {
    throw new Error(
      `A blog document with slug "${post.slug}" already exists in Sanity (${existing.map((e) => e._id).join(', ')}). ` +
        `Change the slug in the frontmatter, or re-run with --force to overwrite.`,
    );
  }
  if (existing.length) console.log(`  --force: overwriting ${existing.map((e) => e._id).join(', ')}`);
  // When refreshing a post that already exists (an update, not a new post),
  // keep its _id and its original publishedAt. Sanity bumps _updatedAt on
  // write, which the site shows as "Updated <date>" and sends as dateModified.
  // Resetting publishedAt would make a 2025 post claim to be new, which Google
  // treats as a trust problem, and a new _id would leave the old doc behind.
  const prior = existing.find((e) => !String(e._id).startsWith('drafts.')) || existing[0];
  const priorFull = prior ? await client.fetch(`*[_id == $id][0]{ _id, publishedAt }`, { id: prior._id }) : null;
  if (priorFull) {
    doc._id = priorFull._id;
    if (priorFull.publishedAt) doc.publishedAt = priorFull.publishedAt;
  }

  // 3. upload the thumbnail
  const asset = await client.assets.upload('image', png, {
    filename: `${post.slug}-1200x630.png`,
    contentType: 'image/png',
    title: post.title,
  });
  // The `mainImage` field in the schema has no alt field, so none is set.
  doc.mainImage = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  console.log(`  asset:     ${asset._id}`);

  // 4. create / replace the PUBLISHED document (id has no drafts. prefix)
  const tx = client.transaction().createOrReplace(doc);
  // If --force overwrote a post that still had a stale draft, clear the draft
  // so the Studio does not show "unpublished changes" that would re-overwrite.
  if (force) tx.delete(`drafts.${doc._id}`);
  await tx.commit();

  // 5. verify it is really there before touching the file system
  const check = await client.fetch(`*[_id == $id][0]._id`, { id: doc._id });
  if (check !== doc._id) throw new Error(`Sanity did not confirm document ${doc._id} after commit; file left in queue.`);
  console.log(`  published: ${doc._id}`);

  // 6. move the file + log it
  mkdirSync(PUBLISHED_DIR, { recursive: true });
  const date = publishedAt.toISOString().slice(0, 10);
  let dest = join(PUBLISHED_DIR, `${date}-${post.slug}.md`);
  if (existsSync(dest)) dest = join(PUBLISHED_DIR, `${date}-${post.slug}-${Date.now()}.md`);
  renameSync(post.filePath, dest);
  if (!existsSync(LOG_FILE)) {
    writeFileSync(LOG_FILE, '# Published blog posts\n\nAppended automatically by scripts/publish-blog.mjs. Do not edit by hand.\n\n| Date | Slug | Sanity id | URL |\n| --- | --- | --- | --- |\n');
  }
  appendFileSync(LOG_FILE, `| ${publishedAt.toISOString()} | ${post.slug} | ${doc._id} | ${url} |\n`);
  console.log(`  moved to:  ${dest}`);
  console.log(`  LIVE:      ${url}`);
  return { url, dest, id: doc._id };
}

// ─── modes ───────────────────────────────────────────────────────────────────

function runValidate() {
  const files = listQueue();
  const example = join(QUEUE_DIR, '_example.md');
  if (existsSync(example)) files.push(example); // keep the example honest too
  if (!files.length) {
    console.log('blog:validate — queue is empty, nothing to check.');
    return 0;
  }
  let failed = 0;
  const seen = new Map();
  for (const f of files) {
    try {
      const p = parsePost(f);
      if (seen.has(p.slug)) throw new Error(`${basename(f)}: slug "${p.slug}" is also used by ${seen.get(p.slug)}`);
      seen.set(p.slug, basename(f));
      const when = p.publishAt ? `scheduled ${p.publishAt.toISOString()}` : 'next free slot';
      console.log(`✓ ${basename(f)}  →  /blog/${p.slug}  (${p.blocks.length} blocks, ${p.wordCount} words, ${when})`);
      for (const w of p.warnings) console.log(`    warning: ${w}`);
    } catch (e) {
      failed++;
      console.error(`✗ ${e.message}`);
    }
  }
  console.log(`\n${files.length - failed}/${files.length} files valid.`);
  return failed ? 1 : 0;
}

async function runPublish(args) {
  const now = new Date();
  let posts;
  if (args.file) {
    const f = resolve(ROOT, args.file);
    if (!existsSync(f)) throw new Error(`File not found: ${args.file}`);
    posts = [parsePost(f)];
    if (!args.dryRun && posts[0].publishAt && posts[0].publishAt > now && !args.force) {
      throw new Error(`${basename(f)} is scheduled for ${posts[0].publishAt.toISOString()} (in the future). Use --force to publish now.`);
    }
  } else {
    const files = listQueue();
    if (!files.length) {
      console.log('Queue is empty (content/blog-queue/*.md). Nothing to publish.');
      return 0;
    }
    const parsed = [];
    const bad = [];
    for (const f of files) {
      try {
        parsed.push(parsePost(f));
      } catch (e) {
        bad.push(e.message);
      }
    }
    for (const b of bad) console.error(`✗ skipping invalid file:\n${b}`);
    posts = pickDue(parsed, now, args.max);
    if (!posts.length) {
      const next = parsed.filter((p) => p.publishAt).sort((a, b) => a.publishAt - b.publishAt)[0];
      console.log(
        `No post is due yet (${parsed.length} queued${next ? `, next: ${basename(next.filePath)} at ${next.publishAt.toISOString()}` : ''}).`,
      );
      return bad.length ? 1 : 0;
    }
  }

  const client = args.dryRun ? null : await makeClient();
  const results = [];
  for (const post of posts) {
    results.push(await publishOne(post, { client, dryRun: args.dryRun, force: args.force, now }));
  }

  console.log(`\n${args.dryRun ? 'Dry run complete' : 'Published'}: ${results.length} post(s).`);
  for (const r of results) console.log(`  ${r.url}`);
  return 0;
}

// ─── main ────────────────────────────────────────────────────────────────────

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const code = args.validate ? runValidate() : await runPublish(args);
    process.exit(code);
  } catch (e) {
    console.error(`\n✗ ${e.message}`);
    if (!e.validation && process.env.DEBUG) console.error(e.stack);
    process.exit(1);
  }
}
