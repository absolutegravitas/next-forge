import { createAuthClient } from "better-auth/react";
import { cloudflareClient } from "better-auth-cloudflare/client";
import { anonymousClient } from "better-auth/client/plugins";

// This file is used to create the auth client for the application.

// It exports the signIn, signOut, signUp functions and the useSession hook.
// These can be used in the application to handle authentication.

// The baseUrl is set to "/api/auth" which is where the auth handlers are located.
// The cloudflareClient plugin is used to handle Cloudflare Workers authentication.
export const { signIn, signOut, signUp, useSession } = createAuthClient({
  baseUrl: "/api/auth",
  plugins: [cloudflareClient(), anonymousClient()],
});
