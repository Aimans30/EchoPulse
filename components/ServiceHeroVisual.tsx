'use client';

import VideoEditingVisual from './service-visuals/VideoEditingVisual';
import LinkedInVisual from './service-visuals/LinkedInVisual';
import BlogVisual from './service-visuals/BlogVisual';
import AdCreativesVisual from './service-visuals/AdCreativesVisual';
import WebsiteVisual from './service-visuals/WebsiteVisual';
import AutomationVisual from './service-visuals/AutomationVisual';
import AppsSoftwareVisual from './service-visuals/AppsSoftwareVisual';
import SeoAeoVisual from './service-visuals/SeoAeoVisual';

/**
 * Per-service hero visual. Each service gets its own product mock, all built
 * on the same frame (components/service-visuals/VisualFrame.tsx) so the eight
 * pages read as one family.
 */
export default function ServiceHeroVisual({ slug, accent }: { slug: string; accent: string }) {
  switch (slug) {
    case 'video-editing':
      return <VideoEditingVisual accent={accent} />;
    case 'linkedin-ghostwriting':
      return <LinkedInVisual accent={accent} />;
    case 'blog-production':
      return <BlogVisual accent={accent} />;
    case 'ad-creatives':
      return <AdCreativesVisual accent={accent} />;
    case 'websites-funnels':
      return <WebsiteVisual accent={accent} />;
    case 'automations':
      return <AutomationVisual accent={accent} />;
    case 'apps-software':
      return <AppsSoftwareVisual accent={accent} />;
    case 'seo-aeo':
      return <SeoAeoVisual accent={accent} />;
    default:
      return null;
  }
}
