'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Gem, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

const defaultFeatures = [
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

interface PageContent {
  title: string;
  subtitle?: string;
  sections: Array<{
    type: string;
    content: any;
    order: number;
  }>;
}

export function BrandStory() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axiosInstance.get('/page-content/brand-story');
        setContent(response.data.data);
      } catch (error) {
        console.error('Error fetching brand story content:', error);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Extract content with proper fallback
  const displayTitle = content?.title || 'Crafting Timeless Elegance';
  const displaySubtitle = content?.subtitle || 'Where Heritage Meets Contemporary Design';
  
  // Get heading and paragraphs from sections
  const heading = content?.sections?.find(s => s.type === 'heading')?.content || displayTitle;
  const paragraphs = content?.sections
    ?.filter(s => s.type === 'paragraph')
    .sort((a, b) => a.order - b.order)
    .map(s => s.content) || [];

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
            {/* Placeholder for image - replace with actual image */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
              <Image
                src="/images/brand-story.png"
                alt="Vasukriti Craftsmanship"
                fill
                className="object-cover opacity-80"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Overlay Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)',
              }} />
            </div>

            {/* Accent Border */}
            <div className="absolute top-8 left-8 right-8 bottom-8 border border-white/20" />
          </motion.div>

          {/* Right Side - Content */}
          <div className="flex items-center px-8 lg:px-16 py-16 lg:py-24">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Subtitle */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12" style={{ backgroundColor: '#7e1219' }} />
                <span className="text-xs font-light uppercase tracking-wider text-gray-400">
                  Since 1985
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-white mb-6">
                {heading.split('\n').map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    {i < heading.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h2>

              {/* Description */}
              {paragraphs.length > 0 ? (
                <>
                  <p className="text-base font-light text-gray-300 leading-relaxed mb-8">
                    {paragraphs[0]}
                  </p>
                  {paragraphs[1] && (
                    <p className="text-sm font-light text-gray-400 leading-relaxed mb-12">
                      {paragraphs[1]}
                    </p>
                  )}
                  {paragraphs[2] && (
                    <p className="text-sm font-light text-gray-400 leading-relaxed mb-12">
                      {paragraphs[2]}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-base font-light text-gray-300 leading-relaxed mb-8">
                    For over three decades, Vasukriti has been synonymous with exceptional 
                    craftsmanship and timeless design. Each piece tells a story of heritage, artistry, 
                    and unwavering commitment to quality.
                  </p>
                  <p className="text-sm font-light text-gray-400 leading-relaxed mb-12">
                    Our master artisans blend traditional Indian jewelry-making techniques with 
                    contemporary aesthetics, creating pieces that transcend generations.
                  </p>
                </>
              )}

              {/* Features */}
              <div className="space-y-6 mb-12">
                {defaultFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
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

              {/* CTA Button */}
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 text-sm font-light uppercase tracking-wider text-white hover:opacity-90 transition-opacity group"
                style={{ backgroundColor: '#7e1219' }}
              >
                Discover Our Story
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
