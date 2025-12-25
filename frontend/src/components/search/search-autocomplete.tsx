'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Clock, X, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRecentSearches } from '@/hooks/use-recent-searches';
import axiosInstance from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category: {
    name: string;
  };
}

interface SearchAutocompleteProps {
  readonly onClose?: () => void;
}

export function SearchAutocomplete({ onClose }: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();

  // Fetch autocomplete results
  const fetchAutocomplete = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setProducts([]);
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/products/search/autocomplete', {
        params: {
          q: searchQuery,
          autocomplete: 'true',
          limit: 5,
        },
      });

      if (response.data.success) {
        setProducts(response.data.data.products || []);
        setSuggestions(response.data.data.suggestions || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        fetchAutocomplete(query);
      }, 300);
    } else {
      setProducts([]);
      setSuggestions([]);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, fetchAutocomplete]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    addRecentSearch(searchQuery);
    setIsOpen(false);
    setQuery('');
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    onClose?.();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = suggestions.length + products.length + recentSearches.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex === -1) {
          handleSearch(query);
        } else if (selectedIndex < suggestions.length) {
          handleSearch(suggestions[selectedIndex]);
        } else if (selectedIndex < suggestions.length + products.length) {
          const product = products[selectedIndex - suggestions.length];
          router.push(`/products/${product.slug}`);
          setIsOpen(false);
          onClose?.();
        } else {
          const recentIndex = selectedIndex - suggestions.length - products.length;
          handleSearch(recentSearches[recentIndex].query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const showDropdown = isOpen && (query.length >= 2 || recentSearches.length > 0);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search for jewelry..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setProducts([]);
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[500px] overflow-y-auto z-50"
        >
          {isLoading && (
            <div className="p-4 text-center text-sm text-gray-500">
              Searching...
            </div>
          )}

          {!isLoading && query.length < 2 && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-sm font-semibold text-gray-700">Recent Searches</h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={search.timestamp}
                  onClick={() => handleSearch(search.query)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md text-left',
                    selectedIndex === suggestions.length + products.length + index && 'bg-gray-100'
                  )}
                >
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-sm text-gray-700">{search.query}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(search.query);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </button>
              ))}
            </div>
          )}

          {!isLoading && query.length >= 2 && (
            <>
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Suggestions
                  </h3>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearch(suggestion)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md text-left',
                        selectedIndex === index && 'bg-gray-100'
                      )}
                    >
                      <TrendingUp className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <span className="flex-1 text-sm text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Products */}
              {products.length > 0 && (
                <div className="p-2">
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Products
                  </h3>
                  {products.map((product, index) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        addRecentSearch(query);
                        setIsOpen(false);
                        setQuery('');
                        onClose?.();
                      }}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md',
                        selectedIndex === suggestions.length + index && 'bg-gray-100'
                      )}
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">{product.category.name}</p>
                      </div>
                      <div className="text-sm font-semibold text-amber-600">
                        ₹{product.price.toLocaleString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {suggestions.length === 0 && products.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">
                  No results found for &quot;{query}&quot;
                </div>
              )}
            </>
          )}

          {/* View All Results */}
          {query.length >= 2 && (products.length > 0 || suggestions.length > 0) && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => handleSearch(query)}
                className="w-full px-3 py-2 text-sm text-center text-amber-600 hover:bg-amber-50 rounded-md font-medium"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
