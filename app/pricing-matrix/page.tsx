import type { Metadata } from 'next';
import { ALL_REGION_PRICING } from '@/lib/useGeoPrice';

/**
 * Admin pricing matrix — every region, side-by-side, so Lakshya can
 * sanity-check the prices across markets in one glance.
 *
 *   /pricing-matrix
 *
 * Edit lib/useGeoPrice.ts → PRICING_BY_REGION to change anything. This
 * page renders that constant as a clean table.
 *
 * Hidden from search engines (noindex), but reachable to anyone with the
 * URL. Bookmark it.
 */
export const metadata: Metadata = {
  title: 'EchoPulse — Pricing Matrix (Admin)',
  description: 'Internal: all region pricing side-by-side. Edit lib/useGeoPrice.ts to change.',
  robots: { index: false, follow: false },
};

const REGION_NAMES: Record<string, { full: string; flag: string; population: string }> = {
  US:    { full: 'United States',           flag: '🇺🇸', population: '~340M' },
  CA:    { full: 'Canada',                  flag: '🇨🇦', population: '~40M' },
  EU:    { full: 'European Union (mainland)', flag: '🇪🇺', population: '~450M' },
  UK:    { full: 'United Kingdom',          flag: '🇬🇧', population: '~67M' },
  OTHER: { full: 'Other (default USD)',     flag: '🌍', population: 'all else' },
};

// USD-equivalent helper — purely for at-a-glance comparison. Uses
// approximate FX so Lakshya can spot which markets are under-/over-priced
// at any moment without opening a converter.
const FX_TO_USD: Record<string, number> = {
  USD: 1,
  CAD: 0.73,
  EUR: 1.08,
  GBP: 1.27,
};

function toUsd(currencyCode: string, price: string): string {
  const fx = FX_TO_USD[currencyCode] ?? 1;
  // Strip commas and "+" before parsing
  const n = Number(price.replace(/[,+\s]/g, ''));
  if (!Number.isFinite(n) || n === 0) return '—';
  const usd = n * fx;
  if (usd >= 1000) return `~$${Math.round(usd / 100) / 10}K`;
  return `~$${Math.round(usd)}`;
}

export default function PricingMatrixPage() {
  const regions = Object.keys(ALL_REGION_PRICING) as Array<keyof typeof ALL_REGION_PRICING>;
  // Order so US is leftmost (the anchor market) and OTHER last.
  // 'IN' was dropped in July 2026 — India now falls into OTHER (USD).
  const ordered: Array<keyof typeof ALL_REGION_PRICING> = ['US', 'CA', 'EU', 'UK', 'OTHER'].filter(
    r => regions.includes(r as keyof typeof ALL_REGION_PRICING),
  ) as Array<keyof typeof ALL_REGION_PRICING>;

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0C0C0B',
      color: '#F2EEE7',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '64px 24px',
    }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '6px 14px', background: 'rgba(232,84,26,0.10)',
          border: '1px solid rgba(232,84,26,0.3)', borderRadius: 100,
          fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
          color: '#E8541A', textTransform: 'uppercase', marginBottom: 16,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#E8541A', boxShadow: '0 0 8px #E8541A',
          }} />
          Admin · internal
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          margin: '0 0 12px',
        }}>
          Pricing matrix — every region, one glance.
        </h1>
        <p style={{
          fontSize: 16, color: 'rgba(242,238,231,0.65)',
          lineHeight: 1.6, maxWidth: 740, margin: '0 0 40px',
        }}>
          Source of truth: <code style={codeStyle}>lib/useGeoPrice.ts</code> → <code style={codeStyle}>PRICING_BY_REGION</code>.
          Edit that constant to change prices anywhere — homepage, /order checkout, popup, FAQ all read from it.
        </p>

        {/* Pricing table */}
        <div style={{
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.10)',
          overflow: 'hidden',
          marginBottom: 32,
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 14,
          }}>
            <thead style={{
              background: 'rgba(255,255,255,0.04)',
            }}>
              <tr>
                <th style={thStyle}>Region</th>
                <th style={thStyle}>Currency</th>
                <th style={thStyle}>Pilot (intro)</th>
                <th style={thStyle}>Pilot anchor (strikethrough)</th>
                <th style={thStyle}>Growth (monthly retainer)</th>
                <th style={thStyle}>Full Studio</th>
                <th style={thStyle}>Pilot in USD ≈</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((r, i) => {
                const data = ALL_REGION_PRICING[r];
                const meta = REGION_NAMES[r];
                return (
                  <tr key={r} style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent',
                  }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontWeight: 700 }}>{meta?.flag} {r}</span>
                        <span style={{ fontSize: 11.5, color: 'rgba(242,238,231,0.5)' }}>
                          {meta?.full} · {meta?.population}
                        </span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
                        {data.currency} <span style={{ color: 'rgba(242,238,231,0.45)' }}>({data.currencyCode})</span>
                      </span>
                    </td>
                    <td style={{ ...tdStyle, ...priceStyle, color: '#F2EEE7' }}>
                      {data.currency}{data.pilot}
                    </td>
                    <td style={{ ...tdStyle, color: 'rgba(242,238,231,0.45)', textDecoration: 'line-through' }}>
                      {data.currency}{data.pilotOriginal}
                    </td>
                    <td style={{ ...tdStyle, ...priceStyle }}>
                      {data.currency}{data.growth}
                    </td>
                    <td style={{ ...tdStyle, ...priceStyle }}>
                      {data.currency}{data.full}
                    </td>
                    <td style={{ ...tdStyle, color: 'rgba(242,238,231,0.55)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
                      {toUsd(data.currencyCode, data.pilot)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Health-check panel: flag any region under $100 USD-equivalent */}
        <div style={{
          padding: '20px 24px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          marginBottom: 24,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 800, color: '#E8541A',
            letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12,
          }}>Floor check</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ordered.map(r => {
              const data = ALL_REGION_PRICING[r];
              const fx = FX_TO_USD[data.currencyCode] ?? 1;
              const usd = Number(data.pilot.replace(/[,+\s]/g, '')) * fx;
              const flag = usd < 100;
              return (
                <div key={r} style={{
                  display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5,
                  color: flag ? '#FFB3B3' : 'rgba(242,238,231,0.72)',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: flag ? '#FFB3B3' : '#7CD992',
                  }} />
                  <span style={{ fontWeight: 700, minWidth: 56 }}>{r}</span>
                  <span>Pilot ≈ {toUsd(data.currencyCode, data.pilot)} {flag ? '— below $100 floor, double-check the math' : 'OK'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* How to change pricing */}
        <details style={{
          padding: '18px 22px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
        }}>
          <summary style={{
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            color: '#F2EEE7', listStyle: 'none',
          }}>
            How to change pricing →
          </summary>
          <div style={{
            marginTop: 14, fontSize: 13.5, lineHeight: 1.7,
            color: 'rgba(242,238,231,0.72)',
          }}>
            <ol style={{ paddingLeft: 18, margin: 0 }}>
              <li>Open <code style={codeStyle}>lib/useGeoPrice.ts</code></li>
              <li>Find the constant named <code style={codeStyle}>PRICING_BY_REGION</code></li>
              <li>Edit the values for any region — pilot, pilotOriginal (the strikethrough), growth, full</li>
              <li>Save. Hot reload picks it up immediately on dev. Push to deploy on prod.</li>
              <li>Reload this page (<code style={codeStyle}>/pricing-matrix</code>) to confirm the values</li>
            </ol>
            <div style={{ marginTop: 14 }}>
              Anything you add as a key on the matrix (e.g. <code style={codeStyle}>AU</code>, <code style={codeStyle}>SG</code>)
              also needs a mapping in <code style={codeStyle}>countryToRegion()</code> in the same file. The mappings
              decide which country flag → which row.
            </div>
            <div style={{ marginTop: 14, color: 'rgba(232,84,26,0.85)', fontWeight: 700 }}>
              Floor policy: Pilot should not fall below ~$100 USD-equivalent in any market. Cheaper markets
              cost the same hours to deliver — discounts compound into unprofitable months.
            </div>
          </div>
        </details>

        {/* Preview links */}
        <div style={{
          marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{
            width: '100%', fontSize: 12, fontWeight: 700, color: 'rgba(242,238,231,0.55)',
            letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4,
          }}>
            Preview each market on the live site
          </div>
          {[
            { label: '🇺🇸 US',     url: '/?city=&country=US' },
            { label: '🇨🇦 Canada', url: '/?city=Toronto&country=CA' },
            { label: '🇪🇺 EU',     url: '/?city=Berlin&country=DE' },
            { label: '🇬🇧 UK',     url: '/?city=London&country=GB' },
            { label: '🇮🇳 India',  url: '/?city=Mumbai&country=IN' },
            { label: '📍 Pune',    url: '/?city=Pune&country=IN' },
            { label: '🌍 Other',   url: '/?city=&country=' },
          ].map(p => (
            <a key={p.url} href={p.url} style={{
              padding: '10px 16px',
              background: 'rgba(232,84,26,0.10)',
              border: '1px solid rgba(232,84,26,0.30)',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 700,
              color: '#F2EEE7',
              textDecoration: 'none',
            }}>{p.label} →</a>
          ))}
        </div>
      </div>
    </main>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1,
  color: 'rgba(242,238,231,0.6)',
  textTransform: 'uppercase',
};

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  verticalAlign: 'top',
};

const priceStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
  fontWeight: 700,
};

const codeStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
  fontSize: '0.92em',
  padding: '1px 6px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 4,
  color: '#F2EEE7',
};
