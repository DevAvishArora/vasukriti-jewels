'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ClientLayout } from '@/components/client/client-layout';
import { ProductCard } from '@/components/client/product/product-card';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axios';

interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  images: string[];
  price: number;
  discountPrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  rating: number;
  reviewCount: number;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/products', {
          params: {
            search: query,
            limit: 50,
          },
        });

        if (response.data.success) {
          setProducts(response.data.data.products || []);
          setTotalCount(response.data.data.pagination?.totalProducts || 0);
        }
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  if (!query) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-md mx-auto">
            <Search className="h-12 w-12 text-gray-200 mx-auto mb-6" />
            <h1 className="text-2xl font-light tracking-wide text-gray-900 mb-3">
              Search for Jewelry
            </h1>
            <p className="text-sm font-light text-gray-400 uppercase tracking-wider">
              Use the search bar above to find your perfect piece
            </p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-light tracking-wide text-gray-900">
                Search Results
              </h1>
              <p className="text-sm font-light text-gray-400 mt-2 uppercase tracking-wider">
                {isLoading ? (
                  'Searching...'
                ) : (
                  <>
                    {totalCount} {totalCount === 1 ? 'result' : 'results'} for &quot;
                    <span className="text-gray-900">{query}</span>&quot;
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Clear Search */}
          {query && (
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-light text-gray-400 hover:text-gray-900 uppercase tracking-wider transition-colors"
            >
              <X className="h-3 w-3" />
              Clear search
            </Link>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }, (_, index) => index).map((i) => (
              <div
                key={i}
                className="bg-gray-50 aspect-[3/4] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Results */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product as unknown as import('@/types/product').Product} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-gray-200 mx-auto mb-6" />
            <h2 className="text-xl font-light tracking-wide text-gray-900 mb-3">
              No products found
            </h2>
            <p className="text-sm font-light text-gray-400 uppercase tracking-wider mb-12">
              We couldn&apos;t find any products matching &quot;{query}&quot;
            </p>
            <div className="space-y-8">
              <div>
                <p className="text-xs font-light text-gray-400 uppercase tracking-wider mb-4">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${term.toLowerCase()}`}
                      className="px-6 py-2 bg-gray-50 hover:bg-gray-100 text-sm font-light text-gray-700 transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <Link href="/shop">
                  <button
                    className="px-8 py-3 text-sm font-light uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#7e1219' }}
                  >
                    Browse All Products
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <ClientLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </ClientLayout>
    }>
      <SearchResults />
    </Suspense>
  );
}
