'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
  isActive: boolean;
}

export function FeaturedCollections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        const data = response.data.data;
        const categoryList = Array.isArray(data) ? data : (data?.categories || []);
        // Only show first 4 active categories
        setCategories(categoryList.filter((cat: Category) => cat.isActive).slice(0, 4));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-wide">
            Collections
          </h2>
          <p className="text-sm text-gray-500 font-light max-w-2xl">
            Discover our curated collections
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gray-100 animate-pulse"
              />
            ))
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group block relative overflow-hidden aspect-[3/4] bg-gray-50"
                >
                  {/* Category Image */}
                  {category.image?.url ? (
                    <Image
                      src={category.image.url}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100" />
                  )}

                  {/* Overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-500"
                    style={{ backgroundColor: '#7e1219' }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-gray-900 group-hover:text-white transition-colors duration-500">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xl font-light mb-1 tracking-wide">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs mb-4 opacity-70 font-light uppercase tracking-wider line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs font-light uppercase tracking-wider group-hover:gap-3 transition-all">
                        <span>Explore</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-sm text-gray-400 font-light">No collections available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
