# Blog queue

Drop a markdown file in this folder, push to the branch GitHub Actions watches, and the
post goes live on echopulse.media one per day. No Sanity Studio clicks needed.

```
content/blog-queue/        <- posts waiting to be published (you write here)
content/blog-published/    <- posts the bot has published (moved automatically) + LOG.md
scripts/publish-blog.mjs   <- the publisher
```

## Day to day

1. Copy `_example.md` to a new file in this folder, e.g. `2026-11-12-why-agents-need-video.md`.
   Files that start with `_` are ignored, so the example never gets published.
2. Fill in the frontmatter (below) and write the post in normal markdown.
3. Run `npm run blog:validate` locally if you want a check first (it runs on every PR too).
4. Push. Every day at 06:30 UTC (12:00 IST) the workflow publishes the **oldest due** file:
   files with a `publishAt` date are ordered by that date and wait until it has passed;
   files without one are published in filename order. Put a date prefix on filenames to
   control the order.
5. The bot moves the file to `content/blog-published/<date>-<slug>.md`, appends a line to
   `content/blog-published/LOG.md`, and commits that back. The live URL is
   `https://echopulse.media/blog/<slug>`; the site re-reads Sanity every 60 seconds.

To publish immediately: GitHub > Actions > "Publish blog post" > Run workflow (set `max` to
publish more than one, tick `dry_run` to rehearse). Or locally:

```
SANITY_WRITE_TOKEN=sk... npm run blog:publish                       # oldest due post
SANITY_WRITE_TOKEN=sk... npm run blog:publish -- --file content/blog-queue/x.md
npm run blog:publish -- --dry-run --file content/blog-queue/_example.md   # no network
npm run blog:thumbnail -- "Any title" out.png "Category"              # just the image
```

## Frontmatter

```yaml
---
title: "Post title"                 # required, <= 120 chars; also the page <h1> and the OG title
slug: post-title                    # optional; derived from the title. Lowercase, hyphens only
excerpt: "One or two sentences."    # required, <= 160 chars; meta description + card text
category: Real Estate               # required, one of the list below
author: Lakshya Soni                # optional, defaults to Lakshya Soni
publishAt: 2026-12-01T06:30:00Z     # optional ISO date; the post waits until it has passed
icp: real-estate                    # optional: real-estate | founders | coaches | dtc | business-owners | saas | home-services
service: video-editing              # optional: video-editing | linkedin-ghostwriting | blog-production | ad-creatives | websites-funnels | automations | apps-software
tags: [video, real estate]          # optional, free text
thumbnailText: "Short punchy title" # optional, used on the generated image instead of the title
readTime: 6                         # optional minutes; computed from the word count if omitted
---
```

Categories (must match exactly, these are the labels `lib/blog.ts` uses):
`Real Estate`, `AI Marketing`, `Funnels`, `Video`, `Authority`, `Content Ops`, `SEO`, `Social`,
`Automation`, `Strategy`, `Company`, `Insights`.

`icp`, `service` and `tags` are validated and kept for future use (internal linking, filtering);
the Sanity `blog` schema does not store them yet.

## Body: what markdown is supported

| You write | It becomes |
| --- | --- |
| `## Heading`, `### Sub`, `#### Minor` | h2 / h3 / h4 blocks (h2 + h3 feed the table of contents). `# H1` is downgraded to h2 |
| paragraphs, `**bold**`, `_italic_`, `` `code` `` | spans with marks |
| `[text](https://...)` | link mark |
| `- item` / `1. item` (nested ok) | bullet / numbered list items |
| `> quote` | blockquote |
| `![alt](https://host/image.jpg "caption")` on its own line | `imageUrl` block (must be an absolute https URL) |
| a YouTube / Vimeo / Loom URL on its own line | `video` block (embedded player) |
| pipe table with a header row | `table` block (scrolls sideways on phones) |

Not supported: raw HTML, fenced code blocks (emitted as inline code), horizontal rules
(dropped), footnotes. The converter prints a warning for anything it had to flatten.

## What the publisher does

For each post: validate frontmatter -> convert markdown to Portable Text -> render a 1200x630
thumbnail (dark brand card with the title and category) -> upload it to Sanity as an image
asset -> `createOrReplace` the published document `blog-<slug>` (never a draft) -> verify it
exists -> move the file + append to LOG.md. If any step fails the file stays in the queue and
the workflow fails loudly. A slug that already exists in Sanity is refused unless `--force`.

## One-time setup

1. **Sanity token**: sanity.io/manage > project `qkz53g2a` > API > Tokens > Add token, role
   **Editor**. Add it to the GitHub repo as a secret named `SANITY_WRITE_TOKEN`
   (Settings > Secrets and variables > Actions).
2. **Deploy the schema** once so Studio knows the new `table` block: in `blog-for-echopulse/`
   run `npx sanity schema deploy` (or just redeploy the Studio). The publisher writes tables
   regardless, but Studio shows "unknown type" until the schema is deployed.
3. **Optional `DEPLOY_HOOK_URL`** secret: the blog pages use ISR (`revalidate = 60`), so new
   posts appear within a minute without a deploy. The sitemap and RSS refresh within 10
   minutes. If you ever switch the blog to fully static, or want a guaranteed full rebuild,
   add a Vercel/Netlify deploy hook URL as this secret and the workflow will call it after
   each publish.
4. The workflow commits with the built-in `GITHUB_TOKEN`. If the branch has protection rules
   that block it, allow the bot or use a PAT.
