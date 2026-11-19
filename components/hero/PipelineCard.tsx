import { PIPELINE_STEPS } from './heroStyles';

/**
 * "Every week, done for you": footage to booked call. Pure markup; the pulse,
 * rail fill and ticks are CSS keyframes on the shared 12 s loop (heroStyles.ts),
 * paused until HeroStage marks the stage as running.
 */

const ICONS: Record<string, React.ReactNode> = {
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12" />
    </>
  ),
  browser: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
};

export default function PipelineCard() {
  return (
    <div className="hs-card hs-pipe hs-anim">
      <div className="hs-hd">
        <span className="hs-kick">Every week</span>
        <em>Done for you</em>
      </div>
      <div className="hs-nodes">
        <div className="hs-rail">
          <i />
        </div>
        <div className="hs-pulse" />
        {PIPELINE_STEPS.map((step, i) => (
          <div
            key={step.name}
            className={`hs-node${i === PIPELINE_STEPS.length - 1 ? ' hs-last' : ''}`}
            data-i={i}
            style={{ '--i': i } as React.CSSProperties}
          >
            <div className="hs-c">
              <svg className="hs-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[step.icon] ?? <path d={step.icon} />}
              </svg>
              <span className="hs-on">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </span>
            </div>
            <div className="hs-tx">
              <strong>{step.name}</strong>
              <small>{step.sub}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
