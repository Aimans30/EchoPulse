# Run report template

The blog engine ends every run with this report, in this order
(BLOG-ENGINE.md section 9). Fill every line; write "none" only when true. The
report goes to the owner only. Nothing in it is published or sent by the
engine.

## 1. Run

Date, weekday, niche, spec version, and what was done: new asset, trending,
weekday refresh, Sunday, nothing, paused, or weekly cap reached. The
refresh list's `NEW POSTS THIS ISO WEEK` line, copied.

## 2. Live

For each post: title, URL, `postType`, word count, chart yes/no.

## 3. Why this post, in one line

`Why Google should rank this over the current #1 (<url>): <the verified gap
it fills, with its number>.` If you cannot write this line with a fact, the
post should not have been published.

## 4. Top 5 gap table (gate G2)

    Target query: "<query>", searched <date>
    | # | URL | Kind | Updated | Covers | Misses or gets wrong (verifiable) |
    | 1 | ... | vendor page / publisher / forum / listicle / official | date or "none shown" | ... | ... |
    Gaps the post fills: <gap> -> <heading or table in the post>; <gap> -> ...

## 5. Gates

The evidence lines G1 to G10 in the shapes in BLOG-ENGINE.md section 7.
`G<n>: FAILED, <why>` for a gate that failed.

## 6. Editor verdict (gate G9)

The verdict block(s) exactly as the reviewer returned them, review 1 and,
if there was one, review 2. Then `Fixes applied:` with each fix and what was
changed, or `not applied: <why>`.

## 7. Founder note

`Founder note: <date> "<first 8 words>" in <heading>` or `Founder note: none
(<no public note fits | file has no notes>)`.

## 8. Money page and links

`moneyPage`, and any link that fell back because a page did not return 200.

## 9. What is new

The `whatsNew` sentence, the cite block text, and which cluster gap was filled.

## 10. Could not verify

Each claim looked for, where, and what the post says instead.

## 11. Refresh

Slug, tier (T, P, A, B, C), the export date the list printed, what changed,
the dry run's `cover:` and `year:` lines.

## 12. Trending

The event, its date and source URL, and the "Because of this" sentence. Or
"Trending: none".

## 13. Distribution kit (for the owner to use or ignore)

The engine posts nothing, sends nothing and looks up no contact details.
Every fact in the kit is in the published post.

- **LinkedIn draft**, in Lakshya's voice, 80 to 160 words: line 1 is the
  finding with its number; then 2 or 3 short lines from the table; then the
  post URL. "I" is allowed here because the owner posts it himself, but it
  states no experience that is not in `founder-notes.md`. No hashtags beyond
  two, no emojis, no dashes, no "game-changer" language (style guide part 1).
- **Forum answer**, 2 sentences: sentence 1 answers a buyer's question from
  the post with one number and its source; sentence 2 links the post and
  discloses it ("I run the studio that published this: <url>"). Name 1 thread
  URL found during research where it would answer the question, if there is
  one.
- **People to tell**, up to 3: a person or site the post cites (a researcher,
  a trade body, a publisher, never a competitor's sales page), the URL of
  their page, and the one sentence of our post that uses their work. Only
  their page's public contact or author URL, if it shows one.

## 14. Sunday only

The outreach targets (BLOG-ENGINE.md section 8).

## 15. Blockers

Publisher failed, token refused, a host that would not open, a page that did
not return 200, a post that could not be pulled, cap reached, paused. Send a
push notification only for a blocker or a run that published nothing.
