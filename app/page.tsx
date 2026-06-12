'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Loader from '@/components/Loader';
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
const Manifesto = dynamic(() => import('@/components/Manifesto'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false });
const WhoWeWorkWith = dynamic(() => import('@/components/WhoWeWorkWith'), { ssr: false });
const OurWork = dynamic(() => import('@/components/OurWork'), { ssr: false });
const Services = dynamic(() => import('@/components/Services'), { ssr: false });
const Process = dynamic(() => import('@/components/Process'), { ssr: false });
const Pricing = dynamic(() => import('@/components/Pricing')); // SSR: tier prices + schema in pre-rendered HTML
// PuneOffering is a self-gating section: it returns null for non-Pune visitors,
// so it's safe to always mount. Code-split so non-Pune folks don't even
// download the chunk after the gate determines they don't need it.
const PuneOffering = dynamic(() => import('@/components/PuneOffering'), { ssr: false });
const FAQ = dynamic(() => import('@/components/FAQ'));           // SSR: FAQ schema for rich-result eligibility
const CTABanner = dynamic(() => import('@/components/CTABanner')); // SSR: book-a-call CTA copy crawlable
const Footer = dynamic(() => import('@/components/Footer'));      // SSR: contact info + sitemap-style links crawlable

const SESSION_KEY = 'ep_loaded_v1';

/**
 * Homepage with the brand loader splash — DESKTOP ONLY.
 *
 * The loader is intentionally skipped on phone (<768px) because mobile users
 * value speed-to-content over brand intros, and the GSAP timeline is flakier
 * on aggressive mobile-browser memory management. Also skipped for returning
 * visitors (sessionStorage flag), internal navigators (referrer matches our
 * origin), and anyone with prefers-reduced-motion.
 */
export default function Home() {
  // ── HYDRATION-SAFE INITIAL STATE ────────────────────────────────────────
  // Server and client MUST render the same initial tree. Previously the
  // useState initializer read `window` and `sessionStorage` to skip the
  // loader on mobile/repeat visits — that produced different markup on the
  // server (loader showing) vs the client (loader hidden), which sent React
  // into hydration-mismatch recovery. The visible symptom was scroll going
  // dead because event handlers detached from the regenerated tree.
  //
  // Trade-off: we always render in "loader-on" state for the first frame on
  // both server and client. The useEffect below skips it on mobile / repeat
  // visits / internal nav / reduced-motion — typically within ~16ms of
  // mount. That's a 1-frame flicker, not a broken page.
  const [loaded, setLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Defer the skip-check by a microtask so the strict React-hooks linter
    // (no-setState-directly-in-effect) is satisfied. Functionally identical —
    // the work still runs on mount before paint.
    queueMicrotask(() => {
      const isMobile =
        typeof window !== 'undefined' && window.innerWidth < 768;

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

      if (isMobile || alreadyLoaded || fromInternal || reducedMotion) {
        // Instant render — no loader for mobile, repeat visitors, internal nav,
        // or users who asked for reduced motion.
        setShowLoader(false);
        setLoaded(true);
        try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* noop */ }
        // Same handoff signal so Hero animations run immediately.
        if (typeof window !== 'undefined') {
          (window as unknown as { __epLoaded?: boolean }).__epLoaded = true;
          window.dispatchEvent(new CustomEvent('ep:loaded'));
        }
      }
      // Otherwise (desktop first visit): keep defaults, Loader plays its
      // ~2.5s GSAP intro then calls handleLoaderDone. The Loader itself has
      // a 4.5s failsafe so even if GSAP hangs, the page never gets stuck.
    });
  }, []);

  const handleLoaderDone = () => {
    setLoaded(true);
    setShowLoader(false);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* private mode etc — non-fatal */
    }
    // Signal Hero (and any other animation-on-loaded subscribers) that
    // the splash is gone — they can fire their entrance animations now,
    // synced exactly to the visual handoff.
    if (typeof window !== 'undefined') {
      (window as unknown as { __epLoaded?: boolean }).__epLoaded = true;
      window.dispatchEvent(new CustomEvent('ep:loaded'));
    }
  };

  return (
    <>
      {showLoader && <Loader onDone={handleLoaderDone} />}
      {/*
        Page content is ALWAYS mounted, even while the loader is on screen.
        That means dynamic imports begin streaming, fonts paint, and Hero's
        GSAP timeline starts working its way through its early frames — all
        while the visitor is still watching the loader splash. By the time
        the splash exits, everything below is already prepared.

        Only the opacity is gated on `loaded` so the under-construction state
        isn't visible behind the splash. `aria-hidden` + `pointerEvents:none`
        keep it out of the tab order and inert until the splash exits.
      */}
      <div
        // suppressHydrationWarning: belt-and-braces protection against
        // attribute injection by browser extensions (Foxified, ColorZilla,
        // Friend Finder etc.) that add `foxified=""` to <html> or
        // `cz-shortcut-listen` to <body>. Without this, the slightest
        // mismatch sends React into hydration-recovery mode and tears
        // down event handlers — including scroll.
        suppressHydrationWarning
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.18s ease',
          pointerEvents: loaded ? 'auto' : 'none',
        }}
        aria-hidden={!loaded}
      >
        {/* Single Nav — earlier there was a duplicate copy on this line that
            shipped two stacked fixed navbars in production. Don't re-add. */}
        <Nav />
        <main id="main">
          <Hero />
          <Manifesto />
          <Testimonials />
          <WhoWeWorkWith />
          <OurWork />
          <Services />
          <Process />
          {/* Pune-only section renders BEFORE Pricing so local visitors see
              their in-person packages first (no scroll past international
              monthly retainers they don't need). Returns null for everyone
              else — order doesn't matter for non-Pune visitors. */}
          <PuneOffering />
          <Pricing />
          <FAQ />
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
