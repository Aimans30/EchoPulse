import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getIcp, icps } from '@/lib/icpData';
import { videosForIcp } from '@/lib/videos';
import ICPPage from '@/components/icp/ICPPage';
import { AREA_SERVED } from '@/lib/schema';

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
  // data.metaTitle is the short descriptive part only (no brand suffix). The
  // root layout template appends " | EchoPulse Media" for the document <title>,
  // so we keep the tag under ~60 chars and avoid the brand doubling up. OG /
  // Twitter titles carry the full brand form explicitly.
  const fullTitle = `${data.metaTitle} | EchoPulse Media`;
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description: data.metaDescription,
      url: canonical,
      siteName: 'EchoPulse Media',
      type: 'website',
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
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
    areaServed: AREA_SERVED,
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
      <ICPPage data={data} videos={pageVideos} />
    </>
  );
}
