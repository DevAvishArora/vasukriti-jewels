'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Heart } from 'lucide-react';
import { ClientLayout } from '@/components/client/client-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Calculate totals
  const subtotal = useMemo(() => getSubtotal(), [getSubtotal]);
  
  const getShipping = (amount: number) => {
    if (amount === 0) return 0;
    return amount >= 3500 ? 0 : 200;
  };
  
  const shipping = getShipping(subtotal);
  const total = subtotal - discount + shipping;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success('Removed from cart', {
      description: productName,
    });
  };

  const handleMoveToWishlist = (item: typeof items[0]) => {
    if (isInWishlist(item.product._id)) {
      toast.info('Already in wishlist');
      return;
    }
    
    addToWishlist(item.product);
    removeItem(item.product._id);
    toast.success('Moved to wishlist', {
      description: item.product.name,
      action: {
        label: 'View',
        onClick: () => router.push('/account/wishlist'),
      },
    });
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    // Mock coupon validation - multiple coupons
    const code = couponCode.toUpperCase();
    const coupons: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
      'SAVE10': { discount: 0.1, type: 'percentage' },
      'SAVE15': { discount: 0.15, type: 'percentage' },
      'SAVE20': { discount: 0.2, type: 'percentage' },
      'FLAT500': { discount: 500, type: 'fixed' },
      'FLAT1000': { discount: 1000, type: 'fixed' },
      'WELCOME': { discount: 0.05, type: 'percentage' },
      'FIRSTORDER': { discount: 0.12, type: 'percentage' },
      'JEWELRY25': { discount: 0.25, type: 'percentage' },
    };

    const validCoupon = coupons[code];
    
    if (validCoupon) {
      let discountAmount: number;
      
      if (validCoupon.type === 'percentage') {
        discountAmount = subtotal * validCoupon.discount;
      } else {
        discountAmount = Math.min(validCoupon.discount, subtotal); // Don't exceed subtotal
      }
      
      setDiscount(discountAmount);
      setAppliedCoupon(code);
      toast.success('Coupon applied!', {
        description: `You saved ₹${discountAmount.toLocaleString('en-IN')}`,
      });
      setCouponCode('');
    } else {
      toast.error('Invalid coupon code', {
        description: 'Please check the code and try again',
      });
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  if (items.length === 0) {
    return (
      <ClientLayout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <ShoppingBag className="h-20 w-20 text-gray-200 mx-auto mb-8" />
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">
              Your cart is empty
            </h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto font-light">
              Discover our curated collection of luxury jewelry
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-white text-xs tracking-wider uppercase font-light"
                style={{ backgroundColor: '#7e1219' }}
              >
                <Link href="/shop">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 text-xs tracking-wider uppercase font-light"
              >
                <Link href="/account/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  View Wishlist
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2 tracking-wide">
            Shopping Cart
          </h1>
          <p className="text-gray-500 font-light">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white border border-gray-100 p-6 md:p-8 hover:border-gray-200 transition-colors"
                >
                  <div className="flex gap-4 md:gap-6">
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 overflow-hidden bg-gray-50"
                    >
                      <Image
                        src={
                          item.product.images?.[0]?.url ||
                          '/placeholder-product.jpg'
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-base font-light text-gray-900 hover:text-gray-600 line-clamp-2 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider font-light">
                            SKU: {item.product.sku}
                          </p>
                        </div>

                        {/* Remove Button - Desktop */}
                        <button
                          onClick={() =>
                            handleRemoveItem(item.product._id, item.product.name)
                          }
                          className="hidden md:flex ml-4 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-light text-gray-500 uppercase tracking-wider">
                            Qty:
                          </span>
                          <div className="flex items-center border border-gray-200">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 font-light min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={item.quantity >= (item.product.stock || 0)}
                              className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between md:justify-end gap-4">
                          <div className="text-right">
                            <p className="text-lg font-light text-gray-900">
                              ₹
                              {(item.price * item.quantity).toLocaleString(
                                'en-IN'
                              )}
                            </p>
                            {item.product.discount > 0 && (
                              <p className="text-sm text-gray-400 line-through font-light">
                                ₹
                                {(
                                  item.product.price * item.quantity
                                ).toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>

                          {/* Remove Button - Mobile */}
                          <button
                            onClick={() =>
                              handleRemoveItem(
                                item.product._id,
                                item.product.name
                              )
                            }
                            className="md:hidden text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {/* {item.quantity >= item.product.stock && (
                        <p className="text-sm text-orange-600 mt-2">
                          Maximum available quantity
                        </p>
                      )} */}

                      {/* Move to Wishlist Button */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          <span>Move to Wishlist</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping Button - Mobile */}
            <Button
              asChild
              variant="outline"
              className="w-full md:hidden mt-4"
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-50 border border-gray-100 p-8 sticky top-24 space-y-8">
              <h2 className="text-xl font-light text-gray-900 tracking-wide">Order Summary</h2>

              {/* Coupon Code */}
              <div className="space-y-3">
                <p className="text-xs font-light text-gray-600 uppercase tracking-wider">
                  Coupon Code
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={!!appliedCoupon}
                    variant="outline"
                  >
                    Apply
                  </Button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs bg-gray-100 border border-gray-200 p-3">
                    <span className="text-gray-700 font-light flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      {appliedCoupon}
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-gray-500 hover:text-gray-700 font-light"
                    >
                      Remove
                    </button>
                  </div>
                )}
                
            
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-gray-600 font-light">
                  <span className="text-xs uppercase tracking-wider">Subtotal</span>
                  <span className="text-sm">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-gray-600 font-light">
                    <span className="text-xs uppercase tracking-wider">Discount</span>
                    <span className="text-sm">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 font-light">
                  <span className="text-xs uppercase tracking-wider">Shipping</span>
                  <span className="text-sm">
                    {shipping === 0 ? (
                      <span className="text-gray-600 font-light">Free</span>
                    ) : (
                      `₹${shipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                {/* {subtotal > 0 && subtotal < 3500 && (
                  <p className="text-xs text-gray-500">
                    Add ₹{(3500 - subtotal).toLocaleString('en-IN')} more for
                    free shipping
                  </p>
                )} */}

                <div className="flex justify-between text-base font-light text-gray-900 border-t border-gray-200 pt-4">
                  <span className="uppercase tracking-wider">Total</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/checkout')}
                  size="lg"
                  className="w-full h-12 text-white text-xs tracking-wider uppercase font-light"
                  style={{ backgroundColor: '#7e1219' }}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full h-12 hidden md:flex border-gray-200 text-xs tracking-wider uppercase font-light"
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-gray-200 pt-6 space-y-3 text-xs text-gray-500 font-light">
                <p className="flex items-center gap-2">
                  <span className="text-gray-400">✓</span>
                  Secure checkout
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gray-400">✓</span>
                  Free shipping on orders over ₹3,500
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gray-400">✓</span>
                  Easy returns within 30 days
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  );
}
