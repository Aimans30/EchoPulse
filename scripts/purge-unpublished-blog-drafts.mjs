#!/usr/bin/env node
/**
 * HARD-DELETE the retired blog posts from Sanity.
 *
 * ─── Read this before running ────────────────────────────────────────────────
 *
 * On 2026-07-11 we unpublished 65 near-duplicate / off-topic blog posts. They
 * are gone from the live site already (the Sanity client uses
 * perspective: 'published'), and next.config.ts 301s every one of their URLs to
 * the surviving post for that topic cluster. So the SEO job is DONE.
 *
 * This script is the optional last step: it permanently destroys the draft
 * documents those posts became. Running it does NOT improve rankings. The only
 * reason to run it is to stop the drafts cluttering your Sanity Studio.
 *
 * IT IS NOT REVERSIBLE. There is no local backup — the Sanity export endpoint
 * was unreachable from the agent sandbox, so nothing was archived. Once these
 * documents are deleted, the copy is gone.
 *
 * Strongly recommended: take a real backup first, which takes one command:
 *
 *     npx sanity@latest dataset export production ./backup-production.tar.gz
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *
 *     # 1. Dry run (default) — prints what WOULD be deleted, changes nothing.
 *     SANITY_TOKEN=sk... node scripts/purge-unpublished-blog-drafts.mjs
 *
 *     # 2. For real.
 *     SANITY_TOKEN=sk... node scripts/purge-unpublished-blog-drafts.mjs --yes
 *
 * The token needs Editor/write permissions. It is in .env.sanity at the repo
 * root of the EchoPulse folder — do not commit it.
 */

import { createClient } from '@sanity/client';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qkz53g2a';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_TOKEN;

const CONFIRMED = process.argv.includes('--yes');

if (!TOKEN) {
  console.error('✗ SANITY_TOKEN is not set. Export it and re-run:\n');
  console.error('    SANITY_TOKEN=sk... node scripts/purge-unpublished-blog-drafts.mjs\n');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
  perspective: 'raw', // we need to see drafts
});

/**
 * Target ONLY blog drafts that have no published counterpart.
 *
 * That condition is the whole safety mechanism. A post you're actively editing
 * has BOTH a draft and a published version, so it is excluded. A post that was
 * unpublished has ONLY a draft — that's what we delete.
 *
 * _type is pinned to "blog" so the 13 `post` documents (the MagicBnB / STR
 * content, which lives in this same dataset but is not part of echopulse.media)
 * are never touched.
 */
const QUERY = `
  *[
    _type == "blog"
    && _id in path("drafts.**")
    && !defined(*[_id == string::split(^._id, "drafts.")[1]][0])
  ]{ _id, title, "slug": slug.current }
`;

const orphanDrafts = await client.fetch(QUERY);

if (orphanDrafts.length === 0) {
  console.log('Nothing to delete — no orphaned blog drafts found.');
  process.exit(0);
}

console.log(`\nFound ${orphanDrafts.length} unpublished blog draft(s):\n`);
for (const doc of orphanDrafts) {
  console.log(`  ${doc.slug ?? '(no slug)'}`);
}

if (!CONFIRMED) {
  console.log(`\n── DRY RUN ──────────────────────────────────────────────────`);
  console.log(`Nothing was deleted. Re-run with --yes to permanently delete`);
  console.log(`these ${orphanDrafts.length} documents. This cannot be undone.\n`);
  process.exit(0);
}

console.log(`\nDeleting ${orphanDrafts.length} documents...`);

// One transaction: all succeed or all fail. Avoids a half-purged dataset.
const tx = orphanDrafts.reduce((t, doc) => t.delete(doc._id), client.transaction());

try {
  await tx.commit();
  console.log(`✓ Deleted ${orphanDrafts.length} documents permanently.\n`);
} catch (err) {
  console.error('✗ Delete failed, no documents were removed:');
  console.error(err.message);
  process.exit(1);
}
