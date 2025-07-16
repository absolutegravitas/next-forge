# ▲ / next-forge

**Production-grade Turborepo template for Next.js apps.**

<div>
  <img src="https://img.shields.io/npm/dy/next-forge" alt="" />
  <img src="https://img.shields.io/npm/v/next-forge" alt="" />
  <img src="https://img.shields.io/github/license/vercel/next-forge" alt="" />
</div>

## Overview

[next-forge](https://github.com/vercel/next-forge) is a [Next.js](https://nextjs.org/) project boilerplate for modern web application. It is designed to be a comprehensive starting point for new apps, providing a solid, opinionated foundation with a minimal amount of configuration.

## Getting Started

Clone the repo using:

```sh
npx next-forge@latest init
```

Then read the [docs](https://www.next-forge.com/docs) for more information.

## Contributors

<a href="https://github.com/vercel/next-forge/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=vercel/next-forge" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

Start Qdrant Docker Server to run embeddings db for RooCode
docker run -p 6333:6333 qdrant/qdrant

For sub-apps
/app/app
/app/api
/app/web

You can add the following scripts to your package.json:

"preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
"cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"

Usage
preview: Builds your app and serves it locally, allowing you to quickly preview your app running locally in the Workers runtime, via a single command. - deploy: Builds your app, and then deploys it to Cloudflare - cf-typegen: Generates a cloudflare-env.d.ts file at the root of your project containing the types for the env.

Summary of Recommended Steps (In Order)

Infrastructure Setup - Configure Cloudflare environment and tooling
Database Migration - Replace Prisma with Drizzle + D1
Authentication Migration - Replace Clerk with Better Auth
Documentation Migration - Replace Mintlify with Fumadocs
Remove Storybook - Clean up Storybook dependencies and configurations
Deployment Configuration - Set up Cloudflare Workers deployment
Environment Variables - Update all environment configurations
Testing & Optimization - Verify everything works and optimize for Cloudflare
