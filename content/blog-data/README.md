# content/blog-data

Data the blog engine reads. The scheduled run cannot write here; the owner
commits these files.

| File | Who reads it | What it is |
| --- | --- | --- |
| `cluster-map.md` | The engine, in full, every run | Selling pages, the live topics for each, and the gaps to write |
| `gsc-pages-YYYY-MM-DD.csv` | `node scripts/publish-blog.mjs --refresh-list` (the engine never reads it by hand) | Search Console > Performance > Pages export, unchanged, export date in the name. Columns: `Top pages,Clicks,Impressions,CTR,Position`. The newest file by name is used. Replace it every month or two; older than 60 days is reported as stale |
| `gsc-queries-YYYY-MM-DD.csv` | The engine, optional | The Queries export from the same screen. If present, target queries and title wording come from it. Not yet committed |

Not read during a run: the notes below.

## Why the answer-engine rules in BLOG-ENGINE.md exist

Confirmed 18 November 2026 through web search results only; the primary pages
could not be opened from the drafting session, so a reviewer should re-read
them.

- Google Search Central, "AI features and your website": no special markup,
  llms.txt or chunking is needed; indexed, snippet-eligible, unique and
  useful content is. developers.google.com/search/docs/appearance/ai-features
- Microsoft Advertising blog, "Optimizing your content for inclusion in AI
  search answers" (8 October 2025): question-and-answer phrasing, concise
  self-contained answers. Basis for the capsule, question H2s and FAQ.
- Aggarwal et al., "GEO: Generative Engine Optimization", KDD 2024
  (arxiv.org/abs/2311.09735): statistics, quotations and cited sources raised
  visibility in a benchmark; keyword stuffing did not. Basis for sourced
  numbers and linking out.
- Ahrefs, AI Overview brand visibility study of 75,000 brands: brand mentions
  on other sites correlated with AI visibility more than backlinks.
  Correlation only. Basis for the cite block and the outreach list.
- The 40 to 75 word capsule band is a house convention so that it can be
  checked by the validator. Vendor studies disagree on answer length.
- Query-level data, backlink data and AI-citation data were not available
  when the spec was written. Nothing in the spec depends on them.
