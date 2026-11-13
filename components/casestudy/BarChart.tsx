import type { CaseStudyBars } from '@/lib/caseStudyData';

/**
 * Small horizontal bar chart, pure CSS. Each bar is a list item so the label
 * and the displayed value are real text for assistive tech and crawlers; the
 * drawn bar itself is decorative (aria-hidden). Bar width is value / max of the
 * series, so the longest bar always fills the track and nothing is truncated.
 */
export default function BarChart({ data }: { data: CaseStudyBars }) {
  const max = Math.max(...data.items.map((i) => i.value), 0) || 1;
  return (
    <figure className="cs-bars">
      <h3 className="cs-bars-title">{data.title}</h3>
      <ul className="cs-bars-list">
        {data.items.map((it) => (
          <li className="cs-bars-row" key={it.label}>
            <span className="cs-bars-label">{it.label}</span>
            <span className="cs-bars-track" aria-hidden="true">
              <span className="cs-bars-fill" style={{ width: `${Math.max((it.value / max) * 100, 0)}%` }} />
            </span>
            <span className="cs-bars-val">{it.display}</span>
          </li>
        ))}
      </ul>
      <figcaption className="cs-bars-caption">{data.caption}</figcaption>
    </figure>
  );
}
