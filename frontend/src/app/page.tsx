'use client';

import dynamic from 'next/dynamic';
import { ClientLayout } from '@/components/client/client-layout';
import { LuxuryHero, CategoryCards } from '@/components/client/home';

// Lazy load below-the-fold components for better initial load
const WhyChooseUs = dynamic(() => import('@/components/client/home').then(mod => ({ default: mod.WhyChooseUs })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

const NewArrivals = dynamic(() => import('@/components/client/home').then(mod => ({ default: mod.NewArrivals })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

const TrendingProducts = dynamic(() => import('@/components/client/home').then(mod => ({ default: mod.TrendingProducts })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

const BrandStory = dynamic(() => import('@/components/client/home').then(mod => ({ default: mod.BrandStory })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

const Newsletter = dynamic(() => import('@/components/client/home').then(mod => ({ default: mod.Newsletter })), {
  loading: () => <div className="h-64 bg-gray-50 animate-pulse" />,
});

const Testimonials = dynamic(() => import('@/components/client/home').then(mod => ({ default: mod.Testimonials })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

const RibbonCutting = dynamic(() => import('@/components/client/launch/ribbon-cutting'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <RibbonCutting />
      <ClientLayout>
        <LuxuryHero />
        <CategoryCards />
        <WhyChooseUs />
        <NewArrivals />
        <TrendingProducts />
        <BrandStory />
        <Newsletter />
        <Testimonials />
      </ClientLayout>
    </>
  );
}
