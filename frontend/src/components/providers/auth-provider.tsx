'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only check auth if we have a token
    if (globalThis.window !== undefined) {
      const token = globalThis.window.localStorage.getItem('token');
      if (token) {
        // Get checkAuth directly from store to avoid dependency
        const checkAuth = useAuthStore.getState().checkAuth;
        checkAuth().catch(() => {
          // Silently handle errors
        });
      }
    }
  }, []); // Empty deps intentional - only run once on mount

  return <>{children}</>;
}
