'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {
          // Autoplay might be blocked by browser
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-amber-900/30 to-black"
    >
      {/* Beautiful gradient background with animated elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-rose-500/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Optional Video Background (hidden if not available) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        onLoadedData={() => {
          // Show video once it's loaded
          if (videoRef.current) {
            videoRef.current.style.opacity = '0.6';
          }
        }}
        onError={() => {
          // Hide video if it fails to load
          if (videoRef.current) {
            videoRef.current.style.opacity = '0';
          }
        }}
      >
        <source src="https://commondatastorage.google.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
        <source src="/videos/jewelry-craftsmanship.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Handcrafted Excellence
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="text-amber-400 text-sm tracking-widest">SINCE 2010</span>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>

          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8 font-light drop-shadow-lg">
            Every piece is meticulously crafted by our master artisans,
            <br className="hidden md:block" />
            blending tradition with contemporary design.
          </p>

          <Link href="/about">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 mx-auto px-8 py-4 bg-amber-500/20 backdrop-blur-md border border-amber-400/30 rounded-full text-white hover:bg-amber-500/30 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Discover Our Story</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
