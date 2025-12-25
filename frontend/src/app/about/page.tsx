import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Heart, Award, Users, ArrowRight } from 'lucide-react';
import { ClientLayout } from '@/components/client/client-layout';
import { FadeIn, StaggerContainer, StaggerItem, SlideIn } from '@/components/transitions';

export const metadata: Metadata = {
  title: 'About Us - Vasukriti Jewels',
  description: 'Discover the story behind Vasukriti Jewels. Learn about our craftsmanship, values, and commitment to creating timeless jewelry pieces.',
};

export default function AboutPage() {
  return (
    <ClientLayout>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] bg-gray-50">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center relative z-10">
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-light tracking-wide text-gray-900 mb-6">
              Crafting Timeless Elegance
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8 font-light">
              For over two decades, we&apos;ve been creating exquisite jewelry pieces that celebrate life&apos;s precious moments
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="flex items-center gap-2 text-[#7e1219]">
              <Sparkles className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-light">Established 2003</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <SlideIn from="left">
              <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070"
                  alt="Jewelry craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
            </SlideIn>
            <FadeIn delay={0.2}>
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed font-light">
                Vasukriti Jewels began with a simple vision: to create jewelry that tells stories. Founded by master craftsmen with a passion for excellence, we&apos;ve grown from a small workshop into a trusted name in fine jewelry.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed font-light">
                Each piece we create is more than just an accessory—it&apos;s a work of art, meticulously crafted to celebrate your unique journey. From traditional designs that honor our heritage to contemporary pieces that embrace modern elegance, we blend timeless craftsmanship with innovative design.
              </p>
              <p className="text-gray-600 leading-relaxed font-light">
                Our commitment to quality, authenticity, and customer satisfaction has made us the preferred choice for customers seeking jewelry that stands the test of time.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-light">
                The principles that guide everything we do
              </p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StaggerItem>
              <div className="bg-white p-8 border border-gray-200 hover:border-gray-900 transition-colors text-center">
                <div className="w-16 h-16 bg-[#7e1219] flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-light uppercase tracking-wider text-gray-900 mb-3">
                  Quality Excellence
                </h3>
                <p className="text-gray-600 font-light">
                  We use only the finest materials and employ rigorous quality standards in every piece we create.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white p-8 border border-gray-200 hover:border-gray-900 transition-colors text-center">
                <div className="w-16 h-16 bg-[#7e1219] flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-light uppercase tracking-wider text-gray-900 mb-3">
                  Authentic Craftsmanship
                </h3>
                <p className="text-gray-600 font-light">
                  Our skilled artisans bring decades of experience to create authentic, handcrafted jewelry.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white p-8 border border-gray-200 hover:border-gray-900 transition-colors text-center">
                <div className="w-16 h-16 bg-[#7e1219] flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-light uppercase tracking-wider text-gray-900 mb-3">
                  Customer First
                </h3>
                <p className="text-gray-600 font-light">
                  Your satisfaction is our priority. We&apos;re committed to providing exceptional service at every step.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white p-8 border border-gray-200 hover:border-gray-900 transition-colors text-center">
                <div className="w-16 h-16 bg-[#7e1219] flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-light uppercase tracking-wider text-gray-900 mb-3">
                  Trust & Transparency
                </h3>
                <p className="text-gray-600 font-light">
                  We believe in honest pricing, authentic certifications, and building lasting relationships.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-light">
              Milestones that shaped who we are today
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                { year: '2003', title: 'The Beginning', description: 'Founded with a vision to create exceptional jewelry that celebrates life\'s precious moments.' },
                { year: '2008', title: 'First Showroom', description: 'Opened our flagship store, bringing our designs directly to customers.' },
                { year: '2015', title: 'Award Recognition', description: 'Received the Excellence in Craftsmanship Award for innovative design and quality.' },
                { year: '2020', title: 'Going Digital', description: 'Launched our online platform to serve customers across the country.' },
                { year: '2023', title: '50,000+ Happy Customers', description: 'Crossed a major milestone in customer satisfaction and trust.' },
              ].map((milestone, index) => (
                <div key={milestone.year} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-[#7e1219] group-hover:scale-125 transition-transform" />
                    {index < 4 && <div className="w-0.5 flex-1 bg-gray-200 mt-2" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="text-sm text-[#7e1219] font-light mb-1">{milestone.year}</div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 font-light">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#7e1219]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white mb-4">
            Discover Our Collections
          </h2>
          <p className="text-white opacity-90 max-w-2xl mx-auto mb-8 font-light">
            Explore our exquisite range of jewelry pieces, each crafted with passion and precision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-white text-[#7e1219] px-8 py-3 font-light uppercase tracking-wider text-sm hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white px-8 py-3 font-light uppercase tracking-wider text-sm hover:bg-white hover:text-[#7e1219] transition-colors inline-flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
    </ClientLayout>
  );
}
