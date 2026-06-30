import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getIcp, icps } from '@/lib/icpData';
import { videosForIcp } from '@/lib/videos';
import ICPPageClient from '@/components/ICPPageClient';

const SITE_URL = 'https://echopulse.media';

// Only the 5 ICP slugs are valid here. dynamicParams=false makes every other
// path under this dynamic segment 404 instead of rendering an empty page, so
// /[icp] can't swallow unknown top-level URLs.
export const dynamicParams = false;

export function generateStaticParams() {
  return icps.map((i) => ({ icp: i.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ icp: string }> }): Promise<Metadata> {
  const { icp } = await params;
  const data = getIcp(icp);
  if (!data) return {};
  const canonical = `${SITE_URL}/${data.key}`;
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: canonical,
      siteName: 'EchoPulse Media',
      type: 'website',
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDescription,
      images: ['/og-image.png'],
    },
  };
}

export default async function IcpLandingPage({ params }: { params: Promise<{ icp: string }> }) {
  const { icp } = await params;
  const data = getIcp(icp);
  if (!data) notFound();

  const pageVideos = videosForIcp(data.key);
  const url = `${SITE_URL}/${data.key}`;

  // Service + FAQ structured data so these outbound pages are citable by
  // answer engines and eligible for rich results. The provider points back at
  // the homepage Organization entity (#organization) for a single brand graph.
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: data.metaTitle,
    description: data.metaDescription,
    serviceType: `Content & marketing for ${data.name}`,
    url,
    provider: { '@id': `${SITE_URL}/#organization` },
    audience: { '@type': 'Audience', audienceType: data.name },
    areaServed: [
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Place', name: 'Western Europe' },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'EchoPulse Media', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: data.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ICPPageClient data={data} videos={pageVideos} />
    </>
  );
}
