'use client';

import { useState } from 'react';
import PromotionalBar from './promotional-bar';
import { LuxuryNavbar } from './layout/luxury-navbar';
import { Footer, MobileNav } from './layout';
import { PageTransition } from '@/components/transitions';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PromotionalBar />
      <LuxuryNavbar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
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
