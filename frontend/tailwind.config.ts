import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Ivory & Cream Base
        ivory: {
          50: '#FFFCF7',
          100: '#FFF9F0',
          200: '#FFF5E8',
          300: '#FFF0DD',
          400: '#FFEBD1',
          500: '#FFE6C5',
          600: '#F5D9B3',
          700: '#E8CCA1',
          800: '#D4B88E',
          900: '#C0A47B',
        },
        // Beige & Champagne
        champagne: {
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#EDE4D5',
          300: '#E3D5C0',
          400: '#D8C5A8',
          500: '#CCB590',
          600: '#BFA578',
          700: '#B29560',
          800: '#9A7F4D',
          900: '#826A3B',
        },
        // Rose Gold
        rosegold: {
          50: '#FFF5F5',
          100: '#FFEAEA',
          200: '#FFD5D5',
          300: '#FFBFBF',
          400: '#FFA9A9',
          500: '#E8968F',
          600: '#D17F78',
          700: '#BA6861',
          800: '#A3514A',
          900: '#8C3A33',
        },
        // Emerald Green
        emerald: {
          50: '#F0F9F4',
          100: '#DBF0E3',
          200: '#B8E2C7',
          300: '#8FCFA7',
          400: '#5FB883',
          500: '#2E9D5F',
          600: '#228047',
          700: '#1B6438',
          800: '#144828',
          900: '#0D2C19',
        },
        // Deep Maroon
        maroon: {
          50: '#FBF5F5',
          100: '#F5E6E6',
          200: '#EBCCCC',
          300: '#E0B3B3',
          400: '#D69999',
          500: '#B85C5C',
          600: '#9A3D3D',
          700: '#7C2E2E',
          800: '#5E1F1F',
          900: '#401010',
        },
        // Warm Charcoal (instead of black)
        charcoal: {
          50: '#F7F7F6',
          100: '#EAEAE8',
          200: '#D5D5D1',
          300: '#BFBFBA',
          400: '#AAAAA3',
          500: '#8C8C83',
          600: '#6E6E65',
          700: '#4F4F47',
          800: '#31312A',
          900: '#1A1A16',
        },
        // Shadcn UI compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'var(--font-cormorant)', 'serif'],
        sans: ['var(--font-inter)', 'var(--font-manrope)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'heading-1': ['3rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'heading-2': ['2.25rem', { lineHeight: '1.3', letterSpacing: '0' }],
        'heading-3': ['1.875rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.75', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0' }],
      },
      letterSpacing: {
        'luxury': '0.05em',
        'elegant': '0.025em',
      },
      borderRadius: {
        'luxury': '20px',
        'elegant': '16px',
        'soft': '12px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 4px 30px rgba(0, 0, 0, 0.06)',
        'elegant': '0 8px 50px rgba(0, 0, 0, 0.08)',
        'luxury': '0 20px 80px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 30px rgba(232, 150, 143, 0.2)',
        'glow-gold': '0 0 40px rgba(204, 181, 144, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      transitionDuration: {
        'elegant': '400ms',
        'smooth': '600ms',
      },
      transitionTimingFunction: {
        'elegant': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
