'use client';

import { useEffect, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import BottomBlur from '@/components/BottomBlur';

// Code-split below-the-fold sections — they don't ship in the initial bundle.
//
// SEO-CRITICAL sections (Pricing, FAQ, CTABanner, Footer) use `ssr: true` so
// Google sees the actual price tiers, FAQ schema, and CTA copy on the
// pre-rendered HTML. Earlier they were `ssr: false` which left crawlers
// staring at just the hero — losing rankings for "agency pricing", "marketing
// retainer", "DFY content", and every long-tail FAQ phrase.
//
// SECTIONS THAT TRULY TOUCH `window` ON FIRST RENDER (animations, IntersectionObserver
// setup, smooth-scroll wiring) keep `ssr: false` because trying to render them
// server-side throws.
// Nov 2026: these six were `ssr: false`, so the homepage HTML had no service
// cards, no audience list, no work, no process and no team block. Googlebot
// renders JS eventually; ChatGPT, Claude and Perplexity crawlers do not, so
// to them the homepage was a hero and a price table. They are code-split
// still (dynamic import) but now pre-rendered.
const Manifesto = dynamic(() => import('@/components/Manifesto'));
const Testimonials = dynamic(() => import('@/components/Testimonials'));
const WhoWeWorkWith = dynamic(() => import('@/components/WhoWeWorkWith'));
const OurWork = dynamic(() => import('@/components/OurWork'));
const Services = dynamic(() => import('@/components/Services'));
const Process = dynamic(() => import('@/components/Process'));
const Pricing = dynamic(() => import('@/components/Pricing')); // SSR: tier prices + schema in pre-rendered HTML
// NOTE: the Pune-gated on-site offering section was removed in July 2026 along
// with the India rate card. components/PuneOffering.tsx is now unused.
const FAQ = dynamic(() => import('@/components/FAQ'));           // SSR: FAQ schema for rich-result eligibility
const CTABanner = dynamic(() => import('@/components/CTABanner')); // SSR: book-a-call CTA copy crawlable
const Footer = dynamic(() => import('@/components/Footer'));      // SSR: contact info + sitemap-style links crawlable


/**
 * Homepage. The branded intro splash was removed: it held every first-time
 * desktop visitor for ~2.5s before they could read anything. Content now
 * paints immediately. The `ep:loaded` signal is still fired once on mount
 * so any entrance animation subscribed to it runs.
 */
export default function HomeClient({ latestPosts }: { latestPosts?: ReactNode }) {
  useEffect(() => {
    (window as unknown as { __epLoaded?: boolean }).__epLoaded = true;
    window.dispatchEvent(new CustomEvent('ep:loaded'));
  }, []);

  return (
    <>
      <div
        // suppressHydrationWarning: belt-and-braces protection against
        // attribute injection by browser extensions (Foxified, ColorZilla,
        // Friend Finder etc.) that add `foxified=""` to <html> or
        // `cz-shortcut-listen` to <body>. Without this, the slightest
        // mismatch sends React into hydration-recovery mode and tears
        // down event handlers — including scroll.
        suppressHydrationWarning
      >
        {/* Single Nav — earlier there was a duplicate copy on this line that
            shipped two stacked fixed navbars in production. Don't re-add. */}
        <Nav />
        <main id="main">
          <Hero />
          {/* Order: the work first, then how a week runs. */}
          <OurWork />
          <Manifesto />
          <Testimonials />
          <WhoWeWorkWith />
          <Services />
          <Process />
          <Pricing />
          <FAQ />
          {/* Kept on the homepage (its only links to the newest posts), below the FAQ. */}
          {latestPosts}
          <CTABanner />
        </main>
        <Footer />
        {/* Permanent frosted-glass blur pinned to the viewport bottom.
            Hides itself when the footer scrolls into view. */}
        <BottomBlur />
      </div>
    </>
  );
}
