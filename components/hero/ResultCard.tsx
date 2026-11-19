/**
 * The one published result, as a card beside the frame (desktop) or an inline
 * chip under the pipeline (stacked). Same figures as the proof pill under the
 * hero buttons and the case study: 5.8 to 4,803 Google impressions a day,
 * April to November 2026, from Search Console. The hidden separators make the
 * text read as one line when the card is laid out in blocks.
 */
export default function ResultCard() {
  return (
    <div className="hs-card hs-result">
      <span className="hs-kick">MagicBNB</span>
      <svg className="hs-sp" viewBox="0 0 56 24" fill="none" aria-hidden="true">
        <path d="M1 22 C 14 22, 22 20, 30 16 S 44 6, 55 2" stroke="#E8541A" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <strong className="hs-num">
        5.8 <span>&rarr;</span> 4,803
      </strong>{' '}
      <span className="hs-fig-tx">
        <span className="hs-lab">
          Google impressions a day<span className="hs-sep">, </span>
        </span>
        <span className="hs-src">
          April to November 2026<span className="hs-sep">, </span>
          <br className="hs-br" />
          Search Console
        </span>
      </span>
    </div>
  );
}
