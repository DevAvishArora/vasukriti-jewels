'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, Loader2, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import axiosInstance from '@/lib/axios';

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  images: Array<{ url: string }>;
  price: number;
  discountPrice?: number;
  category: {
    name: string;
    slug: string;
  };
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/products', {
          params: {
            search: query,
            limit: 8,
          },
        });

        if (response.data.success) {
          setProducts(response.data.data.products || []);
        }
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const saveSearch = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveSearch(query.trim());
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onOpenChange(false);
    }
  };

  const handleProductClick = () => {
    if (query.trim()) {
      saveSearch(query.trim());
    }
    onOpenChange(false);
  };

  const popularSearches = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Gold'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 border border-gray-900" showCloseButton={false}>
        {/* Search Input */}
        <div className="border-b border-gray-200 bg-white">       <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-900" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for jewelry..."
              className="w-full pl-14 pr-14 py-6 text-base font-light text-gray-900 placeholder:text-gray-400 focus:outline-none bg-white"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:opacity-60 transition-opacity"
              >
                <X className="h-4 w-4 text-gray-900" />
              </button>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto bg-white">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-gray-900 animate-spin" />
            </div>
          )}

          {/* Search Results */}
          {!isLoading && query && products.length > 0 && (
            <div className="p-4">
              <div className="text-xs font-light uppercase tracking-wider text-gray-900 mb-4 px-2">
                Products ({products.length})
              </div>
              <div className="space-y-1">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    onClick={handleProductClick}
                    className="flex items-center gap-4 p-3 border border-gray-100 hover:border-gray-900 transition-colors"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 border border-gray-100">
                      {product.images?.[0]?.url && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-light text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-light uppercase tracking-wider mt-1">
                        {product.category.name}
                      </p>
                    </div>
                    <div className="text-sm font-light text-gray-900">
                      ₹{product.discountPrice || product.price}
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => {
                  saveSearch(query);
                  onOpenChange(false);
                }}
                className="block text-center py-3 mt-2 text-sm font-light text-gray-900 hover:opacity-60 transition-opacity border-t border-gray-200"
              >
                View all results
              </Link>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query && products.length === 0 && (
            <div className="text-center py-12 px-6 bg-white">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-light text-gray-900 mb-4">
                No products found for &quot;{query}&quot;
              </p>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => {
                  saveSearch(query);
                  onOpenChange(false);
                }}
                className="text-sm font-light text-gray-900 hover:opacity-60 transition-opacity border-b border-gray-900"
              >
                Search anyway
              </Link>
            </div>
          )}

          {/* Recent & Popular Searches */}
          {!query && (
            <div className="p-6 bg-white">
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-xs font-light uppercase tracking-wider text-gray-900 mb-4">
                    <TrendingUp className="h-3 w-3" />
                    Recent Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 border border-gray-200 hover:border-gray-900 text-sm font-light text-gray-900 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-light uppercase tracking-wider text-gray-900 mb-4">
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 border border-gray-200 hover:border-gray-900 text-sm font-light text-gray-900 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
