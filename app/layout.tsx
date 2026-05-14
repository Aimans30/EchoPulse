import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import EmojiNormalizer from "@/components/EmojiNormalizer";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import PilotPopup from "@/components/PilotPopup";
import AnalyticsProvider from "@/components/AnalyticsProvider";

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
    default: "EchoPulse — We clone your voice, then write at scale.",
    template: "%s | EchoPulse",
  },
  description:
    "EchoPulse is a content studio that records a 90-minute voice interview, builds a Voice DNA document, then ghostwrites your LinkedIn, edits your video, drafts your blogs, and runs your ad creative — in your voice. Saves 20–30 hours a week. Starts with a $299 14-day Pilot.",
  applicationName: "EchoPulse",
  authors: [{ name: "Lakshya Soni", url: "https://www.linkedin.com/in/lakshyasoni/" }],
  creator: "Lakshya Soni",
  publisher: "EchoPulse",
  keywords: [
    "content agency",
    "voice cloning agency",
    "LinkedIn ghostwriting",
    "video editing agency",
    "blog production",
    "ad creatives agency",
    "conversion website design",
    "B2B content marketing",
    "founder content agency",
    "coach content agency",
    "AI content human-in-the-loop",
    "Voice Foundation",
    "EchoPulse",
    "Lakshya Soni",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EchoPulse — We clone your voice, then write at scale.",
    description:
      "Content studio for founders, coaches, and business owners. Saves 20–30 hours a week on content. Voice Foundation interview · LinkedIn · video · blogs · ad creative · websites · automations. $299 14-day Pilot.",
    url: "https://echopulse.media",
    siteName: "EchoPulse",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoPulse — We clone your voice, then write at scale.",
    description:
      "Content studio for founders, coaches, and operators. Saves 20–30 hours a week. Voice Foundation interview, then LinkedIn, video, blogs, ads, websites — all in your voice.",
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
        "Content studio that records a 90-minute voice interview, builds a Voice DNA document, then ghostwrites LinkedIn, edits video, drafts blogs, and runs ad creatives in the client's voice. Founded to do the opposite of every 'AI content agency' shipping ChatGPT slop.",
      foundingDate: "2025",
      founder: { "@id": "https://echopulse.media/#founder" },
      areaServed: [
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Place", name: "Western Europe" },
      ],
      sameAs: ["https://www.linkedin.com/in/lakshyasoni/"],
      makesOffer: [
        { "@type": "Offer", name: "Pilot", price: "299", priceCurrency: "USD", description: "14-day paid trial: voice interview, 12 LinkedIn posts, 3 short-form video edits, 5 long-form blogs, plus one strategic deliverable." },
        { "@type": "Offer", name: "Growth Retainer", price: "1997", priceCurrency: "USD", description: "Monthly retainer covering LinkedIn, blogs, short + long-form video, ad creatives, website optimization, monthly strategy." },
        { "@type": "Offer", name: "Full System", price: "4997", priceCurrency: "USD", description: "All-in monthly plan covering 30 LinkedIn posts, 8 long-form blogs, full ad engine, podcast editing, course modules, automations, quarterly custom website build." },
      ],
    },
    {
      "@type": "Person",
      "@id": "https://echopulse.media/#founder",
      name: "Lakshya Soni",
      jobTitle: "Founder",
      description:
        "Multi-discipline content creative. Years editing video across formats at a Canadian production studio, scriptwriter for founders and creators on camera, creative director on brand films and campaigns, four years of freelance motion design on Upwork, currently runs marketing for a SaaS company. Started EchoPulse to do the opposite of agencies charging serious money for deliverables-for-the-sake-of-deliverables.",
      knowsAbout: [
        "Video editing",
        "Scriptwriting",
        "Creative direction",
        "Motion design",
        "LinkedIn ghostwriting",
        "B2B SaaS marketing",
        "Ad creative",
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
        "Content studio that clones your voice and writes at scale. 20–30 hours a week back, in your voice.",
      publisher: { "@id": "https://echopulse.media/#organization" },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to font/script CDNs for faster handshake */}
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="" />
        {/* Shery.js stylesheet — only loaded on devices that can hover (skipped via media on mobile) */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/sheryjs/dist/Shery.css"
          media="(hover: hover) and (pointer: fine)"
        />
      </head>
      <body className="pb-20 md:pb-0">
        {/* Structured data for search engines + AI agents (Organization + Person + WebSite). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <SmoothScroll>
          <Cursor />
          {children}
        </SmoothScroll>
        {/* Mobile-only sticky CTA bar — visible after scrolling past the hero */}
        <MobileStickyCTA />
        {/* Desktop-leaning $299 Pilot popup — auto-shows after a delay or scroll past hero */}
        <PilotPopup />
        {/* Normalizes every emoji in the DOM to Twemoji SVGs — Apple-emoji-style consistency across every OS */}
        <EmojiNormalizer />
        {/* Analytics — scroll milestones, Calendly book listener, Clarity loader */}
        <AnalyticsProvider />
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
