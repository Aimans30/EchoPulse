# Founder notes

Written by Lakshya Soni only. The blog engine reads this file every run. It
is the only source of first-hand experience a post may carry: when a note
fits a post, the engine may quote it, word for word, attributed to Lakshya
with the note's date. Nothing else counts as experience, and no note means no
experience claims in the post.

## What to write here

Real things you saw or did, each dated the day it happened, in a sentence or
three a buyer would find useful. Good notes are specific:

1. A price you actually saw: whose, for what, where you saw it, the date, the
   currency. ("Fiverr gig X listed a 60-second reel edit at $45 on 3 Nov.")
2. How long a job really takes in your workflow, with the numbers.
3. What raw footage, briefs or logins usually look like when they arrive, and
   what that does to the result.
4. The mistake you see most often from agents, founders, trade owners, coaches
   or DTC brands, and what you tell them.
5. An opinion you would defend on a call ("For under 3 listings a month, pay
   per video").
6. A client-safe anecdote: no client name, no detail that identifies one,
   unless the client agreed in writing (say so in Context).
7. What a tool really costs once you use it (seats, overages, add-ons), with
   the date.

Do not write EchoPulse prices, plans, turnaround or contract terms here (the
engine takes those only from `lib/pricing.ts`), and never a notice period. No
results claims for clients. No en or em dashes.

## Format (the validator checks quotes against it)

One note per heading. The heading line is exact: the date, `public: yes` or
`public: no`, and the topics. `Quote:` is the only text the engine may put in
a post, in straight double quotes, on one line. `Context:` is never published.

```
## 2026-11-12 | public: yes | topics: real estate video, listing video cost
Type: opinion
Quote: "Most agents send 40 clips for a 60-second listing video. Six good ones and a walkthrough in one take would do."
Context: Seen on three free-sample jobs this month. Not for quoting.
```

The block above is an example and is ignored. Write real notes below this
line, newest first.

## Rules the engine follows

- Uses at most one note per post, only a note marked `public: yes` whose
  topics fit the post's `icp` and `service`.
- Quotes the `Quote:` line word for word, in this form, in the section it
  supports:

      > **Lakshya Soni, founder of EchoPulse Media, 12 November 2026:** "Most agents send 40 clips for a 60-second listing video. Six good ones and a walkthrough in one take would do."

- Never paraphrases a note, extends it, or turns it into "we found".
- Skips a note older than 18 months, and a price note older than 12 months.
- Names the note used in the run report, or "Founder note: none".

## Notes
