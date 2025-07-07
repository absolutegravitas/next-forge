import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { withCloudflare } from "better-auth-cloudflare";
import { keys } from "./keys";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { database } from "@repo/database";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth(
  withCloudflare(
    {
      // these props are injected by opennextjs/cloudflare
      cf: {},
      d1: { db: database },
      // kv, r2, geo, cookies, etc. also available here
    },
    {
      // Better‑Auth options
      secret: env.BETTER_AUTH_SECRET,
      database: drizzleAdapter(database, {
        usePlural: true, // if your tables are plural
      }),
      plugins: [
        nextCookies(),
        // organization() // if you want to use organization plugin
      ],
    }
  )
);
