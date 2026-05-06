import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import EmojiNormalizer from "@/components/EmojiNormalizer";

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
  title: "EchoPulse. Content That Converts. No AI Slop.",
  description:
    "Full-stack content studio for premium founders and brands. Cinematic video editing, LinkedIn ghostwriting, agency-quality blogs, ad creatives, conversion websites, and automation. Built on human-in-the-loop systems that sound like you, not ChatGPT.",
  keywords:
    "content agency, video editing agency, LinkedIn ghostwriting, blog content agency, ad creative agency, conversion website design, real estate video, B2B content marketing, founder content agency, AI content human-in-the-loop",
  openGraph: {
    title: "EchoPulse. Content That Converts. No AI Slop.",
    description:
      "Cinematic video, LinkedIn ghostwriting, blogs, ad creatives, and websites for premium founders and brands. Built for founders who want their voice in every word.",
    url: "https://echopulse.media",
    siteName: "EchoPulse",
    type: "website",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
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
      <body>
        <SmoothScroll>
          <Cursor />
          {children}
        </SmoothScroll>
        {/* Normalizes every emoji in the DOM to Twemoji SVGs — Apple-emoji-style consistency across every OS */}
        <EmojiNormalizer />
        {/* Shery loads after hydration AND only on desktop pointer devices */}
        <Script
          src="https://unpkg.com/sheryjs/dist/Shery.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
