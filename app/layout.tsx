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
      "@id": "h