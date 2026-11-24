# EchoPulse blog engine

Spec version: 2026-11-24

This is the spec for the daily unattended run that researches, writes and
publishes blog posts to echopulse.media. The run reads, in full, this file,
`content/blog-queue/README.md`, `lib/pricing.ts` and, in
`content/blog-data/`: `cluster-map.md`, `style-guide.md` and
`founder-notes.md`. It reads `editor-rubric.md` at gate G9,
`fact-check-rubric.md` at gate G9F and
`run-report.md` before reporting. Then it follows this file top to bottom.
To change what gets written, edit these files, not the scheduled task prompt.

Sections: 1 hard rules, 2 today's job, 3 topic gate, 4 research, 5 writing,
6 EchoPulse in the post, 7 gates and publishing, 8 refresh, 9 report,
10 worked example.

Why the blog exists: a US, UK or Canadian buyer who is about to hire someone
for video, ads, a website, LinkedIn, blog/SEO or automation should (a) find us
on Google or in an AI answer, (b) trust the page, (c) book a call or ask for
the free sample. Search Console, 16 months to November 2026: about 150 clicks
on 23,000 impressions, 77% of impressions on the blog, average position 15 in
the US and 16 in the UK. Cost posts earn the clicks (30 URLs, 0.70% CTR).
"Best X" rankings get seen and not clicked (3 URLs, 6,044 impressions, 0.20%).
A third of clicks come from India, Bangladesh and Pakistan, who do not buy. So:
fewer posts, each one the best page on the web for one buyer's question, each
one tied to a page that sells.

## 1. Hard rules

Breaking any one of these means: publish nothing, and say which rule in the
report. Running short of time is not a reason to skip a rule or a gate. An
unpublished day is fine. A wrong post is not.

1. New posts (asset or trending): at most 2 in a day, never 3, and at most 4
   per ISO week (Monday to Sunday, Asia/Kolkata). Refreshes: at most 2 on
   weekdays per week and 3 on a Sunday; they never make room for more new
   posts. The publisher counts from Sanity and refuses past the caps.
2. Never invent a number, a client, a result, a testimonial, a quote or an
   experience. No number from memory or from a search snippet.
3. WebSearch and WebFetch only. Never open a browser.
4. No em dashes or en dashes anywhere in the file, frontmatter included.
5. EchoPulse prices are exactly those in `lib/pricing.ts`. Read it every run.
   No other EchoPulse price, tier or offer, past or present, is mentioned.
6. Turnaround: "short-form edits within 48 hours". Long-form depends on
   length and never gets a number.
7. The only contract term stated is "month-to-month". Never mention a notice
   period or how to cancel.
8. Voice: "we" for what was read, counted or calculated. Never "I". The run
   has no experiences: no "we tested", "we have seen", "in our experience",
   "our clients". The only first-hand experience is a note from
   `content/blog-data/founder-notes.md`, quoted word for word (section 4
   step 8).
9. No client is named and no client result is stated in a post. A case study
   may be linked by its name (section 6). No Clutch figures.
10. The run never emails, messages or contacts anyone, never changes a live
    post's slug, and never publishes with `--force`.
11. Every post feeds one existing selling page and links it (section 3).
12. The SEO safety rules in `style-guide.md` part 4: one live post per
    question (the refresh path wins), no city or niche swaps, no keyword
    stuffing, no images except the publisher's chart, no date-only refresh.
13. If `content/blog-data/PAUSE` exists, publish and refresh nothing. Report
    "paused".

## 2. Today's job

`TZ=Asia/Kolkata date +%u` gives the weekday (1 = Monday).

| Weekday | Niche | `icp` |
| --- | --- | --- |
| 1 Monday | Real estate agents and teams | real-estate |
| 2 Tuesday | Founders and SaaS | founders |
| 3 Wednesday | Home-service owners (plumbers, roofers, HVAC, remodelers, clinics) | business-owners |
| 4 Thursday | Coaches, consultants, course creators | coaches |
| 5 Friday | DTC and e-commerce brands | dtc |
| 6 Saturday | Cross-niche buyer guides (agency pricing, hire vs freelancer, tool vs done-for-you) | founders |
| 7 Sunday | Refresh day and outreach list (section 8). No new post | |

Services: video-editing, linkedin-ghostwriting, blog-production, ad-creatives,
websites-funnels, automations, apps-software.

First, read what is live (no token needed) and keep the list for the whole run:

    curl -s "https://qkz53g2a.apicdn.sanity.io/v2024-01-01/data/query/production?query=*%5B_type%3D%3D%22blog%22%5D%7Btitle%2C%22slug%22%3Aslug.current%2CpublishedAt%2CpostType%2CupdateBy%2Cicp%2Cservice%2CtargetQuery%2CmoneyPage%2ClastChecked%7D%7Corder(publishedAt%20desc)"

Then run `node scripts/publish-blog.mjs --refresh-list` and decide, in this
order. The first line that applies is today's work.

1. **Paused:** the list prints `PAUSED`. Do nothing else; report "paused".
2. **Sunday:** do section 8 "Sunday". Stop there.
3. **Weekday refresh:** if the list prints `WEEKDAY REFRESHES LEFT THIS WEEK`
   of 1 or 2, and it has a Tier P or Tier A row marked `DUE` whose `icp`
   equals today's `icp`, refresh the highest such row (section 8) instead of
   writing a new post. If that post cannot be pulled, take the next such row.
   **If the refresh fails any gate (for example a second G9 fail), do not end
   the run:** drop the refresh, note it in the report, and continue with rule 4
   then rule 5 as if no refresh was due, so a failed refresh never costs a
   whole day. The failed refresh does not count against the weekly refresh
   limit.
4. **Weekly cap:** if the list prints `WEEKLY CAP REACHED`, write no new post.
   Refresh the first `DUE` Tier P or A row of any `icp` if weekday refreshes
   are left; otherwise publish nothing.
5. **New asset post, with a clear margin:** run the topic gate (section 3).
   Write a new post only if the best candidate scores **8 or more** (the pass
   mark is 7) and survives gate G2 (section 4 step 2). An asset answers what a
   buyer types before hiring ("X cost", "X vs Y", "how to choose X", "X specs
   or template") and stays right for 18 months with a yearly refresh.
6. **No clear winner:** if the best candidate scores exactly 7, or fails G2,
   or nothing passes: refresh the first `DUE` Tier P or A row of any `icp` if
   weekday refreshes are left; otherwise publish nothing and say why.

**Trending post (optional second post, Monday to Saturday).** It counts
toward the caps in rule 1. Write one only if all four are true. If any is
not, write none and put "Trending: none" in the report. Do not go looking for
news to justify one.

- A real event dated in the last 7 days, confirmed on the primary source's own
  page (the platform, vendor or regulator that made the change), opened today.
- It changes what a buyer in one of the five niches pays, must do, or should
  choose, for a service we sell. A model launch, funding round or opinion
  piece does not.
- You can finish this sentence with specifics: "Because of this, a <buyer>
  who was going to <decision> should now <different decision>."
- The Sanity list shows fewer than 2 posts with `postType` trending published
  in the last 7 days.

A trending post goes through the same gates, sets `postType: trending` and
`updateBy` 30 to 45 days out.

## 3. The topic gate

Take at least 3 candidates: first from "Gaps to write" for today's niche in
`content/blog-data/cluster-map.md`, then from buyer questions you find in
research. Run every candidate through steps 1 to 4 and write the highest
scorer that passes with a clear margin (section 2). Record all of it for the
report (gate G1).

**Step 1: not already live.** Compare the candidate with every title, slug
and `targetQuery` in the Sanity list. If a live post answers the same question
for the same buyer, or the candidate differs from a live post only by a city,
trade or niche name, drop it: that is a refresh of the live post (add the
angle as a section). Also drop it if the list shows a post with the same
`icp` and `service` published in the last 14 days. The publisher refuses a
near-duplicate anyway; catching it here saves the day.

**Step 2: ban list.** Drop the candidate if it is any of these:

- AI or tech news with no change to what a buyer pays or must do.
- Trends, predictions, opinion, manifestos, "why X is broken".
- A question asked by people who do the work, not people who buy it: salary,
  jobs, "how to become", learn-to-edit tutorials, free tools or downloads,
  rate cards for freelancers.
- South Asian intent: WebSearch results for the query are mostly .in sites,
  INR prices or marketplaces selling to that market.
- A "best X agencies/services" ranking. Allowed instead: "X compared by
  price", built only from published prices, with a price table.
- Course operations (completion rates, course length): they draw impressions
  and no buyers.

**Step 3: money page.** Set `icp` and `service`, then `moneyPage`:
`/<icp>/<service>` if that pair is one of the 12 in `lib/nicheIndex.ts`,
otherwise `/services/<service>`. The validator prints the expected value.

**Step 4: score.** WebSearch the query and look at the top 5 results. Give 0,
1 or 2 on each line.

| Line | 2 | 1 | 0 |
| --- | --- | --- | --- |
| Buyer intent | Query names a price, a comparison or a choice ("cost", "pricing", "vs", "alternatives", "how to choose") | A spec, template or how-to for a job our service does for them | Curiosity or operator topic |
| US/UK searcher | Top 5 are US, UK or Canadian sites with USD, GBP or CAD prices | Mixed | Mostly other markets |
| Information gain | We can build an asset (section 4 step 5) that none of the top 5 has | We can do an existing asset better: more vendors, dated, with the math | Nothing new |
| SERP weakness | 3 or more of the top 5 are vendor sales pages, unsourced listicles or forum threads | 1 or 2 are | All 5 are large publishers, trade bodies or government sites |
| Cluster fit | The topic is listed under "Gaps to write" for its cluster | Not listed, cluster not marked full | Cluster marked full |

Pass = 7 or more, with Buyer intent and Information gain at least 1. A new
post needs 8 or more (section 2). A vendor's or agency's own article that
gives price ranges with no named source counts as a vendor sales page. On a
tie, take the candidate whose cluster has the fewest "Live" topics.

One exception, Saturdays in even ISO weeks only (`date +%V`): a **link asset**
(a count, or a traced correction of a number everyone repeats) may pass with
Buyer intent 0 if Information gain is 2. It still needs a `moneyPage`.

## 4. Research (before writing a word)

If WebFetch fails to open three different hosts in a row with a network or
"host not found" error, the session is blocking research. Stop: publish
nothing, report the blocker "research hosts blocked" with the hosts, and send
the push notification. Do not write from search snippets.

Keep the research log in `content/blog-queue/_research-YYYY-MM-DD-<slug>.md`
(the `_` keeps it out of the publisher). It holds the G1 scores, the gap table
and one line per figure: URL, date opened, the sentence quoted word for word,
primary or not. A figure with no log line is deleted from the post. The
editor reviewer (G9) works from this file.

1. **Target query.** One query in the searcher's words (`targetQuery`), plus
   up to 4 variants the post should also answer. If
   `content/blog-data/gsc-queries-*.csv` exists, take the wording from it.
2. **Gap table (gate G2), before any outline.** WebSearch the target query and
   WebFetch the first 5 organic results in the order WebSearch returns them
   (that order is not Google's rank; never call it a position). Skip ads,
   video carousels, our own pages and any page that will not open (note it in
   the table), taking the next result instead. Three hosts in a row that will
   not open is the "research hosts blocked" stop above. A row filled from a
   search snippet is not a row. Write one row each in the shape in
   `run-report.md` part 4: URL, kind, date shown, what it covers, and what it
   misses or gets wrong. A miss must be checkable: "no price for Podium",
   "quotes the 85% figure without a source", "prices dated 2024", "no total
   for year one", not "thin" or "outdated feel". Then:
   - The post must fill at least 2 rows' misses explicitly, each in a named
     heading or table column. List them under the table as "Gaps the post
     fills".
   - If the top 5 already answer the query fully and you cannot add a
     verifiable fact they lack, drop the topic and take the next candidate.
   - Write the one line "Why Google should rank this over the current #1".
3. **Find the buyers' questions.**
   - WebSearch the query with each of: "how much", "vs", "worth it", "reddit",
     "for <niche>". Question-shaped result titles are the question list.
   - WebSearch `site:reddit.com <query>` and one niche forum (BiggerPockets
     or ActiveRain for agents; ContractorTalk, r/HVAC or r/Plumbing for
     trades; Indie Hackers or r/SaaS for founders; r/ecommerce or the Shopify
     community for DTC; r/coaching for coaches). Open at least 2 threads. If
     a host refuses, use the thread titles for wording only and say so.
   - A question buyers ask that fewer than 3 of the top 5 answer is a gap. The
     post answers at least 3, as H2s or FAQ items, in the buyers' words.
4. **Sources.** Open at least 8 pages in full. At least 5 are primary: the
   vendor's own pricing or help page, the platform's own policy page, a
   regulator, a study with a method section. A roundup quoting a study is not
   the study.
5. **Build one original asset.** One of: a comparison table from 6 or more
   vendors' own pages; a worked cost calculation with stated assumptions; a
   complete template or checklist; a count ("N of M vendors publish no
   price"); a traced correction of a number everyone repeats. `whatsNew` is
   one sentence (160 characters or fewer) naming it with its count and date.
   Test: if that sentence is also true of a top-5 result, there is nothing
   new. Pick another candidate.
6. **Verify every number.**
   - Ask WebFetch for the exact sentence containing the figure. WebFetch
     answers through a summarising model, so a figure that is not inside a
     returned word-for-word quote is not verified.
   - Trace a statistic to where it was first published. If the origin cannot
     be opened, say who repeats it and that the origin could not be found, or
     leave it out.
   - A figure older than 12 months is re-checked or carries its date.
   - Two credible sources disagree: show both, say which we trust and why.
   - Redo every sum, percentage and conversion with python or node.
7. **Could not verify.** Every claim you looked for and could not confirm goes
   on a list with where you looked. Where it matters to the buyer, the post
   says so once ("Podium does not publish a price; its pricing page was
   checked on 18 November 2026"). The list goes in the report.
8. **Founder note.** Read `content/blog-data/founder-notes.md`. If a note
   marked `public: yes` fits this post's `icp` and `service` (and is within
   the age limits in that file), you may quote its `Quote:` line word for
   word, once, as the blockquote shown there, in the section it supports. The
   validator checks the quote against the file. No note fits: no experience
   in the post. Report the note used, or "none".

## 5. Writing

Follow `content/blog-data/style-guide.md` (parts 1 and 2) for every sentence.

### 5.1 Skeleton of an asset post, in this order

1. **Answer capsule.** The first paragraph: 2 to 3 sentences, 40 to 75 words.
   It answers the title with the number, its unit and the date ("as of
   November 2026"), names the subject in the searcher's words (no "it" or
   "this"), and does not mention EchoPulse. Answer engines lift this passage
   out of the page, so it has to make sense alone.
2. **How we checked.** One paragraph under 60 words: what was read, how many,
   which arithmetic is ours. It ends with `Last checked: 19 November 2026.`
   using today's date. The site and the refresh loop both read that line.
3. **First H2: the target query as a question**, then the asset. A table's
   header row names the unit and the date ("Monthly price, USD, 19 Nov
   2026"). One fact per cell. "Not published" instead of a blank. Cells
   cannot hold links: name each source in the row and link it in the text
   below the table and under Sources.
4. **Cite block**, directly after the asset: one blockquote, one sentence with
   the finding, its number and date, then the source line. It must be true of
   the asset above it.

       > **Cite this:** Across 10 vendors' published prices, a real estate agent website costs $928 to $8,500 in year one (checked 16 November 2026). Source: EchoPulse Media, "Real Estate Agent Website Cost 2026: 10 Real Prices", https://echopulse.media/blog/real-estate-agent-website-cost-2026

5. **Chart.** If the main table has a column where 3 to 14 rows hold one
   figure or "a to b" in one currency, set `chartColumn` to that header
   exactly (and `chartLabel` to the column that names each row, if it is not
   the first; `chartSource` to a short source line, "10 vendors' own pricing
   pages"). The publisher draws the bar chart and inserts it after the cite
   block with alt text and a dated caption. Write no image lines yourself.
6. **Three to six more H2s**, each a buyer's question from section 4 step 3 or
   a gap from the gap table. The first sentence under each H2 answers it.
   Define each term of art once as "**Term** is ..." in under 30 words.
7. **One worked example** under a heading that contains the word "example",
   with a buyer's numbers from start to finish.
8. **A recommendation:** what to do, for whom, and when the opposite is right.
9. `## Where does EchoPulse Media fit?` (section 6).
10. `## When does this not apply?` Two to four honest limits.
11. `## FAQ`: 4 to 6 questions buyers asked, as `###` headings, each answered
    in 2 to 4 sentences that stand alone.
12. `## Sources`: every source as a link, what it gave, the date read. At
    least 4 primary.

Length follows the answer: most asset posts land at 1,200 to 2,200 words;
the validator's floor is 800. No H1, no closing summary. A trending post is
at least 600 words and needs items 1, 2, 10, 11 and 12, plus "what changed"
(dated and linked) and "what to do now" as H2s; no table or cite block.

### 5.2 Title, excerpt, slug, cover

- **Title:** 60 characters or fewer. The target query first, in the
  searcher's words, then the number that answers it: a range ("Real Estate
  Video Editing Cost: $10 to $327 Per Video") or a count ("10 Real Prices").
  Every number in the title is in the post. A year only when prices change
  yearly, and it is the year of the `Last checked:` line. No wordplay.
- **Excerpt** (the meta description): 130 to 160 characters. The answer with
  its number and unit, then how it was checked.
- **Slug:** 3 to 6 words, the query. A cost post has "cost", "price",
  "pricing" or "rates" in the slug.
- **`thumbnailText`:** the title or a shorter cut of it, 30 to 60 characters,
  keeping the number. **`thumbnailSub`:** the angle in 40 characters or fewer,
  no full stop.
- **`category`:** `Real Estate` when `icp` is real-estate. Otherwise by
  service: video-editing `Video`; linkedin-ghostwriting `Authority`;
  blog-production `SEO`; ad-creatives and websites-funnels `Funnels`;
  automations `Automation`; apps-software `Strategy`.

### 5.3 Copy bar

- The reader is a tired owner on a phone. Average sentence under 18 words,
  paragraphs of 1 to 4 sentences.
- Every price or percentage names its source in the same paragraph, either
  as a link or by the name it is listed under in Sources. Our own sums say
  "our arithmetic".
- Take a position. A post that only lists options is a brochure.
- Describe competitors neutrally, link each, never knock one. Never link a
  competitor's sales page as proof of a general claim.
- Bold only for table headers and a defined term.

## 6. EchoPulse in the post: links and the one ask

The site adds the call-to-action cards and their tracked buttons itself,
chosen from the post's stored `service`: video-editing and ad-creatives posts
offer the free sample ("Get my 2 free edits"); every other service offers the
free 15-minute call. Never write a booking link, a button or "book a call"
copy into a post.

EchoPulse Media is mentioned only in these places:

- `## Where does EchoPulse Media fit?` Required on cost and comparison posts,
  optional elsewhere. Under 90 words. It says what we do for this buyer and
  links the `moneyPage` once, in a sentence that reads fine without the link.
  - Cost posts include this sentence, with the numbers as they are in
    `lib/pricing.ts` today: "EchoPulse Media starts with a free sample of 2
    edited short-form videos, then a $299 Pilot (14 days), $399 a month
    (Presence Engine) or $1,997 a month (Growth). Larger scopes are quoted on
    a call. Monthly plans are month-to-month." If the file's numbers differ
    from this sentence, use the file's and say so in the report.
  - A video-editing or ad-creatives post may add: "Send footage and get 2
    edited short-form videos back free within 48 hours" with a link to
    /free-edits. Posts for every other service never mention footage.
  - No other vendor's price appears in this section.
- Optionally one row in a price table, labelled "EchoPulse Media (us)".
- The cite block, the chart's caption and Sources.

Links every post carries:

1. The `moneyPage`, once (above).
2. Two sibling posts from the same cluster, by their real titles and exact
   slugs from the Sanity list, published on or after 1 July 2026 and passing
   the ban list. If the cluster has fewer than two, use the nearest posts for
   the same `icp` and say so. Put them where they help the reader, or in one
   line starting "Related:" directly before the FAQ.
3. One case study only where it fits: blog, SEO or AI-search posts may link
   /case-studies/magicbnb-seo-aeo; coach website posts may link
   /case-studies/working-with-god-rebuild. Link it by name. Do not restate its
   numbers.

## 7. Gates and publishing

Write the post to `content/blog-queue/YYYY-MM-DD-<slug>.md`. Frontmatter is
defined in `content/blog-queue/README.md`. Required on every engine post:
`title`, `slug`, `excerpt`, `category`, `icp`, `service`, `postType`
(`updateBy` if trending), `targetQuery`, `moneyPage`, `whatsNew`,
`thumbnailText`, `thumbnailSub`; `chartColumn` when section 5.1 item 5
applies. Never add `engine: false`.

Pass every gate, in order. Each gate's evidence line goes in the report word
for word in this shape. A gate with no evidence line counts as failed, and a
failed gate means the post is not published.

| Gate | What to do | Evidence line for the report |
| --- | --- | --- |
| G1 Topic | Section 3 for 3 or more candidates | `G1: <candidate> intent/us/gain/serp/cluster = n/n/n/n/n total n` for each, which was chosen, and `margin: yes (8+)` |
| G2 SERP gap | Section 4 step 2 | `G2: top 5 read n/5, gaps filled n: <gap> -> <heading>; ...` plus the table in the report |
| G3 Sources | Count the research log | `G3: opened n pages, n primary, n linked under Sources` (minimums 8, 5, 4) |
| G4 Numbers | Every figure has a log line with a word-for-word quote; every sum redone | `G4: n figures, n quoted from source, n our arithmetic (recomputed), n could not verify` |
| G5 Prices | Open `lib/pricing.ts`; compare with the ladder sentence in section 6 | `G5: lib/pricing.ts read, ladder <as in file>, matches spec yes/no` |
| G6 Validator | `npm run blog:validate`. Fix every error. For each warning, fix it or give the reason | `G6:` the validator's `STANDARD ENFORCED:` line, copied, plus `0 errors, n warnings` and the reason for each warning left |
| G7 Live links | `curl -s -o /dev/null -w '%{http_code}' https://echopulse.media<path>` for every internal link that is not a /blog/ link | `G7: <path> 200, <path> 200, ...` |
| G8 Self-edit | Cut about 10% (intro lines, restated points, sentences that announce the next one). Then quote from the post | `G8: answer "<sentence from paragraph 1>"; asset "<what it is>"; recommendation "<the sentence>"; cut "<what was removed>"` |
| G9 Editor | An independent review by `content/blog-data/editor-rubric.md` (a fresh subagent where the Task or Agent tool exists). Pass mark there. On a fail: one rewrite applying every fix, re-run G6, then a fresh review. A second fail: publish nothing | `G9: PASS review <1 or 2>, total n/30, accuracy 5, reviewer <subagent or self>` plus the verdict block(s) in the report |
| G9F Fact check | After G9 passes, on the final file: an independent Sonnet subagent (`model: "sonnet"`) runs `content/blog-data/fact-check-rubric.md`: every claim re-checked against a source opened today, EchoPulse claims against `lib/pricing.ts`, and Google's spam policies and helpful content guidance. Any non-confirmed claim or guideline problem is a fail. On a fail: apply every fix, re-run G6, fresh Sonnet check. A second fail: publish nothing | `G9F: PASS check <1 or 2>, claims n, confirmed n, guidelines clean, model sonnet` plus the verdict block(s) in the report |
| G10 Published | Publish, then check the URL | `G10: <url> 200, title matches` |

Notes:

- **G6.** The validator checks, among other things: dashes, title and excerpt
  length, the capsule, the table and its units, the cite block, FAQ and
  Sources, the `Last checked:` date and the title year, banned phrases and
  constructions, paragraph and sentence length, question H2s, keyword
  stuffing, images, "I" and experience claims, founder quotes against the
  notes file, prices in the EchoPulse section, the cost slug, the money page
  link, internal links, and whether `chartColumn` can be drawn. It cannot
  judge truth. Passing it does not replace G3, G4 or G9.
- **G7.** If the `moneyPage` does not return 200, change `moneyPage` and its
  link to `/services/<service>` and say so. If /free-edits or /pilot does not
  return 200, remove that sentence.

Publish, one command per post:

    SANITY_WRITE_TOKEN=proxy-injected npm run blog:publish -- --file content/blog-queue/<file>.md

The cloud environment injects the real token; `proxy-injected` is correct.
If `curl -s -o /dev/null -w '%{http_code}' https://echopulse.media/pricing`
prints 404, prefix the command with `BLOG_TABLES=pipes` (the chart is then
skipped). A refresh adds `--refresh` (section 8). Never use `--force`. Run the
same command with `--dry-run` first: it writes nothing, prints the cap, topic
and chart lines, and must end with "Dry run complete". The publisher refuses
a new post past the caps or on a live topic; that is a reason to stop, not to
retry. After publishing, the post URL must return 200 within 3 minutes (check
up to 4 times).

## 8. Refresh

**What the run can see.** Sanity (the list in section 2 and post bodies),
what WebSearch returns, and the Search Console export the owner commits as
`content/blog-data/gsc-pages-YYYY-MM-DD.csv`. Do not read the CSV by hand:
`node scripts/publish-blog.mjs --refresh-list` reads the newest one, joins it
with what is live and prints the order. The run has no analytics, backlink or
AI-citation data and no memory of earlier runs. Never guess a position. If
the list says the export is older than 60 days, or that there is none, say so.

**Order.** The list is sorted: Tier T (trending posts past `updateBy`), Tier
P (cost and pricing posts whose prices were last checked over 90 days ago:
mandatory, most impressions first), Tier A (position 5 to 15 with 100 or more
impressions), Tier B (position above 15 with 200 or more impressions: these
need a rewrite against today's top 5, not a polish), Tier C (no data, oldest
check first). Work the first row marked `DUE` that fits today's rule. Never
refresh a row marked `SKIP`. Skip a Tier P or C row that would fail the ban list
(opinion and "why X is broken" posts are reported, not refreshed).

**How to refresh one post.**

1. `node scripts/publish-blog.mjs --pull <slug>` writes the live post to
   `content/blog-queue/<today>-<slug>.md` and proves the copy matches. If it
   refuses, skip the post, name it in the report and take the next row.
2. Redo the research: section 4 steps 2 to 8, including the gap table against
   today's top 5. Re-open every source and re-verify every number. Update
   prices, dates, the `Last checked:` line and Sources.
3. Bring it to the current standard (sections 5 and 6), including `icp`,
   `service`, `moneyPage`, `targetQuery`, `whatsNew` and `chartColumn`.
   Remove "I", client claims, notice periods and links to posts published
   before 1 July 2026. Use the `icp` the list printed. If the topic matches
   none of our services exactly, use video-editing for social media and
   content topics and blog-production for SEO and writing topics. Delete any
   image line that is not a real, sourced screenshot (the chart is redrawn).
4. Title and excerpt: change them only if they break section 5.2. If the list
   shows a CTR of 1.5% or more, leave the title alone. The year in a title
   changes only when every figure was re-opened today (G4 says so); the
   dry run prints a `year:` line when it changes. A live "best X" post keeps
   its query words and becomes a price comparison ("... Compared by Price").
5. Leave `slug` and the `refresh: true` line as they are. Leave
   `thumbnailText` as pulled unless the title changed. `category` and
   `author` are not updated by a refresh.
6. Pass gates G2 to G9F, then:

       npm run blog:publish -- --refresh --dry-run --file content/blog-queue/<file>.md
       SANITY_WRITE_TOKEN=proxy-injected npm run blog:publish -- --refresh --file content/blog-queue/<file>.md

   `--refresh` updates the title, excerpt, body and engine fields and keeps the
   slug, the publish date and everything else. The publisher refuses a
   refresh that changes nothing but dates.

**Tier T.** Rewrite the trending post into an asset (evergreen title, full
skeleton, `postType: asset`). If the topic is dead, move its facts into the
nearest asset post and add one line at the top of the trending post:
"Superseded by <link>".

**Sunday, in order:** (1) Tier T rows; (2) Tier P rows, then the first `DUE`
rows, until three posts in total have been refreshed today; (3) the outreach
list below. Each refresh is its own file and its own gates.

**Outreach list (for the owner; the run contacts nobody).** Pick one live
post with a cite block. WebSearch for pages that repeat the number our post
corrects, or that cover the topic without the data our asset has. List up to
5 targets, each with: page URL, site and author name as shown on the page, the
sentence they print (quoted), our finding and its primary source, our post
URL. Only US, UK or Canadian sites with a named author, updated in the last 24
months. No direct competitors' sales pages. Do not look up or guess email
addresses; give the page's own contact or author URL if it shows one.

## 9. The run report

End every run with the report in `content/blog-data/run-report.md`, in its
order. It must include: the G1 to G10 evidence lines (including G9F), the top 5 gap table,
the editor verdict block(s), the fact check verdict block(s) and every fix applied, the founder note used (or
"none"), the one line "Why Google should rank this over the current #1", and
the distribution kit (a LinkedIn draft, a 2-sentence forum answer, up to 3
people or sites the post cites). The kit is for the owner; the run posts and
sends nothing. Send a push notification only for a blocker or a run that
published nothing.

## 10. Worked example

A live post with the frontmatter it should carry:

    title: "Real Estate Agent Website Cost 2026: 10 Real Prices"
    slug: real-estate-agent-website-cost-2026
    excerpt: "A real estate agent website costs about $930 to $8,500 in the first year, based on 10 vendors' published prices checked on 16 November 2026."
    category: Real Estate
    icp: real-estate
    service: websites-funnels
    postType: asset
    targetQuery: "real estate agent website cost"
    moneyPage: /real-estate/websites-funnels
    whatsNew: "Year-one totals for 10 agent website vendors, worked out from their own pricing pages on 16 November 2026."
    thumbnailText: "Real Estate Agent Website Cost: 10 Real Prices"
    thumbnailSub: "Setup fee plus 12 months, by vendor"
    chartColumn: "Year one, USD (our arithmetic)"
    chartLabel: "Vendor"
    chartSource: "10 vendors' own pricing pages"

- G1 (scores illustrative): `G1: real estate agent website cost
  intent/us/gain/serp/cluster = 2/2/2/2/2 total 10, margin: yes (8+)`.
- One G2 row: `| 3 | <a vendor's cost guide> | vendor page | 2024 | ranges for
  "basic" and "custom" sites | no named vendor, no setup fees, no year-one
  total |`; gap filled by the year-one column of the table.
- Capsule (57 words): "A real estate agent website costs about $930 to $8,500
  in the first year, based on the published prices of 10 vendors checked on
  16 November 2026. The low end is a hosted agent site with listing search at
  $928 a year. The high end is a fully custom design at $6,500 setup plus $165
  a month."
- Asset: one table, one row per vendor, headers with unit and date: "Setup
  fee, USD", "Monthly, USD", "Year one, USD (our arithmetic)", "Source, read
  16 Nov 2026". The chart under the cite block draws the year-one column.
- The site shows the 15-minute call on this post because `service` is
  websites-funnels. The body links /real-estate/websites-funnels once.
