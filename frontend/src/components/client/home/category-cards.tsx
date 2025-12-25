'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import axiosInstance from '@/lib/axios-instance';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
  };
  productCount?: number;
}

export function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(response.data.data.categories.filter((cat: Category) => cat.image?.url));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center text-gray-500">Loading categories...</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null; // Don't show section if no categories with images
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-light text-gray-900 mb-2"
            >
              Shop by Category
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600"
            >
              Discover our curated collections
            </motion.p>
          </div>

          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-sm uppercase tracking-wider hover:opacity-60 transition-opacity"
            style={{ color: '#7e1219' }}
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 snap-start"
              >
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group block w-64 md:w-72"
                >
                  {/* Image Container */}
                  <div className="relative h-80 md:h-96 overflow-hidden bg-gray-100 mb-4">
                    {category.image?.url && (
                      <Image
                        src={category.image.url}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                    {/* Item Count Badge */}
                    {category.productCount !== undefined && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider text-gray-700">
                        {category.productCount}+ Items
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors uppercase tracking-wide">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicator - Mobile Only */}
          <div className="flex md:hidden justify-center gap-2 mt-6">
            {[...Array(Math.ceil(categories.length / 2))].map((_, i) => (
              <div
                key={i}
                className="h-1 w-8 bg-gray-200"
              />
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <Link
          href="/shop"
          className="flex md:hidden items-center justify-center gap-2 text-sm uppercase tracking-wider mt-8 hover:opacity-60 transition-opacity"
          style={{ color: '#7e1219' }}
        >
          View All Categories
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
