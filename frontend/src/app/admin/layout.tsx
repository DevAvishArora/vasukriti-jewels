'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Sidebar } from '@/components/admin/sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
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
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-gray-700 dark:text-gray-300"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Sidebar - Desktop: Fixed, Mobile: Drawer */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
