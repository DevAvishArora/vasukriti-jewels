'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    title: 'Timeless\nElegance',
    description: 'Discover exquisite handcrafted jewellery that tells your story',
    image: '/images/hero-1.jpg', // Replace with actual image paths
    gradient: 'from-amber-50 via-rose-50 to-pink-50'
  },
  {
    id: 2,
    title: 'Crafted with\nPassion',
    description: 'Each piece is a masterpiece, handcrafted with precision and care',
    image: '/images/hero-2.jpg',
    gradient: 'from-gray-50 via-stone-50 to-neutral-50'
  },
  {
    id: 3,
    title: 'Celebrate\nYour Moments',
    description: 'Jewelry that captures life\'s precious moments in timeless beauty',
    image: '/images/hero-3.jpg',
    gradient: 'from-rose-50 via-pink-50 to-red-50'
  }
];

export function LuxuryHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slider Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="relative w-full h-full">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Glassmorphism Overlay - Only over text area */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-transparent pointer-events-none" />

      {/* Content Container - Left Aligned */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            {/* Animated Text Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 leading-tight whitespace-pre-line">
                  {slides[currentSlide].title}
                </h1>
                
                <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
                  {slides[currentSlide].description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/shop"
                    className="px-8 py-3 text-white font-medium text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#7e1219' }}
                  >
                    Shop Now
                  </Link>

                  <Link
                    href="/about"
                    className="px-8 py-3 border-2 text-gray-900 font-medium text-sm uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all"
                    style={{ borderColor: '#7e1219' }}
                  >
                    About Us
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 flex flex-wrap gap-6 text-xs uppercase tracking-wider text-gray-600">
                  <span>Free Shipping</span>
                  <span>•</span>
                  <span>Easy Returns</span>
                  <span>•</span>
                  <span>Secure Checkout</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 h-2 rounded-full'
                : 'w-2 h-2 rounded-full'
            }`}
            style={{
              backgroundColor: index === currentSlide ? '#7e1219' : 'rgba(0,0,0,0.3)'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
