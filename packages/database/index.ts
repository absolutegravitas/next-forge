// packages/database/index.ts
import "server-only";
import { drizzle } from "drizzle-orm/d1";
import { tables } from "./schema";
import type { D1Database } from "@cloudflare/workers-types";

// This global variable is used by Wrangler to inject the D1 database
// when running in Workers or wrangler dev.
// It is not available in other environments, such as Node.js.
declare global {
  var __D1_BETA__DB: D1Database;
}

function getD1Database(): D1Database {
  if (process.env.DB) return process.env.DB as unknown as D1Database;
  if (globalThis.__D1_BETA__DB) return globalThis.__D1_BETA__DB;
  throw new Error("D1 DB not available—run under Workers or wrangler dev.");
}

export function getDatabase() {
  return drizzle(getD1Database(), {
    schema: tables,
    logger: true, // optional
  });
}
