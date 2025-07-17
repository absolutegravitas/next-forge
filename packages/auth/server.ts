import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDatabase } from "@repo/database";
import { keys } from "./keys";

const env = keys();

export const auth = betterAuth(
  withCloudflare(
    {
      // Cloudflare environment configuration
      cf: {
        // Enable automatic IP detection from Cloudflare headers
        ipHeader: "cf-connecting-ip",
        // Enable geolocation tracking
        geolocation: {
          enabled: env.ENABLE_GEOLOCATION_TRACKING === "true",
          trackOnSignIn: true,
          trackOnSignUp: true,
        },
      },
      // D1 Database integration
      d1: { 
        db: getDatabase(),
      },
      // KV Storage for session caching (optional)
      kv: env.CLOUDFLARE_KV_NAMESPACE_ID ? {
        namespace: env.CLOUDFLARE_KV_NAMESPACE_ID,
        enableSessionCaching: true,
      } : undefined,
      // R2 File Storage for user files
      r2: env.CLOUDFLARE_R2_BUCKET_NAME ? {
        bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
        enableFileTracking: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      } : undefined,
    },
    {
      // Better Auth configuration
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL,
      database: drizzleAdapter(getDatabase(), {
        usePlural: false,
      }),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
          enabled: true,
          maxAge: 60 * 5, // 5 minutes
        },
      },
      // Enable automatic geolocation enrichment
      trustedOrigins: [
        process.env.BETTER_AUTH_URL,
        process.env.NEXTAUTH_URL,
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
      ].filter(Boolean),
      plugins: [
        nextCookies(),
        // Additional plugins can be added here
        // organization(), // for multi-tenant support
        // twoFactor(), // for 2FA support
      ],
      // Advanced configuration for Cloudflare
      advanced: {
        crossSubDomainCookies: {
          enabled: false, // Enable if using subdomains
        },
        ipAddress: {
          enabled: true,
          ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"],
        },
        rateLimit: {
          enabled: true,
          window: 60, // 1 minute
          max: 100, // requests per window
        },
      },
    }
  )
);

// Export types for TypeScript
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
