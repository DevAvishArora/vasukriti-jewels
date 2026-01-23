'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Gem, Shield, Star, Heart, Sparkles, Crown, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

// Icon mapping for features
const iconMap: any = {
  Gem,
  Shield,
  Award,
  Star,
  Heart,
  Sparkles,
  Crown,
  CheckCircle,
};

const features = [
  {
    icon: Gem,
    title: 'Handcrafted Excellence',
    description: 'Every piece meticulously crafted by master artisans',
  },
  {
    icon: Shield,
    title: 'BIS Hallmarked',
    description: 'Certified purity and quality guaranteed',
  },
  {
    icon: Award,
    title: 'Heritage Design',
    description: 'Traditional craftsmanship meets modern elegance',
  },
];

interface BrandStoryData {
  image: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  features?: Array<{ icon?: string; title: string; description: string }>;
  ctaText?: string;
  ctaLink?: string;
}

export function BrandStory() {
  const [data, setData] = useState<BrandStoryData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/cms/brand-story');
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching brand story:', error);
      }
    };
    fetchData();
  }, []);

  const displayData = data || {
    image: '/images/brand-story.png',
    heading: 'Crafting Timeless Elegance',
    paragraph1: 'For over three decades, Vasukriti has been synonymous with exceptional craftsmanship and timeless design. Each piece tells a story of heritage, artistry, and unwavering commitment to quality.',
    paragraph2: 'Our master artisans blend traditional Indian jewelry-making techniques with contemporary aesthetics, creating pieces that transcend generations.',
    features: [
      { icon: 'Gem', title: 'Handcrafted Excellence', description: 'Every piece meticulously crafted by master artisans' },
      { icon: 'Shield', title: 'BIS Hallmarked', description: 'Certified purity and quality guaranteed' },
      { icon: 'Award', title: 'Heritage Design', description: 'Traditional craftsmanship meets modern elegance' },
    ],
    ctaText: 'Discover Our Story',
    ctaLink: '/about',
  };

  const displayFeatures = displayData.features || features;

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[500px] lg:h-[700px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
              <Image
                src={displayData.image}
                alt="Vasukriti Craftsmanship"
                fill
                className="object-cover opacity-80"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)',
              }} />
            </div>

            <div className="absolute top-8 left-8 right-8 bottom-8 border border-white/20" />
          </motion.div>

          {/* Right Side - Content */}
          <div className="flex items-center px-8 lg:px-16 py-16 lg:py-24">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <h2 className="text-4xl lg:text-5xl font-light mb-6 text-white">
                {displayData.heading}
              </h2>

              <p className="text-base font-light text-gray-300 leading-relaxed mb-8">
                {displayData.paragraph1}
              </p>
              <p className="text-sm font-light text-gray-400 leading-relaxed mb-12">
                {displayData.paragraph2}
              </p>

              <div className="space-y-6 mb-12">
                {displayFeatures.map((feature, idx) => {
                  // Get icon from feature data or fallback to array icon
                  const iconName = feature.icon || features[idx]?.icon;
                  const Icon = iconMap[iconName as string] || Gem;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 border border-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                        <Icon className="h-4 w-4" style={{ color: '#7e1219' }} strokeWidth={1} />
                      </div>
                      <div>
                        <h3 className="text-sm font-light text-white mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-xs font-light text-gray-400 uppercase tracking-wider">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <Link
                href={displayData.ctaLink || '/about'}
                className="inline-flex items-center gap-3 px-8 py-4 text-sm font-light uppercase tracking-wider text-white hover:opacity-90 transition-opacity group"
                style={{ backgroundColor: '#7e1219' }}
              >
                {displayData.ctaText || 'Discover Our Story'}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
