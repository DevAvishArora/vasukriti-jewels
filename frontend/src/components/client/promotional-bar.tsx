'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const promotions = [
  "Festive Offer – Flat 15% Off on Handcrafted Jewellery",
  "🎁 Free Shipping on Orders Above ₹10,000",
  "💎 New Collection Launch – Explore Timeless Elegance",
  "⭐ Complimentary Gift Wrapping on All Orders",
];

export default function PromotionalBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible || scrolled) return null;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-40 overflow-hidden"
    >
      {/* Clean Background */}
      <div className="relative py-2.5 text-white" style={{ backgroundColor: '#7e1219' }}>
        {/* Content Container */}
        <div className="relative flex items-center justify-center px-4">
        

          {/* Sliding Text */}
          <div className="flex-1 overflow-hidden">
            <motion.div
              className="flex whitespace-nowrap"
              animate={{
                x: [0, '-50%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 15,
                  ease: "linear",
                },
              }}
            >
              {[...promotions, ...promotions].map((promo, index) => (
                <span
                  key={index}
                  className="mx-8 text-sm font-medium tracking-wide text-white/95"
                >
                  {promo}
                </span>
              ))}
            </motion.div>
          </div>

        
        </div>

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>
    </motion.div>
  );
}
