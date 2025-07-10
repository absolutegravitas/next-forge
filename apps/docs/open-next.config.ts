// in apps/docs/opennext.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Enable the OpenNext Cloudflare integration
  // This allows for better caching and performance on Cloudflare Workers
  enableCacheInterception: true,
});
