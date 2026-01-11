'use client';

import { useState } from 'react';
import PromotionalBar from './promotional-bar';
import { LuxuryNavbar } from './layout/luxury-navbar';
import { Footer, MobileNav } from './layout';
import { PageTransition } from '@/components/transitions';
import EmailVerificationBanner from './email-verification-banner';
import { useAuthStore } from '@/store/auth-store';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  // Show verification banner if user is logged in but not verified
  const showVerificationBanner = isAuthenticated && user && !user.isVerified;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PromotionalBar />
      <LuxuryNavbar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
      {showVerificationBanner && <EmailVerificationBanner />}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
