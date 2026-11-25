import { LandingPageView, landingMetadata } from '@/components/landing/buildLanding';
import { PERSONAL_BRANDING } from '@/lib/landingPages';

// Search landing page. Not linked from the nav, footer or homepage on purpose;
// listed in the sitemap and llms.txt so search and AI answers find it.
export const metadata = landingMetadata(PERSONAL_BRANDING);

export default function Page() {
  return <LandingPageView page={PERSONAL_BRANDING} />;
}
