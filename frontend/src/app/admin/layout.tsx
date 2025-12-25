'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Sidebar } from '@/components/admin/sidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  
  // Use a ref to get the latest auth state without causing re-renders
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Wait a tick for Zustand to hydrate from localStorage
    const timer = setTimeout(() => {
      setIsReady(true);
      
      // Now check auth
      const currentAuth = useAuthStore.getState();
      if (!currentAuth.isAuthenticated) {
        router.replace('/login');
      } else if (currentAuth.user?.role !== 'admin') {
        router.replace('/');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  // Show loading while hydrating
  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-amber-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // After hydration, check if user should be here
  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Router will handle redirect
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
