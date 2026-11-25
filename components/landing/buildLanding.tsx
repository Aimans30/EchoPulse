import type { Metadata } from 'next';
import OfferLanding from '@/components/landing/OfferLanding';
import { LandingDetails, LandingIntro } from '@/components/landing/LandingSections';
import type { LandingPage } from '@/lib/landingPages';
import { PRESENCE } from '@/lib/pricing';
import { AREA_SERVED } from '@/lib/schema';
import { ogImages } from '@/lib/ogImages';

const SITE_URL = 'https://echopulse.media';

export function landingMetadata(page: LandingPage): Metadata {
  const url = `${SITE_URL}/${page.slug}`;
  const full = `${page.metaTitle} | EchoPulse Media`;
  return {
    // absolute: the title already names the offer; the brand rides in OG.
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: full, description: page.metaDescription, url, siteName: 'EchoPulse Media', type: 'website', images: ogImages() },
    twitter: { card: 'summary_large_image', title: full, description: page.metaDescription, images: ogImages() },
  };
}

/** The page: same hero and sections as the homepage, plus Service, Offer and FAQPage schema that match the visible text. */
export function LandingPageView({ page }: { page: LandingPage }) {
  const url = `${SITE_URL}/${page.slug}`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: page.hero.eyebrow,
        serviceType: page.serviceType,
        description: page.metaDescription,
        url,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: AREA_SERVED,
        offers: {
          '@type': 'Offer',
          name: PRESENCE.name,
          price: PRESENCE.priceUsd,
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: PRESENCE.priceUsd,
            priceCurrency: 'USD',
            unitText: 'MONTH',
          },
          url,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: page.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  const hero = {
    eyebrow: page.hero.eyebrow,
    lines: [
      <>{page.hero.line1}</>,
      <>{page.hero.line2Plain}<span className="hl-accent">{page.hero.line2Accent}</span></>,
    ] as [React.ReactNode, React.ReactNode],
    sub: (
      <>
        <span>{page.hero.sub}</span>{' '}
        <strong style={{ color: '#0C0C0B', fontWeight: 600 }}>{page.hero.subStrong}</strong>
      </>
    ),
    trackPrefix: page.track,
    stats: page.hero.stats,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <OfferLanding hero={hero} intro={<LandingIntro page={page} />} details={<LandingDetails page={page} />} />
    </>
  );
}
