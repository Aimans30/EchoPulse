import type { NextConfig } from "next";
import { BLOG_REDIRECTS } from "./lib/redirects";

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
  //
  // Cloudinary hosts all the OurWork showcase videos and any future <Image>
  // posters built from those clips. Adding both `res.cloudinary.com` (asset
  // delivery) and `player.cloudinary.com` (embed player) up-front so a
  // future next/image swap doesn't fail the Vercel build.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },        // Twemoji
      { protocol: "https", hostname: "emojicdn.elk.sh" },         // Apple emoji proxy
      { protocol: "https", hostname: "res.cloudinary.com" },      // Cloudinary asset CDN (videos + future posters)
      { protocol: "https", hostname: "player.cloudinary.com" },   // Cloudinary embed player (older video links)
      // Sanity is where every blog cover and in-article image lives, and it
      // was the one host missing from this list, which meant next/image
      // physically could not be used for them, so the blog ships raw <img>
      // tags requesting one fixed desktop width (900px cards, a 1600px hero)
      // to every phone. Whitelisting the host does not change a single byte
      // on its own; it removes the build-time blocker so app/blog/** and
      // components/Blog*.tsx can be converted to <Image> with a responsive
      // `sizes`, which is where the actual saving is.
      { protocol: "https", hostname: "cdn.sanity.io" },           // Sanity image CDN (blog covers + article images)
    ],
  },

  /**
   * Redirects — three jobs, and order matters (Next applies the first match).
   *
   *   1. Canonical host. GSC was counting https://, https://www. and http://
   *      as three separate sites, splitting what little equity exists. Force
   *      everything to the apex https://echopulse.media.
   *   2. Blog consolidation. ~65 near-duplicate posts are unpublished in Sanity;
   *      each 301s to the surviving post for its topic cluster so the equity
   *      consolidates instead of 404ing. Emitted for BOTH /blog/* and /blogs/*
   *      so a dead /blogs/ URL resolves in one hop, not two.
   *   3. Section consolidation. /blogs/* -> /blog/*. Two live blog paths means
   *      duplicate section signals; /blog is the canonical one.
   */
  async redirects() {
    const deadSlugRedirects = Object.entries(BLOG_REDIRECTS).flatMap(
      ([slug, destination]) => [
        { source: `/blog/${slug}`, destination, permanent: true },
        // Same target, so a dead /blogs/ URL never chains through /blog/.
        { source: `/blogs/${slug}`, destination, permanent: true },
      ],
    );

    return [
      // 1. www -> apex. `has` matches the incoming Host header.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.echopulse.media" }],
        destination: "https://echopulse.media/:path*",
        permanent: true,
      },

      // 2. Retired duplicate posts -> their cluster survivor.
      ...deadSlugRedirects,

      // 3. Everything still living under /blogs -> /blog.
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blogs/:slug", destination: "/blog/:slug", permanent: true },
    ];
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
