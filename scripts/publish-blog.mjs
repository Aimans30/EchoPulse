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
 *   node scripts/publish-blog.mjs --dry-run [--file ...]              # writes nothing, moves nothing
 *   node scripts/publish-blog.mjs --validate [--file x.md]            # check every queued file (or one)
 *   node scripts/publish-blog.mjs --validate --published              # also check content/blog-published (warnings only)
 *   node scripts/publish-blog.mjs --pull <slug>                       # live post -> content/blog-queue/<today>-<slug>.md
 *   node scripts/publish-blog.mjs --refresh --file x.md               # update a live post in place (safe refresh)
 *   node scripts/publish-blog.mjs --refresh --dry-run --file x.md     # show what the refresh would keep and change
 *   node scripts/publish-blog.mjs --refresh-list                      # refresh order from content/blog-data/gsc-pages-*.csv
 *   node scripts/publish-blog.mjs --force                             # REPLACE an existing slug (rebuilds the whole
 *                                                                     # document and its cover; the engine never uses it)
 *
 * Safe refresh (--refresh) patches title, excerpt, body, read time and the
 * engine fields on the existing document. It never touches the slug,
 * publishedAt, category, author or any field set by hand in Studio, and it
 * keeps the existing cover unless the text on the cover changes (or
 * --new-cover is passed). Sanity bumps _updatedAt, which the site shows as
 * "Updated <date>".
 *
 * Validation has two levels. The ENGINE STANDARD (content/BLOG-ENGINE.md) is
 * enforced as errors on every file in content/blog-queue. A hand-written post
 * can opt out with `engine: false` in its frontmatter, and files in
 * content/blog-published are always checked as legacy: for both, the standard
 * is reported as warnings and only the basic checks can fail.
 *
 * Env:
 *   SANITY_WRITE_TOKEN   required to publish or refresh (Editor token). Reads need no token.
 *   SANITY_PROJECT_ID    optional, default qkz53g2a
 *   SANITY_DATASET       optional, default production
 *
 * Exit codes: 0 ok (including "nothing due"), 1 on any error.
 * Nothing is deleted on failure: a file is only moved after Sanity confirms
 * the document exists.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync, appendFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import opentype from 'opentype.js';
import sharp from 'sharp';
import { markdownToPortableText, assertPortableText, makeKey } from './markdown-to-portable-text.mjs';
import { renderThumbnail, pickIcon } from './render-thumbnail.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE_DIR = join(ROOT, 'content', 'blog-queue');
const PUBLISHED_DIR = join(ROOT, 'content', 'blog-published');
const LOG_FILE = join(PUBLISHED_DIR, 'LOG.md');
const DATA_DIR = join(ROOT, 'content', 'blog-data');
const THUMBS_DIR = join(ROOT, '.thumbs');
const SITE_URL = 'https://echopulse.media';
/** IndexNow key. The matching file public/<key>.txt (containing only the key) must stay deployed. */
const INDEXNOW_KEY = '5d97392a18c74d6b9fb2d0f2e27035dc';

/** Tell IndexNow a post changed. Fails soft: never throws, never affects the exit code. */
async function pingIndexNow(slug) {
  if (process.env.INDEXNOW === 'off') return;
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'echopulse.media',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: [`${SITE_URL}/blog/${slug}`, `${SITE_URL}/blog`],
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log(`  IndexNow pinged (${res.status})`);
  } catch (e) {
    console.log(`IndexNow ping skipped: ${e?.message || e}`);
  }
}

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
/** The five ICPs that have a page (IcpKey in lib/blogLinks.ts). Engine posts use only these. */
export const ENGINE_ICPS = ['real-estate', 'founders', 'coaches', 'dtc', 'business-owners'];
export const DEFAULT_AUTHOR = 'Lakshya Soni';
const EXCERPT_MAX = 160;
const EXCERPT_MIN = 130;
const TITLE_MAX_ENGINE = 60;
/** Posts published before this date are under owner review for removal: not refreshed, not linked. */
const LEGACY_CUTOFF = '2026-07-01';
/** New posts (asset or trending, not refreshes) per ISO week and per day, Asia/Kolkata calendar. */
const WEEK_CAP = 4;
const DAY_CAP = 2;
/** A cost or pricing post is re-checked at least this often; other posts become DUE after 45 days. */
const PRICE_RECHECK_DAYS = 90;
const DUE_DAYS = 45;
/** Every chart the publisher inserts ends its caption with this, so a refresh can replace it. */
const CHART_MARK = 'Chart by EchoPulse Media from the table above.';
const FONT_DIR = join(ROOT, 'scripts', 'fonts');

// ─── CLI args ────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { dryRun: false, validate: false, force: false, max: 1, file: null, refresh: false, newCover: false, pull: null, refreshList: false, published: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--validate') args.validate = true;
    else if (a === '--force') args.force = true;
    else if (a === '--refresh') args.refresh = true;
    else if (a === '--new-cover') args.newCover = true;
    else if (a === '--refresh-list') args.refreshList = true;
    else if (a === '--published') args.published = true;
    else if (a === '--pull') args.pull = argv[++i];
    else if (a.startsWith('--pull=')) args.pull = a.slice(7);
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
  if (args.refresh && args.force) throw new Error('Use --refresh or --force, not both. --refresh is the safe one.');
  if (args.refresh && !args.file) throw new Error('--refresh needs --file content/blog-queue/<file>.md');
  if (args.pull != null && !/^[a-z0-9][a-z0-9-]*$/.test(String(args.pull))) throw new Error('--pull needs the live post slug, e.g. --pull real-estate-video-editing-cost');
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
export function parsePost(filePath, opts = {}) {
  const src = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
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

  const targetQuery = str(data.targetQuery);
  const moneyPage = str(data.moneyPage).replace(/(.)\/$/, '$1');
  const whatsNew = str(data.whatsNew);

  const chartColumn = str(data.chartColumn);
  const chartLabel = str(data.chartLabel);
  const chartSource = str(data.chartSource);
  if (chartSource.length > 80) errors.push(`chartSource is ${chartSource.length} chars; max 80`);

  const known = new Set(['title', 'slug', 'excerpt', 'category', 'author', 'publishAt', 'icp', 'service', 'tags', 'thumbnailText', 'thumbnailSub', 'readTime', 'postType', 'updateBy', 'targetQuery', 'moneyPage', 'whatsNew', 'ask', 'engine', 'refresh', 'chartColumn', 'chartLabel', 'chartSource']);
  const warnings = [];
  for (const k of Object.keys(data)) if (!known.has(k)) warnings.push(`unknown frontmatter key "${k}" ignored`);

  let blocks = [];
  let wordCount = 0;
  let oldCharts = 0;
  if (!errors.length) {
    try {
      const r = markdownToPortableText(body);
      // A chart the publisher inserted earlier comes back in a pulled refresh
      // file. It is drawn from the old table, so it is dropped here and, when
      // chartColumn is set, drawn again from the table as it is now.
      blocks = r.blocks.filter((b) => !(b._type === 'imageUrl' && String(b.caption || '').endsWith(CHART_MARK)));
      oldCharts = r.blocks.length - blocks.length;
      wordCount = r.wordCount;
      warnings.push(...r.warnings);
      assertPortableText(blocks);
      if (!blocks.length) errors.push('post body produced no content blocks');
    } catch (e) {
      errors.push(`body conversion failed: ${e.message}`);
    }
  }

  // The engine standard. Errors for engine posts in the queue; warnings for
  // hand-written posts (`engine: false`) and for anything already published.
  // Files starting with "_" are templates: checked, reported, never publishable.
  const template = basename(filePath).startsWith('_');
  const legacy = Boolean(opts.legacy) || template || data.engine === false || str(data.engine).toLowerCase() === 'false';
  let standard = { errors: [], warnings: [], facts: [], lastChecked: null };
  let checkBlocks = blocks;
  if (!errors.length) {
    // Tables must be counted as tables even while BLOG_TABLES=pipes is set.
    if (process.env.BLOG_TABLES === 'pipes') {
      const saved = process.env.BLOG_TABLES;
      delete process.env.BLOG_TABLES;
      try { checkBlocks = markdownToPortableText(body).blocks.filter((b) => !(b._type === 'imageUrl' && String(b.caption || '').endsWith(CHART_MARK))); } finally { process.env.BLOG_TABLES = saved; }
    }
    standard = checkStandard({
      src, body, data, blocks: checkBlocks, wordCount,
      title, slug, excerpt, icp, service, postType, moneyPage, whatsNew, targetQuery,
      thumbnailText, thumbnailSub, ask: str(data.ask), isRefresh: data.refresh === true, template,
    }, opts.now ?? new Date());
    if (legacy) {
      warnings.push(...standard.errors.map((e) => `standard: ${e}`), ...standard.warnings);
    } else {
      errors.push(...standard.errors);
      warnings.push(...standard.warnings);
    }
  }

  // The chart: planned here (no network, no rendering) so validate reports it.
  let chart = null;
  if (!errors.length) {
    if (oldCharts) standard.facts.push(`${oldCharts} old chart block${oldCharts > 1 ? 's' : ''} dropped (redrawn from the current table if chartColumn is set)`);
    if (chartColumn) {
      // Planned on real table blocks; under BLOG_TABLES=pipes the publisher then skips drawing it.
      chart = planChart(checkBlocks, { column: chartColumn, label: chartLabel });
      if (chart.skip) {
        warnings.push(`chart skipped: ${chart.skip} Fix: point chartColumn at a column of the main table whose cells each hold one figure or "a to b" in one currency, with 3 or more such rows, or delete chartColumn.`);
        standard.facts.push('chart skipped');
        chart = null;
      } else {
        standard.facts.push(`chart ${chart.rows.length} bars from "${chart.header}"${chart.missing.length ? `, ${chart.missing.length} not charted` : ''}`);
      }
    } else {
      standard.facts.push('chart none (no chartColumn)');
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
    targetQuery, moneyPage, whatsNew, lastChecked: standard.lastChecked, legacy, facts: standard.facts,
    coverTextExplicit: Boolean(str(data.thumbnailText)),
    chart, chartColumn, chartLabel, chartSource,
  };
}

// ─── the engine standard (content/BLOG-ENGINE.md), as machine checks ─────────
//
// Only what can be checked without judgement. Every message ends with the fix,
// because the reader is an unattended model that has to act on it.

let repoFactsCache = null;
/** Routes, niche pages and prices, read from the checkout so they cannot drift. */
export function repoFacts() {
  if (repoFactsCache) return repoFactsCache;
  const read = (rel) => {
    try { return readFileSync(join(ROOT, rel), 'utf8'); } catch { return ''; }
  };
  const routes = new Set(['/']);
  const appDir = join(ROOT, 'app');
  if (existsSync(appDir)) {
    for (const d of readdirSync(appDir)) {
      if (/^[[(_]/.test(d) || d === 'api') continue;
      const dir = join(appDir, d);
      if (statSync(dir).isDirectory() && (existsSync(join(dir, 'page.tsx')) || existsSync(join(dir, 'page.jsx')))) routes.add(`/${d}`);
    }
  }
  for (const s of SERVICES) routes.add(`/services/${s}`);
  for (const i of ENGINE_ICPS) routes.add(`/${i}`);
  const niche = new Set();
  for (const m of read('lib/nicheIndex.ts').matchAll(/\{\s*icp:\s*'([a-z-]+)',\s*service:\s*'([a-z-]+)'/g)) {
    niche.add(`/${m[1]}/${m[2]}`);
    routes.add(`/${m[1]}/${m[2]}`);
  }
  for (const m of read('lib/caseStudyData.ts').matchAll(/^ {2}slug:\s*'([a-z0-9-]+)'/gm)) routes.add(`/case-studies/${m[1]}`);
  // The EchoPulse prices a post may state: every priceLabel in lib/pricing.ts.
  const prices = new Set([...read('lib/pricing.ts').matchAll(/priceLabel:\s*'(\$[\d,]+)'/g)].map((m) => m[1]));
  if (!prices.size) for (const p of ['$299', '$399', '$1,997']) prices.add(p);
  // ICP keyword rules, for posts published before `icp` was stored.
  const icpRules = [];
  const rulesSrc = (read('lib/blogLinks.ts').match(/const ICP_RULES[^=]*=\s*\[([\s\S]*?)\n\];/) || [])[1] || '';
  for (const m of rulesSrc.matchAll(/\['([a-z-]+)',\s*\[([^\]]*)\]\]/g)) {
    icpRules.push([m[1], [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1])]);
  }
  repoFactsCache = { routes, niche, prices, icpRules, founderNotes: parseFounderNotes(read('content/blog-data/founder-notes.md')) };
  return repoFactsCache;
}

/** Straight quotes, single spaces: how a quote is compared with the note it came from. */
const normQuote = (t) => String(t).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();

/**
 * content/blog-data/founder-notes.md: one "## YYYY-MM-DD | public: yes|no | ..."
 * heading per note, with a `Quote: "..."` line. Anything inside a fenced code
 * block (the template's example) is ignored.
 * @returns {{ date: string, public: boolean, quote: string }[]}
 */
export function parseFounderNotes(src) {
  const notes = [];
  let fence = false;
  let cur = null;
  for (const line of String(src || '').split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue; }
    if (fence) continue;
    const h = line.match(/^##\s+(\d{4}-\d{2}-\d{2})\s*\|(.*)$/);
    if (h) {
      cur = { date: h[1], public: /\bpublic:\s*yes\b/i.test(h[2]), quote: '' };
      notes.push(cur);
      continue;
    }
    if (/^##\s/.test(line)) { cur = null; continue; }
    const q = cur && line.match(/^\s*-?\s*Quote:\s*["“](.*)["”]\s*$/);
    if (q) cur.quote = normQuote(q[1]);
  }
  return notes.filter((n) => n.quote);
}

/** The one selling page a post feeds: the niche page when the pair exists, else the service page. */
export function expectedMoneyPage(icp, service) {
  const niche = `/${icp}/${service}`;
  return repoFacts().niche.has(niche) ? niche : `/services/${service}`;
}

/** What the site's cards ask for on a post of this service (blogAskFor in lib/blogLinks.ts). */
export function askFor(service) {
  return service === 'video-editing' || service === 'ad-creatives' ? 'sample' : 'call';
}

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const COST_RE = /\b(costs?|prices?|pricing|rates|how much)\b/i;

/** Phrases that are never right. Each hit is an error. */
const BANNED_HARD = [
  [/\bdelv(e|es|ed|ing)\b/i, 'delve'], [/\bseamless(ly)?\b/i, 'seamless'], [/\bgame[- ]chang/i, 'game-changer'],
  [/\bcutting[- ]edge\b/i, 'cutting-edge'], [/\btapestry\b/i, 'tapestry'], [/\bsupercharg/i, 'supercharge'],
  [/\bever[- ]evolving\b/i, 'ever-evolving'], [/\bin today['’]s\b/i, "in today's"], [/^\s*in this (post|guide|article)\b|\bin this (post|guide|article),? (we|you|i)\b/i, 'in this post/guide'],
  [/\blet['’]s dive\b|\bdive in\b|\bdeep dive\b/i, "let's dive / deep dive"], [/\bwhen it comes to\b/i, 'when it comes to'],
  [/\bhere['’]s the thing\b/i, "here's the thing"], [/\bthe truth is\b/i, 'the truth is'], [/\bworth noting\b/i, "it's worth noting"],
  [/\bimportant to (note|remember)\b/i, "it's important to note"], [/\bwhat most people miss\b/i, 'what most people miss'],
  [/\bultimate guide\b|\bcomplete guide\b|\beverything you need to know\b/i, 'ultimate/complete guide'],
  // content/blog-data/style-guide.md, the mechanical part
  [/\bfast[- ]paced\b/i, 'fast-paced'], [/\bin conclusion\b|\bin summary\b|\bto sum (it )?up\b|\bthe bottom line\b/i, 'in conclusion / in summary'],
  [/\bwhether you['’]re an? \b/i, "whether you're a"], [/\bnavigat(e|es|ing) (the|this|these|your)\b/i, 'navigate the'],
  [/\bnot (just|only|merely) [^.;:?!]{1,60}?,? but( also)?\b/i, '"not just X, but Y"'],
  [/\bit['’]s not (just )?(about )?[^.;:?!]{1,40}?[,;] it['’]s\b/i, '"it\'s not X, it\'s Y"'],
  [/\bunlock(s|ed|ing)? (the|your|new|a|real|growth|potential|value)\b/i, 'unlock'], [/\blandscape\b(?! (video|mode|orientation|format|photo|shot|footage|version|aspect))/i, 'landscape (outside "landscape video")'],
  [/\bempower(s|ed|ing)?\b/i, 'empower'], [/\btransformative\b/i, 'transformative'], [/\bin the realm of\b|\brealm\b/i, 'realm'],
  [/\bgame plan\b|\bnext level\b|\btake (it|your \w+) to the next level\b/i, 'next level'], [/\bhidden gem\b|\bsecret sauce\b|\bmagic bullet\b/i, 'secret sauce / magic bullet'],
  [/\blook no further\b|\bwithout further ado\b|\bbuckle up\b/i, 'look no further / without further ado'],
  [/\b(ever )?wondered (why|how|what|whether|if)\b/i, 'ever wondered'],
];
/** Words that are usually filler but have literal uses ("landscape video"). Warnings. */
const BANNED_SOFT = /\b(elevat\w*|leverag\w*|robust|unlock\w*|streamlin\w*|foster\w*|navigat\w*|crucial|really|very|truly|simply|essentially|arguably|comprehensive|holistic|myriad|plethora|pivotal|paramount|vibrant|bustling|meticulous\w*|endeavou?r\w*|embark\w*|harness\w*|boost\w*)\b/i;
/** Things the engine cannot have done, or that EchoPulse never says. Errors. */
const BANNED_CLAIMS = [
  [/\bI (checked|tested|tried|reviewed|read|opened|compared|counted|looked|ran|found|built|pulled|priced|asked|called|spoke|use|used|have|recommend|think|would)\b|\bI['’](ve|d|m|ll)\b/, 'first person singular ("I ..."). The run is automated. Fix: write "we" for what was read or calculated ("we read 10 pricing pages"), or cut the sentence.'],
  [/\b(in|from) (my|our) experience\b|\bmy (clients?|agency|team)\b|\bour clients?\b|\bwe(?: have|['’]ve) (seen|found|worked|helped|tested|tried)\b|\bwe (tested|tried)\b/i, 'an experience or client claim the engine cannot back. Fix: cut it, or replace it with what a linked source says.'],
  [/cal\.com/i, 'a booking link. Fix: remove it; the site adds the tracked button itself.'],
  [/4,?997|\bFull System\b/, 'a retired EchoPulse tier. Fix: remove it; state only the prices in lib/pricing.ts.'],
  [/\bClutch\b/, 'Clutch. Fix: remove the mention.'],
];

/**
 * @returns {{ errors: string[], warnings: string[], facts: string[], lastChecked: string|null }}
 */
export function checkStandard(p, now) {
  const errors = [];
  const warnings = [];
  const facts = [];
  const { routes, prices } = repoFacts();
  const isAsset = p.postType !== 'trending';

  // ── frontmatter ──
  if (!p.icp) errors.push(`icp is required. Fix: set icp to one of ${ENGINE_ICPS.join(', ')}.`);
  else if (!ENGINE_ICPS.includes(p.icp)) errors.push(`icp "${p.icp}" has no page on the site. Fix: use ${p.icp === 'saas' ? 'founders' : p.icp === 'home-services' ? 'business-owners' : `one of ${ENGINE_ICPS.join(', ')}`}.`);
  if (!p.service) errors.push(`service is required. Fix: set service to one of ${SERVICES.join(', ')}.`);
  if (p.data.postType == null || p.data.postType === '') errors.push('postType is required. Fix: add "postType: asset" (or trending, with updateBy).');
  if (!p.targetQuery) errors.push('targetQuery is required. Fix: add the one search query this post answers, in the searcher\'s words.');
  if (!p.whatsNew) errors.push('whatsNew is required. Fix: add one sentence naming the original asset with its count and date.');
  else if (p.whatsNew.length < 20 || p.whatsNew.length > 160) errors.push(`whatsNew is ${p.whatsNew.length} chars. Fix: make it 20 to 160.`);
  if (p.icp && p.service && ENGINE_ICPS.includes(p.icp)) {
    const want = expectedMoneyPage(p.icp, p.service);
    const servicePage = `/services/${p.service}`;
    if (!p.moneyPage) errors.push(`moneyPage is required. Fix: add "moneyPage: ${want}".`);
    else if (p.moneyPage !== want && p.moneyPage !== servicePage) errors.push(`moneyPage "${p.moneyPage}" is not the selling page for ${p.icp} + ${p.service}. Fix: set "moneyPage: ${want}".`);
    else if (p.moneyPage !== want) warnings.push(`moneyPage is ${servicePage} although ${want} exists in this checkout. Only correct if ${want} did not return 200 on the live site; say so in the report.`);
    const ask = askFor(p.service);
    if (p.ask && p.ask !== ask) errors.push(`ask "${p.ask}" does not match the service. Fix: delete the ask line (it is derived: ${p.service} gives "${ask}").`);
    facts.push(`ask ${ask}`);
  }
  if (p.title.length > TITLE_MAX_ENGINE) errors.push(`title is ${p.title.length} chars. Fix: cut it to ${TITLE_MAX_ENGINE} or fewer, keeping the query first and the number.`);
  if (p.excerpt.length < EXCERPT_MIN) errors.push(`excerpt is ${p.excerpt.length} chars. Fix: make it ${EXCERPT_MIN} to ${EXCERPT_MAX} (the answer with its number, then how it was checked).`);
  if (p.thumbnailText.length > 60) warnings.push(`thumbnailText is ${p.thumbnailText.length} chars; over 60 wraps badly on the cover.`);
  if ((COST_RE.test(p.title) || COST_RE.test(p.targetQuery)) && !/cost|price|pricing|rates/.test(p.slug)) {
    if (p.isRefresh) warnings.push(`cost post without cost, price, pricing or rates in the slug "${p.slug}". A live slug is never changed, so the site will not add its price line here.`);
    else errors.push(`this is a cost post but the slug "${p.slug}" has none of cost, price, pricing, rates. Fix: put one in the slug (the site shows the EchoPulse price line only on those slugs).`);
  }
  facts.push(`title ${p.title.length} chars`, `excerpt ${p.excerpt.length} chars`);

  // ── dashes, anywhere in the file ──
  const lines = p.src.split('\n');
  const dashLines = [];
  lines.forEach((l, i) => { if (/[‒–—―]/.test(l)) dashLines.push(i + 1); });
  if (dashLines.length) errors.push(`en or em dash on line${dashLines.length > 1 ? 's' : ''} ${dashLines.slice(0, 12).join(', ')}${dashLines.length > 12 ? ', ...' : ''}. Fix: write "to" for ranges ("15 to 30 seconds") and a comma, colon or full stop elsewhere.`);

  // ── line-level phrase checks on the body ──
  const bodyStart = lines.length - p.body.split('\n').length;
  const bodyLines = p.body.split('\n');
  const soft = [];
  let fence = false;
  bodyLines.forEach((l, i) => {
    const n = bodyStart + i + 1;
    if (/^\s*(```|~~~)/.test(l)) fence = !fence;
    if (fence || /^\s*>/.test(l)) return; // quoted speech is someone else's words
    const text = l.replace(/\]\([^)]*\)/g, ']'); // do not scan URLs
    for (const [re, name] of BANNED_HARD) if (re.test(text)) errors.push(`line ${n}: banned phrase "${name}". Fix: rewrite the sentence so it states the fact directly.`);
    for (const [re, why] of BANNED_CLAIMS) if (re.test(text)) errors.push(`line ${n}: ${why}`);
    const m = text.match(BANNED_SOFT);
    if (m) soft.push(`${n} (${m[0].toLowerCase()})`);
    if (/echopulse/i.test(text)) {
      if (/\bnotice\b/i.test(text)) errors.push(`line ${n}: a notice period next to EchoPulse. Fix: remove it. The only term stated is "month-to-month".`);
      const hrs = [...text.matchAll(/\b(\d+)[- ]?(?:hours?|hrs?)\b/gi)].map((x) => x[1]);
      if (hrs.some((h) => h !== '48')) errors.push(`line ${n}: an EchoPulse turnaround other than 48 hours. Fix: say only "short-form edits within 48 hours"; long-form depends on length and gets no number.`);
    }
  });
  if (soft.length) warnings.push(`filler words on lines ${soft.slice(0, 15).join(', ')}${soft.length > 15 ? ', ...' : ''}. Rewrite each unless it is literal ("landscape video", "site navigation").`);

  // ── structure, from the converted blocks ──
  const info = p.blocks.map((b) => {
    if (b._type === 'table') return { kind: 'table', text: b.rows.flatMap((r) => r.cells).join(' '), links: [] };
    if (b._type !== 'block') return { kind: b._type, text: '', links: [] };
    return { kind: b.listItem ? 'li' : b.style, text: b.children.map((c) => c.text).join(''), links: (b.markDefs || []).map((d) => String(d.href || '')) };
  });
  const norm = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  const words = (t) => t.split(/\s+/).filter(Boolean).length;
  const internalPath = (href) => {
    const m = href.match(/^https?:\/\/(?:www\.)?echopulse\.media(\/[^?#]*)?/i);
    const path = m ? (m[1] || '/') : href.startsWith('/') ? href.split(/[?#]/)[0] : null;
    return path == null ? null : path.length > 1 ? path.replace(/\/$/, '') : path;
  };
  const isExternal = (href) => /^https?:\/\//i.test(href) && internalPath(href) == null;

  // capsule
  const first = info[0];
  if (!first || first.kind !== 'normal') {
    errors.push('the post must open with the answer paragraph, not a heading, list, quote or image. Fix: make the first block a 40 to 75 word paragraph that answers the title.');
  } else {
    const w = words(first.text);
    facts.push(`capsule ${w} words`);
    if (w < 40 || w > 75) errors.push(`the first paragraph (answer capsule) is ${w} words. Fix: make it 40 to 75 words, 2 to 3 sentences.`);
    if (!/\d/.test(first.text)) errors.push('the first paragraph has no number. Fix: state the answer with its number, unit and date ("as of November 2026").');
    if (/echopulse/i.test(first.text)) errors.push('the first paragraph mentions EchoPulse. Fix: remove it; the capsule answers the question and nothing else.');
  }

  // sections
  let h2 = '';
  let h3 = '';
  let faqCount = 0;
  let hasFaq = false;
  let hasSources = false;
  let hasFit = false;
  const sourceLinks = new Set();
  const allExternal = new Set();
  const blogLinks = new Set();
  const badInternal = new Set();
  let moneyLinked = false;
  let tables = 0;
  let cite = false;
  let figureBlocks = 0;
  const unsourced = [];
  const fitPrices = new Set();
  let fitText = '';
  const isFaq = (t) => /^(faq|frequently asked questions|common questions)/.test(norm(t));
  const FIGURE_RE = /[$£€]\s?\d|\d\s?%|\d\s?percent\b/;
  const DERIVED_RE = /our arithmetic|we (calculated|worked out|added|counted)|works out (to|at)|could not (verify|confirm|find)|does not publish|do not publish|not published|no public price|table above|rows above/i;

  // A figure counts as sourced when its paragraph links out, or names a source
  // that is linked under "## Sources" (by the first word of the link text or
  // by its domain: "Jobber's pricing page lists ..." matches getjobber.com).
  const sourceNames = new Set();
  {
    let inSources = false;
    for (const b of p.blocks) {
      if (b._type !== 'block') continue;
      const text = b.children.map((c) => c.text).join('');
      if (b.style === 'h2') { inSources = /^sources/.test(norm(text)); continue; }
      if (!inSources) continue;
      for (const d of b.markDefs || []) {
        const href = String(d.href || '');
        if (!isExternal(href)) continue;
        const host = href.replace(/^https?:\/\/(www\.)?/i, '').split('/')[0].split('.').slice(0, -1).pop() || '';
        if (host.length >= 3) sourceNames.add(host.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const label = b.children.filter((c) => (c.marks || []).includes(d._key)).map((c) => c.text).join('');
        const firstWord = (label.match(/[A-Za-z0-9][A-Za-z0-9.&'-]{2,}/) || [''])[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        if (firstWord.length >= 3 && !['the', 'how', 'why', 'what', 'our', 'new'].includes(firstWord)) sourceNames.add(firstWord);
      }
    }
  }
  const namesSource = (text) => {
    const flat = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const n of sourceNames) if (flat.includes(n)) return true;
    return false;
  };

  info.forEach((b, idx) => {
    if (b.kind === 'h2') {
      h2 = norm(b.text); h3 = '';
      if (isFaq(b.text)) hasFaq = true;
      if (/^sources/.test(h2)) hasSources = true;
      if (/echopulse/.test(h2)) hasFit = true;
      return;
    }
    if (b.kind === 'h3') { h3 = norm(b.text); if (isFaq(h2)) faqCount++; return; }
    if (b.kind === 'h1') errors.push('the body has an H1. Fix: start headings at "## "; the title is the only H1.');
    if (b.kind === 'table') tables++;
    if (b.kind === 'blockquote' && /^\s*cite this:/i.test(b.text)) {
      cite = true;
      if (!b.text.includes(`echopulse.media/blog/${p.slug}`)) errors.push(`the cite block does not contain this post's URL. Fix: end it with "https://echopulse.media/blog/${p.slug}".`);
    }
    for (const href of b.links) {
      const path = internalPath(href);
      if (path != null) {
        if (path === p.moneyPage) moneyLinked = true;
        const blog = path.match(/^\/blog\/([a-z0-9-]+)$/);
        if (blog) { if (blog[1] !== p.slug) blogLinks.add(blog[1]); }
        else if (path !== '/blog' && !routes.has(path)) badInternal.add(path);
      } else if (isExternal(href)) {
        allExternal.add(href);
        if (/^sources/.test(h2)) sourceLinks.add(href);
      }
    }
    const inFit = /echopulse/.test(h2);
    if (inFit) fitText += ` ${b.text}`;
    if (inFit) for (const m of b.text.matchAll(/\$\s?[\d,]+(?:\.\d+)?/g)) fitPrices.add(m[0].replace(/\s/g, '').replace(/,$/, ''));
    // number sourcing: paragraphs and list items in the researched sections
    const exempt = idx === 0 || inFit || isFaq(h2) || /^sources/.test(h2) || /example/.test(h2) || /example/.test(h3) || /last checked:/i.test(b.text);
    if ((b.kind === 'normal' || b.kind === 'li') && !exempt && FIGURE_RE.test(b.text)) {
      figureBlocks++;
      if (!b.links.some(isExternal) && !DERIVED_RE.test(b.text) && !namesSource(b.text)) unsourced.push(b.text.slice(0, 70).trim());
    }
  });

  if (isAsset) {
    facts.push(`tables ${tables}`);
    if (!tables) errors.push('an asset post needs at least one table. Fix: put the asset in a pipe table whose header row names the unit and the date.');
    if (!cite) errors.push(`no cite block. Fix: directly after the asset add one blockquote: "> **Cite this:** <the finding with its number and date>. Source: EchoPulse Media, "<title>", https://echopulse.media/blog/${p.slug}".`);
    // Length follows the answer (style-guide.md). The floor only catches a
    // post too short to hold a table, the method, the buyers' questions and
    // the FAQ; thinness is judged by the editor gate on information gain.
    if (p.template) { /* a format example is short on purpose */ } else if (p.wordCount < 800) errors.push(`${p.wordCount} words. Fix: an asset post that answers the buyers' questions with a table, method and FAQ is rarely under 800 words; add the missing buyer questions from the gap table, never padding.`);
    else if (p.wordCount > 2400) warnings.push(`${p.wordCount} words. Length follows the answer: cut restated points and anything the gap table did not ask for.`);
  } else if (p.wordCount < 600) {
    errors.push(`${p.wordCount} words. Fix: a trending post is at least 600 words.`);
  }
  facts.push(`${p.wordCount} words`);

  if (!hasFaq) errors.push('no FAQ section. Fix: add "## FAQ" with 4 to 6 questions as "### " headings, each answered in 2 to 4 sentences.');
  else if (faqCount < 4) errors.push(`the FAQ has ${faqCount} question${faqCount === 1 ? '' : 's'}. Fix: 4 to 6 real questions, each a "### " heading under "## FAQ".`);
  else if (faqCount > 6) warnings.push(`the FAQ has ${faqCount} questions; keep the best 6.`);
  facts.push(`FAQ ${faqCount}`);

  const minSources = isAsset ? 4 : 2;
  if (!hasSources) errors.push('no Sources section. Fix: end the post with "## Sources": every source as a link, what it gave, and the date read.');
  else if (sourceLinks.size < minSources) errors.push(`Sources lists ${sourceLinks.size} external link${sourceLinks.size === 1 ? '' : 's'}. Fix: link at least ${minSources} primary sources there.`);
  facts.push(`sources ${sourceLinks.size} links`);

  // the "Last checked" line: the post's own refresh date
  let lastChecked = null;
  const lc = p.body.match(/Last checked:\s*(\d{1,2}) ([A-Za-z]+) (\d{4})/);
  if (!lc || !MONTHS.includes(lc[2].toLowerCase())) {
    errors.push('no "Last checked: D Month YYYY." line. Fix: end the "How we checked" paragraph with it, using today\'s date, for example "Last checked: 18 November 2026."');
  } else {
    const d = new Date(Date.UTC(Number(lc[3]), MONTHS.indexOf(lc[2].toLowerCase()), Number(lc[1])));
    lastChecked = d.toISOString().slice(0, 10);
    const days = (now.getTime() - d.getTime()) / 86400000;
    if (!p.template && (days < -1.5 || days > 3)) errors.push(`"Last checked: ${lc[1]} ${lc[2]} ${lc[3]}" is not today. Fix: re-check the sources today and write today's date.`);
    facts.push(`last checked ${lastChecked}`);
  }

  // links
  if (badInternal.size) errors.push(`internal link${badInternal.size > 1 ? 's' : ''} to a page that does not exist in this checkout: ${[...badInternal].join(', ')}. Fix: link a real page (the money page, /pricing, /free-edits, /pilot, a /case-studies/ page or a /blog/ post) or remove the link.`);
  if (p.moneyPage && !moneyLinked) errors.push(`the body never links the money page. Fix: link ${p.moneyPage} once, in a sentence that reads fine without the link.`);
  else if (p.moneyPage) facts.push(`money page ${p.moneyPage} linked`);
  if (blogLinks.size < 2) warnings.push(`${blogLinks.size} links to other posts; the standard is 2 siblings from the same cluster. Say in the report if the cluster has none.`);

  // EchoPulse section and prices
  const isCost = /cost|price|pricing|rates/.test(p.slug);
  if (isCost && isAsset && !hasFit) errors.push('a cost post needs "## Where does EchoPulse Media fit?". Fix: add it (under 90 words, the fixed ladder sentence, the money page link).');
  if (hasFit) {
    const paid = [...prices].filter((x) => /\d/.test(x));
    const absent = paid.filter((x) => !fitPrices.has(x));
    if (isCost && absent.length) errors.push(`the EchoPulse section of a cost post must state the ladder (${paid.join(', ')}); missing ${absent.join(', ')}. Fix: use the fixed ladder sentence from BLOG-ENGINE.md section 6 with the numbers in lib/pricing.ts.`);
    if (p.service && askFor(p.service) === 'call' && /\bfootage\b/i.test(fitText)) errors.push(`the EchoPulse section mentions footage, but a ${p.service} post offers the call, not the free edits. Fix: remove the footage sentence.`);
    const fw = words(fitText);
    if (fw > 90) warnings.push(`the EchoPulse section is ${fw} words; keep it under 90.`);
  }
  const wrongPrices = [...fitPrices].filter((x) => !prices.has(x));
  if (wrongPrices.length) errors.push(`the EchoPulse section states ${wrongPrices.join(', ')}, which is not a price in lib/pricing.ts (${[...prices].join(', ')}). Fix: use the fixed ladder sentence only, and keep other vendors' prices out of that section.`);

  // title number must be in the post
  const bodyText = info.map((b) => b.text).join('\n');
  const missing = (p.title.match(/[$£€]?\d[\d,]*(?:\.\d+)?%?/g) || [])
    .map((t) => t.replace(/,$/, ''))
    .filter((t) => !/^20[2-3]\d$/.test(t))
    .filter((t) => !bodyText.includes(t));
  if (missing.length) errors.push(`the title promises ${missing.join(', ')} but the body never states ${missing.length > 1 ? 'them' : 'it'}. Fix: make the title match the numbers in the post.`);

  // number sourcing
  if (unsourced.length) {
    const msg = `${unsourced.length} of ${figureBlocks} paragraphs with a price or percentage name no source: ${unsourced.slice(0, 5).map((t) => `"${t}..."`).join('; ')}.`;
    const fix = ' Fix: in the same paragraph link the source or name it as it is listed under Sources ("Jobber\'s pricing page lists ..."), or say it is "our arithmetic" from the table above, or say the figure "could not be verified" and where you looked, or delete the number.';
    if (figureBlocks >= 4 && unsourced.length > figureBlocks / 2) errors.push(msg + fix);
    else warnings.push(msg + fix);
  }

  // ── the year in the title follows the re-check, never the calendar ──
  const ty = (p.title.match(/\b(20[2-3]\d)\b/) || [])[1];
  if (ty && lastChecked && !p.template) {
    const lcy = lastChecked.slice(0, 4);
    if (ty > lcy) errors.push(`the title says ${ty} but the post was last checked in ${lcy}. Fix: the year in a title is the year of the "Last checked:" line.`);
    else if (ty < lcy && !p.isRefresh) errors.push(`the title says ${ty} but the post is checked in ${lcy}. Fix: use ${lcy}.`);
    else if (ty < lcy) warnings.push(`the title says ${ty} and every figure was re-checked in ${lcy}. Change the year only if G4 shows every figure re-opened today; otherwise keep it and say why in the report.`);
  }

  // ── experience: only the owner's own notes, quoted word for word ──
  const notes = repoFacts().founderNotes;
  const MONTH_RE = /(\d{1,2}) ([A-Za-z]+) (\d{4})/;
  for (const b of p.blocks) {
    if (b._type !== 'block') continue;
    const text = b.children.map((c) => c.text).join('');
    if (!/lakshya/i.test(text)) continue;
    if (b.style === 'blockquote' && /^\s*Lakshya Soni\b/.test(text)) {
      const m = text.match(/^\s*Lakshya Soni[^:"“]*?(\d{1,2} [A-Za-z]+ \d{4}):\s*["“](.+)["”]\s*$/);
      const d = m && m[1].match(MONTH_RE);
      const iso = d && MONTHS.includes(d[2].toLowerCase())
        ? `${d[3]}-${String(MONTHS.indexOf(d[2].toLowerCase()) + 1).padStart(2, '0')}-${d[1].padStart(2, '0')}` : null;
      const note = iso && notes.find((n) => n.date === iso && n.quote === normQuote(m[2]));
      if (!m || !iso) errors.push(`a founder quote is not in the fixed form. Fix: write it as one blockquote: > **Lakshya Soni, founder of EchoPulse Media, 12 November 2026:** "<the Quote line of that note, word for word>"`);
      else if (!note) errors.push(`the founder quote dated ${m[1]} is not, word for word, the Quote line of a note dated ${iso} in content/blog-data/founder-notes.md. Fix: copy the Quote line exactly, or remove the quote. Nothing else counts as experience.`);
      else if (!note.public) errors.push(`the founder note dated ${iso} is marked "public: no". Fix: remove the quote; only notes marked "public: yes" may be quoted.`);
      else facts.push(`founder note ${iso} quoted`);
    } else {
      warnings.push(`"Lakshya" appears outside a founder quote: "${text.slice(0, 60).trim()}...". Experience goes only in the founder blockquote (section 4 step 8); a plain mention is fine only if it states no experience.`);
    }
  }

  // ── readability and scannability (section 5.3) ──
  // Calibrated on the three newest live posts (16 to 18 Nov 2026): average
  // sentence 14 to 16 words; 2 to 6 sentences over 35 words each; longest
  // paragraph 100 to 148 words. Warnings, except a paragraph over 160 words.
  const sentencesOf = (t) => t
    .replace(/\b(e\.g|i\.e|vs|Mr|Dr|St|Inc|Co|approx)\./gi, '$1')
    .replace(/(\d)\.(\d)/g, '$1$2')
    .split(/(?<=[.!?])["')\]]*\s+(?=["'(\[]?[A-Z0-9$£€])/)
    .map((s) => s.trim())
    .filter((s) => /[a-z]/i.test(s));
  const longParas = [];
  const hugeParas = [];
  const longSentences = [];
  let sentenceCount = 0;
  let sentenceWords = 0;
  {
    let sec = '';
    for (const b of p.blocks) {
      if (b._type !== 'block') continue;
      const text = b.children.map((c) => c.text).join('');
      if (b.style === 'h2') { sec = norm(text); continue; }
      if (/^h[1-4]$/.test(b.style) || b.style === 'blockquote' || /^sources/.test(sec)) continue;
      const w = words(text);
      if (!b.listItem && w > 160) hugeParas.push(`${w} words: "${text.slice(0, 50).trim()}..."`);
      else if (!b.listItem && w > 90) longParas.push(`${w} ("${text.slice(0, 40).trim()}...")`);
      for (const s of sentencesOf(text)) {
        const sw = words(s);
        sentenceCount++;
        sentenceWords += sw;
        if (sw > 35) longSentences.push(`${sw} ("${s.slice(0, 45).trim()}...")`);
      }
    }
  }
  const avgSentence = sentenceCount ? sentenceWords / sentenceCount : 0;
  facts.push(`avg sentence ${avgSentence.toFixed(1)} words`);
  if (hugeParas.length) errors.push(`paragraph over 160 words: ${hugeParas.slice(0, 3).join('; ')}. Fix: split it; a paragraph is 1 to 4 sentences.`);
  if (longParas.length) warnings.push(`${longParas.length} paragraph${longParas.length > 1 ? 's' : ''} over 90 words: ${longParas.slice(0, 4).join('; ')}. Split each, or use a list or the table.`);
  if (avgSentence > 18) warnings.push(`average sentence is ${avgSentence.toFixed(1)} words; the bar is under 18. Split the longest sentences.`);
  if (longSentences.length) warnings.push(`${longSentences.length} sentence${longSentences.length > 1 ? 's' : ''} over 35 words: ${longSentences.slice(0, 4).join('; ')}. Split each at "and", "which" or a comma.`);

  // every H2 is the buyer's question or a clear task
  const FIXED_H2 = /^(faq|frequently asked questions|sources|related)\b/;
  const TASK_H2 = /^(how to|how do|how much|worked example|example|checklist|template|step|steps|what to|which|when|where|who|why|what|is|are|can|should|do|does)\b/;
  const badH2 = info.filter((b) => b.kind === 'h2' && !/\?\s*$/.test(b.text.trim()) && !FIXED_H2.test(norm(b.text)) && !TASK_H2.test(norm(b.text))).map((b) => `"${b.text.trim()}"`);
  if (badH2.length) warnings.push(`H2 not a question or a task: ${badH2.slice(0, 5).join(', ')}. Fix: phrase it as the buyer's question ("How much does X cost?") or a task ("Worked example: ...", "Checklist: ...").`);

  // tables: units in the header, and the asset table names its date
  const MONEY = /[$£€]\s?\d/;
  const CURRENCY = /\b(USD|GBP|CAD|EUR|AUD|dollars?|pounds?)\b|[$£€]/i;
  const DATE_IN = /\b\d{1,2} (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{4}\b|\bchecked\b|\bas of\b/i;
  let firstTable = true;
  for (const b of p.blocks) {
    if (b._type !== 'table' || !b.rows?.length) continue;
    const head = b.rows[0].cells.map((c) => String(c));
    const bodyRows = b.rows.slice(1).map((r) => r.cells.map((c) => String(c)));
    const noUnit = [];
    head.forEach((h, i) => {
      if (i === 0) return;
      const cells = bodyRows.map((r) => r[i] || '');
      const money = cells.filter((c) => MONEY.test(c)).length;
      if (money && money >= cells.length / 2 && !CURRENCY.test(h)) noUnit.push(`"${h}"`);
    });
    if (noUnit.length) warnings.push(`table "${head.join(' | ').slice(0, 60)}": column${noUnit.length > 1 ? 's' : ''} ${noUnit.join(', ')} ${noUnit.length > 1 ? "hold" : "holds"} prices but the header names no currency. Fix: add it to the header ("Monthly price, USD").`);
    if (firstTable && isAsset && !p.template && !head.some((h) => DATE_IN.test(h))) warnings.push(`the first table's header names no date. Fix: put the check date in a header cell ("Monthly price, USD, 18 Nov 2026").`);
    firstTable = false;
  }

  // ── style-guide.md patterns that need the block structure ──
  {
    let sec = '';
    let heading = '';
    let firstUnder = false;
    for (const b of p.blocks) {
      if (b._type !== 'block') continue;
      const text = b.children.map((c) => c.text).join('').trim();
      if (/^h[2-4]$/.test(b.style)) { if (b.style === 'h2') sec = norm(text); heading = text; firstUnder = true; continue; }
      if (b.style !== 'normal' || b.listItem || !text) { firstUnder = false; continue; }
      const inFaq = isFaq(sec);
      const firstSentence = sentencesOf(text)[0] || text;
      if (!inFaq && /\?["')]*$/.test(firstSentence.trim())) errors.push(`a paragraph opens with a question: "${firstSentence.slice(0, 60)}". Fix: open with the answer or the fact; questions belong in headings and the FAQ.`);
      if (/^(overall|ultimately|in short|all in all|at the end of the day|to wrap (it )?up|wrapping up|in a nutshell|the key takeaway)\b/i.test(text)) errors.push(`a closing-summary paragraph: "${text.slice(0, 60)}". Fix: delete it; the post ends with the FAQ and Sources, not a recap.`);
      if (firstUnder && heading && !/\d/.test(firstSentence)) {
        const hw = new Set(norm(heading).split(' '));
        const sw = norm(firstSentence).split(' ').filter(Boolean);
        const fresh = sw.filter((w) => !hw.has(w) && !['a', 'an', 'the', 'is', 'are', 'it', 'this', 'that', 'of', 'to', 'and', 'in'].includes(w));
        const shared = sw.filter((w) => hw.has(w) && w.length > 3).length;
        // "No." or "Usually, yes." is a direct answer, not a restatement.
        if (sw.length >= 6 && shared >= 4 && fresh.length < 3) warnings.push(`the sentence under "${heading.slice(0, 50)}" restates the heading ("${firstSentence.slice(0, 60)}"). Fix: open with the answer itself.`);
      }
      firstUnder = false;
    }
  }

  // ── keyword stuffing: the exact target phrase, in headings and in the body ──
  if (p.targetQuery && !p.template) {
    const phrase = norm(p.targetQuery);
    const count = (t) => (norm(t).match(new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')) || []).length;
    const inHeadings = info.filter((b) => /^h[2-4]$/.test(b.kind) && count(b.text)).length;
    const inBody = info.filter((b) => b.kind !== 'table').reduce((n, b) => n + count(b.text), 0);
    const cap = 2 + Math.floor(p.wordCount / 400);
    facts.push(`exact target phrase ${inBody}x (cap ${cap}), in ${inHeadings} heading${inHeadings === 1 ? '' : 's'}`);
    if (inHeadings > 2) errors.push(`the exact phrase "${p.targetQuery}" is in ${inHeadings} headings. Fix: keep it in the first H2 and at most one more; write the other headings as the buyers' own questions.`);
    if (inBody > cap) errors.push(`the exact phrase "${p.targetQuery}" appears ${inBody} times; the cap for ${p.wordCount} words is ${cap}. Fix: name the thing plainly ("the site", "a listing video") after the first uses.`);
  }

  // ── images: the cover and the publisher's own chart are the only images ──
  const images = p.blocks.filter((b) => b._type === 'imageUrl');
  if (images.length && !p.template) {
    const msg = `${images.length} image line${images.length > 1 ? 's' : ''} in the body (${images.map((b) => b.url).slice(0, 2).join(', ')}). The engine adds no images: the publisher draws the chart from the table (chartColumn), and an image from elsewhere could be AI-made or unlicensed.`;
    if (p.isRefresh) warnings.push(`${msg} This came from the live post: keep it only if it is a real screenshot or photo with a source caption; otherwise delete the line.`);
    else errors.push(`${msg} Fix: delete the line.`);
  }

  // the first 100 words carry the target query's main term
  if (p.targetQuery) {
    const STOP = new Set(['a', 'an', 'the', 'for', 'in', 'of', 'to', 'and', 'or', 'on', 'per', 'vs', 'versus', 'how', 'much', 'does', 'do', 'is', 'are', 'what', 'which', 'best', 'cost', 'costs', 'price', 'prices', 'pricing', 'rates', 'rate', 'my', 'your', 'with', 'uk', 'us', 'usa']);
    const first100 = info.filter((b) => b.kind !== 'table' && !/^h[1-4]$/.test(b.kind)).map((b) => b.text).join(' ').split(/\s+/).slice(0, 100).join(' ').toLowerCase();
    const stem = (w) => (w.length >= 5 ? w.slice(0, 4) : w);
    const terms = p.targetQuery.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w && !STOP.has(w) && !/^20\d\d$/.test(w));
    const absent = terms.filter((w) => !new RegExp(`\\b${stem(w)}`).test(first100));
    if (terms.length && absent.length > (terms.length >= 4 ? 1 : 0)) warnings.push(`the first 100 words miss ${absent.map((w) => `"${w}"`).join(', ')} from the target query "${p.targetQuery}". Fix: name the subject in the searcher's words in the capsule.`);
  }

  return { errors, warnings, facts, lastChecked };
}

// ─── the chart: the main table's figures as a branded bar chart ─────────────

const fmtMoney = (sym, n) => `${sym}${n.toLocaleString('en-US', { maximumFractionDigits: n < 10 ? 2 : 0 })}`;

/**
 * Read the chart data out of the first table that has `column`.
 * A cell is charted when it holds one money figure, or "a to b". Anything
 * else ("Not published", "$49 + $29", "$720 plus setup") is listed as not charted.
 * @returns {{ skip: string } | { header, labelHeader, rows: {label, low, high, text}[], missing: string[], sym: string, tableIndex: number }}
 */
export function planChart(blocks, { column, label } = {}) {
  const want = String(column || '').trim().toLowerCase();
  const tableIndex = blocks.findIndex((b) => b._type === 'table' && (b.rows?.[0]?.cells || []).some((c) => String(c).trim().toLowerCase() === want));
  if (tableIndex === -1) return { skip: `no table has a header cell exactly "${column}".` };
  const table = blocks[tableIndex];
  const head = table.rows[0].cells.map((c) => String(c).trim());
  const col = head.findIndex((c) => c.toLowerCase() === want);
  let lab = label ? head.findIndex((c) => c.toLowerCase() === String(label).trim().toLowerCase()) : 0;
  if (lab === -1) return { skip: `chartLabel "${label}" is not a header of that table.` };
  if (lab === col) lab = col === 0 ? 1 : 0;
  const rows = [];
  const missing = [];
  const syms = new Set();
  for (const r of table.rows.slice(1)) {
    const name = String(r.cells[lab] || '').trim();
    const cell = String(r.cells[col] || '').trim();
    const nums = [...cell.matchAll(/([$£€])\s?(\d[\d,]*(?:\.\d+)?)\s?([kK]\b)?/g)].map((m) => {
      syms.add(m[1]);
      return Number(m[2].replace(/,/g, '')) * (m[3] ? 1000 : 1);
    });
    const range = /\bto\b/i.test(cell) && nums.length === 2;
    // "$720 plus setup" or "$1,500+" is not a whole figure: listed, not drawn.
    const partial = /\bplus\b|\+/i.test(cell);
    if (!name || !nums.length || partial || (nums.length > 1 && !range)) { if (name) missing.push(name); continue; }
    rows.push({ label: name, low: Math.min(...nums), high: Math.max(...nums), text: cell });
  }
  if (syms.size > 1) return { skip: `the column mixes currencies (${[...syms].join(' ')}).` };
  if (rows.length < 3) return { skip: `only ${rows.length} row${rows.length === 1 ? '' : 's'} of "${head[col]}" hold one figure or "a to b".` };
  if (rows.length > 14) return { skip: `${rows.length} rows is too many bars to read on a phone (max 14).` };
  rows.sort((a, b) => a.low - b.low || a.high - b.high);
  return { header: head[col], labelHeader: head[lab], rows, missing, sym: [...syms][0], tableIndex };
}

const chartFonts = {};
function chartFont(file) {
  if (!chartFonts[file]) {
    const buf = readFileSync(join(FONT_DIR, file));
    chartFonts[file] = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  }
  return chartFonts[file];
}

/** Text as SVG path outlines (no fonts needed where sharp runs), like render-thumbnail.mjs. */
function chartText(font, text, x, y, size, anchor = 'start') {
  const w = font.getAdvanceWidth(text, size);
  const x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
  const n = (v) => String(+v.toFixed(2));
  let d = '';
  for (const c of font.getPath(text, x0, y, size).commands) {
    if (c.type === 'M' || c.type === 'L') d += `${c.type}${n(c.x)} ${n(c.y)}`;
    else if (c.type === 'Q') d += `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
    else if (c.type === 'C') d += `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
    else if (c.type === 'Z') d += 'Z';
  }
  return { d, w };
}

/** Shorten to fit `maxW` at `size`, ending in "..." (three full stops, never a dash or an ellipsis glyph). */
function fitText(font, text, size, maxW) {
  if (font.getAdvanceWidth(text, size) <= maxW) return text;
  let t = text;
  while (t.length > 1 && font.getAdvanceWidth(`${t}...`, size) > maxW) t = t.slice(0, -1);
  return `${t.trimEnd()}...`;
}

/** Alt text and caption, written from the data so they can never disagree with the bars. */
export function chartWords(plan, { checked, source }) {
  const lo = plan.rows[0];
  const hi = [...plan.rows].sort((a, b) => b.high - a.high)[0];
  const n = plan.rows.length;
  const alt = `Bar chart of ${plan.header} for ${n} rows of the table above, from ${fmtMoney(plan.sym, lo.low)} (${lo.label}) to ${fmtMoney(plan.sym, hi.high)} (${hi.label})${plan.missing.length ? `. Not charted: ${plan.missing.join(', ')}` : ''}.`;
  const caption = `${plan.header}. Source: ${source || 'the pages listed under Sources'}, checked ${checked}. ${CHART_MARK}`;
  return { alt: alt.replace(/[‒–—―]/g, ','), caption: caption.replace(/[‒–—―]/g, ',') };
}

export function buildChartSvg(plan, { title, checked, source }) {
  const W = 1200;
  const M = 56;
  const ROW = 54;
  const bold = chartFont('Poppins-Bold.ttf');
  const semi = chartFont('Poppins-SemiBold.ttf');
  const reg = chartFont('Poppins-Regular.ttf');
  const top = 168;
  const H = top + plan.rows.length * ROW + (plan.missing.length ? 120 : 90);
  const labelW = 330;
  const x0 = M + labelW + 20;
  const valueW = 200;
  const barMax = W - M - valueW - x0;
  const max = Math.max(...plan.rows.map((r) => r.high));
  const parts = [];
  const path = (t, fill) => parts.push(`<path d="${t.d}" fill="${fill}"/>`);
  path(chartText(bold, fitText(bold, title, 34, W - 2 * M), M, 78, 34), '#0C0C0B');
  path(chartText(reg, fitText(reg, `${plan.header}, by ${plan.labelHeader.toLowerCase()}. Lowest first. Checked ${checked}.`, 19, W - 2 * M), M, 118, 19), '#6E6B63');
  plan.rows.forEach((r, i) => {
    const cy = top + i * ROW + ROW / 2;
    path(chartText(semi, fitText(semi, r.label, 19, labelW), M + labelW, cy + 7, 19, 'end'), '#0C0C0B');
    const wLow = Math.max(4, (r.low / max) * barMax);
    const wHigh = Math.max(wLow, (r.high / max) * barMax);
    if (wHigh > wLow) parts.push(`<rect x="${x0}" y="${cy - 15}" width="${wHigh.toFixed(1)}" height="30" rx="6" fill="#E8541A" fill-opacity="0.32"/>`);
    parts.push(`<rect x="${x0}" y="${cy - 15}" width="${wLow.toFixed(1)}" height="30" rx="6" fill="#E8541A"/>`);
    const v = r.high > r.low ? `${fmtMoney(plan.sym, r.low)} to ${fmtMoney(plan.sym, r.high)}` : fmtMoney(plan.sym, r.low);
    path(chartText(bold, v, x0 + wHigh + 12, cy + 7, 18), '#0C0C0B');
  });
  let y = top + plan.rows.length * ROW + 34;
  if (plan.missing.length) {
    path(chartText(reg, fitText(reg, `Not charted (no single published figure): ${plan.missing.join(', ')}`, 17, W - 2 * M), M, y, 17), '#6E6B63');
    y += 32;
  }
  parts.push(`<rect x="${M}" y="${y - 6}" width="${W - 2 * M}" height="1" fill="#0C0C0B" fill-opacity="0.12"/>`);
  path(chartText(reg, fitText(reg, `Source: ${source || 'the pages listed under Sources'}.${plan.rows.some((r) => r.high > r.low) ? ' Lighter bar: top of a published range.' : ''}`, 16, W - 2 * M - 260), M, y + 30, 16), '#6E6B63');
  const wm = chartText(bold, 'EchoPulse', W - M - 22, y + 32, 22, 'end');
  path(wm, '#0C0C0B');
  parts.push(`<circle cx="${W - M - 11}" cy="${y + 26}" r="4" fill="#E8541A"/>`);
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#F2EEE7"/>${parts.join('')}</svg>`, width: W, height: H };
}

export async function renderChart(plan, meta) {
  const { svg, width, height } = buildChartSvg(plan, meta);
  const png = await sharp(Buffer.from(svg), { density: 96 }).png({ compressionLevel: 9 }).toBuffer();
  return { png, width, height };
}

/** Where the chart goes: after the table, and after the cite block when it follows the table. */
export function insertChart(blocks, tableIndex, block) {
  let at = tableIndex + 1;
  const next = blocks[at];
  if (next && next._type === 'block' && next.style === 'blockquote' && /^\s*cite this:/i.test(next.children.map((c) => c.text).join(''))) at++;
  return [...blocks.slice(0, at), block, ...blocks.slice(at)];
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
    // Engine declarations. Stored so the next (memoryless) run can dedupe by
    // query, count clusters and order refreshes without re-reading bodies.
    targetQuery: post.targetQuery || undefined,
    moneyPage: post.moneyPage || undefined,
    whatsNew: post.whatsNew || undefined,
    lastChecked: post.lastChecked || undefined,
    // The text printed on the rendered cover, so a refresh can tell whether
    // the cover needs re-rendering.
    coverText: post.thumbnailText || undefined,
    // The chart settings, so --pull can write them back into a refresh file.
    chartColumn: post.chartColumn || undefined,
    chartLabel: post.chartLabel || undefined,
    chartSource: post.chartSource || undefined,
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

// ─── reading the live blog (no token needed) ─────────────────────────────────

async function makeReadClient() {
  const { createClient } = await import('@sanity/client');
  // Reads are public. A placeholder token (the cloud proxy injects the real
  // one) or no token both work; never fail a read for lack of one.
  return createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, useCdn: false, perspective: 'published' });
}

/** The owner's kill switch: while content/blog-data/PAUSE exists nothing is written to Sanity. */
export function paused() {
  return existsSync(join(DATA_DIR, 'PAUSE'));
}

/** Content words of a title or query, for comparing topics ("cost", "2026" and the like removed). */
function topicWords(t) {
  const STOP = new Set(['a', 'an', 'the', 'for', 'in', 'of', 'to', 'and', 'or', 'on', 'per', 'vs', 'versus', 'how', 'much', 'does', 'do', 'is', 'are', 'what', 'which', 'best', 'cost', 'costs', 'price', 'prices', 'pricing', 'rates', 'rate', 'my', 'your', 'with', 'real', 'prices', 'compared', 'guide', 'checklist', 'template', 'month', 'year', 'per', 'by', 'from', 'it', 'you', 'should', 'can']);
  return new Set(String(t || '').toLowerCase().replace(/\$[\d,]+/g, ' ').split(/[^a-z0-9]+/)
    .filter((w) => w && !STOP.has(w) && !/^\d+$/.test(w))
    .map((w) => (w.length > 4 ? w.replace(/(ing|ers|er|es|s)$/, '') : w)));
}

/**
 * Live posts that answer the same question. Refused when the content words of
 * the new title or target query overlap a live one by 75% or more, or when the
 * two differ by one word each (a city or trade swap: a doorway page).
 */
export function nearDuplicates(post, live) {
  const mine = [topicWords(post.targetQuery), topicWords(post.title)].filter((x) => x.size >= 2);
  const hits = [];
  for (const d of live) {
    if (d.slug === post.slug) continue;
    for (const theirs of [topicWords(d.targetQuery), topicWords(d.title)].filter((x) => x.size >= 2)) {
      let best = null;
      for (const m of mine) {
        const inter = [...m].filter((w) => theirs.has(w)).length;
        const overlap = inter / Math.min(m.size, theirs.size);
        const swap = m.size === theirs.size && m.size >= 3 && inter === m.size - 1;
        if (overlap >= 0.75 || swap) best = { overlap, swap };
      }
      if (best) { hits.push(`/blog/${d.slug} ("${d.title}")${best.swap ? ' differs by one word' : ` ${Math.round(best.overlap * 100)}% the same topic words`}`); break; }
    }
  }
  return hits;
}

/** YYYY-MM-DD on the run's calendar (Asia/Kolkata). */
function istDate(d) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d instanceof Date ? d : new Date(d));
}

/** "2026-11-19" -> "19 November 2026" */
function longDate(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return `${d} ${MONTHS[m - 1][0].toUpperCase()}${MONTHS[m - 1].slice(1)} ${y}`;
}

/** Monday of the ISO week that contains `today` (YYYY-MM-DD). */
function isoMonday(today) {
  const t = new Date(`${today}T00:00:00Z`);
  const dow = t.getUTCDay() || 7;
  return new Date(t.getTime() - (dow - 1) * 86400000).toISOString().slice(0, 10);
}

/** New posts live this ISO week and today, by publishedAt on the Asia/Kolkata calendar. null without network. */
async function newPostCounts(client, now) {
  let rows;
  try {
    rows = await client.fetch(`*[_type == "blog" && defined(slug.current) && defined(publishedAt)]{ "slug": slug.current, publishedAt }`);
  } catch {
    return null;
  }
  return countNewPosts(rows, now);
}

export function countNewPosts(rows, now) {
  const today = istDate(now);
  const monday = isoMonday(today);
  const week = rows.filter((r) => { const d = istDate(r.publishedAt); return d >= monday && d <= today; });
  return { week: week.length, day: week.filter((r) => istDate(r.publishedAt) === today).length, monday, today, slugs: week.map((r) => r.slug) };
}

/** Every live slug with its publish date, for checking /blog/ links. Returns null when the network is unavailable. */
async function liveSlugs(client) {
  try {
    const rows = await client.fetch(`*[_type == "blog" && defined(slug.current)]{ "slug": slug.current, publishedAt }`);
    return new Map(rows.map((r) => [r.slug, String(r.publishedAt || '9999').slice(0, 10)]));
  } catch {
    return null;
  }
}

function blogLinksIn(blocks, ownSlug) {
  const out = new Set();
  for (const b of blocks) {
    for (const d of b.markDefs || []) {
      const m = String(d.href || '').match(/^(?:https?:\/\/(?:www\.)?echopulse\.media)?\/blog\/([a-z0-9-]+)\/?(?:[?#].*)?$/i);
      if (m && m[1] !== ownSlug) out.add(m[1]);
    }
  }
  return [...out];
}

// ─── Portable Text -> markdown (for refreshing a live post) ──────────────────

function escapeMd(text) {
  return String(text).replace(/([\\*_`[\]<~])/g, '\\$1');
}

function spansToMd(block) {
  const defs = new Map((block.markDefs || []).map((d) => [d._key, d]));
  let out = '';
  for (const c of block.children || []) {
    const raw = String(c.text ?? '');
    if (!raw) continue;
    const lead = raw.match(/^\s*/)[0];
    const trail = raw.slice(lead.length).match(/\s*$/)[0];
    const core = raw.slice(lead.length, raw.length - trail.length);
    if (!core) { out += raw; continue; }
    const marks = c.marks || [];
    let t = marks.includes('code') ? `\`${core.replace(/`/g, "'")}\`` : escapeMd(core).replace(/\n/g, '  \n');
    if (marks.includes('em')) t = `_${t}_`;
    if (marks.includes('strong')) t = `**${t}**`;
    const link = marks.map((m) => defs.get(m)).find((d) => d && d._type === 'link' && d.href);
    if (link) t = `[${t}](${String(link.href).replace(/\)/g, '%29').replace(/\s/g, '%20')})`;
    out += lead + t + trail;
  }
  return out.trim();
}

/** Consecutive "a | b | c" paragraphs (written with BLOG_TABLES=pipes) become one table block. */
function foldPipeParagraphs(blocks) {
  const out = [];
  const cellsOf = (b) => {
    if (b._type !== 'block' || (b.style ?? 'normal') !== 'normal' || b.listItem) return null;
    const t = (b.children || []).map((c) => c.text).join('');
    const cells = t.split(' | ').map((x) => x.trim());
    return cells.length >= 2 ? cells : null;
  };
  for (let i = 0; i < blocks.length; i++) {
    const first = cellsOf(blocks[i]);
    if (!first) { out.push(blocks[i]); continue; }
    const rows = [first];
    let j = i + 1;
    for (; j < blocks.length; j++) {
      const c = cellsOf(blocks[j]);
      if (!c || c.length !== first.length) break;
      rows.push(c);
    }
    if (rows.length < 2) { out.push(blocks[i]); continue; }
    out.push({ _type: 'table', hasHeader: true, rows: rows.map((cells) => ({ cells })) });
    i = j - 1;
  }
  return out;
}

/**
 * @returns {{ markdown: string, unsupported: string[], shape: string[] }}
 * `shape` is one line per block (kind + text), used to prove the round trip.
 */
export function portableTextToMarkdown(content) {
  const blocks = foldPipeParagraphs(Array.isArray(content) ? content : []);
  const parts = [];
  const unsupported = [];
  const counters = [];
  let prevList = false;
  for (const b of blocks) {
    const isList = b._type === 'block' && Boolean(b.listItem);
    if (!isList) counters.length = 0;
    let md = null;
    if (b._type === 'block') {
      const text = spansToMd(b);
      const style = b.style ?? 'normal';
      if (isList) {
        const level = Math.max(1, b.level || 1);
        counters.length = level;
        counters[level - 1] = (counters[level - 1] || 0) + 1;
        md = `${'    '.repeat(level - 1)}${b.listItem === 'number' ? `${counters[level - 1]}.` : '-'} ${text}`;
      } else if (/^h[1-4]$/.test(style)) {
        md = `${'#'.repeat(Math.max(2, Number(style[1])))} ${text}`;
      } else if (style === 'blockquote') {
        md = `> ${text}`;
      } else if (style === 'normal') {
        if (!text) continue; // empty paragraphs carry nothing
        md = text.replace(/^(#{1,6}\s|>|[-+]\s|\d+[.)]\s)/, '\\$1').replace(/^\\(\d+)([.)])/, '$1\\$2');
      } else {
        unsupported.push(`text style "${style}"`);
        continue;
      }
    } else if (b._type === 'table') {
      const rows = (b.rows || []).map((r) => (r.cells || []).map((c) => String(c ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim() || ' '));
      if (!rows.length) continue;
      const width = Math.max(...rows.map((r) => r.length));
      const line = (r) => `| ${Array.from({ length: width }, (_, i) => r[i] ?? ' ').join(' | ')} |`;
      md = [line(rows[0]), `| ${Array(width).fill('---').join(' | ')} |`, ...rows.slice(1).map(line)].join('\n');
    } else if (b._type === 'imageUrl' && b.url) {
      md = `![${String(b.alt || '').replace(/[[\]]/g, '')}](${b.url}${b.caption ? ` "${String(b.caption).replace(/"/g, "'")}"` : ''})`;
    } else if (b._type === 'video' && b.url) {
      md = b.url;
    } else {
      unsupported.push(`block type "${b._type}"`);
      continue;
    }
    parts.push(isList && prevList ? `\n${md}` : `${parts.length ? '\n\n' : ''}${md}`);
    prevList = isList;
  }
  return { markdown: `${parts.join('')}\n`, unsupported, shape: shapeOf(blocks) };
}

function shapeOf(blocks) {
  const squash = (t) => String(t).replace(/\s+/g, ' ').trim();
  return blocks
    .map((b) => {
      if (b._type === 'block') {
        const text = squash((b.children || []).map((c) => c.text).join(''));
        if (!text && !b.listItem) return null;
        const style = b.style ?? 'normal';
        return `${b.listItem ? `${b.listItem}${b.level || 1}` : style === 'h1' ? 'h2' : style}: ${text}`;
      }
      if (b._type === 'table') return `table: ${(b.rows || []).map((r) => (r.cells || []).map(squash).join('|')).join(' / ')}`;
      return `${b._type}: ${b.url || ''}`;
    })
    .filter((x) => x != null);
}

/** `--pull <slug>`: write a live post into the queue as a refresh file. */
async function runPull(slug) {
  const client = await makeReadClient();
  const doc = await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0]{ _id, title, "slug": slug.current, excerpt, category, author, icp, service, postType, updateBy, targetQuery, moneyPage, whatsNew, lastChecked, coverText, chartColumn, chartLabel, chartSource, publishedAt, content }`,
    { slug },
  );
  if (!doc) throw new Error(`No live post has the slug "${slug}". Check the slug in the Sanity list (it is never guessed).`);
  const { markdown, unsupported, shape } = portableTextToMarkdown(doc.content);
  if (unsupported.length) {
    throw new Error(`"${slug}" cannot be refreshed safely: it contains ${[...new Set(unsupported)].join(', ')}, which markdown cannot express. Skip this post and name it in the report.`);
  }
  // Prove the markdown says what the live post says before anyone edits it.
  const back = shapeOf(markdownToPortableText(markdown).blocks);
  const diffAt = shape.findIndex((line, i) => line !== back[i]);
  if (diffAt !== -1 || shape.length !== back.length) {
    const i = diffAt === -1 ? Math.min(shape.length, back.length) : diffAt;
    throw new Error(
      `"${slug}" did not survive the round trip to markdown at block ${i + 1}.\n    live: ${shape[i] ?? '(nothing)'}\n    file: ${back[i] ?? '(nothing)'}\n  Skip this post and name it in the report.`,
    );
  }
  const fm = {
    refresh: true,
    title: doc.title || '',
    slug: doc.slug,
    excerpt: doc.excerpt || '',
    category: CATEGORIES.includes(doc.category) ? doc.category : 'Insights',
    author: doc.author || DEFAULT_AUTHOR,
    icp: doc.icp || undefined,
    service: doc.service || undefined,
    postType: doc.postType || 'asset',
    updateBy: doc.postType === 'trending' && doc.updateBy ? String(doc.updateBy).slice(0, 10) : undefined,
    targetQuery: doc.targetQuery || undefined,
    moneyPage: doc.moneyPage || undefined,
    whatsNew: doc.whatsNew || undefined,
    thumbnailText: doc.coverText || doc.title || undefined,
    chartColumn: doc.chartColumn || undefined,
    chartLabel: doc.chartLabel || undefined,
    chartSource: doc.chartSource || undefined,
  };
  for (const k of Object.keys(fm)) if (fm[k] === undefined) delete fm[k];
  const head =
    `# REFRESH FILE for the live post /blog/${doc.slug} (first published ${String(doc.publishedAt || '').slice(0, 10) || 'unknown'}).\n` +
    `# Publish it with:  npm run blog:publish -- --refresh --file <this file>\n` +
    `# Never change slug. category and author are not updated by a refresh.\n` +
    `# The cover is kept unless thumbnailText changes.\n`;
  mkdirSync(QUEUE_DIR, { recursive: true });
  const dest = join(QUEUE_DIR, `${new Date().toISOString().slice(0, 10)}-${doc.slug}.md`);
  if (existsSync(dest)) throw new Error(`${dest} already exists. Delete it first if you want a fresh copy of the live post.`);
  writeFileSync(dest, `---\n${head}${yaml.dump(fm, { lineWidth: -1, quotingType: '"', forceQuotes: false })}---\n\n${markdown}`);
  console.log(`Pulled /blog/${doc.slug} (${shape.length} blocks, round trip verified) to:\n  ${dest}`);
  console.log(`Stored on the live post: icp=${doc.icp || 'none'} service=${doc.service || 'none'} lastChecked=${doc.lastChecked || 'none'}`);
  console.log('Next: edit the file to the current standard, then `npm run blog:validate -- --file <file>`, then publish with --refresh.');
  return 0;
}

// ─── refresh order (Search Console export + what is live) ────────────────────

function newestGscFile() {
  if (!existsSync(DATA_DIR)) return null;
  const files = readdirSync(DATA_DIR).filter((f) => /^gsc-pages-\d{4}-\d{2}-\d{2}\.csv$/.test(f)).sort();
  return files.length ? files[files.length - 1] : null;
}

function readGscPages(file) {
  const rows = new Map();
  const lines = readFileSync(join(DATA_DIR, file), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).slice(1);
  for (const line of lines) {
    const cols = line.split(',');
    if (cols.length < 5) continue;
    const m = cols[0].match(/\/blog\/([a-z0-9-]+)\/?$/i);
    if (!m) continue;
    const clicks = Number(cols[1]);
    const impr = Number(cols[2]);
    const pos = Number(cols[4]);
    if (!Number.isFinite(impr) || !Number.isFinite(pos)) continue;
    // www and non-www rows for one post are added up; position is impression-weighted.
    const r = rows.get(m[1]) || { slug: m[1], clicks: 0, impr: 0, posSum: 0 };
    r.clicks += clicks; r.impr += impr; r.posSum += pos * impr;
    rows.set(m[1], r);
  }
  return [...rows.values()].map((r) => ({ ...r, pos: r.impr ? r.posSum / r.impr : 0, ctr: r.impr ? (100 * r.clicks) / r.impr : 0 }));
}

function guessIcp(slug, title) {
  const text = `${slug} ${title || ''}`.toLowerCase();
  for (const [key, words] of repoFacts().icpRules) if (words.some((w) => text.includes(w))) return key;
  return 'founders';
}

/** `--refresh-list`: print the refresh order so nobody sorts a CSV by hand. */
async function runRefreshList() {
  const now = new Date();
  // The run's calendar is Asia/Kolkata (the trigger works out the weekday there).
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
  if (paused()) console.log('PAUSED: content/blog-data/PAUSE exists. Publish and refresh nothing today; say "paused" in the report.\n');
  const file = newestGscFile();
  let gsc = [];
  if (file) {
    gsc = readGscPages(file);
    const age = Math.round((now.getTime() - new Date(`${file.slice(10, 20)}T00:00:00Z`).getTime()) / 86400000);
    console.log(`Search Console data: content/blog-data/${file} (${age} days old${age > 60 ? '; OLDER THAN 60 DAYS, say so in the report' : ''}), ${gsc.length} blog URLs.`);
  } else {
    console.log('Search Console data: none (no content/blog-data/gsc-pages-YYYY-MM-DD.csv). Tiers A and B are empty; use Tier T and Tier C. Never guess a position.');
  }
  let live = null;
  try {
    const client = await makeReadClient();
    live = await client.fetch(`*[_type == "blog" && defined(slug.current)]{ "slug": slug.current, title, icp, postType, updateBy, lastChecked, publishedAt, targetQuery }`);
  } catch (e) {
    console.log(`Could not read the live post list (${e.message.split('\n')[0]}). Showing Search Console rows only; check each slug is live before pulling it.`);
  }
  const bySlug = new Map((live || []).map((d) => [d.slug, d]));
  const dayAge = (iso) => (iso ? Math.floor((now.getTime() - new Date(iso).getTime()) / 86400000) : null);
  const gscBySlug = new Map(gsc.map((g) => [g.slug, g]));
  // A cost or pricing post: its prices go stale, so it is re-checked every
  // PRICE_RECHECK_DAYS counted from its last check, or from its publish date
  // when it has never been refreshed (the publish date is when it was checked).
  const isCostPost = (d) => COST_RE.test(`${d.slug.replace(/-/g, ' ')} ${d.title || ''} ${d.targetQuery || ''}`);
  const priceAge = (d) => dayAge(d.lastChecked || d.publishedAt);
  const isOld = (d) => d && String(d.publishedAt || '9999').slice(0, 10) < LEGACY_CUTOFF;
  const row = (tier, g, d) => {
    const lc = d?.lastChecked || null;
    const age = dayAge(lc);
    const cost = d && isCostPost(d);
    const pAge = d ? priceAge(d) : null;
    const due = cost ? pAge == null || pAge > PRICE_RECHECK_DAYS || age == null || age > DUE_DAYS : age == null || age > DUE_DAYS;
    const icp = d ? (ENGINE_ICPS.includes(d.icp) ? d.icp : guessIcp(d.slug, d.title)) : guessIcp(g.slug, '');
    const status = isOld(d) ? 'SKIP (legacy, owner is reviewing it for removal)'
      : tier === 'P' ? `DUE (price re-check: ${pAge} days since ${lc ? 'last check' : 'publish'}, limit ${PRICE_RECHECK_DAYS})`
      : due ? 'DUE' : `not due for ${DUE_DAYS - age} days`;
    return `| ${tier} | ${g ? g.slug : d.slug} | ${icp} | ${g ? g.impr : '-'} | ${g ? g.pos.toFixed(1) : '-'} | ${g ? g.clicks : '-'} | ${g ? `${g.ctr.toFixed(2)}%` : '-'} | ${lc || 'never'} | ${status} |`;
  };
  const head = '| Tier | Slug | icp | Impr. | Pos. | Clicks | CTR | Last checked | Status |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |';
  const isLive = (g) => !live || bySlug.has(g.slug);
  const tierT = (live || []).filter((d) => d.postType === 'trending' && d.updateBy && String(d.updateBy).slice(0, 10) <= today);
  const tierP = (live || [])
    .filter((d) => !tierT.includes(d) && !isOld(d) && isCostPost(d) && (priceAge(d) ?? 0) > PRICE_RECHECK_DAYS)
    .sort((a, b) => (gscBySlug.get(b.slug)?.impr || 0) - (gscBySlug.get(a.slug)?.impr || 0) || priceAge(b) - priceAge(a));
  const early = new Set([...tierT.map((d) => d.slug), ...tierP.map((d) => d.slug)]);
  const tierA = gsc.filter((g) => isLive(g) && !early.has(g.slug) && g.pos >= 5 && g.pos <= 15 && g.impr >= 100).sort((a, b) => b.impr - a.impr);
  const tierB = gsc.filter((g) => isLive(g) && !early.has(g.slug) && g.pos > 15 && g.impr >= 200).sort((a, b) => b.impr - a.impr);
  const ranked = new Set([...early, ...tierA.map((g) => g.slug), ...tierB.map((g) => g.slug)]);
  const tierC = (live || [])
    .filter((d) => !ranked.has(d.slug) && String(d.publishedAt || '9999').slice(0, 10) >= LEGACY_CUTOFF)
    .sort((a, b) => String(a.lastChecked || '').localeCompare(String(b.lastChecked || '')) || String(a.publishedAt || '').localeCompare(String(b.publishedAt || '')))
    .slice(0, 5);

  console.log(`\nRefresh order, top to bottom. Work the first DUE row that fits today's rule (BLOG-ENGINE.md section 8).\n`);
  console.log(head);
  for (const d of tierT) console.log(row('T', gscBySlug.get(d.slug), d));
  for (const d of tierP) console.log(row('P', gscBySlug.get(d.slug), d));
  for (const g of tierA) console.log(row('A', g, bySlug.get(g.slug)));
  for (const g of tierB) console.log(row('B', g, bySlug.get(g.slug)));
  for (const d of tierC) console.log(row('C', null, d));
  if (live) {
    // Weekday refreshes are capped at 2 between Monday and Saturday. Sunday has its own 2.
    const t = new Date(`${today}T00:00:00Z`);
    const dow = t.getUTCDay() || 7; // 1 = Monday ... 7 = Sunday
    const monday = new Date(t.getTime() - (dow - 1) * 86400000).toISOString().slice(0, 10);
    const done = live.filter((d) => d.lastChecked && d.lastChecked >= monday && d.lastChecked <= today
      // a refresh, not a new post: checked at least 2 days after it was first published
      && d.publishedAt && new Date(`${d.lastChecked}T00:00:00Z`).getTime() - new Date(d.publishedAt).getTime() > 2 * 86400000);
    console.log(`\nToday is ${today} (Asia/Kolkata), weekday ${dow}. Posts refreshed since Monday ${monday}: ${done.length}${done.length ? ` (${done.map((d) => d.slug).join(', ')})` : ''}.`);
    console.log(dow === 7 ? 'SUNDAY: refresh up to 3 posts today, Tier T rows first, then DUE rows from the top.' : `WEEKDAY REFRESHES LEFT THIS WEEK: ${Math.max(0, 2 - done.length)} of 2`);
    const counts = countNewPosts(live.filter((d) => d.publishedAt), now);
    console.log(`NEW POSTS THIS ISO WEEK: ${counts.week} of ${WEEK_CAP}${counts.week ? ` (${counts.slugs.join(', ')})` : ''}. NEW POSTS TODAY: ${counts.day} of ${DAY_CAP}.${counts.week >= WEEK_CAP ? ' WEEKLY CAP REACHED: no new post until Monday; refresh or publish nothing.' : ''}`);
    const gone = gsc.filter((g) => !bySlug.has(g.slug) && g.impr >= 100).map((g) => g.slug);
    if (gone.length) console.log(`In the export but no longer live (ignored): ${gone.join(', ')}`);
  }
  console.log(`SKIP rows were published before ${LEGACY_CUTOFF}: never refresh them and never link to them.`);
  console.log(`\nT = trending post past its updateBy. P = cost or pricing post not re-checked for ${PRICE_RECHECK_DAYS} days (most impressions first). A = position 5 to 15 with 100+ impressions. B = position above 15 with 200+ impressions. C = no data, oldest check first (top 5 shown). A post appears once, in its first tier.`);
  console.log('icp is the stored value, or the keyword guess for posts published before it was stored.');
  return 0;
}

async function publishOne(post, { client, dryRun, force, refresh, newCover, now }) {
  const publishedAt = post.publishAt ?? now;
  const doc = buildDocument(post, publishedAt);
  const url = `${SITE_URL}/blog/${post.slug}`;

  console.log(`\n▶ ${basename(post.filePath)}${refresh ? '  (refresh of a live post)' : ''}`);
  console.log(`  title:     ${post.title}`);
  console.log(`  slug:      ${post.slug}`);
  console.log(`  category:  ${post.category}  |  author: ${post.author}  |  ${post.wordCount} words, ${post.readTime} min`);
  console.log(`  standard:  ${post.legacy ? 'NOT ENFORCED (engine: false)' : 'enforced'}  |  ${post.facts.join(' | ')}`);
  for (const w of post.warnings) console.log(`  warning:   ${w}`);

  // The scheduled engine always publishes with the placeholder token (the
  // cloud proxy swaps in the real one). It may not opt a post out of the standard.
  if (!dryRun && post.legacy && process.env.SANITY_WRITE_TOKEN === 'proxy-injected') {
    throw new Error('This post sets "engine: false", so the engine standard was not enforced. An engine run cannot publish it. Fix: remove the "engine: false" line, run npm run blog:validate, and fix every error.');
  }

  // 0. every /blog/ link must be a live post (needs one public read)
  const reader = client ?? (await makeReadClient());
  const wanted = blogLinksIn(post.blocks, post.slug);
  if (wanted.length) {
    const live = await liveSlugs(reader);
    if (!live) {
      if (!dryRun) throw new Error('Could not read the live post list to check the /blog/ links. Nothing was published; retry once.');
      console.log('  links:     /blog/ links NOT checked (no network in this dry run)');
    } else {
      const dead = wanted.filter((s) => !live.has(s));
      if (dead.length) {
        throw new Error(`The post links to ${dead.map((s) => `/blog/${s}`).join(', ')}, which ${dead.length > 1 ? 'are' : 'is'} not live. Fix: copy the slug exactly from the Sanity list, or remove the link.`);
      }
      const old = wanted.filter((s) => live.get(s) < LEGACY_CUTOFF);
      if (old.length && !post.legacy) {
        throw new Error(`The post links to ${old.map((s) => `/blog/${s}`).join(', ')}, published before ${LEGACY_CUTOFF} and under review for removal. Fix: link a newer post from the same cluster instead, or remove the link.`);
      }
      console.log(`  links:     ${wanted.length} /blog/ link${wanted.length > 1 ? 's' : ''} checked, all live`);
    }
  }

  // 0a. quality over volume: at most WEEK_CAP new posts per ISO week, DAY_CAP a day
  if (!refresh && !force && !post.legacy) {
    const counts = await newPostCounts(reader, now);
    if (!counts) {
      if (!dryRun) throw new Error('Could not read the live post list to count this week\'s new posts. Nothing was published; retry once.');
      console.log('  cap:       NOT checked (no network in this dry run)');
    } else {
      console.log(`  cap:       ${counts.week} of ${WEEK_CAP} new posts this ISO week (since ${counts.monday}), ${counts.day} of ${DAY_CAP} today (${counts.today}, Asia/Kolkata)`);
      if (counts.week >= WEEK_CAP) throw new Error(`${counts.week} new posts are already live this ISO week (since Monday ${counts.monday}): ${counts.slugs.join(', ')}. The cap is ${WEEK_CAP} (BLOG-ENGINE.md section 1 rule 1). Publish nothing new; refresh instead or report "weekly cap reached".`);
      if (counts.day >= DAY_CAP) throw new Error(`${counts.day} new posts are already live today (${counts.today}, Asia/Kolkata). Never three in a day. Publish nothing more today.`);
    }
  }

  // 0a2. one live post per question: a near-duplicate is a refresh, never a new post
  if (!refresh && !force && !post.legacy) {
    let rows = null;
    try { rows = await reader.fetch(`*[_type == "blog" && defined(slug.current)]{ "slug": slug.current, title, targetQuery }`); } catch { /* reported below */ }
    if (!rows) {
      if (!dryRun) throw new Error('Could not read the live post list to check for duplicate topics. Nothing was published; retry once.');
      console.log('  topic:     duplicates NOT checked (no network in this dry run)');
    } else {
      const dupes = nearDuplicates(post, rows);
      if (dupes.length) throw new Error(`This topic is already live: ${dupes.slice(0, 3).join('; ')}. The refresh path wins (BLOG-ENGINE.md section 3 step 1): refresh that post instead, or pick a different question.`);
      console.log(`  topic:     no live post with the same topic words (${rows.length} checked)`);
    }
  }

  // 0b. the chart, drawn from the post's own table
  if (post.chart && process.env.BLOG_TABLES === 'pipes') {
    console.log('  chart:     skipped (BLOG_TABLES=pipes: the live site has no table renderer, so the chart would sit under pipe text)');
  } else if (post.chart) {
    const checked = longDate(post.lastChecked || new Date().toISOString().slice(0, 10));
    const { alt, caption } = chartWords(post.chart, { checked, source: post.chartSource });
    const { png, width, height } = await renderChart(post.chart, { title: post.title, checked, source: post.chartSource });
    mkdirSync(THUMBS_DIR, { recursive: true });
    const chartPath = join(THUMBS_DIR, `${post.slug}-chart.png`);
    writeFileSync(chartPath, png);
    let chartUrl = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/chart-uploaded-at-publish-${width}x${height}.png`;
    if (!dryRun) {
      const asset = await client.assets.upload('image', png, { filename: `${post.slug}-chart-${width}x${height}.png`, contentType: 'image/png', title: `${post.title}: chart` });
      if (!asset?.url) throw new Error('Sanity did not return a URL for the chart image. Nothing was published; retry once.');
      chartUrl = asset.url;
    }
    doc.content = insertChart(doc.content, post.chart.tableIndex, { _type: 'imageUrl', _key: makeKey(), url: chartUrl, alt, caption });
    console.log(`  chart:     ${chartPath} (${width}x${height}, ${post.chart.rows.length} bars)${dryRun ? '' : ` uploaded: ${chartUrl}`}`);
    console.log(`    alt:     ${alt}`);
    console.log(`    caption: ${caption}`);
  } else {
    console.log(`  chart:     none${post.chartColumn ? ' (chartColumn set, table not chart-able: see the warning above)' : ' (no chartColumn in the frontmatter)'}`);
  }

  const render = async () => {
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
    return png;
  };
  const upload = async (png) => {
    const asset = await client.assets.upload('image', png, {
      filename: `${post.slug}-1200x630.png`,
      contentType: 'image/png',
      title: post.title,
    });
    console.log(`  asset:     ${asset._id}`);
    // The `mainImage` field in the schema has no alt field, so none is set.
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  };
  const finish = (id, when, note) => {
    mkdirSync(PUBLISHED_DIR, { recursive: true });
    const date = when.toISOString().slice(0, 10);
    let dest = join(PUBLISHED_DIR, `${date}-${post.slug}.md`);
    if (existsSync(dest)) dest = join(PUBLISHED_DIR, `${date}-${post.slug}-${Date.now()}.md`);
    renameSync(post.filePath, dest);
    if (!existsSync(LOG_FILE)) {
      writeFileSync(LOG_FILE, '# Published blog posts\n\nAppended automatically by scripts/publish-blog.mjs. Do not edit by hand.\n\n| Date | Slug | Sanity id | URL |\n| --- | --- | --- | --- |\n');
    }
    appendFileSync(LOG_FILE, `| ${when.toISOString()} | ${post.slug}${note} | ${id} | ${url} |\n`);
    console.log(`  moved to:  ${dest}`);
    console.log(`  LIVE:      ${url}`);
    return { url, dest, id };
  };

  // ── safe refresh: patch the live document, keep everything else ──
  if (refresh) {
    let prior;
    try {
      prior = await reader.fetch(
        `*[_type == "blog" && slug.current == $slug && !(_id in path("drafts.**"))][0]{ _id, title, excerpt, publishedAt, category, author, coverText, "hasCover": defined(mainImage.asset) || defined(mainImageUrl), "blocks": count(content), content }`,
        { slug: post.slug },
      );
    } catch (e) {
      if (!dryRun) throw e;
      console.log(`  dry run: could not read the live post (${e.message.split('\n')[0]}). A real refresh reads it first and stops if the slug is not live.`);
      return { url, dryRun: true };
    }
    if (!prior) {
      throw new Error(`--refresh updates an existing post, and no live post has the slug "${post.slug}". Fix: use the slug exactly as it is live (run --pull <slug> to start from the live post), or publish without --refresh if this is a new post.`);
    }
    // The cover is re-rendered only when the text printed on it changes.
    const same = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
    // No fake freshness: a refresh that changes only the date is refused, so
    // "Updated" and dateModified only ever follow a real content change.
    const readable = (blocks) => shapeOf((blocks || []).filter((b) => !(b._type === 'imageUrl' && String(b.caption || '').endsWith(CHART_MARK))))
      .map((l) => l.replace(/(Last checked:|checked on|checked|as of|read)\s*\d{1,2} [A-Za-z]+ \d{4}/gi, '$1 <date>').replace(/\b\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b/g, '<date>'))
      .join('\n');
    if (same(prior.title, doc.title) && same(prior.excerpt, doc.excerpt) && readable(prior.content) === readable(doc.content)) {
      throw new Error(`The refresh of "${post.slug}" changes nothing but dates. A refresh that changes nothing a reader would notice is not published (BLOG-ENGINE.md section 8): re-check the figures, update what changed, or take the next row.`);
    }
    const oldCoverText = prior.coverText || prior.title;
    const coverChanges = newCover || !prior.hasCover || !same(post.thumbnailText, oldCoverText);
    const set = {
      title: doc.title, excerpt: doc.excerpt, readTime: doc.readTime, content: doc.content,
      postType: doc.postType,
    };
    for (const k of ['icp', 'service', 'targetQuery', 'moneyPage', 'whatsNew', 'lastChecked', 'chartColumn', 'chartLabel', 'chartSource']) if (doc[k]) set[k] = doc[k];
    if (doc.updateBy) set.updateBy = doc.updateBy;
    const unset = [...(doc.updateBy ? [] : ['updateBy']), ...['chartColumn', 'chartLabel', 'chartSource'].filter((k) => !doc[k])];

    console.log('  refresh plan:');
    console.log(`    keep:    _id ${prior._id}, slug, publishedAt ${String(prior.publishedAt || '').slice(0, 10)}, category "${prior.category ?? ''}", author "${prior.author ?? ''}", any field set in Studio`);
    console.log(`    title:   ${same(prior.title, doc.title) ? 'unchanged' : `"${prior.title}" -> "${doc.title}"`}`);
    const yearOf = (t) => (String(t || '').match(/\b(20[2-3]\d)\b/) || [])[1] || null;
    if (yearOf(prior.title) !== yearOf(doc.title)) console.log(`    year:    title year ${yearOf(prior.title) || 'none'} -> ${yearOf(doc.title) || 'none'}. Allowed only because every figure was re-opened today (G4 must say so).`);
    console.log(`    excerpt: ${same(prior.excerpt, doc.excerpt) ? 'unchanged' : 'changed'}`);
    console.log(`    body:    ${prior.blocks ?? 0} blocks -> ${doc.content.length} blocks`);
    console.log(`    set:     ${Object.keys(set).filter((k) => k !== 'content').join(', ')}${unset.length ? `; unset: ${unset.join(', ')}` : ''}`);
    console.log(`    cover:   ${coverChanges ? `RE-RENDERED (${newCover ? '--new-cover' : !prior.hasCover ? 'the post has no cover' : `cover text "${oldCoverText}" -> "${post.thumbnailText}"`})` : 'kept (cover text unchanged)'}`);
    console.log('    date:    Sanity sets _updatedAt on write; the site shows "Updated <date>"');

    let png = null;
    if (coverChanges) png = await render();
    if (dryRun) {
      console.log(`  dry run: nothing written, file not moved. Would refresh ${url}`);
      return { url, dryRun: true };
    }
    if (png) {
      set.mainImage = await upload(png);
      set.coverText = post.thumbnailText;
    }
    await client.patch(prior._id).set(set).unset(unset).commit();
    const check = await client.fetch(`*[_id == $id][0]{ title, "slug": slug.current, publishedAt }`, { id: prior._id });
    if (!check || check.title !== doc.title || check.slug !== post.slug || check.publishedAt !== prior.publishedAt) {
      throw new Error(`Sanity did not confirm the refresh of ${prior._id}; file left in queue.`);
    }
    const draft = await client.fetch(`*[_id == $id][0]._id`, { id: `drafts.${prior._id}` });
    if (draft) console.log(`  warning:   an unpublished draft of this post exists in Studio (${draft}). It was not touched; publishing it from Studio would undo this refresh. Name it in the report.`);
    console.log(`  refreshed: ${prior._id}`);
    return finish(prior._id, now, ' (refresh)');
  }

  // 1. thumbnail
  const png = await render();

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
        `If this is a new post, change the slug in the frontmatter. If you are updating that post, re-run with --refresh ` +
        `(it keeps the publish date, the cover and everything set by hand). --force replaces the whole document and is not for the engine.`,
    );
  }
  if (existing.length) console.log(`  --force: overwriting ${existing.map((e) => e._id).join(', ')}`);
  // When replacing a post that already exists, keep its _id and its original
  // publishedAt. Resetting publishedAt would make an old post claim to be new,
  // which Google treats as a trust problem, and a new _id would leave the old
  // doc behind.
  const prior = existing.find((e) => !String(e._id).startsWith('drafts.')) || existing[0];
  const priorFull = prior ? await client.fetch(`*[_id == $id][0]{ _id, publishedAt }`, { id: prior._id }) : null;
  if (priorFull) {
    doc._id = priorFull._id;
    if (priorFull.publishedAt) doc.publishedAt = priorFull.publishedAt;
  }

  // 3. upload the thumbnail
  doc.mainImage = await upload(png);

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
  return finish(doc._id, publishedAt, '');
}

// ─── modes ───────────────────────────────────────────────────────────────────

function runValidate(args) {
  let files;
  if (args.file) {
    const f = resolve(ROOT, args.file);
    if (!existsSync(f)) throw new Error(`File not found: ${args.file}`);
    files = [f];
  } else {
    files = listQueue();
    const example = join(QUEUE_DIR, '_example.md');
    if (existsSync(example)) files.push(example); // keep the example honest too
    if (args.published && existsSync(PUBLISHED_DIR)) {
      files.push(...readdirSync(PUBLISHED_DIR).filter((f) => f.endsWith('.md') && f !== 'LOG.md').sort().map((f) => join(PUBLISHED_DIR, f)));
    }
  }
  if (!files.length) {
    console.log('blog:validate — queue is empty, nothing to check.');
    return 0;
  }
  let failed = 0;
  const seen = new Map();
  for (const f of files) {
    try {
      const p = parsePost(f, { legacy: dirname(f) === PUBLISHED_DIR });
      if (seen.has(p.slug)) throw new Error(`${basename(f)}: slug "${p.slug}" is also used by ${seen.get(p.slug)}`);
      seen.set(p.slug, basename(f));
      const when = p.publishAt ? `scheduled ${p.publishAt.toISOString()}` : 'next free slot';
      console.log(`✓ ${basename(f)}  →  /blog/${p.slug}  (${p.blocks.length} blocks, ${p.wordCount} words, ${when})`);
      console.log(`    STANDARD ${p.legacy ? 'NOT ENFORCED (legacy or engine: false)' : 'ENFORCED'}: ${p.facts.join(' | ')}`);
      for (const w of p.warnings) console.log(`    warning: ${w}`);
    } catch (e) {
      failed++;
      console.error(`✗ ${e.message}`);
    }
  }
  console.log(`\n${files.length - failed}/${files.length} files valid.`);
  if (failed) console.log('Every line above that starts with " - " is an error. Each ends with its fix. Fix them all and run this again.');
  return failed ? 1 : 0;
}

async function runPublish(args) {
  const now = new Date();
  if (paused()) {
    if (!args.dryRun) throw new Error(`content/blog-data/PAUSE exists: the owner has paused the blog. Nothing was published. Report "paused" and stop.`);
    console.log('PAUSED: content/blog-data/PAUSE exists. This dry run continues, but a real publish or refresh is refused.');
  }
  let posts;
  if (args.file) {
    const f = resolve(ROOT, args.file);
    if (!existsSync(f)) throw new Error(`File not found: ${args.file}`);
    posts = [parsePost(f)];
    if (!args.dryRun && basename(f).startsWith('_')) throw new Error(`${basename(f)} is a template (its name starts with "_") and is never published. Write the post to its own file.`);
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
    results.push(await publishOne(post, { client, dryRun: args.dryRun, force: args.force, refresh: args.refresh, newCover: args.newCover, now }));
    if (!args.dryRun) await pingIndexNow(post.slug);
  }

  console.log(`\n${args.dryRun ? 'Dry run complete' : args.refresh ? 'Refreshed' : 'Published'}: ${results.length} post(s).`);
  for (const r of results) console.log(`  ${r.url}`);
  return 0;
}

// ─── main ────────────────────────────────────────────────────────────────────

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const args = parseArgs(process.argv.slice(2));
    let code;
    if (args.validate) code = runValidate(args);
    else if (args.pull != null) code = await runPull(args.pull);
    else if (args.refreshList) code = await runRefreshList();
    else code = await runPublish(args);
    process.exit(code);
  } catch (e) {
    console.error(`\n✗ ${e.message}`);
    if (!e.validation && process.env.DEBUG) console.error(e.stack);
    process.exit(1);
  }
}
