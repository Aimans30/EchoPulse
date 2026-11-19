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
   Files that start with `_` are ignored, so the example never gets published. The example shows
   the format only: the engine follows `content/BLOG-ENGINE.md`, not the example's content.
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
npm run blog:publish -- --dry-run --file content/blog-queue/_example.md   # writes nothing
npm run blog:thumbnail -- "Any title" out.png "Category"              # just the image
```

## Frontmatter

```yaml
---
title: "Post title"                 # required. Engine posts: 60 chars or fewer. Also the page <h1> and the OG title
slug: post-title                    # optional; derived from the title. Lowercase, hyphens only. Cost posts: contains cost, price, pricing or rates
excerpt: "One or two sentences."    # required. Engine posts: 130 to 160 chars. Meta description + card text
category: Real Estate               # required, one of the list below
author: Lakshya Soni                # optional, defaults to Lakshya Soni
publishAt: 2026-12-01T06:30:00Z     # optional ISO date; the post waits until it has passed
icp: real-estate                    # engine posts: required. real-estate | founders | coaches | dtc | business-owners
service: video-editing              # engine posts: required. video-editing | linkedin-ghostwriting | blog-production | ad-creatives | websites-funnels | automations | apps-software
postType: asset                     # engine posts: required. asset (evergreen) | trending (news-driven, must set updateBy)
updateBy: 2026-12-15                # trending only: date by which the engine rewrites it into an asset
targetQuery: "real estate agent website cost"   # engine posts: required. The one query the post answers, in the searcher's words
moneyPage: /real-estate/websites-funnels        # engine posts: required. /<icp>/<service> if that page exists, else /services/<service>
whatsNew: "Year-one totals for 10 vendors, from their own pricing pages on 16 November 2026."  # engine posts: required, 20 to 160 chars
thumbnailText: "The post title, or a shorter version of it" # optional, 30 to 60 chars, shown on the cover; defaults to the title
thumbnailSub: "Per video vs monthly plans" # optional, max 40 chars, the angle in one line under the title
tags: [video, real estate]          # optional, free text, not stored
readTime: 6                         # optional minutes; computed from the word count if omitted
chartColumn: "Year one, USD (our arithmetic)"   # optional: the main table's header (exact) to draw as a bar chart
chartLabel: "Vendor"                # optional: the column that names each bar; default the first column
chartSource: "10 vendors' own pricing pages"   # optional, max 80 chars: the source line on the chart and caption
refresh: true                       # written by --pull on a refresh file; leave it. A live slug is never changed
engine: false                       # hand-written posts only: report the engine standard as warnings instead of errors. The engine never sets this
---
```

Categories (must match exactly, these are the labels `lib/blog.ts` uses):
`Real Estate`, `AI Marketing`, `Funnels`, `Video`, `Authority`, `Content Ops`, `SEO`, `Social`,
`Automation`, `Strategy`, `Company`, `Insights`.

What is stored on the Sanity document: `icp`, `service`, `postType`, `updateBy`, `targetQuery`,
`moneyPage`, `whatsNew`, `chartColumn`, `chartLabel`, `chartSource`, plus `lastChecked` (read from
the `Last checked: D Month YYYY.` line in the body; the page's `dateModified` comes from it) and
`coverText` (the text on the rendered cover). The site reads the stored `icp` and
`service` to choose a post's call to action and its money-page link (`audienceFor` in
`lib/blogLinks.ts`); posts published before those fields existed fall back to keywords in the
slug and title. The last five fields are not in the Studio schema yet, so Studio lists them as
unknown fields until they are added to `blog-for-echopulse/schemaTypes/blog.ts`. That is harmless.

There is no `ask` field: the ask follows the service (video-editing and ad-creatives get the free
sample, everything else gets the 15-minute call).

## The engine standard and the validator

`npm run blog:validate` checks every file in this folder. `npm run blog:validate -- --file <path>`
checks one. Each error line ends with its fix. For engine posts (every file here that does not say
`engine: false`) these fail validation:

- an en dash or em dash anywhere in the file;
- title over 60 characters; excerpt outside 130 to 160; a number in the title that is not in the body;
- missing `icp`, `service`, `postType`, `targetQuery`, `moneyPage` or `whatsNew`; a `moneyPage` that is
  not the selling page for that `icp` and `service`; a body that never links the `moneyPage`;
- a first paragraph that is not 40 to 75 words, has no number, or mentions EchoPulse;
- asset posts: no table, no `> **Cite this:**` block with the post's own URL, under 1,200 words;
  trending posts: under 600 words;
- no `## FAQ` with at least 4 `###` questions; no `## Sources` with at least 4 external links
  (2 for trending); no `Last checked: D Month YYYY.` line dated today;
- a cost post (cost, price, pricing, rates or "how much" in the title or `targetQuery`) whose slug
  has none of those words, or that has no `## Where does EchoPulse Media fit?` with the ladder;
- in the EchoPulse section: a price that is not in `lib/pricing.ts`, or footage on a post whose
  service gets the call; next to the word EchoPulse anywhere: a notice period, or a turnaround
  other than 48 hours;
- "I ..." sentences, experience and client claims ("in our experience", "our clients", "we tested"),
  a `cal.com` link, the retired tier, Clutch, and the banned phrases in BLOG-ENGINE.md section 5.3;
- an internal link to a page that does not exist in the checkout; more than half of the paragraphs
  with a price or percentage naming no source;
- the banned phrases and constructions in `content/blog-data/style-guide.md` part 1, a paragraph that
  opens with a question or a closing summary, a paragraph over 160 words;
- the exact `targetQuery` phrase in more than 2 headings or more than 2 + 1 per 400 words; under 800
  words (asset); any image line in a new post (the publisher draws the only chart);
- a year in the title that is not the year of the `Last checked:` line;
- a founder quote that is not, word for word, the `Quote:` line of a `public: yes` note in
  `content/blog-data/founder-notes.md` with the same date.

Warnings (fix, or explain in the run report): filler words, fewer than 2 links to sibling posts,
an H2 that is neither a question nor a task, a long EchoPulse section, over 2,400 words, paragraphs
over 90 words, an average sentence over 18 words, sentences over 35 words, a price column with no
currency in its header, a first table with no date in its header, a sentence that restates its
heading, first 100 words missing the target query's words, a `chartColumn` that cannot be drawn.
The thresholds were calibrated on the three newest live posts (16 to 18 November 2026): none of
them fails a new check; each gets a few of the new warnings.

At publish time the publisher also checks that every `/blog/` link is a live post published on or
after 1 July 2026, refuses a new post when 4 new posts are already live this ISO week or 2 today
(Asia/Kolkata), refuses a new post whose title or `targetQuery` repeats a live post's topic,
refuses a `--refresh` that changes nothing but dates, and refuses everything while
`content/blog-data/PAUSE` exists.

## The chart

With `chartColumn` set, the publisher reads that column of the first table that has it, draws a
1200 px wide bar chart (Poppins outlines through `opentype.js` and `sharp`, the same tooling as the
cover, no new dependencies), uploads it to Sanity as an image asset and inserts an `imageUrl` block
after the table (after the cite block when one follows it), with alt text built from the data and the
caption "<column>. Source: <chartSource>, checked <date>. Chart by EchoPulse Media from the table
above." A cell is drawn when it holds one figure or "a to b" in one currency; anything else is
listed under the bars as not charted. Fewer than 3 drawable rows, more than 14, or mixed currencies:
the chart is skipped with a warning and the post publishes without it. A refresh drops the old chart
(found by its caption) and draws a new one. `--dry-run` writes the PNG to `.thumbs/<slug>-chart.png`.

Files in `content/blog-published/` and files whose name starts with `_` are checked as legacy: the
standard is printed as warnings (`npm run blog:validate -- --published` includes the published folder).

## Refreshing a live post

```
node scripts/publish-blog.mjs --refresh-list                 # refresh order (tiers T, P, A, B, C), caps, PAUSE
node scripts/publish-blog.mjs --pull <slug>                  # live post -> content/blog-queue/<today>-<slug>.md, round trip verified
npm run blog:validate -- --file content/blog-queue/<file>.md
npm run blog:publish -- --refresh --dry-run --file content/blog-queue/<file>.md   # prints what is kept and what changes
SANITY_WRITE_TOKEN=sk... npm run blog:publish -- --refresh --file content/blog-queue/<file>.md
```

`--refresh` patches the title, excerpt, body, read time and the engine fields on the live
document. It keeps the slug, `publishedAt`, category, author and anything set by hand in Studio,
and keeps the existing cover unless `thumbnailText` differs from the text on the cover (or
`--new-cover` is passed). Sanity bumps `_updatedAt`, which the site shows as "Updated <date>".
`--force` still exists and replaces the whole document and its cover; the engine never uses it.

Search Console data for the refresh order lives in `content/blog-data/` (see the README there).

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
the workflow fails loudly. A slug that already exists in Sanity is refused: use `--refresh` to
update that post (above).

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

## IndexNow ping

After a real publish or `--refresh`, the publisher pings IndexNow (api.indexnow.org) with the post URL and `/blog`, so Bing, and ChatGPT search through it, learns of the change at once. It fails soft (one "IndexNow ping skipped" line, exit code unchanged) and is skipped for `--dry-run` or `INDEXNOW=off`.
The key file lives in `public/` and its name must match `INDEXNOW_KEY` at the top of `scripts/publish-blog.mjs`.
Owner, once: verify echopulse.media in Bing Webmaster Tools (bing.com/webmasters) so Bing trusts the pings.
