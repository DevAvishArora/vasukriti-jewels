'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/client/product/product-card';
import axiosInstance from '@/lib/axios';
import type { Product } from '@/types/product';

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axiosInstance.get('/products', {
          params: {
            sortBy: 'createdAt',
            order: 'desc',
            limit: 8,
          },
        });

        if (response.data.success) {
          setProducts(response.data.data.products || []);
        }
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <motion.h2
              className="text-3xl font-light tracking-wide text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              New Arrivals
            </motion.h2>
            <motion.p
              className="text-xs font-light text-gray-400 uppercase tracking-wider mt-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Discover our latest collection
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/shop?sortBy=createdAt&order=desc"
              className="hidden md:flex items-center gap-2 text-xs font-light text-gray-900 hover:opacity-60 transition-opacity uppercase tracking-wider"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProductCard product={product} showNewBadge={true} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Mobile View All Link */}
        <motion.div
          className="mt-8 text-center md:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/shop?sortBy=createdAt&order=desc"
            className="inline-flex items-center gap-2 text-xs font-light text-gray-900 hover:opacity-60 transition-opacity uppercase tracking-wider"
          >
            View All New Arrivals
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
