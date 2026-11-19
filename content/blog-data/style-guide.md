# Style guide and safety rules

Read in full by the blog engine every run (BLOG-ENGINE.md section 5) and by
the editor reviewer (G9). Part 1 is checked by `npm run blog:validate`. Part 2
is judged by the reviewer and scored under "Clarity" in `editor-rubric.md`.
Part 3 is the list of things that could hurt the site; most are enforced by
the publisher.

## 1. Mechanical (the validator rejects these)

Errors, anywhere outside a blockquote:

- Phrases: delve, seamless, game-changer, cutting-edge, tapestry, supercharge,
  ever-evolving, "in today's", "fast-paced", "in this post/guide/article",
  "let's dive", "deep dive", "when it comes to", "here's the thing", "the truth
  is", "it's worth noting", "it's important to note", "what most people miss",
  "ultimate guide", "complete guide", "everything you need to know", "in
  conclusion", "in summary", "to sum up", "the bottom line", "whether you're
  a", "navigate the/this/your", "unlock the/your/growth/potential", empower,
  transformative, realm, "next level", "secret sauce", "magic bullet", "hidden
  gem", "look no further", "without further ado", "ever wondered",
  "landscape" (except "landscape video/mode/format").
- Constructions: "not just X, but Y"; "not only X but also Y"; "it's not X,
  it's Y".
- A paragraph that opens with a question (questions go in headings and the
  FAQ).
- A paragraph that opens with a closing summary: Overall, Ultimately, In
  short, All in all, At the end of the day, To wrap up, In a nutshell, The key
  takeaway.
- A paragraph over 160 words. En or em dashes anywhere.
- "I ..." sentences, "in our experience", "our clients", "we tested", "we have
  seen" (experience lives only in a founder quote, BLOG-ENGINE.md section 4
  step 8).
- The exact target phrase in more than 2 headings, or more often than 2 plus
  one per 400 words in the body.
- Any image line in a new post (the publisher draws the only chart).

Warnings (fix, or give the reason in G6): elevate, leverage, robust, unlock,
streamline, foster, navigate, crucial, really, very, truly, simply,
essentially, arguably, comprehensive, holistic, myriad, plethora, pivotal,
paramount, vibrant, bustling, meticulous, endeavour, embark, harness, boost;
a paragraph over 90 words; an average sentence over 18 words; any sentence
over 35 words; an H2 that is neither a question nor a task; a price column
whose header names no currency; a first table with no date in its header; a
first sentence under a heading that only restates it; first 100 words missing
the target query's words.

## 2. Judgement (the reviewer scores these under Clarity)

1. Every paragraph carries at least one of: a fact with its source, a number,
   a worked example, or a decision the buyer can make. A paragraph that
   carries none is cut, not reworded.
2. Concrete nouns: "a 60-second listing walkthrough", "Jobber Core at $49 a
   month", not "video content", "solutions", "your marketing".
3. One idea per paragraph. If a paragraph needs "also" twice, it is two
   paragraphs, or a list.
4. Scenarios come from the niche, with its numbers: "a two-truck HVAC shop
   that misses 40 calls a week", "a coach selling a $2,000 cohort to 30
   people". Never "a business" or "a user".
5. Length follows the answer. A section stops when the buyer's question is
   answered. Nothing is added to reach a word count; the validator's floor is
   800 words and no target is enforced above it.
6. No triplets for rhythm ("fast, simple and affordable"), no moral as the last
   line, no rhetorical question as a transition, no sentence that announces
   what the next one says.
7. Competitors are described by what their own page says, neutrally, and
   linked.

## 3. Before and after (from live posts, November 2026)

**Announcing instead of saying.** From "Missed Call Text Back Cost for
Contractors in 2026":

- Before: "Three things stand out. First, the text messages themselves are
  almost free: 200 SMS segments cost under $2 on both Twilio and HighLevel at
  their published rates."
- After: "The texts themselves are almost free: 200 SMS segments cost under $2
  at Twilio's and HighLevel's published rates."

**Filler that restates the heading.** From "B2B Blog Writing Cost Per Article
in 2026: 9 Real Prices", first line under "How much does a B2B blog post cost
per article?":

- Before: "Here's the full list."
- After: "Thirteen price points from nine vendors, each converted to one
  1,500-word post (our arithmetic from each published rate):"

**A moral instead of a decision.** From the missed call post:

- Before: "The honest version: a meaningful share of your calls go unanswered,
  most people won't leave a voicemail, and nobody has published good data on
  how many call back. Run the numbers on your own phone log instead."
- After: "No public study measures how many missed callers call back. Count
  your own: last month's unanswered calls from new numbers, times your booking
  rate on answered calls."

## 4. SEO and AEO safety (nothing the engine does may hurt the site)

| Rule | How it is enforced |
| --- | --- |
| One live post per question. A near-duplicate of a live title or `targetQuery` is a refresh of that post, never a new post | Topic gate step 1; the publisher refuses a new post whose topic words overlap a live post's by 75% or more, or differ by one word |
| No doorway or city-swap pages: no post that differs from another only by city, state, trade or niche name | Same publisher check; a niche angle goes into the live post as a section |
| No keyword stuffing | Validator: exact target phrase in at most 2 headings, at most 2 + 1 per 400 words in the body |
| No thin posts | G2 (a verifiable gap the top 5 miss) and G9 (Information gain at least 3); not a word count |
| Never mass-publish | Publisher: at most 2 new posts a day and 4 per ISO week, counted from Sanity; refreshes capped separately (2 on weekdays, 3 on Sunday). Refreshes never make room for more new posts |
| Never change a live URL | The publisher never changes a slug on `--refresh`; `--force` is never used |
| Every claim about the world links its primary source | G3, G4, G9 Accuracy; validator source check |
| No images that could be AI-made or unlicensed | Validator: no image lines in new posts; the only images are the cover card and the chart drawn from the post's table |
| No fake dates | `Last checked:` must be today; the publisher refuses a refresh that changes nothing but dates; the page's `dateModified` comes from `lastChecked` |
| Internal links only to live, relevant pages | Validator (pages in the checkout), publisher (`/blog/` links live and after 1 July 2026), G7 (200 on the live site) |
| Kill switch | While `content/blog-data/PAUSE` exists the publisher writes nothing and the engine reports "paused" |
