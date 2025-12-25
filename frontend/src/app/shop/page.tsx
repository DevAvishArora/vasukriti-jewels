'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClientLayout } from '@/components/client/client-layout';
import { ProductFilters } from '@/components/client/shop/product-filters';
import { ProductCard } from '@/components/client/product/product-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, X, Grid3x3, LayoutGrid } from 'lucide-react';
import axiosInstance from '@/lib/axios-instance';
import type { Product } from '@/types';
import { motion } from 'framer-motion';

interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  materials: string[];
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    minPrice: 0,
    maxPrice: 100000,
    materials: [],
  });
  const [sort, setSort] = useState('-createdAt');
  const [gridCols, setGridCols] = useState<'3' | '4'>('4');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Fetch category ID from slug
      const fetchCategoryId = async () => {
        try {
          const response = await axiosInstance.get('/categories');
          const categories = response.data.data.categories;
          const category = categories.find((cat: any) => cat.slug === categoryParam);
          if (category) {
            setFilters(prev => ({
              ...prev,
              categories: [category._id]
            }));
          }
        } catch (error) {
          console.error('Error fetching category:', error);
        }
      };
      fetchCategoryId();
    }
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '12',
          sort,
        });

        if (filters.categories.length > 0) {
          params.append('category', filters.categories.join(','));
        }
        if (filters.minPrice > 0) {
          params.append('minPrice', filters.minPrice.toString());
        }
        if (filters.maxPrice < 100000) {
          params.append('maxPrice', filters.maxPrice.toString());
        }
        if (filters.materials.length > 0) {
          params.append('material', filters.materials.join(','));
        }

        const response = await axiosInstance.get(`/products?${params}`);
        const data = response.data.data;
        const productList = Array.isArray(data) ? data : (data?.products || []);
        
        setProducts(productList);
        setTotalPages(data?.pagination?.totalPages || 1);
        setTotalProducts(data?.pagination?.total || productList.length);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters, sort, page]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      minPrice: 0,
      maxPrice: 100000,
      materials: [],
    });
    setPage(1);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.materials.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 100000;

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-light text-gray-900 mb-2 tracking-wide">Shop</h1>
          <p className="text-sm text-gray-500 font-light">Discover our collection</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden border-gray-200 text-xs uppercase tracking-wider font-light">
                      <SlidersHorizontal className="h-3 w-3 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 text-white text-xs w-5 h-5 flex items-center justify-center" style={{ backgroundColor: '#7e1219' }}>
                          {filters.categories.length + filters.materials.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto bg-white">
                    <div className="mt-8">
                      <ProductFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Results Count */}
                <span className="text-xs text-gray-500 uppercase tracking-wider font-light">
                  {loading ? 'Loading...' : `${totalProducts} products`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Grid Toggle - Desktop Only */}
                <div className="hidden md:flex items-center gap-1 border border-gray-200 p-1">
                  <button
                    onClick={() => setGridCols('3')}
                    className={`p-1.5 transition-colors ${
                      gridCols === '3'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setGridCols('4')}
                    className={`p-1.5 transition-colors ${
                      gridCols === '4'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[180px] border-gray-200 text-xs uppercase tracking-wider font-light">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-createdAt" className="text-xs">Newest First</SelectItem>
                    <SelectItem value="createdAt" className="text-xs">Oldest First</SelectItem>
                    <SelectItem value="price" className="text-xs">Price: Low to High</SelectItem>
                    <SelectItem value="-price" className="text-xs">Price: High to Low</SelectItem>
                    <SelectItem value="name" className="text-xs">Name: A to Z</SelectItem>
                    <SelectItem value="-name" className="text-xs">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Chips */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 mb-6"
              >
                <span className="text-xs text-gray-500 uppercase tracking-wider font-light">Active Filters:</span>
                {filters.categories.length > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-light">
                    <span>{filters.categories.length} Categories</span>
                    <button
                      onClick={() =>
                        handleFilterChange({ ...filters, categories: [] })
                      }
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.materials.length > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-light">
                    <span>{filters.materials.length} Materials</span>
                    <button
                      onClick={() =>
                        handleFilterChange({ ...filters, materials: [] })
                      }
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {(filters.minPrice > 0 || filters.maxPrice < 100000) && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-light">
                    <span>
                      ₹{filters.minPrice.toLocaleString('en-IN')} - ₹
                      {filters.maxPrice.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() =>
                        handleFilterChange({
                          ...filters,
                          minPrice: 0,
                          maxPrice: 100000,
                        })
                      }
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-gray-900 font-light uppercase tracking-wider"
                >
                  Clear All
                </button>
              </motion.div>
            )}

            {/* Products Grid */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }, (_, i) => `skeleton-${i}`).map((id) => (
                  <div
                    key={id}
                    className="bg-gray-100 rounded-xl animate-pulse"
                    style={{ aspectRatio: '3/4' }}
                  />
                ))}
              </div>
            )}

            {!loading && products.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-block p-6 bg-gray-50 mb-6">
                  <SlidersHorizontal className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 mb-8 font-light">
                  Try adjusting your filters
                </p>
                <Button 
                  onClick={clearFilters} 
                  variant="outline"
                  className="border-gray-200 text-xs uppercase tracking-wider font-light"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}

            {!loading && products.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`grid gap-6 ${
                    gridCols === '3'
                      ? 'grid-cols-2 md:grid-cols-3'
                      : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                  }`}
                >
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 mt-12"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (p) =>
                            p === 1 ||
                            p === totalPages ||
                            (p >= page - 1 && p <= page + 1)
                        )
                        .map((p, index, array) => (
                          <>
                            {index > 0 && array[index - 1] !== p - 1 && (
                              <span key={`ellipsis-${p}`} className="px-2 text-gray-400">
                                ...
                              </span>
                            )}
                            <Button
                              key={p}
                              variant={page === p ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setPage(p)}
                              className={
                                page === p
                                  ? 'text-white'
                                  : 'border-gray-200'
                              }
                              style={page === p ? { backgroundColor: '#7e1219' } : undefined}
                            >
                              {p}
                            </Button>
                          </>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
