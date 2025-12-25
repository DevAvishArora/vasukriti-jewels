'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AnimatedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function AnimatedLink({
  href,
  children,
  className = '',
  variant = 'primary',
}: AnimatedLinkProps) {
  const variants = {
    primary: 'bg-[#7e1219] text-white hover:bg-opacity-90',
    secondary: 'bg-white text-[#7e1219] hover:bg-gray-50',
    outline: 'border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className={`inline-flex items-center justify-center px-8 py-3 font-light uppercase tracking-wider text-sm transition-all ${variants[variant]} ${className}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
