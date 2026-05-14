import type { NextConfig } from "next";

/**
 * Next.js config — tuned for production deploys on **Vercel** and
 * **Netlify** (via @netlify/plugin-nextjs). Keep this minimal: both
 * platforms auto-detect Next App Router and don't need an `output`
 * directive. Adding `output: 'export'` would break the /api/lead-magnet
 * route, so it's intentionally omitted.
 */
const nextConfig: NextConfig = {
  // Strict mode catches subtle React bugs in dev.
  reactStrictMode: true,

  // Strip console.* from production bundles (except errors + warnings).
  // Cuts a few KB and avoids leaking dev logs in the wild.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // Image optimization formats (used by next/image when adopted).
  // Both Vercel and Netlify support next/image out of the box.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" }, // Twemoji
      { protocol: "https", hostname: "emojicdn.elk.sh" },  // Apple emoji proxy
    ],
  },

  // Set correct Content-Type + cache headers for the AI-readable files.
  async headers() {
    return [
      {
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
    ];
  },

  // Production source maps off — smaller deploys, faster cold starts.
  productionBrowserSourceMaps: false,
};

export default nextConfig;
