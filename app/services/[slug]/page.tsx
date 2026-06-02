import { getService, services } from '@/lib/serviceData';
import { notFound } from 'next/navigation';
import ServicePageClient from '@/components/ServicePageClient';

const SITE_URL = 'https://echopulse.media';

export function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const canonical = `${SITE_URL}/services/${slug}`;
  return {
    title: `${service.name} | EchoPulse`,
    description: service.heroSub,
    alternates: { canonical },
    openGraph: {
      title: `${service.name} | EchoPulse`,
      description: service.heroSub,
      url: canonical,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.name} | EchoPulse`,
      description: service.heroSub,
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
    areaServed: [
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Place', name: 'Western Europe' },
    ],
  };

  // Breadcrumb schema — gives Google / answer engines a clean trail
  // (Home → Services → This Service) so the page is eligible for breadcrumb
  // rich snippets and stronger topical context.
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/#services` },
      { '@type': 'ListItem', position: 3, name: service.name, item: `${SITE_URL}/services/${slug}` },
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
      <ServicePageClient service={service} />
    </>
  );
}
