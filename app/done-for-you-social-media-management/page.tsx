import { LandingPageView, landingMetadata } from '@/components/landing/buildLanding';
import { SOCIAL_MEDIA } from '@/lib/landingPages';

// Search landing page. Not linked from the nav, footer or homepage on purpose;
// listed in the sitemap and llms.txt so search and AI answers find it.
export const metadata = landingMetadata(SOCIAL_MEDIA);

export default function Page() {
  return <LandingPageView page={SOCIAL_MEDIA} />;
}
