import HomeClient from '@/components/HomeClient';
import HomeLatestPosts from '@/components/HomeLatestPosts';

// Same cadence as the blog index so new posts reach the homepage without a redeploy.
export const revalidate = 60;

export default function Home() {
  return <HomeClient latestPosts={<HomeLatestPosts />} />;
}
