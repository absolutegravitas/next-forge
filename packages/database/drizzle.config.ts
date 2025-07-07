import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  // Use wrangler for local development and migrations
  // This will automatically use your wrangler.jsonc configuration
});
