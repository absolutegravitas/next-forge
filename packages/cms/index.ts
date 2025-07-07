import { allPosts, allLegals } from "content-collections";

// --- Types (no change needed here) ---
export type Post = (typeof allPosts)[number];
export type Legal = (typeof allLegals)[number];

export const blog = {
  postsQuery: null,
  latestPostQuery: null,
  postQuery: (slug: string) => null,
  getPosts: async () => allPosts,
  getLatestPost: async () =>
    allPosts
      .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())
      .at(0),
  getPost: async (slug: string) =>
    allPosts.find(({ _meta }: any) => _meta.path === slug),
};

export const legal = {
  postsQuery: null,
  latestPostQuery: null,
  postQuery: (slug: string) => null,
  getPosts: async () => allLegals,
  getLatestPost: async () =>
    allLegals
      .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())
      .at(0),
  getPost: async (slug: string) =>
    allLegals.find(({ _meta }: any) => _meta.path === slug),
};
