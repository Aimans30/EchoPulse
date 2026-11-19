# content/blog-data

Data the blog engine reads. The scheduled run cannot write here; the owner
commits these files.

| File | Who reads it | What it is |
| --- | --- | --- |
| `cluster-map.md` | The engine, in full, every run | Selling pages, the live topics for each, and the gaps to write |
| `style-guide.md` | The engine every run; the editor reviewer | Banned phrases and patterns (validator), judgement rules (reviewer), before/after rewrites, the SEO safety rules |
| `founder-notes.md` | The engine every run; the validator | Lakshya's dated, real observations. The only source of first-hand experience a post may quote |
| `editor-rubric.md` | The editor reviewer at gate G9 | The independent review: source re-check, buyer read, six scored criteria with anchors, pass mark, verdict format |
| `run-report.md` | The engine, before reporting | The run report template: gap table, gates, editor verdict, founder note, distribution kit |
| `PAUSE` | The engine and the publisher | Kill switch. Create an empty file named `PAUSE` here and push: the engine publishes and refreshes nothing until it is deleted |
| `gsc-pages-YYYY-MM-DD.csv` | `node scripts/publish-blog.mjs --refresh-list` (never read by hand) | Search Console > Performance > Pages export, unchanged, export date in the name. Columns: `Top pages,Clicks,Impressions,CTR,Position`. The newest file by name is used. Replace it every month or two; older than 60 days is reported as stale |
| `gsc-queries-YYYY-MM-DD.csv` | The engine, optional | The Queries export from the same screen. If present, target queries and title wording come from it. Not yet committed |

Not read during a run: the notes below.

## Sources behind the engine's rules (checked 19 November 2026)

Confirmed through web search results on 19 November 2026. The drafting
session could not open developers.google.com or seroundtable.com (outside its
network), so wording marked "via search" is as quoted by search results and
secondary coverage, not read on the primary page. A reviewer with access
should re-read the four Google pages.

Google Search Central (primary, via search):

- "Creating helpful, reliable, people-first content",
  developers.google.com/search/docs/fundamentals/creating-helpful-content.
  The Who, How and Why questions: make clear who created the content; say how
  automation or AI was used where a reader would expect it; the Why test is
  whether content exists to help people rather than primarily to rank. Lists
  "Are you changing the date of pages to make them seem fresh when the
  content has not substantially changed?" as a warning sign. Basis for: the
  editor gate's Information gain and Accuracy, founder notes as the only
  experience, the date-only refresh refusal and `dateModified` from
  `lastChecked`.
- The same page, updated about 1 October 2026 (Search Engine Roundtable,
  Search Engine Journal and others, 2 October 2026): a definition of main
  content, rater attributes including effort, originality, skill and
  accuracy, and a warning against fabricated author profiles. Basis for: the
  rubric's anchors, the real-founder-only quotes and the author Person in the
  JSON-LD. Exact wording not read on the primary page.
- Spam policies, March 2024 core and spam updates: three new policies,
  scaled content abuse (many pages made primarily to manipulate rankings, no
  matter whether by people, AI or both), site reputation abuse and expired
  domain abuse; Google projected about 40% less unoriginal content in
  results. Basis for: the weekly cap of 4, the clear-margin rule, the
  near-duplicate and city-swap refusal.
- "AI features and your website" and "Optimizing your website for generative
  AI features on Google Search" (15 May 2026): no extra requirements or
  special markup to appear in AI Overviews or AI Mode; a page must be indexed
  and eligible for a snippet; unique, non-commodity content matters most;
  llms.txt and chunking are not needed. Basis for: no AEO tricks in the spec,
  effort spent on the gap table and the asset instead.
- Article structured data (developers.google.com/search/docs/appearance/structured-data/article):
  `author` with `name` and `url` to a page that identifies the author;
  `datePublished`, `dateModified` recommended. Basis for the JSON-LD on
  `app/blog/[slug]/page.tsx`.

What answer engines cite (secondary, vendor studies; correlation only):

- Ahrefs, "38% of AI Overview citations pull from the top 10" (March 2026
  update of a July 2025 study that had said 76%; Ahrefs says its parsing
  improved, so the two are not comparable). Ranking helps but is not the
  whole story.
- Ahrefs, June 2025, 76.7M AI Overviews and about 950k ChatGPT and
  Perplexity prompts: Wikipedia is the most cited domain for all three
  (ChatGPT 16.3%, Perplexity 12.5%, AI Overviews 8.4%); YouTube is large in
  Perplexity and AI Overviews. Profound (about 30M citations, Aug 2024 to
  Jun 2025) and BrightEdge report Reddit and other community sites heavy in
  AI Overviews and Perplexity. Basis for: the forum answer in the
  distribution kit, and reading buyers' forum threads in research.
- SE Ranking, February to March 2025, 2,000 keywords: AI Overviews cite about
  9 links on average. More sources per answer means a sourced, specific page
  has room to be one of them.
- Aggarwal et al., "GEO: Generative Engine Optimization", KDD 2024
  (arxiv.org/abs/2311.09735): adding statistics, quotations and cited sources
  raised visibility in their benchmark; keyword stuffing did not. Basis for:
  sourced numbers, linking out, and the keyword stuffing cap.
- Microsoft Advertising blog, "Optimizing your content for inclusion in AI
  search answers" (8 October 2025): concise, self-contained answers and
  question phrasing. Basis for the capsule, question H2s and FAQ.

House conventions, not research findings: the 40 to 75 word capsule, the
readability thresholds (calibrated on our own three newest posts), the 8 of
10 margin, the editor pass mark of 22 of 30, the 75% topic-overlap refusal.
Nothing in the spec depends on query-level, backlink or AI-citation data,
which the engine does not have.
