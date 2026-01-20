'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface ProductCardProps {
  readonly product: Product;
  readonly index?: number;
  readonly showNewBadge?: boolean;
}

export function ProductCard({ product, index = 0, showNewBadge = false }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success('Added to cart!', {
      description: product.name,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist', {
        description: product.name,
      });
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!', {
        description: product.name,
      });
    }
  };

  const discount = product.discount || 0;
  const finalPrice = product.finalPrice || product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-3">
          {product.images?.[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-neutral-900 text-white px-2 py-1 text-xs uppercase tracking-wider">
              {discount}% OFF
            </div>
          )}

          {/* NEW Badge */}
          {showNewBadge && discount === 0 && (
            <div className="absolute top-3 left-3 bg-neutral-900 text-white px-2 py-1 text-xs uppercase tracking-wider">
              NEW
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'fill-black text-black' : 'text-gray-700'
              }`}
            />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 py-2.5 text-white text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
            style={{ backgroundColor: '#7e1219' }}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {typeof product.category === 'object' ? product.category?.name : 'Jewelry'}
          </p>

          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-base font-medium text-gray-900">
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Stock Warning
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-gray-500 pt-1">
              Only {product.stock} left
            </p>
          )} */}
        </div>
      </Link>
    </motion.div>
  );
}
