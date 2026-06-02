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
import PuneInquiryModal from "@/components/PuneInquiryModal";
import { GeoProvider } from "@/components/GeoProvider";
import { getServerGeo } from "@/lib/geoServer";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
    default: "EchoPulse — Marketing without the agency tax.",
    template: "%s | EchoPulse",
  },
  description:
    "Full-service content studio for founders, coaches, business owners, and real estate agents. Video edits, LinkedIn posts, blogs, ad creative, websites, and custom software — handled by one team. 20 to 30 hours back a week. One bill instead of five. No contracts. Starts with a $299 14-day Pilot.",
  applicationName: "EchoPulse",
  authors: [{ name: "Lakshya Soni", url: "https://www.linkedin.com/in/lakshyasoni/" }],
  creator: "Lakshya Soni",
  publisher: "EchoPulse",
  keywords: [
    "content studio",
    "content agency",
    "video editing agency",
    "real estate video editing",
    "real estate marketing agency",
    "LinkedIn content agency",
    "blog production agency",
    "ad creatives agency",
    "conversion website design",
    "coach marketing agency",
    "business owner marketing",
    "agency for founders",
    "agency for coaches",
    "agency for real estate agents",
    "custom app development agency",
    "EchoPulse",
    "Lakshya Soni",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EchoPulse — Marketing without the agency tax.",
    description:
      "Full-service content studio for founders, coaches, business owners, and real estate agents. Video, content, ads, websites, custom software. Done-for-you. One team, one bill. $299 14-day Pilot.",
    url: "https://echopulse.media",
    siteName: "EchoPulse",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoPulse — Marketing without the agency tax.",
    description:
      "Full-service content studio for founders, coaches, business owners, and real estate agents. Video, content, ads, websites, custom software. Done-for-you. Get 20-30 hours a week back.",
    creator: "@lakshyasoni",
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
      name: "EchoPulse",
      alternateName: "EchoPulse Studio",
      url: "https://echopulse.media",
      description:
        "Full-service content studio for founders, coaches, business owners, and real estate agents. Video edits, social posts, blogs, ad creative, websites, automations, and custom software — one team, one bill, every channel. Built to give clients 20 to 30 hours back every week.",
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
      sameAs: ["https://www.linkedin.com/in/lakshyasoni/"],
      makesOffer: [
        { "@type": "Offer", name: "Pilot", price: "299", priceCurrency: "USD", description: "14-day paid trial: onboarding interview, 12 social posts, 3 short-form video edits, 5 long-form blogs, plus one strategic deliverable." },
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
        "Multi-discipline operator running EchoPulse. Years editing video across formats at a Canadian production studio, freelance motion design, marketing lead at a Canadian SaaS, and frontend engineer shipping production code. Built EchoPulse to be the one team founders, coaches, business owners, and real estate agents can hire instead of managing five vendors.",
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
      url: "https://echopulse.media",
      sameAs: ["https://www.linkedin.com/in/lakshyasoni/"],
      image: "https://echopulse.media/founder.jpg",
    },
    {
      "@type": "WebSite",
      "@id": "https://echopulse.media/#website",
      url: "https://echopulse.media",
      name: "EchoPulse",
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
          {/* Pune-only on-site shoot inquiry modal — open via
              window.openPuneInquiryModal(packageName). Required phone field,
              no Razorpay path; submissions land in #pune-onsite Slack +
              Sales Pipeline → Discovery Call Booked in Asana. */}
          <PuneInquiryModal />
        </GeoProvider>
        {/* GA4 — only loaded when NEXT_PUBLIC_GA_ID is set */}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        {/* Shery loads after hydration AND only on desktop pointer devices */}
        <Script
          src="https://unpkg.com/sheryjs/dist/Shery.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
