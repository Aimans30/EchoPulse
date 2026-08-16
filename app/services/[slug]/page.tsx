import { getService, services } from '@/lib/serviceData';
import { notFound } from 'next/navigation';
import ServicePageClient from '@/components/ServicePageClient';
import { AREA_SERVED } from '@/lib/schema';

const SITE_URL = 'https://echopulse.media';

export function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const canonical = `${SITE_URL}/services/${slug}`;

  // `title` used to be a plain string, which the root layout's
  // `template: "%s | EchoPulse Media"` then wrapped — producing
  // "Video Editing | EchoPulse | EchoPulse Media". `absolute` opts out of the
  // template so the brand appears exactly once. The "for Founders" qualifier
  // is what makes this rank for a query someone actually types.
  const pageTitle = `${service.name} Services for Founders | EchoPulse`;

  return {
    title: { absolute: pageTitle },
    // `metaDescription`, not `heroSub`. heroSub is the on-page pitch paragraph
    // (251 to 448 chars depending on the service) and Google truncates around
    // 155, so every one of these was getting cut mid-sentence in the SERP.
    description: service.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description: service.metaDescription,
      url: canonical,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  // Service-specific JSON-LD — gives AI agents a structured record of the
  // offering, the provider (EchoPulse), and the parent organization so this
  // page can be cited cleanly in answer-engine results.
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/services/${slug}#service`,
    name: service.name,
    description: service.heroSub,
    serviceType: service.name,
    url: `${SITE_URL}/services/${slug}`,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: AREA_SERVED,
  };

  // Breadcrumb schema — gives Google / answer engines a clean trail
  // (Home → Services → This Service) so the page is eligible for breadcrumb
  // rich snippets and stronger topical context.
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    // Two levels, not three. The middle level used to be
    // `${SITE_URL}/#services`, but a fragment resolves to the homepage, so
    // positions 1 and 2 pointed at the same URL. A trail that visits the same
    // page twice is malformed and Google drops the whole breadcrumb, which is
    // part of why Search Appearance shows nothing. There is no standalone
    // /services index page to point at, so the honest trail is Home > Service.
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: service.name, item: `${SITE_URL}/services/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Service pages had no <main> landmark at all, so the skip-to-content
          link in the root layout pointed at nothing and screen readers had no
          way to jump past the nav. Wrapping here rather than inside
          ServicePageClient keeps the client component focused on presentation. */}
      <main id="main">
        <ServicePageClient service={service} />
      </main>
    </>
  );
}
