'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios-instance';

interface Message {
  text: string;
  link: string;
  icon: string;
}

interface PromotionalBar {
  messages: Message[];
  design: {
    type: 'sliding' | 'rotating' | 'static' | 'ticker';
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    animation: {
      speed: number;
      direction: 'left' | 'right' | 'up' | 'down';
    };
  };
  isActive: boolean;
}

export default function PromotionalBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [barData, setBarData] = useState<PromotionalBar | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const fetchPromotionalBar = async () => {
      try {
        const response = await axiosInstance.get('/cms/promotional-bar/active');
        if (response.data.success && response.data.data) {
          setBarData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching promotional bar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionalBar();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotating message interval
  useEffect(() => {
    if (!barData || barData.design.type !== 'rotating') return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % barData.messages.length);
    }, (barData.design.animation.speed || 5) * 1000);

    return () => clearInterval(interval);
  }, [barData]);

  // Don't render if no data, loading, not visible, or scrolled
  if (loading || !barData || !isVisible || scrolled) return null;

  const messages = barData.messages.map(msg => 
    `${msg.icon ? msg.icon + ' ' : ''}${msg.text}`
  );

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-40 overflow-hidden"
    >
      <div 
        className="relative py-2.5"
        style={{ 
          backgroundColor: barData.design.backgroundColor,
          color: barData.design.textColor,
        }}
      >
        <div className="relative flex items-center justify-center px-4">
          <div className="flex-1 overflow-hidden">
            {barData.design.type === 'static' ? (
              <div className="text-center">
                <span 
                  className="font-medium tracking-wide"
                  style={{ fontSize: barData.design.fontSize }}
                >
                  {messages[0]}
                </span>
              </div>
            ) : barData.design.type === 'rotating' ? (
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <span 
                  className="font-medium tracking-wide"
                  style={{ fontSize: barData.design.fontSize }}
                >
                  {messages[currentMessageIndex]}
                </span>
              </motion.div>
            ) : (
              <motion.div
                className="flex whitespace-nowrap"
                animate={{
                  x: barData.design.animation.direction === 'right' 
                    ? [0, 1000] 
                    : [0, -1000],
                }}
                transition={{
                  duration: barData.design.animation.speed || 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {[...messages, ...messages, ...messages].map((msg, index) => (
                  <span
                    key={index}
                    className="mx-8 font-medium tracking-wide"
                    style={{ fontSize: barData.design.fontSize }}
                  >
                    {msg}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>
    </motion.div>
  );
}
