// Framer Motion Animation Variants for Premium Luxury Experience

export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
};

export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
};

export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

// Stagger children animations
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
};

// Hero text reveal
export const lineReveal = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
};

export const wordReveal = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 }
};

// Hover effects
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -8, 
    scale: 1.02,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }
};

export const hoverGlow = {
  rest: { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' },
  hover: { 
    boxShadow: '0 8px 40px rgba(232, 150, 143, 0.15)',
    transition: { duration: 0.3 }
  }
};

export const imageZoom = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// Mega menu animations
export const megaMenuContainer = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.3 }
  }
};

export const megaMenuItem = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 }
};

// Navbar scroll animations
export const navbarVariants = {
  transparent: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    backdropFilter: 'blur(0px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0)',
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }
  },
  solid: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    backdropFilter: 'blur(0px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }
  }
};

// Card animations
export const cardHover = {
  rest: { 
    y: 0,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  },
  hover: { 
    y: -12,
    boxShadow: '0 12px 50px rgba(0, 0, 0, 0.1)',
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Button animations
export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.15 }
};

export const buttonHover = {
  scale: 1.02,
  boxShadow: '0 8px 30px rgba(232, 150, 143, 0.25)',
  transition: { duration: 0.3 }
};

// Promotional bar
export const slideText = {
  animate: {
    x: [0, -100],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
        ease: "linear",
      },
    },
  },
};

// Parallax scroll
export const parallaxVariants = {
  initial: { y: 0 },
  animate: (custom: number) => ({
    y: custom,
    transition: { duration: 0 }
  })
};

// Modal/Overlay animations
export const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.3 }
  }
};

// Loading skeleton
export const skeletonPulse = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Floating elements
export const floatAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shimmer effect
export const shimmerVariants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};
