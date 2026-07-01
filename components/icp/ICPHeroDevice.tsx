import type { IcpKey } from '@/lib/videos';

/**
 * Per-segment hero visual "device" — pure CSS/SVG, no real video, so it ships
 * in the server-rendered HTML and costs nothing to load. One recognizable
 * artifact per audience:
 *   real-estate     → a phone frame showing a property reel
 *   founders        → a LinkedIn post card
 *   coaches         → a funnel / lead-magnet flow
 *   dtc             → a grid of ad variants
 *   business-owners → a search-result + inbound lead card
 *
 * `alt` is a plain descriptive string used as the group aria-label so the
 * decorative device still carries meaning for assistive tech and crawlers.
 */
export default function ICPHeroDevice({ icp, accent, alt }: { icp: IcpKey; accent: string; alt: string }) {
  return (
    <div className="icp-device" role="img" aria-label={alt}>
      {icp === 'real-estate' && <PhoneReel accent={accent} />}
      {icp === 'founders' && <LinkedInCard accent={accent} />}
      {icp === 'coaches' && <FunnelFlow accent={accent} />}
      {icp === 'dtc' && <AdGrid accent={accent} />}
      {icp === 'business-owners' && <InboundCard accent={accent} />}

      <style>{`
        .icp-device { width: 100%; max-width: 380px; margin: 0 auto; }
        .icp-device .dev-frame {
          position: relative; border-radius: 22px; overflow: hidden;
          background: #14110d; border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}

// ── Real estate: a phone showing a property reel ─────────────────────────────
function PhoneReel({ accent }: { accent: string }) {
  return (
    <div className="dev-frame" style={{ aspectRatio: '9 / 16', maxWidth: 260 }}>
      {/* sky-to-ground gradient standing in for a listing shot */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #bcd3e6 0%, #dfe7ce 55%, #b9a389 100%)' }} />
      {/* house silhouette */}
      <svg viewBox="0 0 100 80" style={{ position: 'absolute', bottom: '18%', left: 0, width: '100%' }} aria-hidden="true">
        <path d="M20 45 L50 22 L80 45 L80 78 L20 78 Z" fill="rgba(20,17,13,0.72)" />
        <rect x="44" y="58" width="12" height="20" fill={accent} opacity="0.9" />
        <rect x="28" y="50" width="9" height="9" fill="rgba(255,255,255,0.55)" />
        <rect x="63" y="50" width="9" height="9" fill="rgba(255,255,255,0.55)" />
      </svg>
      {/* address caption bar */}
      <div style={{ position: 'absolute', bottom: 14, left: 12, right: 12 }}>
        <div style={{ height: 8, width: '70%', background: '#fff', borderRadius: 3, marginBottom: 6, opacity: 0.92 }} />
        <div style={{ height: 6, width: '45%', background: 'rgba(255,255,255,0.7)', borderRadius: 3 }} />
      </div>
      {/* play affordance */}
      <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%,-50%)', width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#14110d" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
      </div>
      {/* engagement rail */}
      <div style={{ position: 'absolute', right: 10, top: '48%', display: 'flex', flexDirection: 'column', gap: 14, color: '#fff' }} aria-hidden="true">
        <Heart /><Comment /><Share />
      </div>
    </div>
  );
}

// ── Founders: a LinkedIn post card ───────────────────────────────────────────
function LinkedInCard({ accent }: { accent: string }) {
  return (
    <div className="dev-frame" style={{ aspectRatio: '4 / 5', background: '#161513', padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: accent, opacity: 0.9 }} />
        <div>
          <div style={{ height: 9, width: 96, background: 'rgba(242,238,231,0.85)', borderRadius: 3, marginBottom: 6 }} />
          <div style={{ height: 7, width: 130, background: 'rgba(242,238,231,0.4)', borderRadius: 3 }} />
        </div>
      </div>
      {[92, 100, 100, 78, 100, 64].map((w, i) => (
        <div key={i} style={{ height: 8, width: `${w}%`, background: 'rgba(242,238,231,0.28)', borderRadius: 3, marginBottom: 10 }} />
      ))}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 22, color: 'rgba(242,238,231,0.6)' }} aria-hidden="true">
        <ThumbUp accent={accent} /><Comment /><Share />
      </div>
    </div>
  );
}

// ── Coaches: a lead-magnet → nurture → sale funnel ───────────────────────────
function FunnelFlow({ accent }: { accent: string }) {
  const steps = [
    { label: 'Lead magnet', w: '100%' },
    { label: 'Nurture sequence', w: '74%' },
    { label: 'Enrolled', w: '48%' },
  ];
  return (
    <div className="dev-frame" style={{ aspectRatio: '4 / 5', background: '#161513', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
      {steps.map((s, i) => (
        <div key={s.label} style={{ margin: '0 auto', width: s.w }}>
          <div style={{ background: i === steps.length - 1 ? accent : `${accent}${i === 0 ? '55' : '33'}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center', color: i === steps.length - 1 ? '#fff' : 'rgba(242,238,231,0.9)', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700 }}>
            {s.label}
          </div>
          {i < steps.length - 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── DTC: a grid of ad variants ───────────────────────────────────────────────
function AdGrid({ accent }: { accent: string }) {
  const tiles = ['#1f2b26', '#2a231d', '#241f2b', '#1d2630', accent, '#262321'];
  return (
    <div className="dev-frame" style={{ aspectRatio: '4 / 5', background: '#161513', padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, height: '100%' }}>
        {tiles.map((bg, i) => (
          <div key={i} style={{ background: bg, borderRadius: 10, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ position: 'absolute', top: 8, left: 8, height: 5, width: 22, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />
            <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, height: 5, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
            {i === 4 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>WINNER</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Business owners: a search result + inbound lead ping ──────────────────────
function InboundCard({ accent }: { accent: string }) {
  return (
    <div className="dev-frame" style={{ aspectRatio: '4 / 5', background: '#161513', padding: 20 }}>
      {/* search bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, padding: '10px 14px', marginBottom: 18 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,238,231,0.5)" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
        <div style={{ height: 7, width: '55%', background: 'rgba(242,238,231,0.3)', borderRadius: 3 }} />
      </div>
      {/* top result (you) */}
      <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 12, marginBottom: 16 }}>
        <div style={{ height: 8, width: '80%', background: 'rgba(242,238,231,0.85)', borderRadius: 3, marginBottom: 7 }} />
        <div style={{ height: 6, width: '95%', background: 'rgba(242,238,231,0.35)', borderRadius: 3, marginBottom: 5 }} />
        <div style={{ height: 6, width: '70%', background: 'rgba(242,238,231,0.35)', borderRadius: 3 }} />
      </div>
      {[1, 2].map((i) => (
        <div key={i} style={{ paddingLeft: 12, marginBottom: 14, opacity: 0.5 }}>
          <div style={{ height: 7, width: '65%', background: 'rgba(242,238,231,0.5)', borderRadius: 3, marginBottom: 6 }} />
          <div style={{ height: 5, width: '85%', background: 'rgba(242,238,231,0.25)', borderRadius: 3 }} />
        </div>
      ))}
      {/* inbound lead ping */}
      <div style={{ marginTop: 16, background: `${accent}1f`, border: `1px solid ${accent}55`, borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} aria-hidden="true" />
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#F2EEE7' }}>New inbound lead</div>
      </div>
    </div>
  );
}

// ── shared tiny glyphs ───────────────────────────────────────────────────────
function Heart() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5 8.5 5 10 6 12 8c2-2 3.5-3 5.5-3C21 5 23.5 8.5 21.5 12.5 19 16.65 12 21 12 21z" /></svg>; }
function Comment() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 01-12 7.7L3 21l1.8-6A8.5 8.5 0 1121 11.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Share() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 12v8h16v-8M12 3v13M7 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ThumbUp({ accent }: { accent: string }) { return <svg width="18" height="18" viewBox="0 0 24 24" fill={accent} aria-hidden="true"><path d="M2 10h4v11H2zM22 11a2 2 0 00-2-2h-5l1-4a2 2 0 00-4-1l-4 7v10h11a2 2 0 002-1.6l1.4-7A2 2 0 0022 11z" /></svg>; }
