# Fact check and Google guidelines (gate G9F)

This is the last gate before publishing. It runs after G9 passes, on the exact
file that will be published, for every new post and every refresh. It is done
by a separate Sonnet subagent that did not write the post and did not do the
G9 review. Its only job is to find anything false, unsupported or against
Google's guidelines. A fail costs one unpublished day. A wrong post costs the
site's trust and can cost rankings for the whole domain. When in doubt, fail.

## How the engine starts the check

With the Task (Agent) tool, start a new subagent with `model: "sonnet"` and
this prompt, filled in:

    You are the fact checker for an EchoPulse Media blog post that is about to
    be published on echopulse.media. You did not write it. Read
    content/blog-data/fact-check-rubric.md in full, then lib/pricing.ts,
    content/blog-data/founder-notes.md, and the draft <draft path>. Do not read
    the research log, the gate lines or the editor verdict: check the post
    against the web yourself. Research with WebSearch and WebFetch only; never
    open or drive a browser. Follow the rubric exactly and return only the
    verdict block it defines.

If the subagent tool cannot take a model, start it anyway and mark the
verdict `model: default`. Without any subagent tool, do the check as a
separate step that starts by re-reading this file and the draft from disk,
re-opens every source fresh, and is marked `checker: self (no subagent tool)`.

The re-check after a fail is done by a new subagent that is not shown the
first verdict.

## Steps

1. **Every claim, not only numbers.** List every checkable claim in the post:
   figures, prices, percentages, dates, plan names and what a plan includes,
   feature claims about a tool or company ("X has no API", "Y offers refunds"),
   quotes, who said what, rankings, laws and platform rules, "first", "only",
   "most" and "best" claims. Headings, the table, the FAQ, the cite block, the
   chart column and image captions count as part of the post.
2. **Check each claim against a source opened today.** For a claim with a
   link in the post, WebFetch that URL with the prompt "Quote word for word
   the sentence that supports or contradicts: <claim>". For a claim with no
   link, WebSearch for a primary source (the vendor's own page, the official
   filing, the study itself) and quote it. Recompute every sum, average,
   percentage and conversion with node or python. Mark each claim:
   - `confirmed`: a quote opened today supports it as written (same number,
     same unit, same period, same plan);
   - `outdated`: the source supported it once but now says something else;
   - `mismatch`: the source says something different;
   - `unsupported`: no source found after a real search, and the post does not
     say "not published" or "could not verify";
   - `host failed`: the page would not open twice. A claim whose only source
     failed counts as unsupported.
   A blog, listicle or AI answer repeating a number is not a primary source
   for it. If three hosts in a row fail, the verdict is FAIL with the reason
   "checker could not open sources".
3. **EchoPulse claims.** Every EchoPulse price, plan name and inclusion must
   match `lib/pricing.ts` exactly. No retired tier, no cancellation notice
   period, no discount the file does not have. No client name, client result,
   client count, testimonial, review count or rating unless it is in
   `founder-notes.md` word for word. No "I tested", "we tested", "in our
   experience", "we've helped hundreds" or any other experience the run did
   not have. Founder quotes must match `founder-notes.md` word for word.
4. **Competitors and named people.** Every statement about a named company or
   person must be accurate, current and fair: their price as their own page
   shows it today, no invented weakness, no "scam", "worst" or similar, no
   claim about their quality we cannot source. A ranking or "best" list must
   say how it was ranked.
5. **Google guidelines.** Check the post against Google Search Essentials, the
   spam policies and the helpful content guidance. Fail the post for any of:
   - **Not people-first:** it exists to rank, not to help. It restates the top
     results with nothing new, pads to a word count, or answers a question
     other than the one in the title.
   - **Scaled or templated content:** it reads like the same template as other
     posts with the nouns swapped, or it is one of several near-duplicates of
     a live post on this site (check the live post list the run gave you, or
     `site:echopulse.media <topic>` on WebSearch).
   - **Fake experience or expertise (E-E-A-T):** first-hand testing, client
     work, photos or results the run did not have; an author credential that
     is not in `founder-notes.md`.
   - **Misleading title or excerpt:** the title promises something the post
     does not deliver (a price list with no prices, "2026 data" with old
     figures, "free" when it is not).
   - **Keyword stuffing or hidden text:** the target phrase repeated
     unnaturally, lists of cities or keywords, text meant for crawlers.
   - **Fake reviews or ratings:** star ratings, "reviews" or "testimonials"
     that are not real and sourced; review-style claims about products the
     run never used.
   - **Structured data that does not match the page:** an FAQ answer, rating,
     price or date in the frontmatter that is not visible in the post as
     written.
   - **Dates:** a "Last checked" or "updated" date for figures that were not
     re-opened, or a year in the title when the figures are older.
   - **YMYL risk:** legal, tax, financial or health statements given as advice
     without a primary source, or that a reader could act on and be harmed.
   - **Links:** paid-looking or keyword-anchored outbound links, links to
     spam or unsafe pages, affiliate links without disclosure.
   - **Copyright:** text copied from a source beyond a short quote with
     attribution, or images the post has no right to use.
6. **Fixes.** For every claim not `confirmed` and every guideline problem,
   write the exact fix: the corrected sentence with its source URL and quote,
   or "delete: <sentence>", or "say not published: <sentence>".

## Pass mark

PASS only if all of these hold: every claim is `confirmed`, or the post itself
says plainly that it could not be verified; zero `mismatch`, `outdated` or
`unsupported`; every step 3 and step 4 item is clean; zero guideline problems
in step 5. Anything else: FAIL.

On a fail the writer applies every fix (fix or delete, never argue), re-runs
G6, and a fresh Sonnet subagent checks the new file. A second fail: publish
nothing and report why, with both verdict blocks.

## Verdict block (return exactly this, filled in)

    FACT CHECK: PASS | FAIL (check 1 | check 2), checker: subagent | self (no subagent tool), model: sonnet | default
    Claims: n total, n confirmed, n outdated, n mismatch, n unsupported, n recomputed
    Problems: <claim as written> -> <status>: <what the source says, quoted, URL> ...
    EchoPulse claims: prices match lib/pricing.ts yes/no; client or experience claims <none | list>
    Competitors and people: <clean | list>
    Google guidelines: <clean | each problem: policy -> where in the post>
    Fixes: 1. <where: exact change> 2. ...
