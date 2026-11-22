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
import AgentTools from "@/components/AgentTools";
import { GeoProvider } from "@/components/GeoProvider";
import { pricingOffers } from "@/lib/pricing";
import { BOOK_CALL_URL } from "@/lib/links";
import { AREA_SERVED, BUSINESS_ADDRESS } from "@/lib/schema";
import { ogImages } from "@/lib/ogImages";

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
    title: "EchoPulse Media | Growth Partner for Founders and Businesses",
    description:
      "A growth partner for founders and businesses: content and personal brand, websites and funnels, custom software and CRMs, AI and automation, and SEO and AI search visibility. Start with 2 free edits or a $299 Pilot.",
    url: "https://echopulse.media",
    siteName: "EchoPulse Media",
    type: "website",
    locale: "en_US",
    images: ogImages("default"),
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoPulse Media | Growth Partner for Founders and Businesses",
    description:
      "A growth partner for founders and businesses: content, websites, custom software, AI and automation, and SEO. Start with 2 free edits or a $299 Pilot.",
    creator: "@Lakshya_Creates",
    site: "@Lakshya_Creates",
    images: ogImages("default"),
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
      alternateName: ["EchoPulse", "Echo Pulse", "Echo Pulse Media"],
      url: "https://echopulse.media",
      logo: {
        "@type": "ImageObject",
        url: "https://echopulse.media/logo-512.png",
        width: 512,
        height: 512,
      },
      image: "https://echopulse.media/logo-512.png",
      description:
        // Matches the first two sentences of the entity page lede
        // (/what-is-echopulse-media) and the opening block of public/llms.txt.
        // No results claims here.
        "EchoPulse Media is a growth partner for founders and businesses, founded in 2025 by Lakshya Soni and based in Bhopal, India. It makes the content that builds the founder and the brand, builds websites, funnels and custom software such as CRMs, sets up AI and automation, and gets businesses found on Google and in AI answers.",
      disambiguatingDescription:
        "EchoPulse Media (echopulse.media) is a growth partner for businesses run by Lakshya Soni from Bhopal, India. It is not the Echopulse thyroid treatment device made by Theraclion, the ECHOPulse echocardiogram research model, the EchoPulse heart diagnosis device from IIT (ISM) Dhanbad, the website echopulse.in or Rezono's EchoPulse BI.",
      slogan: "A growth partner for founders and businesses",
      foundingDate: "2025",
      founder: { "@id": "https://echopulse.media/about/lakshya-soni#person" },
      // Where we operate FROM (Bhopal, India) vs which markets we SELL INTO
      // (US/CA/UK/AU/Western Europe) are two different properties. India was
      // removed from areaServed in Sept 2026 because declaring it as a served
      // market was pulling 51% of all site clicks from South Asia at a 0%
      // conversion rate; it lives here instead, where it is true. See
      // lib/schema.ts for the Search Console numbers behind that decision.
      address: BUSINESS_ADDRESS,
      areaServed: AREA_SERVED,
      knowsAbout: [
        "Short-form video editing",
        "LinkedIn ghostwriting",
        "Personal branding",
        "Ad creative",
        "Website design and development",
        "Sales funnels and landing pages",
        "Custom software development",
        "Custom CRM development",
        "Client portals",
        "Business process automation",
        "AI automation",
        "Search engine optimization",
        "Answer engine optimization",
        "Structured data",
      ],
      // sameAs: add only company profiles the owner controls and has checked (Clutch after the city is fixed, LinkedIn company page, Instagram). See entity plan 20 Nov 2026.
      mainEntityOfPage: "https://echopulse.media/what-is-echopulse-media",
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
      "@id": "https://echopulse.media/about/lakshya-soni#person",
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
      // An entity needs one canonical page describing it; /about/lakshya-soni
      // is that page (its ProfilePage schema names this node as mainEntity),
      // and bylines link to it.
      url: "https://echopulse.media/about/lakshya-soni",
      mainEntityOfPage: "https://echopulse.media/about/lakshya-soni",
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
      jobTitle: "Partner and design lead",
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
      alternateName: ["EchoPulse", "Echo Pulse Media"],
      description:
        "EchoPulse Media is a growth partner for founders and businesses, founded in 2025 by Lakshya Soni and based in Bhopal, India. It makes the content that builds the founder and the brand, builds websites, funnels and custom software such as CRMs, sets up AI and automation, and gets businesses found on Google and in AI answers.",
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
        {/* WebMCP origin trial (Chrome). Register the domain at
            developer.chrome.com/origintrials, then set NEXT_PUBLIC_WEBMCP_OT_TOKEN in Vercel. */}
        {process.env.NEXT_PUBLIC_WEBMCP_OT_TOKEN && (
          <meta httpEquiv="origin-trial" content={process.env.NEXT_PUBLIC_WEBMCP_OT_TOKEN} />
        )}
        <link rel="dns-prefetch" href="https://cal.com" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
        {/* The hero reel and work cards stream from Cloudinary on first paint. */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
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
          <AgentTools />
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
