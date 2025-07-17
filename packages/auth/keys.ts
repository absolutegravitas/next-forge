import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      BETTER_AUTH_SECRET: z.string(),
      BETTER_AUTH_URL: z.string().optional(),
      // Cloudflare Workers environment
      CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
      CLOUDFLARE_D1_DATABASE_ID: z.string().optional(),
      CLOUDFLARE_API_TOKEN: z.string().optional(),
      // KV Storage for session caching
      CLOUDFLARE_KV_NAMESPACE_ID: z.string().optional(),
      // R2 File Storage
      CLOUDFLARE_R2_BUCKET_NAME: z.string().optional(),
      CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().optional(),
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().optional(),
      // Geolocation and IP detection
      ENABLE_GEOLOCATION_TRACKING: z.string().optional().default("true"),
    },
    client: {},
    runtimeEnv: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
      CLOUDFLARE_D1_DATABASE_ID: process.env.CLOUDFLARE_D1_DATABASE_ID,
      CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
      CLOUDFLARE_KV_NAMESPACE_ID: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
      CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      ENABLE_GEOLOCATION_TRACKING: process.env.ENABLE_GEOLOCATION_TRACKING,
    },
  });
