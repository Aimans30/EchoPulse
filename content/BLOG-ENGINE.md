# EchoPulse blog engine

The spec for the daily scheduled run that researches, writes and publishes blog
posts to echopulse.media. The run reads this file first and follows it. Edit
this file to change what gets written; do not edit the scheduled task prompt.

Last revised: 10 November 2026.

## 1. What the blog is for

Three outcomes, in order:

1. People who are about to hire someone for content, a website, SEO/AEO, ads or
   automation find EchoPulse on Google and inside ChatGPT, Perplexity and
   Google AI answers, and book a call.
2. EchoPulse Media becomes the name those tools recommend when someone asks
   "who should I hire for X" in our niches.
3. The blog reads as the work of people who do this every day, not an agency
   content farm. Every post is something a real owner would send to a friend.

Where we are (Search Console, 12 months to 8 Nov 2026): 137 clicks, 20K
impressions, average position 10.6, CTR 0.2%. 130 live posts. Clicks skew to
India and Bangladesh; the buyers are in the US, UK and Canada. The lesson from
the audit: the posts that earn clicks are pricing guides, comparisons and
specs. Opinion posts, "trends", and anything that reads as AI get nothing.

## 2. Who we write for

Five audiences and two more we are opening. Rotate by weekday so every niche
gets covered every week.

| Weekday | Niche | ICP key | Money page |
| --- | --- | --- | --- |
| Monday | Real estate agents and teams | real-estate | /real-estate |
| Tuesday | Founders and SaaS | founders (or saas) | /founders |
| Wednesday | Home-service owners (plumbers, roofers, HVAC, remodelers, clinics) | business-owners (or home-services) | /business-owners |
| Thursday | Coaches, consultants, course creators | coaches | /coaches |
| Friday | DTC and e-commerce brands | dtc | /dtc |
| Saturday | Cross-niche buyer guides (agency pricing, hire vs freelancer, tools vs done-for-you) | founders | /pricing |
| Sunday | Refresh day: no new asset. Update the two weakest posts (section 8) | as the post | as the post |

Each niche also has a standing list of services to cover in rotation: video
editing, LinkedIn/social, blog/SEO/AEO, websites, ads, automations/CRM. Within
a niche, do not write two posts about the same service in the same month.

## 3. Daily allocation

- One **asset** post every day Monday to Saturday. An asset answers a question
  a buyer types before hiring: "how much does X cost", "best X for Y", "X vs Y",
  "how to choose X", "X checklist/template/specs". It is written to still be
  right in 18 months with a yearly refresh.
- One **trending** post only when there is a real, dated event in the last 7
  days that our audience will search for: a platform change (Meta, LinkedIn,
  Google, TikTok, Zillow, MLS), a pricing change at a tool they use, a policy
  change (Fair Housing, FTC, CAN-SPAM, PECR), a Google update, a new AI feature
  that changes how they get found. No event, no second post. Never invent
  urgency. A trending post MUST set `postType: trending` and `updateBy` 30 to
  45 days out, and must be written so it can be rewritten into an asset later
  (section 8). Target at most 2 trending posts a week.
- Never three posts in a day. If today's asset cannot be made excellent, ship
  nothing and say why in the report. One strong post beats two average ones;
  Google's scaled-content policy punishes volume without value.

## 4. Research protocol (before writing a word)

1. **Dedupe.** Query Sanity for every published title and slug. Check the
   topic bank (section 10) and the last 14 days of the report log. If a
   planned topic overlaps a live post by more than about 60%, refresh that post
   (section 8) instead of writing a new one, and say so in the report.
2. **Pick the query.** Use the searcher's own words. Prefer queries where the
   current top results are vendor pages, cost-estimator sites or AI-written
   listicles with unsourced numbers. Those are winnable. Skip queries where
   the top 5 are HubSpot, NAR, Forbes or a government site.
3. **Read the top 5 live.** Fetch them with WebFetch. Note what they cover,
   what they get wrong, what they leave out, and whether they answer the
   question in the first 100 words. Our post must do at least one thing none
   of them do: a complete table, a sourced price list, a real template, an
   original count, or a correction of a number everyone repeats.
4. **Collect sources.** Primary sources only: the vendor's own pricing page,
   the platform's help centre, a government or industry body, a published
   study with a sample size, a dated news report. Every number carries its
   source and date in the same sentence. If a price is not published, write
   "not published" and say where you looked. If two credible sources disagree,
   show both. Never take a figure from a search snippet.
5. **Check it is still true.** Any number older than 12 months gets re-checked
   or labelled with its date. Anything you cannot verify is cut.

Use WebSearch and WebFetch only. Never open a browser. Never use a stat from
memory.

## 5. Writing standard

Shape:

- **Title** under 60 characters, in the searcher's words, with the number or
  year where one belongs. Written for the click, not for cleverness.
- **Excerpt** 140 to 160 characters, the answer in one sentence.
- **Answer capsule**: the first paragraph answers the question directly in two
  to three sentences with the key number. No warm-up, no "in this guide".
  This is what AI tools quote.
- **One table** at minimum in every asset post (prices, specs, comparison,
  checklist). Pipe tables render on the site.
- **H2s** phrased as the questions people ask. H3s for sub-answers. No H1 in
  the body (the page supplies it).
- **A "when this does not apply" section** so the post is honest about limits.
- **FAQ** at the end: 4 to 6 questions, each answered in 2 to 4 sentences,
  phrased as people ask them.
- **Sources** list at the end with links, dated.
- Length: as long as the answer needs. Asset posts land between 1,200 and
  2,200 words. Padding is a defect.

Voice:

- Plain words. Short sentences. One idea per sentence. Contractions.
- First person is fine ("I checked nine vendors' pricing pages on 10 Nov").
- Name the thing, not the category: "a 90-second listing walkthrough", not
  "video content".
- No em dashes or en dashes. Use commas, colons, full stops.
- Banned: delve, elevate, leverage, seamless, robust, unlock, empower,
  game-changer, cutting-edge, streamline, transformative, foster, realm,
  landscape (as metaphor), "in today's fast-paced world", "here's the thing",
  "it's not X, it's Y", "the result?", lists of three adjectives, tidy
  symmetrical paragraphs, praise then "but".
- Never claim client results, client counts, testimonials or revenue. The
  one proof we publish is the MagicBNB case study (5.8 to 1,574 average daily
  Google impressions, April to August 2026, best day 2,398). Link it, never
  restate it with different numbers.
- EchoPulse's own price appears in every pricing guide, plainly, once: the
  ladder is in lib/pricing.ts (free sample, $299 Pilot, $399/month Presence
  Engine, $1,997/month Growth, Custom). Describe competitors' prices neutrally
  and link each one. Never knock a competitor.
- At most two EchoPulse mentions in the body. The site adds the CTA boxes
  automatically; do not write "book a call" copy into the post.

## 6. AEO (being cited by AI tools)

- The answer capsule is the citation. Make the first 100 words quotable on
  their own: the question, the answer, the number, the date.
- Define terms once, in one sentence, where they first appear.
- Use the exact entity names (EchoPulse Media, the vendor's real name, the
  platform's real feature name). AI tools match entities, not vibes.
- Put the date in the text, not only in metadata: "As of November 2026".
- Tables with headers. Lists only for truly parallel items.
- One claim per sentence. Hedged, stacked claims do not get quoted.
- Link to 2 to 4 external primary sources. Posts that cite get cited.

## 7. Internal links

Every post links to:

- Its money page (the ICP page from section 2) once, in a sentence that
  makes sense without the link.
- One service page (/services/<slug>) once.
- Two to three other posts in the same niche, by their real titles.

The site adds the inline CTA boxes and the "guides" blocks on money pages.
Set `icp` and `service` in the frontmatter correctly; that is what wires them.

## 8. Refresh loop (this is what turns trending posts into assets)

Every Sunday, and whenever the dedupe step finds an overlap:

1. Query Sanity for posts where `postType == "trending" && updateBy <= now`.
   For each: either rewrite it into an asset (new title in the searcher's
   evergreen words, answer capsule, table, FAQ, `postType: asset`, remove
   `updateBy`) or, if the topic is dead, fold its useful facts into the
   nearest asset post and leave the trending post as is with a one-line
   "superseded by" note at the top linking to the asset.
2. Pick the two weakest live asset posts: the oldest `_updatedAt` among posts
   with impressions but low clicks (use the Search Console export in
   content/gsc/ when present, else oldest first). Re-verify every number,
   update prices and dates, add the missing table or FAQ, tighten the capsule.
3. Publish updates with `--force` on the same slug. The publisher keeps the
   original ID and publish date and the site shows "Updated <date>" and sends
   `dateModified`. Never change a slug on refresh.

## 9. Frontmatter and publishing

Posts are markdown files in `content/blog-queue/` with the frontmatter in
`content/blog-queue/README.md`. Required: title, excerpt, category, icp,
service, postType (and updateBy for trending). Run `npm run blog:validate`
before publishing. Publish with:

    SANITY_WRITE_TOKEN=proxy-injected npm run blog:publish -- --file content/blog-queue/<file>.md

(the cloud environment injects the real token; the placeholder is correct).
Add `--force` only for a refresh of an existing slug. One command per post.
After publishing, confirm the URL returns 200 and the title matches.

## 10. Topic bank (work through these first; add to it as you go)

Cross-niche (Saturdays): content agency pricing index 2026 (published prices
from 50+ studios, refreshed quarterly); hire a video editor: Upwork vs agency
vs subscription, total cost; freelancer vs agency vs in-house cost with BLS
data; what a $399/month content retainer should include; how to brief a video
editor (template); how to tell if a blog post was written by AI (and why it
matters for ranking); what AI search citations are and how a small business
gets them.

Real estate: real estate agent website cost 2026 (US vs Canada vs UK); best
video editors for real estate agents (with prices); listing video specs for
MLS, Zillow, Instagram (exists: refresh); realtor Instagram reels calendar, 52
weeks; speed-to-lead for agents (original study: time 100 agent form replies);
Follow Up Boss automation with Make; estate agent video marketing cost UK; just
listed / just sold post templates; neighbourhood guide template that ranks.

Founders and SaaS: best LinkedIn ghostwriting agencies with published prices;
LinkedIn ghostwriting for SaaS founders: cost and what is included; SaaS demo
video cost; B2B blog writing cost per article; founder LinkedIn ROI tracking
template; comparison and alternatives pages: how to write one that ranks; how
ChatGPT picks which SaaS to recommend (with examples).

Home services: website cost for plumbers, HVAC, roofers (with a teardown of 50
real contractor sites); social media marketing for HVAC and plumbers: cost per
month by option; what to film on a job site (shot list); missed-call text
back: cost and setup; Google Business Profile checklist for contractors;
review request text templates; roofing and HVAC Facebook ad examples
(annotated swipe file); how much to spend on ads as a 3-truck company.

Coaches: ManyChat and Instagram DM automation cost for coaches; Make vs Zapier
for a coaching business: real monthly cost; YouTube editing cost per video for
coaches; Skool vs Circle vs Kajabi community cost; webinar show-up rate
benchmarks (exists: refresh); discovery call conversion benchmarks (exists:
refresh); course launch email sequence (exists: refresh with a table).

DTC: Superside alternatives and pricing comparison; UGC creator rates vs
agency cost (exists, position 41: rewrite); Klaviyo flow setup cost; Shopify
landing page for ads: cost and what converts; ad creative testing: how many
variants and how long; static vs video ads (exists: add decision table).

## 11. The run report (end every run with this)

- Date, weekday, niche for the day.
- Post(s) published: title, URL, postType, target query, word count, the one
  thing the post has that the top results do not, sources count.
- Refreshes done (Sunday or overlap): slug, what changed.
- Trending candidate considered and why it was or was not written.
- Anything cut for being unverifiable.
- Blockers: publisher failed, token refused, repo branch missing, Sanity
  query failed. Send a push notification only for a blocker or a run with
  zero posts.
