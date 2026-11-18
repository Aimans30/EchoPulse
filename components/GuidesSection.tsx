import Link from 'next/link';
import type { Guide } from '@/lib/blogLinks';

/**
 * "Guides for {audience}" block for ICP and service pages. Plain links in the
 * initial HTML (no client JS) so crawlers and AI tools follow them. Renders
 * nothing when there are no matching posts, so a page never shows an empty
 * heading.
 */
export default function GuidesSection({
  heading,
  intro,
  guides,
  dark = false,
}: {
  heading: string;
  intro?: string;
  guides: Guide[];
  dark?: boolean;
}) {
  if (!guides.length) return null;
  const fg = dark ? '#F2EEE7' : '#0C0C0B';
  const muted = dark ? 'rgba(242,238,231,0.62)' : '#6E6B63';
  return (
    <section
      id="guides"
      aria-labelledby="guides-heading"
      style={{ padding: '72px 56px', background: dark ? '#0C0C0B' : '#F2EEE7', color: fg }}
      className="guides-section"
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <p className="gd-eyebrow" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#E8541A', margin: '0 0 12px' }}>
          Read before you book
        </p>
        <h2 id="guides-heading" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 900, letterSpacing: '-1.2px', lineHeight: 1.08, margin: '0 0 10px' }}>
          {heading}
        </h2>
        {intro ? <p style={{ color: muted, fontSize: 15, lineHeight: 1.6, maxWidth: 640, margin: '0 0 28px' }}>{intro}</p> : null}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: 14,
          }}
        >
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/blog/${g.slug}`}
                data-cursor-hover
                style={{
                  display: 'block',
                  height: '100%',
                  padding: '18px 18px 16px',
                  borderRadius: 16,
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
                  border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.85)',
                  color: fg,
                  textDecoration: 'none',
                }}
              >
                <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>{g.title}</span>
                {g.excerpt ? (
                  <span className="gd-excerpt" style={{ display: 'block', fontSize: 13, lineHeight: 1.5, color: muted }}>
                    {g.excerpt.length > 120 ? `${g.excerpt.slice(0, 117)}...` : g.excerpt}
                  </span>
                ) : null}
                <span className="gd-more" style={{ display: 'inline-block', marginTop: 10, fontSize: 12, fontWeight: 700, color: '#E8541A' }}>Read the guide &rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="gd-note" style={{ marginTop: 22, fontSize: 13, color: muted }}>
          <Link href="/blog" style={{ color: fg, fontWeight: 600 }}>All guides</Link> are sourced, dated and written by the people who do the work.
        </p>
      </div>
      <style>{`@media (max-width: 640px) { .guides-section { padding: 48px 20px !important; } }`}</style>
    </section>
  );
}
