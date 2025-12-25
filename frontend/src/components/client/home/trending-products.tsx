'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '../product/product-card';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '@/lib/axios-instance';
import type { Product } from '@/types';

export function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axiosInstance.get('/products?limit=8&sort=-createdAt');
        const data = response.data.data;
        // Handle both array and paginated response
        const productList = Array.isArray(data) ? data : (data?.products || []);
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching trending products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="bg-gray-50 aspect-[3/4] animate-pulse" />
                <div className="h-4 bg-gray-50 animate-pulse w-3/4" />
                <div className="h-4 bg-gray-50 animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl font-light text-black tracking-wider mb-2">
              TRENDING NOW
            </h2>
            <p className="text-sm text-gray-500">
              Discover our most popular pieces
            </p>
          </div>
          <Link 
            href="/shop"
            className="hidden md:flex items-center gap-2 text-sm text-black hover:text-gray-600 transition-colors group"
          >
            VIEW ALL
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View All Button (Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:hidden text-center"
        >
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#7e1219] text-white text-sm tracking-wider hover:bg-[#6a0f15] transition-colors"
          >
            VIEW ALL
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
