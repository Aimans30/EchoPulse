import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  BadgeCheck,
  Clapperboard,
  Code2,
  Compass,
  Film,
  Gauge,
  KeyRound,
  Layers,
  LayoutTemplate,
  LifeBuoy,
  ListOrdered,
  Megaphone,
  Sparkles,
  Split,
  Target,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import type { CaseStudyWorkstream } from '@/lib/caseStudyData';
import { Rise } from './motion';
import { PhoneFrame } from './Frames';

const ICONS: Record<string, LucideIcon> = {
  layout: LayoutTemplate,
  compass: Compass,
  layers: Layers,
  target: Target,
  sparkles: Sparkles,
  user: UserRound,
  megaphone: Megaphone,
  activity: Activity,
  split: Split,
  list: ListOrdered,
  badge: BadgeCheck,
  code: Code2,
  gauge: Gauge,
  lifebuoy: LifeBuoy,
  key: KeyRound,
  film: Film,
  clapperboard: Clapperboard,
};

/**
 * The work as a vertical timeline. Each step shows its marker, when or where
 * it happened, the one-line summary and its number; the full detail lives in
 * a <details> underneath, so it is in the server HTML for crawlers and answer
 * engines but does not fill the screen for a reader who is scanning.
 */
export default function WorkTimeline({ items }: { items: CaseStudyWorkstream[] }) {
  return (
    <ol className="cs-tl">
      {items.map((w, i) => {
        const Icon = (w.icon && ICONS[w.icon]) || Layers;
        const media = (w.media ?? []).slice(0, 3);
        const tall = media.length > 0 && media[0].height > media[0].width * 1.5;
        return (
          <Rise as="li" key={w.name} className="cs-tl-step" delay={Math.min(i * 0.03, 0.12)}>
            <span className="cs-tl-marker" aria-hidden="true">
              <Icon size={18} strokeWidth={1.8} />
            </span>
            <div className="cs-tl-body">
              <p className="cs-tl-when">
                <span>{String(i + 1).padStart(2, '0')}</span>
                {w.when && <span>{w.when}</span>}
              </p>
              <div className={`cs-tl-main${w.stat ? ' has-stat' : ''}`}>
                <div>
                  <h3 className="cs-tl-title">{w.name}</h3>
                  <p className="cs-tl-summary">{w.summary}</p>
                </div>
                {w.stat && (
                  <p className="cs-tl-stat">
                    <strong>{w.stat.value}</strong>
                    <span>{w.stat.label}</span>
                  </p>
                )}
              </div>
              {media.length > 0 && (
                <ul className={`cs-tl-media${tall ? ' is-tall' : ''}`}>
                  {media.map((m) => (
                    <li key={m.src}>
                      <figure>
                        {tall ? (
                          <PhoneFrame>
                            <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes="(max-width: 760px) 30vw, 170px" className="cs-shot" />
                          </PhoneFrame>
                        ) : (
                          <div className="cs-tl-still">
                            <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes="(max-width: 760px) 90vw, 420px" className="cs-shot" />
                          </div>
                        )}
                        {m.caption && <figcaption className="cs-caption">{m.caption}</figcaption>}
                      </figure>
                    </li>
                  ))}
                </ul>
              )}
              <details className="cs-more">
                <summary>
                  <span>How it was done</span>
                  <span className="cs-more-count">{w.points.length} points</span>
                </summary>
                <div className="cs-more-body">
                  <ul className="cs-points">
                    {w.points.map((p) => (
                      <li key={p.slice(0, 40)}>{p}</li>
                    ))}
                  </ul>
                  {w.serviceSlug && (
                    <Link className="cs-arrowlink" href={`/services/${w.serviceSlug}`}>
                      How this service works <span aria-hidden="true">&rarr;</span>
                    </Link>
                  )}
                </div>
              </details>
            </div>
          </Rise>
        );
      })}
    </ol>
  );
}
