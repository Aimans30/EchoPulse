/**
 * Sticky in-page section nav. Desktop only (hidden under 1000px by the page
 * stylesheet). Plain anchor links, no scroll-spy and no client JavaScript, so
 * it costs nothing and works before hydration. The page only passes sections
 * that actually render for the study.
 */
export type SectionNavItem = { id: string; label: string };

export default function SectionNav({ items }: { items: SectionNavItem[] }) {
  if (items.length < 2) return null;
  return (
    <div className="cs-secnav-wrap">
      <nav className="cs-secnav" aria-label="On this page">
        {items.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
