'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function AnimatedButton({
  children,
  className = '',
  variant = 'primary',
  ...props
}: AnimatedButtonProps) {
  const variants = {
    primary: 'bg-[#7e1219] text-white hover:bg-opacity-90',
    secondary: 'bg-white text-[#7e1219] hover:bg-gray-50',
    outline: 'border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center px-8 py-3 font-light uppercase tracking-wider text-sm transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
