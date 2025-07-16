import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Optimize for static generation where possible
  experimental: {
    // Enable static optimization for better caching
    // causes critter error
    // optimizeCss: true,
    // Reduce bundle size
    optimizePackageImports: ["lucide-react"],
  },
  // Improve build performance
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Configure output for better caching
  output: "standalone",

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
    ],
  },

  // caching rules
  /* 
  public: Indicates that the response can be stored by any cache, including Cloudflare's edge network and the user's browser.

  s-maxage=31536000: This is the most important part. s-maxage (shared max-age) specifically tells CDNs like Cloudflare to cache the content for one year (31,536,000 seconds). Since your content only changes on deployment, caching it for a long time is ideal.

  stale-while-revalidate=60: This is a user-experience enhancement. If a request comes in after the cache has expired, Cloudflare will serve the old (stale) version instantly while it fetches the new version in the background. This means visitors always get a fast response.
*/
  // Enhanced caching rules for better CDN performance
  async headers() {
    return [
      {
        // Static documentation pages
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=31536000, stale-while-revalidate=60",
          },
          // Remove the Vary header to improve cache hit rates
          {
            key: "X-Cache-Strategy",
            value: "long-term",
          },
        ],
      },
      {
        // API routes should have shorter cache times
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=60",
          },
        ],
      },
    ];
  },

  // biome-ignore lint/suspicious/useAwait: "redirects is async"
  redirects: async () => {
    return [
      {
        source: "/apps",
        destination: "/apps/api",
        permanent: true,
      },
      {
        source: "/packages",
        destination: "/packages/ai",
        permanent: true,
      },

      {
        source: "/migrations",
        destination: "/migrations/authentication/authjs",
        permanent: true,
      },
      {
        source: "/addons",
        destination: "/addons/friendlier-words",
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
