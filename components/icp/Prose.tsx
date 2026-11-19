import type { ReactNode } from 'react';

/**
 * Splits copy into sentences without dropping any text. A sentence ends at
 * . ! or ? (optionally followed by a closing quote or bracket) when the next
 * word starts with a capital, a digit, a quote or a currency sign, so figures
 * such as "$1.5K" or "4.5" are never cut.
 */
export function sentences(text: string): string[] {
  return text
    .trim()
    .split(/(?<=[.!?]["'”’)]?)\s+(?=["'“‘$A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Groups sentences into paragraphs of at most `max`, spread evenly. */
export function chunk(text: string, max = 3): string[][] {
  const s = sentences(text);
  if (s.length <= max) return [s];
  const groups = Math.ceil(s.length / max);
  const size = Math.ceil(s.length / groups);
  const out: string[][] = [];
  for (let i = 0; i < s.length; i += size) out.push(s.slice(i, i + size));
  return out;
}

/**
 * Renders long copy as short, scannable paragraphs: every source paragraph is
 * kept word for word, split so no paragraph runs past three sentences, and
 * the first sentence of each source paragraph is set in bold as a lead-in.
 */
export default function Prose({
  paragraphs,
  className = 'fn-prose',
  leadIn = true,
}: {
  paragraphs: string[];
  className?: string;
  leadIn?: boolean;
}): ReactNode {
  return (
    <div className={className}>
      {paragraphs.flatMap((para, pi) =>
        chunk(para).map((group, gi) => {
          const bold = leadIn && gi === 0 && group.length > 1;
          return (
            <p key={`${pi}-${gi}`}>
              {bold ? (
                <>
                  <strong>{group[0]}</strong> {group.slice(1).join(' ')}
                </>
              ) : (
                group.join(' ')
              )}
            </p>
          );
        }),
      )}
    </div>
  );
}
