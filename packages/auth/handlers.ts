import 'server-only';
import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from './server';

// Export the Next.js handlers for Better Auth
export const { POST, GET } = toNextJsHandler(auth);

// Export additional handler functions if needed
export const authHandlers = {
  POST,
  GET,
};