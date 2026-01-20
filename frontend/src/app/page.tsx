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
import RibbonCutting from '@/components/client/launch/ribbon-cutting';

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
