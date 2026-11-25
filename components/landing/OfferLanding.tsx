'use client';

import { useEffect, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero, { type HeroCopy } from '@/components/Hero';
import BottomBlur from '@/components/BottomBlur';

// Same sections, same code-splitting and same server rendering as the
// homepage (components/HomeClient.tsx), so these pages look and load like it.
const OurWork = dynamic(() => import('@/components/OurWork'));
const Pricing = dynamic(() => import('@/components/Pricing'));
const CTABanner = dynamic(() => import('@/components/CTABanner'));
const Footer = dynamic(() => import('@/components/Footer'));

/**
 * Search landing pages (/affordable-personal-branding-for-founders,
 * /done-for-you-social-media-management). Built from the homepage parts so
 * the reel, the animation and the work wall are identical; only the copy and
 * the middle sections change.
 *
 * These pages are deliberately NOT linked from the nav, the footer or the
 * homepage. They are reached from search and AI answers (sitemap, llms.txt).
 *
 * `intro` renders between the hero and the work wall (the answer, what you
 * get, the comparison); `details` renders after it (proof, process, fit, FAQ).
 */
export default function OfferLanding({
  hero,
  intro,
  details,
}: {
  hero: HeroCopy;
  intro: ReactNode;
  details: ReactNode;
}) {
  useEffect(() => {
    (window as unknown as { __epLoaded?: boolean }).__epLoaded = true;
    window.dispatchEvent(new CustomEvent('ep:loaded'));
  }, []);

  return (
    <div suppressHydrationWarning>
      <Nav />
      <main id="main">
        <Hero copy={hero} />
        {intro}
        <OurWork />
        {details}
        <Pricing />
        <CTABanner />
      </main>
      <Footer />
      <BottomBlur />
    </div>
  );
}
