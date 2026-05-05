'use client';

import { useState } from 'react';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import Manifesto from '@/components/Manifesto';
import WhoWeWorkWith from '@/components/WhoWeWorkWith';
import MarqueeDivider from '@/components/MarqueeDivider';
import OurWork from '@/components/OurWork';
import Services from '@/components/Services';
import Results from '@/components/Results';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import ContentShowcase from '@/components/ContentShowcase';
import CTABanner from '@/components/CTABanner';
import Footer from '@/components/Footer';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <Nav />
        <Hero />
        <Ticker />
        <Manifesto />
        <WhoWeWorkWith />
        <ContentShowcase />
        <MarqueeDivider text="Our Work" />
        <OurWork />
        <Services />
        <Results />
        <Process />
        <Testimonials />
        <Blog />
        <Pricing />
        <FAQ />
        <CTABanner />
        <Footer />
      </div>
    </>
  );
}
