'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

interface RibbonCuttingProps {
  onComplete?: () => void;
}

export default function RibbonCutting({ onComplete }: RibbonCuttingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Check if user has seen the animation
    const hasSeenAnimation = localStorage.getItem('vasukritijewels_launch_seen');
    
    if (!hasSeenAnimation) {
      setIsVisible(true);
      
      // Start cutting animation after 1 second
      setTimeout(() => {
        setIsCut(true);
        setShowConfetti(true);
      }, 1000);

      // Hide everything after animation completes
      setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('vasukritijewels_launch_seen', 'true');
        onComplete?.();
      }, 4000);
    }
  }, [onComplete]);

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 360,
    color: ['#FFD700', '#FF6B9D', '#C89BFA', '#4ECDC4', '#FF6B6B'][Math.floor(Math.random() * 5)],
  }));

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: `${particle.x}vw`,
                  y: '-10%',
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  y: '110vh',
                  rotate: particle.rotation * 3,
                  opacity: 0,
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: 'easeIn',
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{ backgroundColor: particle.color }}
              />
            ))}
          </div>
        )}

        {/* Stars decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{
                duration: 2,
                delay: 1 + Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
              }}
              className="absolute text-yellow-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <Star className="w-4 h-4 fill-current" />
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-4">
          {/* Grand Opening Text */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: 0.5,
              }}
              className="text-4xl md:text-6xl font-bold text-white mb-2 font-serif"
            >
              Grand Opening
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 text-yellow-400"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xl md:text-2xl font-light">Vasukriti Jewels</span>
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </motion.div>

          {/* Ribbon Container */}
          <div className="relative h-32 flex items-center justify-center">
            {/* Left Ribbon */}
            <motion.div
              animate={isCut ? { x: -200, rotate: -15, opacity: 0 } : {}}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute left-0 right-1/2 h-20 bg-gradient-to-r from-red-600 to-red-500 shadow-lg"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>

            {/* Right Ribbon */}
            <motion.div
              animate={isCut ? { x: 200, rotate: 15, opacity: 0 } : {}}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute left-1/2 right-0 h-20 bg-gradient-to-l from-red-600 to-red-500 shadow-lg"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%, 0 50%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>

            {/* Scissors */}
            <motion.div
              initial={{ x: -300, rotate: -45 }}
              animate={isCut ? { x: 0, rotate: 0 } : { x: -300, rotate: -45 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute z-10"
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl"
              >
                <path
                  d="M6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
                  fill="#FFD700"
                  stroke="#B8860B"
                  strokeWidth="0.5"
                />
                <path
                  d="M8 6L19 12L8 18"
                  stroke="#B8860B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M19 12L21 10M19 12L21 14"
                  stroke="#B8860B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Sparkles at cut point */}
            {isCut && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i * Math.PI * 2) / 8) * 100,
                      y: Math.sin((i * Math.PI * 2) / 8) * 100,
                      opacity: [1, 0],
                    }}
                    transition={{ duration: 1 }}
                    className="absolute"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                ))}
              </>
            )}
          </div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isCut ? 1 : 0, y: isCut ? 0 : 20 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8"
          >
            <p className="text-white text-xl md:text-2xl font-light">
              Welcome to Timeless Elegance
            </p>
            <p className="text-yellow-400/80 text-sm md:text-base mt-2">
              Where Every Piece Tells a Story
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
