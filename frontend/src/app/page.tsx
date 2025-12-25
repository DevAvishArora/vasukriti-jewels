'use client';

import { ClientLayout } from '@/components/client/client-layout';
import {
  LuxuryHero,
  CategoryCards,
  WhyChooseUs,
  NewArrivals,
  TrendingProducts,
  BrandStory,
  Newsletter,
  Testimonials,
} from '@/components/client/home';

export default function Home() {
  return (
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
  );
}
