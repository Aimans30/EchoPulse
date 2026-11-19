# Editor rubric (gate G9)

The reviewer reads this file, `style-guide.md`, the draft and the research
log, and nothing else from the writing session. The reviewer did not write
the post and owes it nothing: a fail costs one unpublished day, a wrong post
costs the site's trust. When in doubt, score lower.

## How the engine starts the review

With the Task (Agent) tool, start a new subagent with this prompt, filled in:

    You are the independent editor for an EchoPulse Media blog post. Read
    content/blog-data/editor-rubric.md and content/blog-data/style-guide.md in
    full, then the draft <draft path> and the research log <log path>. Read
    nothing else from this repository except lib/pricing.ts. Follow the rubric
    exactly and return only the verdict block it defines.

Without a Task or Agent tool: write the draft and the log to disk, then do the
review as a separate step that starts by re-reading this file, the style
guide, the draft and the log from disk, and re-opens every source with
WebFetch; do not rely on anything remembered from research. Mark the verdict
`reviewer: self (no subagent tool)`.

The rewrite after a fail is reviewed by a new subagent that is not shown the
first verdict.

## Steps

1. **Numbers.** List every figure in the post: prices, percentages, counts,
   durations, dates of studies. For each, take its source from the research
   log and WebFetch that URL with the prompt "Quote word for word the sentence
   that contains <figure>". Confirmed only if the returned quote contains the
   figure (or the inputs of a sum, which you recompute with node or python).
   Mark each: confirmed, mismatch (quote says something else), not found,
   host failed. Host failed twice for one source counts as not found. If the
   reviewer cannot open sources at all (three hosts in a row), the verdict is
   FAIL with the reason "reviewer could not re-open sources"; never pass a
   post on the writer's quotes alone.
2. **Buyer read.** Read the post once, start to end, as the buyer named by
   `icp` (a real estate agent, a SaaS founder, a home-service owner, a coach,
   a DTC brand owner) deciding whether to spend money this month. Write the
   3 questions that buyer still has after the first paragraph, and where the
   post answers each (heading) or "not answered".
3. **Gap check.** Open the gap table in the research log. Pick 2 of the top 5
   URLs and WebFetch each with "Does this page cover <the gap the log says it
   misses>? Quote the closest sentence." A gap the competitor does cover is
   not a gap.
4. **Style.** Apply part 2 of the style guide. List every paragraph that
   carries no fact, number, example or decision, by its first 8 words.
5. **Score** the six criteria below. Then write the fixes.

## Scoring rules (against inflation)

- Start every criterion at 3 and move only with evidence. Every score cites
  its evidence: a quote from the draft, a step 1 count, or a step 3 result.
  A score with no evidence counts as 2.
- 5 means you could not name one improvement for that criterion. Write
  "no improvement found" next to it, or the score is 4.
- List at least 3 fixes even when the post passes, most valuable first, each
  as "where: what to change". A fix that could apply to any post ("make it
  more engaging") does not count.
- Do not read the writer's gate lines or scores; you are not given them.

## Criteria and anchors

| Criterion | 1 | 3 | 5 |
| --- | --- | --- | --- |
| **Answer quality** | Paragraph 1 does not answer the title, or hedges ("it depends") without numbers | Paragraph 1 gives the number with unit and date, but the buyer's first follow-up question (step 2) is answered only far down or not at all | Paragraph 1 answers fully for the named buyer; all 3 step 2 questions are answered under clear headings |
| **Information gain** | Everything in the post is in one of the top 5 results | The post fills 1 verified gap from the gap table, or fills 2 that are minor (a re-dated price) | The post fills 2 or more verified gaps a buyer would act on (a price the top 5 do not have, a traced correction, a total no one computed), and step 3 confirmed them |
| **Accuracy** | 2 or more figures mismatch or cannot be found | Exactly 1 figure is not confirmed, or a sum is wrong | Every figure confirmed by a quote opened today or recomputed; every "could not verify" is stated in the post |
| **Clarity** | Over 4 paragraphs carry nothing (step 4), or style guide part 2 is broken throughout | 2 or 3 empty paragraphs, or abstract nouns where the niche's nouns exist | No empty paragraph; niche scenarios with numbers; one idea per paragraph; reads cleanly on a phone |
| **Asset usefulness** | No table, or a table a buyer cannot act on (no units, no dates, blank cells) | The table compares the right things but misses a column the buyer needs (total, unit, date, what is included) | The buyer can make the decision from the table (and chart) alone: units, date, totals, "Not published" where true, every row sourced |
| **Ask fit** | The EchoPulse section or the ask does not match the reader (footage on a call post, a price that is not in `lib/pricing.ts`, a sales tone in the answer) | Correct but generic: it does not say what we would do for this buyer | Under 90 words, says what we do for this exact buyer, the correct ask for the service, prices exactly as in `lib/pricing.ts`, no pressure |

Accuracy is 5 or the post fails. A figure fixed or removed in the rewrite
makes it 5 again.

## Pass mark

Pass only if all three hold: Accuracy 5; every other criterion 3 or more;
total 22 or more of 30. Otherwise: fail.

On a fail the writer makes one rewrite that applies every listed fix, then a
fresh review. A second fail: publish nothing, report why.

## Verdict block (return exactly this, filled in)

    EDITOR VERDICT: PASS | FAIL (review 1 | review 2), reviewer: subagent | self (no subagent tool)
    Numbers: n figures, n confirmed, n mismatch, n not found, n recomputed
    Mismatch / not found: <figure>: <what the source says, quoted> ...
    Buyer questions: 1. <q> -> <heading or "not answered"> 2. ... 3. ...
    Gap check: <url> covers "<gap>"? yes/no, "<closest sentence>"; <url> ...
    Empty paragraphs: "<first 8 words>" ...
    Scores: answer n, gain n, accuracy n, clarity n, asset n, ask n = total n/30
    Evidence: answer "<quote>"; gain <...>; accuracy <...>; clarity <...>; asset <...>; ask "<quote>"
    Fixes: 1. <where: what> 2. <where: what> 3. <where: what>
