'use client';

import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AccountLayout } from '@/components/client/account/account-layout';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';

export default function WishlistPage() {
  const router = useRouter();
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success('Removed from wishlist', {
      description: productName,
    });
  };

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product, 1);
    removeItem(product._id);
    toast.success('Added to cart!', {
      description: `${product.name} moved from wishlist to cart`,
    });
  };

  const handleMoveAllToCart = () => {
    for (const product of items) {
      addToCart(product, 1);
    }
    for (const product of items) {
      removeItem(product._id);
    }
    toast.success('All items added to cart!', {
      description: `${items.length} items moved from wishlist`,
    });
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border-2 border-gray-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 flex items-center gap-3">
                <Heart className="h-6 w-6" strokeWidth={1} style={{ color: '#7e1219' }} />
                My Wishlist
              </h2>
              <p className="text-xs font-light uppercase tracking-wider text-gray-400 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2 px-6 py-3 text-sm font-light uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#7e1219' }}
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={1} />
                Add All to Cart
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-900 p-12 text-center"
          >
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-xl font-light tracking-wide text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-sm font-light text-gray-600 mb-6">
              Save your favorite items to buy them later!
            </p>
            <button
              onClick={() => router.push('/shop')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-light uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#7e1219' }}
            >
              Explore Products
              <ArrowRight className="h-4 w-4" strokeWidth={1} />
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-100 hover:border-gray-900 transition-colors group"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50">
                  <Link href={`/products/${product.slug}`}>
                    <Image
                      src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id, product.name)}
                    className="absolute top-3 right-3 h-10 w-10 bg-white border border-gray-200 hover:border-red-600 flex items-center justify-center transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" strokeWidth={1} />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.discount > 0 && (
                      <span className="px-2 py-1 text-xs font-light uppercase tracking-wider text-white bg-red-600">
                        {product.discount}% OFF
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="px-2 py-1 text-xs font-light uppercase tracking-wider text-white bg-neutral-900">
                        Featured
                      </span>
                    )}
                    {product.stock <= 0 && (
                      <span className="px-2 py-1 text-xs font-light uppercase tracking-wider text-gray-700 bg-gray-200">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/products/${product.slug}`} className="block mb-2">
                    <h3 className="font-light tracking-wide text-gray-900 line-clamp-2 hover:opacity-60 transition-opacity">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Category */}
                  <p className="text-xs font-light uppercase tracking-wider text-gray-400 mb-3">
                    {typeof product.category === 'string'
                      ? product.category
                      : product.category?.name || 'Jewelry'}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-light text-gray-900">
                      ₹{(product.finalPrice || product.price).toLocaleString('en-IN')}
                    </span>
                    {product.comparePrice && product.comparePrice > (product.finalPrice || product.price) && (
                      <span className="text-sm font-light text-gray-400 line-through">
                        ₹{product.comparePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {product.stock > 0 && product.stock <= 10 && (
                    <p className="text-xs font-light uppercase tracking-wider text-orange-600 mb-3">
                      Only {product.stock} left in stock!
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="flex-1 px-4 py-2 text-xs font-light uppercase tracking-wider text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#7e1219' }}
                    >
                      <ShoppingCart className="h-3 w-3" strokeWidth={1} />
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="px-4 py-2 border border-gray-200 hover:border-gray-900 text-xs font-light uppercase tracking-wider text-gray-900 transition-colors flex items-center justify-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recommendations Section */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 border border-gray-200 p-6 text-center"
          >
            <h3 className="text-lg font-light tracking-wide text-gray-900 mb-2">
              Looking for more?
            </h3>
            <p className="text-sm font-light text-gray-600 mb-4">
              Discover our latest collection and trending designs
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-900 text-sm font-light uppercase tracking-wider text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
            >
              Browse All Products
              <ArrowRight className="h-4 w-4" strokeWidth={1} />
            </Link>
          </motion.div>
        )}
      </div>
    </AccountLayout>
  );
}
