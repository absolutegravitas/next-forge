import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      // CLOUDFLARE_ACCOUNT_ID: z.string(),
      // CLOUDFLARE_D1_DATABASE_ID: z.string(),
      // CLOUDFLARE_API_TOKEN: z.string(),
    },
    runtimeEnv: {
      // CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
      // CLOUDFLARE_D1_DATABASE_ID: process.env.CLOUDFLARE_D1_DATABASE_ID,
      // CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    },
  });
