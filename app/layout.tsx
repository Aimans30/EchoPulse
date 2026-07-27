import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import EmojiNormalizer from "@/components/EmojiNormalizer";
import PilotPopup from "@/components/PilotPopup";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import BookCallModal from "@/components/BookCallModal";
import { GeoProvider } from "@/components/GeoProvider";
import { getServerGeo } from "@/lib/geoServer";

const GA_ID = 'G-3PPKSJLR7F';

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
    default:
      "Done-For-You Content Agency for Founders: Video Editing, LinkedIn & Blogs | EchoPulse",
    // Service/blog pages already carry their own name, so don't re-append it.
    template: "%s | EchoPulse Media",
  },
  description:
    "Done-for-you content studio for founder-led content. Video editing for founders, LinkedIn content, and short-form video, handled by one team.",
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
    title: "EchoPulse Media. You hit record. We do the rest.",
    description:
      "EchoPulse Media is a content and AI studio for founders, coaches, business owners, and real estate agents. Video, social, ads, websites, custom software, handled end to end by one team. One bill. $299 14-day Pilot.",
    url: "https://echopulse.media",
    siteName: "EchoPulse Media",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1902,
        height: 653,
        alt: "EchoPulse Media. You hit record. We do the rest.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoPulse Media. You hit record. We do the rest.",
    description:
      "EchoPulse Media is a content and AI studio for founders, coaches, business owners, and real estate agents. Video, social, ads, websites, custom software, handled end to end. Get 20-30 hours a week back.",
    creator: "@Lakshya_Creates",
    site: "@Lakshya_Creates",
    images: ["/og-image.png"],
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
      logo: "https://echopulse.media/logo.png",
      description:
        "EchoPulse Media is a content and AI studio for founders, coaches, business owners, and real estate agents. Video edits, social posts, blogs, ad creative, websites, automations, and custom software. One team, one bill, every channel. Built to give clients 20 to 30 hours back every week.",
      foundingDate: "2025",
      founder: { "@id": "https://echopulse.media/#founder" },
      areaServed: [
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Country", name: "India" },
        { "@type": "Place", name: "Western Europe" },
      ],
      sameAs: [
        "https://www.linkedin.com/in/lakshyasoni/",
        "https://x.com/Lakshya_Creates",
      ],
      makesOffer: [
        { "@type": "Offer", name: "Pilot", price: "299", priceCurrency: "USD", description: "14-day paid trial: onboarding strategy session, 8 short-form and 5 clipped content pieces, 5 long-form blogs, plus a content audit and 30-day plan." },
        { "@type": "Offer", name: "Growth Retainer", price: "1997", priceCurrency: "USD", description: "Monthly retainer covering social, blogs, short + long-form video, ad creatives, website optimization, and monthly strategy." },
        { "@type": "Offer", name: "Full System", price: "4997", priceCurrency: "USD", description: "All-in monthly plan covering 30 social posts, 8 long-form blogs, full ad engine, podcast editing, course modules, automations, and quarterly custom website build." },
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Server-side geo read from middleware-set headers. In production this is
  // free (Vercel/Cloudflare inject them); in local dev these come back as
  // null and the client-side fallback in useGeoPrice takes over.
  const { country, city } = await getServerGeo();

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Microsoft Clarity */}
        <Script id="clarity-init" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "ukzjzunyk5");
        `}</Script>
        {/* Preconnect to font/script CDNs for faster handshake */}
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="" />
        {/* Cal.com preconnect — DNS + TLS handshake done BEFORE the user clicks
            "Book a call", so when the modal opens the iframe starts at full speed. */}
        <link rel="preconnect" href="https://cal.com" />
        <link rel="dns-prefetch" href="https://cal.com" />
        <link rel="preconnect" href="https://app.cal.com" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
        {/* Shery.js stylesheet — only loaded on devices that can hover (skipped via media on mobile) */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/sheryjs/dist/Shery.css"
          media="(hover: hover) and (pointer: fine)"
        />
      </head>
      <body className="pb-20 md:pb-0">
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
          {/* Desktop-leaning Pilot popup — auto-shows after a delay or scroll past hero */}
          <PilotPopup />
          {/* Normalizes every emoji in the DOM to Twemoji SVGs for consistent rendering. */}
          <EmojiNormalizer />
          {/* Analytics — scroll milestones, Calendly book listener, Clarity loader */}
          <AnalyticsProvider />
          {/* Global "Book a call" modal — open from anywhere via window.openBookCallModal() */}
          <BookCallModal />
          {/* The Pune-only on-site inquiry modal was removed in July 2026 with
              the India rate card. components/PuneInquiryModal.tsx and
              /api/pune-inquiry are now unused. */}
        </GeoProvider>
        <GoogleAnalytics gaId={GA_ID} />
        {/* Shery loads after hydration AND only on desktop pointer devices */}
        <Script
          src="https://unpkg.com/sheryjs/dist/Shery.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
