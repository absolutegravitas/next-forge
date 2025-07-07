import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import type { Options } from "@content-collections/mdx";
import {
  type RehypeCodeOptions,
  rehypeCode,
  remarkGfm,
  remarkHeading,
} from "fumadocs-core/mdx-plugins";
import readingTime from "reading-time";
import { z } from "zod";

const rehypeCodeOptions: RehypeCodeOptions = {
  themes: {
    light: "catppuccin-mocha",
    dark: "catppuccin-mocha",
  },
};

const posts = defineCollection({
  name: "posts",
  directory: "content/blog",
  include: "**/*.mdx",
  // CORRECTED: Use z.object directly instead of a function
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    image: z.string(),
    authors: z.array(z.string()),
    tags: z.array(z.string()),
  }),
  transform: async ({ title, ...page }, context) => {
    const body = await context.cache(page.content, async () =>
      compileMDX(context, page, {
        remarkPlugins: [remarkGfm, remarkHeading],
        rehypePlugins: [[rehypeCode, rehypeCodeOptions]],
      })
    );

    return {
      ...page,
      _title: title,
      _slug: page._meta.path,
      body,
      readingTime: readingTime(page.content).text,
    };
  },
});

const legals = defineCollection({
  name: "legals",
  directory: "content/legals",
  include: "**/*.mdx",
  // CORRECTED: Use z.object directly instead of a function
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
  }),
  transform: async ({ title, ...page }, context) => {
    const body = await context.cache(page.content, async () =>
      compileMDX(context, page, {
        remarkPlugins: [remarkGfm, remarkHeading],
        rehypePlugins: [[rehypeCode, rehypeCodeOptions]],
      })
    );
    return {
      ...page,
      _title: title,
      _slug: page._meta.path,
      body,
    };
  },
});

type Config = Parameters<typeof defineConfig>[0];

const config: Config = {
  collections: [posts, legals],
};

export default defineConfig(config);
