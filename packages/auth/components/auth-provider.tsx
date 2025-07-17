"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSession, useCloudflareContext } from '../client';
import type { AuthContext } from '../client';

interface AuthProviderContextType {
  session: any;
  isLoading: boolean;
  cloudflareContext: AuthContext;
}

const AuthProviderContext = createContext<AuthProviderContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const session = useSession();
  const cloudflareContext = useCloudflareContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false once session is resolved
    if (session !== undefined) {
      setIsLoading(false);
    }
  }, [session]);

  const value = {
    session,
    isLoading,
    cloudflareContext,
  };

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthProviderContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export a hook to get just the Cloudflare context
export const useCloudflareInfo = () => {
  const { cloudflareContext } = useAuth();
  return cloudflareContext;
};