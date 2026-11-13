import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudyWorkstream } from '@/lib/caseStudyData';
import Reveal from '@/components/icp/Reveal';

/**
 * Workstreams as native <details> accordions. No JavaScript is needed to open
 * or close them, and every point stays in the server-rendered HTML whether the
 * row is open or not. The first row is open by default so the page shows what
 * an opened row looks like without the reader having to guess.
 */
export default function WorkstreamList({ items }: { items: CaseStudyWorkstream[] }) {
  return (
    <ol className="cs-work-list">
      {items.map((w, i) => {
        const media = (w.media ?? []).slice(0, 3);
        return (
          <Reveal as="li" key={w.name} delay={Math.min(i * 0.04, 0.16)}>
            <details className="cs-work" open={i === 0}>
              <summary className="cs-work-sum">
                <span className="cs-work-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="cs-work-title">{w.name}</h3>
                <span className="cs-work-summary">{w.summary}</span>
                {w.stat && (
                  <span className="cs-stat">
                    <span className="cs-stat-value">{w.stat.value}</span>
                    <span className="cs-stat-label">{w.stat.label}</span>
                  </span>
                )}
                <span className="cs-chev" aria-hidden="true" />
              </summary>
              <div className="cs-work-body" data-media={media.length > 0 ? 'true' : 'false'}>
                <div>
                  <ul className="cs-work-points">
                    {w.points.map((p) => (
                      <li key={p.slice(0, 40)}>{p}</li>
                    ))}
                  </ul>
                  {w.serviceSlug && (
                    <Link className="cs-work-link" href={`/services/${w.serviceSlug}`}>
                      How this service works
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  )}
                </div>
                {media.length > 0 && (
                  <ul className="cs-work-media">
                    {media.map((m) => (
                      <li key={m.src}>
                        <figure>
                          <div className="cs-still">
                            <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes="(max-width: 760px) 30vw, 140px" />
                          </div>
                          {m.caption && <figcaption>{m.caption}</figcaption>}
                        </figure>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          </Reveal>
        );
      })}
    </ol>
  );
}
