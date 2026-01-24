'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import axiosInstance from '@/lib/axios-instance';

interface HeroImage {
  url: string;
  publicId: string;
  alt: string;
}

interface HeroCTA {
  text: string;
  link: string;
  style: string;
}

interface HeroDesign {
  layout: string;
  overlay: {
    enabled: boolean;
    color: string;
  };
  textAlignment: string;
  animation: string;
  height: string;
}

interface HeroSection {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  images: HeroImage[];
  cta: HeroCTA;
  secondaryCta: HeroCTA;
  design: HeroDesign;
  isActive: boolean;
  order: number;
}

export function LuxuryHero() {
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const response = await axiosInstance.get('/cms/hero/active');
      const data = response.data.data || [];
      setHeroes(data.sort((a: HeroSection, b: HeroSection) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching hero sections:', error);
      setHeroes([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance slides if multiple heroes
  useEffect(() => {
    if (heroes.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroes.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroes.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="relative h-screen w-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (heroes.length === 0) {
    return null;
  }

  const currentHero = heroes[currentSlide];
  const animation = currentHero.design.animation || 'fade';
  const textAlign = currentHero.design.textAlignment || 'left';
  const height = currentHero.design.height || '100vh';

  // Animation variants
  const getAnimationVariants = () => {
    switch (animation) {
      case 'slide':
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -50 },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const variants = getAnimationVariants();

  // Get text alignment classes
  const getAlignmentClasses = () => {
    switch (textAlign) {
      case 'left':
        return 'justify-start text-left';
      case 'right':
        return 'justify-end text-right';
      case 'center':
      default:
        return 'justify-center text-center';
    }
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {/* Background Image with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`image-${currentSlide}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {currentHero.images[0]?.url && (
            <Image
              src={currentHero.images[0].url}
              alt={currentHero.images[0].alt || currentHero.title}
              fill
              className="object-cover"
              priority
              quality={85}
              sizes="100vw"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      {currentHero.design.overlay.enabled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: currentHero.design.overlay.color }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className={`max-w-3xl ${textAlign === 'center' ? 'mx-auto' : textAlign === 'right' ? 'ml-auto' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                initial={variants.initial}
                animate={variants.animate}
                exit={variants.exit}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}
              >
                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-white mb-6 leading-tight whitespace-pre-line">
                  {currentHero.title}
                </h1>

                {/* Subtitle */}
                {currentHero.subtitle && (
                  <h2 className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 font-light">
                    {currentHero.subtitle}
                  </h2>
                )}

                {/* Description */}
                {currentHero.description && (
                  <p className="text-base md:text-lg text-white/80 mb-8 max-w-2xl">
                    {currentHero.description}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className={`flex flex-wrap gap-4 ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                  {currentHero.cta.text && (
                    <Link
                      href={currentHero.cta.link || '/shop'}
                      className={`px-8 py-3 font-medium text-sm uppercase tracking-wider transition-all ${
                        currentHero.cta.style === 'primary'
                          ? 'text-white hover:opacity-90'
                          : 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                      }`}
                      style={
                        currentHero.cta.style === 'primary'
                          ? { backgroundColor: '#7e1219' }
                          : {}
                      }
                    >
                      {currentHero.cta.text}
                    </Link>
                  )}

                  {currentHero.secondaryCta.text && (
                    <Link
                      href={currentHero.secondaryCta.link || '/about'}
                      className={`px-8 py-3 font-medium text-sm uppercase tracking-wider transition-all ${
                        currentHero.secondaryCta.style === 'primary'
                          ? 'text-white hover:opacity-90'
                          : 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                      }`}
                      style={
                        currentHero.secondaryCta.style === 'primary'
                          ? { backgroundColor: '#7e1219' }
                          : {}
                      }
                    >
                      {currentHero.secondaryCta.text}
                    </Link>
                  )}
                </div>

                {/* Trust Indicators */}
                {currentSlide === 0 && (
                  <div className="mt-12 flex flex-wrap gap-6 text-xs uppercase tracking-wider text-white/70">
                    <span>Free Shipping</span>
                    <span>•</span>
                    <span>Easy Returns</span>
                    <span>•</span>
                    <span>Secure Checkout</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {heroes.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {heroes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide ? 'w-8 h-2 rounded-full' : 'w-2 h-2 rounded-full'
              }`}
              style={{
                backgroundColor: index === currentSlide ? '#7e1219' : 'rgba(255,255,255,0.5)',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
