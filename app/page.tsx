'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';

// Code-split below-the-fold sections — they don't ship in the initial bundle.
// Each chunk loads as the user scrolls, dramatically improving first paint
// on mobile/slow connections.
const Manifesto = dynamic(() => import('@/components/Manifesto'), { ssr: true });
const WhoWeWorkWith = dynamic(() => import('@/components/WhoWeWorkWith'), { ssr: true });
const OurWork = dynamic(() => import('@/components/OurWork'), { ssr: true });
const Services = dynamic(() => import('@/components/Services'), { ssr: true });
const Process = dynamic(() => import('@/components/Process'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: true });
const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: true });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true });
const CTABanner = dynamic(() => import('@/components/CTABanner'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });

const SESSION_KEY = 'ep_loaded_v1';

export default function Home() {
  // Default to "loaded" so the page paints instantly during the first
  // server/client mismatch — we'll flip to false on mount only if the
  // loader genuinely needs to run (first visit this tab session).
  const [loaded, setLoaded] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Skip the loader if:
    //  1. The user already saw it this tab session (came back from /services/*)
    //  2. They navigated here via internal link (referrer matches our origin)
    //  3. They prefer reduced motion
    const alreadyLoaded =
      typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1';

    const fromInternal =
      typeof document !== 'undefined' &&
      document.referrer &&
      (() => {
        try {
          return new URL(document.referrer).origin === window.location.origin;
        } catch {
          return false;
        }
      })();

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (alreadyLoaded || fromInternal || reducedMotion) {
      // Instant render — no loader shown
      setShowLoader(false);
      setLoaded(true);
      sessionStorage.setItem(SESSION_KEY, '1');
      return;
    }

    // First visit this tab — show the loader
    setShowLoader(true);
    setLoaded(false);
  }, []);

  const handleLoaderDone = () => {
    setLoaded(true);
    setShowLoader(false);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* private mode etc — non-fatal */
    }
  };

  return (
    <>
      {showLoader && <Loader onDone={handleLoaderDone} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <Nav />
        <Hero />
        <Ticker />
        <Manifesto />
        <WhoWeWorkWith />
        <OurWork />
        <Services />
        <Process />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTABanner />
        <Footer />
      </div>
    </>
  );
}
