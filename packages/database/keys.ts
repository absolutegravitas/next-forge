import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      // Cloudflare D1 Database
      CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
      CLOUDFLARE_D1_DATABASE_ID: z.string().optional(),
      CLOUDFLARE_API_TOKEN: z.string().optional(),
      // Database URL for local development
      DATABASE_URL: z.string().optional(),
      // Turso/Libsql configuration (alternative to D1 for local dev)
      TURSO_DATABASE_URL: z.string().optional(),
      TURSO_AUTH_TOKEN: z.string().optional(),
    },
    client: {},
    runtimeEnv: {
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
      CLOUDFLARE_D1_DATABASE_ID: process.env.CLOUDFLARE_D1_DATABASE_ID,
      CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
      DATABASE_URL: process.env.DATABASE_URL,
      TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    },
  });
