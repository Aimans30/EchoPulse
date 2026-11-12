import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { caseStudies, getCaseStudy, heroImageFor } from '@/lib/caseStudyData';
import CaseStudyPage from '@/components/casestudy/CaseStudyPage';

const SITE_URL = 'https://echopulse.media';

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const canonical = `${SITE_URL}/case-studies/${study.slug}`;
  const fullTitle = `${study.metaTitle} | EchoPulse Media`;
  const share = heroImageFor(study)?.src ?? '/og-echopulse-media.png';
  return {
    title: study.metaTitle,
    description: study.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description: study.metaDescription,
      url: canonical,
      siteName: 'EchoPulse Media',
      type: 'article',
      publishedTime: study.publishedISO,
      images: [share],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: study.metaDescription,
      images: [share],
    },
  };
}

export default async function CaseStudyRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const url = `${SITE_URL}/case-studies/${study.slug}`;
  const clientId = `${url}#client`;
  const datasetId = `${url}#dataset`;

  const heroImage = heroImageFor(study);

  /**
   * STRUCTURED DATA
   *
   * There is no CaseStudy type in schema.org, and inventing one gets the block
   * silently ignored. So the page is an Article whose `about` is the client as
   * a real Organization carrying `sameAs` to their live site. That property is
   * the whole trust mechanism in machine-readable form: it stops the page
   * asserting a result and starts it pointing at an entity a crawler can go and
   * verify independently.
   *
   * The Dataset block is the rare one. Publishing the underlying export as a
   * described dataset, with its exact temporal coverage and the instrument that
   * produced it, is something almost no agency does, and it is the strongest
   * available signal that the numbers on this page are observations rather than
   * marketing. `citation` on the Article points back at it so the two nodes are
   * linked rather than floating side by side.
   *
   * Deliberately NOT emitted: Review or AggregateRating. We have no written,
   * permissioned client quote, and a rating nobody gave us is the exact kind of
   * fabrication this entire page exists to avoid.
   */
  const clientLd = {
    '@type': 'Organization',
    '@id': clientId,
    name: study.client,
    url: study.clientUrl,
    sameAs: [study.clientUrl],
    description: study.clientTagline,
  };

  // Only emitted where a real export backs the page. A Dataset node describing
  // measurements nobody took would be precisely the fabrication the rest of
  // this section is built to avoid, and a study without one simply omits it.
  const datasetLd = study.dataset
    ? {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        '@id': datasetId,
        name: study.dataset.name,
        description: study.dataset.description,
        temporalCoverage: `${study.windowStartISO}/${study.windowEndISO}`,
        measurementTechnique: study.dataset.measurementTechnique,
        variableMeasured: study.dataset.variableMeasured,
        about: { '@id': clientId },
        creator: { '@id': `${SITE_URL}/#organization` },
        isAccessibleForFree: true,
        license: 'https://echopulse.media/terms',
        url,
      }
    : null;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: `${study.headline} ${study.headlineAccent}`.trim(),
    description: study.metaDescription,
    datePublished: study.publishedISO,
    dateModified: study.publishedISO,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    about: clientLd,
    ...(datasetLd ? { citation: { '@id': datasetId } } : {}),
    url,
    ...(heroImage
      ? {
          image: {
            '@type': 'ImageObject',
            url: `${SITE_URL}${heroImage.src}`,
            caption: heroImage.caption,
          },
        }
      : {}),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'EchoPulse Media', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Case studies', item: `${SITE_URL}/case-studies` },
      { '@type': 'ListItem', position: 3, name: `${study.client} case study`, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {datasetLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <CaseStudyPage study={study} />
    </>
  );
}
