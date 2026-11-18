import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConsentGate from "@/components/ConsentGate";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import EmojiNormalizer from "@/components/EmojiNormalizer";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import BookCallModal from "@/components/BookCallModal";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { GeoProvider } from "@/components/GeoProvider";
import { pricingOffers } from "@/lib/pricing";
import { BOOK_CALL_URL } from "@/lib/links";
import { AREA_SERVED, BUSINESS_ADDRESS } from "@/lib/schema";

const GA_ID = 'G-3PPKSJLR7F';
/** Microsoft Clarity project. Both tags are gated by ConsentGate. */
const CLARITY_ID = 'ukzjzunyk5';

// Slim font weights — only what we actually use, with display:swap for fast first paint
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F2EEE7",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://echopulse.media"),
  title: {
    // The old default was "EchoPulse Media. You hit record. We do the rest."
    // Beautiful brand copy, zero search relevance: it contains no term anyone
    // types into Google, so the homepage had nothing to rank for. This version
    // leads with the service + audience and keeps the brand at the end.
    // 58 chars, so it survives Google's ~60-char truncation with the brand
    // intact. The previous version was 84 chars and put "| EchoPulse" at the
    // very end, which is exactly the part that got cut — so the ~700 people
    // per month searching "echopulse" scanned the results, never saw the
    // brand name, and had no signal this was the right result.
    default: "EchoPulse Media | Done-For-You Content and Website Studio",
    // Service/blog pages already carry their own name, so don't re-append it.
    template: "%s | EchoPulse Media",
  },
  description:
    "Done-for-you videos, posts and websites for founders, coaches, real estate agents and business owners, from $399 a month. Start with 2 free edits.",
  applicationName: "EchoPulse Media",
  authors: [{ name: "Lakshya Soni", url: "https://www.linkedin.com/in/lakshyasoni/" }],
  creator: "Lakshya Soni",
  publisher: "EchoPulse Media",
  // NOTE: the `keywords` meta tag was removed here on purpose. Google has
  // ignored it since 2009, and the same stuffed 18-term list was rendering on
  // every single page — which is a low-quality signal to human raters, not a
  // ranking input. Nothing to gain, something to lose.
  alternates: {
    canonical: "/",
  },
  // Trustpilot domain-ownership verification (one-time check, but harmless to
  // keep — removing it can un-verify the domain if Trustpilot re-checks).
  // Renders as: <meta name="trustpilot-one-time-domain-verification-id" content="…">
  other: {
    "trustpilot-one-time-domain-verification-id":
      "c3102d40-64ae-49d1-a3a1-d7253573f122",
  },
  openGraph: {
    // Was "EchoPulse Media. You hit record. We do the rest." The <title> tag
    // was rewritten away from that tagline because it contains no term anyone
    // searches, but the OG and Twitter titles were left behind. They drive
    // every social share, Slack unfurl and link preview, and several AI
    // browsing tools prefer og:title over <title> when summarising a page.
    title: "EchoPulse Media | Done-For-You Content and Website Studio",
    description:
      "Done-for-you content and website studio for founders, coaches, real estate agents and business owners. Video, LinkedIn, blogs, ads and websites by one owner-operated team. 2 free edits, then a $299 Pilot.",
    url: "https://echopulse.media",
    siteName: "EchoPulse Media",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-echopulse-media.png",
        width: 1200,
        height: 630,
        alt: "EchoPulse Media: you run the business, we run the content. Done-for-you video, posts, blogs and websites.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoPulse Media | Done-For-You Content and Website Studio",
    description:
      "Done-for-you content and website studio. Video, LinkedIn, blogs, ads and websites by one owner-operated team. 2 free edits, then a $299 Pilot.",
    creator: "@Lakshya_Creates",
    site: "@Lakshya_Creates",
    images: ["/og-echopulse-media.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "Marketing",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

// JSON-LD structured data — describes EchoPulse + the founder for AI agents,
// search engines, and rich-result eligibility. Lives in the layout so every
// route inherits the Organization + Person schema; service pages add their
// own Service schema on top.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://echopulse.media/#organization",
      name: "EchoPulse Media",
      // "Echo Pulse" (two words) is deliberate. A YouTube vocab channel of that
      // name currently outranks us for our OWN brand query — most of our search
      // impressions are people looking for them, not us. Declaring the spaced
      // variant as an alternateName is how you tell Google the two-word string
      // is also this entity. Table stakes: you must be #1 for your own name.
      alternateName: ["EchoPulse", "Echo Pulse", "EchoPulse Studio", "Echo Pulse Media"],
      url: "https://echopulse.media",
      logo: "https://echopulse.media/logo-512.png",
      description:
        "EchoPulse Media is a content and AI studio for founders, coaches, business owners, and real estate agents. Video edits, social posts, blogs, ad creative, websites, automations, and custom software. One team, one bill, every channel. Built to give clients 20 to 30 hours back every week.",
      foundingDate: "2025",
      founder: { "@id": "https://echopulse.media/#founder" },
      // Where we operate FROM (Bhopal, India) vs which markets we SELL INTO
      // (US/CA/UK/AU/Western Europe) are two different properties. India was
      // removed from areaServed in Sept 2026 because declaring it as a served
      // market was pulling 51% of all site clicks from South Asia at a 0%
      // conversion rate; it lives here instead, where it is true. See
      // lib/schema.ts for the Search Console numbers behind that decision.
      address: BUSINESS_ADDRESS,
      areaServed: AREA_SERVED,
      sameAs: [
        "https://www.linkedin.com/in/lakshyasoni/",
        "https://x.com/Lakshya_Creates",
      ],
      makesOffer: pricingOffers(),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        url: BOOK_CALL_URL,
        availableLanguage: ["en"],
      },
      employee: [
        { "@id": "https://echopulse.media/#shaurya" },
        { "@id": "https://echopulse.media/#aiman" },
      ],
    },
    {
      "@type": "Person",
      "@id": "https://echopulse.media/#founder",
      name: "Lakshya Soni",
      jobTitle: "Founder",
      description:
        "Multi-discipline operator running EchoPulse Media. Years editing video across formats at a Canadian production studio, freelance motion design, marketing lead at a Canadian SaaS, and frontend engineer shipping production code. Built EchoPulse Media to be the one team founders, coaches, business owners, and real estate agents can hire instead of managing five vendors.",
      knowsAbout: [
        "Video editing",
        "Content production",
        "Creative direction",
        "Motion design",
        "Content marketing",
        "SaaS marketing",
        "Ad creative",
        "Real estate marketing",
        "Content strategy",
      ],
      worksFor: { "@id": "https://echopulse.media/#organization" },
      // Point the Person entity at the dedicated founder page, not the homepage.
      // An entity needs one canonical page describing it; /about is that page,
      // and every blog author box links back to it to reinforce the chain.
      url: "https://echopulse.media/about",
      mainEntityOfPage: "https://echopulse.media/about",
      sameAs: [
        "https://www.linkedin.com/in/lakshyasoni/",
        "https://x.com/Lakshya_Creates",
      ],
      image: "https://echopulse.media/founder.jpg",
    },
    {
      "@type": "Person",
      "@id": "https://echopulse.media/#shaurya",
      name: "Shaurya",
      jobTitle: "Design",
      worksFor: { "@id": "https://echopulse.media/#organization" },
    },
    {
      "@type": "Person",
      "@id": "https://echopulse.media/#aiman",
      name: "Aiman",
      jobTitle: "Delivery",
      worksFor: { "@id": "https://echopulse.media/#organization" },
    },
    {
      "@type": "WebSite",
      "@id": "https://echopulse.media/#website",
      url: "https://echopulse.media",
      name: "EchoPulse Media",
      alternateName: "EchoPulse",
      description:
        "Done-for-you marketing for serious businesses. Video, content, ads, websites, and custom software for founders, coaches, business owners, and real estate agents. 20 to 30 hours a week back.",
      publisher: { "@id": "https://echopulse.media/#organization" },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Geo is NOT read on the server any more. `headers()`/`cookies()` in the
  // root layout made every route dynamic (`Cache-Control: private, no-store`),
  // so the 150-URL site had no CDN cache and the blog's `revalidate = 60` did
  // nothing. Tier prices are flat USD worldwide (lib/pricing.ts) and only the
  // /order flow localizes, which useGeoPrice already does on the client from
  // the ep_geo cookie or a timezone fallback. Pages are static/ISR again.
  const country: string | null = null;
  const city: string | null = null;

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Microsoft Clarity used to boot from here on every page load.
            It now lives in components/ConsentGate.tsx, mounted at the bottom
            of <body>, and does not load at all until the visitor allows it.
            Clarity is a session recorder: it instruments DOM mutations and
            input events and replays the session. Running that on a UK or EU
            visitor before they have been asked is the GDPR problem, and the
            performance note that used to be here (lazyOnload keeps ~40KB of
            parse off the interaction path) still holds inside ConsentGate. */}
        {/* Cal.com: DNS resolved early, but NO preconnect.
            A preconnect opens a real TCP + TLS connection immediately, and on
            4G those two round trips compete for bandwidth with the hero paint
            for every single visitor, including the ~99% who never open the
            booking modal. DNS is the part that is genuinely slow on mobile
            networks (100-300ms) and dns-prefetch is nearly free, so we keep
            that and let the TLS handshake happen on click, where it is hidden
            behind the modal's own open animation. */}
        <link rel="dns-prefetch" href="https://cal.com" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
        {/* NOTE: the unpkg preconnect and the Shery.css <link> used to live
            here. A stylesheet with a non-matching `media` is still DOWNLOADED
            by every browser (just at low priority and without blocking
            render), so the "skipped via media on mobile" comment was wrong:
            phones were paying for Shery's CSS, its DNS lookup and its TLS
            handshake to serve a magnetic-hover effect that a touchscreen can
            never trigger. Both are now injected by the desktop-only loader at
            the bottom of <body>. */}
      </head>
      <body className="pb-20 md:pb-0" suppressHydrationWarning>
        {/* Skip-to-content — first focusable element. Invisible until the
            user Tabs to it. Lets keyboard users bypass the nav. */}
        <a href="#main" className="skip-to-content">Skip to content</a>
        {/* Structured data for search engines + AI agents (Organization + Person + WebSite). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* GeoProvider wraps the whole tree so every component that calls
            useGeoPrice gets the server-detected region on the FIRST render
            — no client fetch, no flash, no flicker. */}
        <GeoProvider initialCountry={country} initialCity={city}>
          <SmoothScroll>
            <Cursor />
            {children}
          </SmoothScroll>
          {/* Normalizes every emoji in the DOM to Twemoji SVGs for consistent rendering. */}
          <EmojiNormalizer />
          {/* Analytics — scroll milestones, Calendly book listener, Clarity loader */}
          <AnalyticsProvider />
          {/* Global "Book a call" modal — open from anywhere via window.openBookCallModal() */}
          <BookCallModal />
          {/* Mobile sticky CTA. Mounted here rather than per-page because <body>
              already reserves `pb-20` for it on phones — without the component
              that padding was just a gap at the bottom of every page, and the
              service and blog routes had no mobile conversion path at all. The
              component no-ops above 768px and stays hidden until 600px of
              scroll, so desktop and above-the-fold are untouched. */}
          <MobileStickyCTA />
          {/* The Pune-only on-site inquiry modal was removed in July 2026 with
              the India rate card. components/PuneInquiryModal.tsx and
              /api/pune-inquiry are now unused. */}
        </GeoProvider>
        {/* Analytics consent, and the tags it gates. Renders nothing on the
            server; the banner appears after hydration and GA and Clarity mount
            only once the visitor has allowed them.
            CLARITY_ID is the hard-coded project that used to run from <head>.
            components/AnalyticsProvider carries a second Clarity snippet gated
            on NEXT_PUBLIC_CLARITY_ID; that one is now consent-gated too, so
            there is no ungated path left. */}
        <ConsentGate gaId={GA_ID} clarityId={CLARITY_ID} />
        {/* Shery.js is genuinely desktop-only now.
            The previous `<Script src="...Shery.js">` was unconditional: every
            phone downloaded and parsed the library (it bundles its own copies
            of three.js and GSAP, so it is one of the heaviest single requests
            on the site) purely so components/Services.tsx could call
            Shery.makeMagnet() on hover, an effect that does not exist on a
            touchscreen. Swapping the tag for a guarded injector means the
            request is never made below the hover/pointer test, while desktop
            gets exactly the same library at exactly the same point in the
            lifecycle (still lazyOnload, i.e. after the load event). The
            stylesheet rides along with it because it is useless on its own. */}
        <Script id="shery-desktop-only" strategy="lazyOnload">{`
          (function(){
            try {
              if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
              if (document.getElementById('shery-css')) return;
              var css = document.createElement('link');
              css.id = 'shery-css';
              css.rel = 'stylesheet';
              css.href = 'https://unpkg.com/sheryjs/dist/Shery.css';
              document.head.appendChild(css);
              var js = document.createElement('script');
              js.src = 'https://unpkg.com/sheryjs/dist/Shery.js';
              js.async = true;
              document.body.appendChild(js);
            } catch (e) { /* decorative only, never break the page */ }
          })();
        `}</Script>
      </body>
    </html>
  );
}
