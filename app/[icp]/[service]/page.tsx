import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import NichePage from '@/components/niche/NichePage';
import { getIcp } from '@/lib/icpData';
import { NICHE_PAGES, NICHE_PLAN_ROWS, getNichePage } from '@/lib/nicheServiceData';
import { NICHE_PAGES_UPDATED_ISO } from '@/lib/siteMeta';

const SITE_URL = 'https://echopulse.media';

// Only the 12 combinations listed in lib/nicheServiceData.ts exist. With
// dynamicParams = false every other /[icp]/[service] path 404s instead of
// rendering an empty shell. Static routes such as /services/[slug] and
// /case-studies/[slug] are more specific, so they still win.
export const dynamicParams = false;

export function generateStaticParams() {
  return NICHE_PAGES.map((p) => ({ icp: p.icp, service: p.service }));
}

// The three countries the brief names. Narrower than the shared AREA_SERVED
// list on purpose: these pages are written for US, UK and Canadian buyers.
const AREA = [
  { '@type': 'Country', name: 'United States' },
  { '@type': 'Country', name: 'United Kingdom' },
  { '@type': 'Country', name: 'Canada' },
];

type Params = Promise<{ icp: string; service: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { icp, service } = await params;
  const page = getNichePage(icp, service);
  if (!page) return {};
  const canonical = `${SITE_URL}/${page.icp}/${page.service}`;
  // `absolute` opts out of the root "%s | EchoPulse Media" template so the tag
  // stays under 60 characters. The short brand suffix is added only if it fits.
  const withBrand = `${page.metaTitle} | EchoPulse`;
  const title = withBrand.length <= 60 ? withBrand : page.metaTitle;
  return {
    title: { absolute: title },
    description: page.metaDescription,
    alternates: { canonical },
    openGraph: {
      title,
      description: page.metaDescription,
      url: canonical,
      siteName: 'EchoPulse Media',
      type: 'website',
      images: ['/og-echopulse-media.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.metaDescription,
      images: ['/og-echopulse-media.png'],
    },
  };
}

export default async function NicheServicePage({ params }: { params: Params }) {
  const { icp, service } = await params;
  const page = getNichePage(icp, service);
  if (!page) notFound();

  const icpData = getIcp(page.icp);
  const url = `${SITE_URL}/${page.icp}/${page.service}`;

  // Offers read from the plan objects in lib/pricing.ts through the table rows.
  // The free sample is a real offer at price 0. Custom has no price, so it is
  // left out rather than invented.
  const offers = NICHE_PLAN_ROWS.filter(({ plan }) => plan.key === 'free' || plan.priceUsd > 0).map(({ plan, key }) => ({
    '@type': 'Offer',
    name: plan.name,
    price: String(plan.priceUsd),
    priceCurrency: 'USD',
    description: `${plan.per}. ${page.ladder[key]}`,
  }));

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: page.h1,
    description: page.metaDescription,
    serviceType: `${page.serviceName} for ${page.buyer}`,
    url,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: AREA,
    audience: { '@type': 'Audience', audienceType: page.buyer },
    offers,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: icpData?.name ?? page.buyer, item: `${SITE_URL}/${page.icp}` },
      { '@type': 'ListItem', position: 3, name: page.h1, item: url },
    ],
  };

  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.h1,
    description: page.capsule,
    dateModified: NICHE_PAGES_UPDATED_ISO,
    inLanguage: 'en',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${url}#service` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      <NichePage page={page} />
    </>
  );
}
