import type { Metadata } from 'next';
import { caseStudies } from '@/lib/caseStudyData';
import CaseStudyIndex from '@/components/casestudy/CaseStudyIndex';
import Nav from '@/components/Nav';

const SITE_URL = 'https://echopulse.media';
const canonical = `${SITE_URL}/case-studies`;

const META_DESCRIPTION =
  'Client work with named companies and live URLs you can check: a search engagement, a website rebuild and a full operating system for a multi-outlet laundry chain.';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: META_DESCRIPTION,
  alternates: { canonical },
  openGraph: {
    title: 'Case Studies | EchoPulse Media',
    description: META_DESCRIPTION,
    url: canonical,
    siteName: 'EchoPulse Media',
    type: 'website',
    images: ['/og-echopulse-media.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies | EchoPulse Media',
    description: META_DESCRIPTION,
    images: ['/og-echopulse-media.png'],
  },
};

export default function CaseStudiesRoute() {
  // CollectionPage over an ItemList. This gives an answer engine the set of
  // published studies as an enumerable list rather than as prose it has to
  // parse, and it is the node that will carry the value as more land here.
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonical}#collection`,
    name: 'EchoPulse Media case studies',
    description: META_DESCRIPTION,
    url: canonical,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: caseStudies.length,
      itemListElement: caseStudies.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${canonical}/${c.slug}`,
        name: `${c.client}: ${c.headline} ${c.headlineAccent}`.trim(),
        // The same one-sentence result printed on the card for this study.
        description: c.indexResult,
      })),
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'EchoPulse Media', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Case studies', item: canonical },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Nav />
      <CaseStudyIndex studies={caseStudies} />
    </>
  );
}
