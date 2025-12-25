'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  };
  isActive: boolean;
}

interface MegaMenuProps {
  onClose: () => void;
}

export function MegaMenu({ onClose }: Readonly<MegaMenuProps>) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      if (response.data.success) {
        const data = response.data.data;
        const categoryList = Array.isArray(data) ? data : (data?.categories || []);
        setCategories(categoryList.filter((cat: Category) => cat.isActive));
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const priceRanges = [
    { label: 'Under ₹10,000', min: 0, max: 10000 },
    { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
    { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
    { label: 'Above ₹1,00,000', min: 100000, max: 999999999 },
  ];

  return (
    <motion.div
      className="fixed left-0 right-0 top-[57px] z-40"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={onClose}
    >
      <div className="bg-white border-t border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-8 py-12">
          <div className="grid grid-cols-12 gap-12">
            {/* Shop by Category - 4 columns */}
            <div className="col-span-4">
              <h3 className="text-xs font-light uppercase tracking-wider text-gray-900 mb-6 pb-3 border-b border-gray-100">
                Shop by Category
              </h3>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="h-8 bg-gray-50 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      key={category._id}
                      href={`/shop?category=${category.slug}`}
                      className="group flex items-center justify-between py-2 hover:opacity-60 transition-opacity"
                      onClick={onClose}
                    >
                      <span className="text-sm font-light text-gray-900">
                        {category.name}
                      </span>
                      <ChevronRight className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 mt-6 pt-4 border-t border-gray-100 text-xs font-light uppercase tracking-wider text-gray-900 hover:opacity-60 transition-opacity"
                onClick={onClose}
              >
                View All Products
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Shop by Price - 3 columns */}
            <div className="col-span-3">
              <h3 className="text-xs font-light uppercase tracking-wider text-gray-900 mb-6 pb-3 border-b border-gray-100">
                Shop by Price
              </h3>

              <div className="space-y-1">
                {priceRanges.map((range) => (
                  <Link
                    key={range.label}
                    href={`/shop?minPrice=${range.min}&maxPrice=${range.max}`}
                    className="group flex items-center justify-between py-2 hover:opacity-60 transition-opacity"
                    onClick={onClose}
                  >
                    <span className="text-sm font-light text-gray-900">
                      {range.label}
                    </span>
                    <ChevronRight className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Images - 5 columns */}
            <div className="col-span-5">
              <h3 className="text-xs font-light uppercase tracking-wider text-gray-900 mb-6 pb-3 border-b border-gray-100">
                Featured Collections
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {loading ? (
                  <>
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="aspect-square bg-gray-50 animate-pulse" />
                    ))}
                  </>
                ) : (
                  categories.slice(0, 4).map((category) => (
                    <Link
                      key={category._id}
                      href={`/shop?category=${category.slug}`}
                      className="group relative aspect-square overflow-hidden bg-gray-50"
                      onClick={onClose}
                    >
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

                      {/* Overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-300"
                        style={{ backgroundColor: '#7e1219' }}
                      />

                      {/* Text */}
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <h4 className="text-sm font-light text-gray-900 group-hover:text-white transition-colors duration-300 text-center uppercase tracking-wider">
                          {category.name}
                        </h4>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
