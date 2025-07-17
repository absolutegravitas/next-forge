// Server-side exports
export { auth } from './server';
export type { Session, User } from './server';

// Client-side exports
export { 
  signIn, 
  signOut, 
  signUp, 
  useSession,
  useCloudflareContext,
  useUserGeolocation,
} from './client';
export type { AuthContext } from './client';

// Handlers for API routes
export { POST, GET } from './handlers';

// Middleware
export { authMiddleware } from './middleware';

// Environment configuration
export { keys } from './keys';

// Re-export useful utilities from better-auth-cloudflare
export type {
  CloudflareContext,
  GeolocationData,
} from 'better-auth-cloudflare/client';