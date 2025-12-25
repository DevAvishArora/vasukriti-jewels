'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-amber-200/20 to-rose-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-200/20 to-amber-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 text-amber-700 text-sm font-medium"
            >
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 5000+ Happy Customers</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Timeless Elegance,
              <br />
              <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                Crafted for You
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Discover exquisite handcrafted jewelry that tells your story.
              Premium quality, authentic designs, certified excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/shop?filter=featured">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-amber-600 text-amber-600 hover:bg-amber-50"
                >
                  View Collections
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-6 text-center lg:text-left"
            >
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  <p className="text-2xl font-bold text-gray-900">10+</p>
                </div>
                <p className="text-sm text-gray-600">Years Excellence</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Shield className="h-5 w-5 text-amber-600" />
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                </div>
                <p className="text-sm text-gray-600">Authentic</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  <p className="text-2xl font-bold text-gray-900">5000+</p>
                </div>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Placeholder for product image - replace with actual jewelry image */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-rose-200 to-purple-200 rounded-full blur-3xl opacity-50" />
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-4/5 h-4/5 bg-white/80 backdrop-blur rounded-full shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="h-24 w-24 text-amber-600 mx-auto mb-4" />
                    <p className="font-playfair text-2xl font-bold text-gray-900">
                      Premium
                      <br />
                      Jewelry
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
                className="absolute top-10 -left-4 bg-white rounded-2xl shadow-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Certified</p>
                    <p className="text-sm font-bold text-gray-900">100% Pure</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
                className="absolute bottom-10 -right-4 bg-white rounded-2xl shadow-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Premium</p>
                    <p className="text-sm font-bold text-gray-900">Quality</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
