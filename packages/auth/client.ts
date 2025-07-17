import { createAuthClient } from "better-auth/react";
import { cloudflareClient } from "better-auth-cloudflare/client";
import { anonymousClient } from "better-auth/client/plugins";

// Enhanced auth client with Cloudflare features
export const { 
  signIn, 
  signOut, 
  signUp, 
  useSession,
  $fetch,
  // Additional exports for enhanced functionality
  useContext,
  useGeolocation,
  useCloudflareInfo,
} = createAuthClient({
  baseUrl: "/api/auth",
  plugins: [
    cloudflareClient({
      // Enable rich client-side context
      enableContextTracking: true,
      // Automatically detect timezone, city, country, region
      enrichContext: {
        timezone: true,
        location: true,
        device: true,
      },
      // Enable file upload capabilities
      enableFileUpload: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    }),
    anonymousClient(),
  ],
  fetchOptions: {
    // Include Cloudflare headers for IP detection
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
});

// Export context hooks for accessing Cloudflare data
export const useCloudflareContext = () => {
  const context = useContext?.();
  return {
    ip: context?.ip,
    country: context?.country,
    region: context?.region,
    city: context?.city,
    timezone: context?.timezone,
    cf: context?.cf,
  };
};

// Export geolocation hook
export const useUserGeolocation = () => {
  return useGeolocation?.();
};

// Export type for client usage
export type AuthContext = ReturnType<typeof useCloudflareContext>;
