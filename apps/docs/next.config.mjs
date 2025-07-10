import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vercel.com",
      },
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
  async headers() {
    return [
      {
        // Apply these headers to all pages of your docs site
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            // This is the optimal value for your use case
            value: "public, s-maxage=31536000, stale-while-revalidate=60",
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
