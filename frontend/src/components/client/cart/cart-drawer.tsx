'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';

interface CartDrawerProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();

  // Calculate subtotal using useMemo
  const subtotal = useMemo(() => getSubtotal(), [getSubtotal]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-white">
        <SheetHeader className="border-b border-gray-100 pb-6">
          <SheetTitle className="text-xl font-light tracking-wider uppercase">
            Cart
            <span className="text-sm font-light text-gray-500 ml-2">
              ({items.length})
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-6" />
              <h3 className="text-base font-light text-gray-900 mb-2 tracking-wide">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500 mb-6 font-light">
                Add items to get started
              </p>
              <Button 
                asChild 
                onClick={() => onOpenChange(false)}
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs tracking-wider uppercase"
              >
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-4 p-4 border-b border-gray-100 last:border-b-0 bg-white transition-colors hover:bg-gray-50"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-gray-50"
                      onClick={() => onOpenChange(false)}
                    >
                      <Image
                        src={
                          item.product.images?.[0]?.url ||
                          '/placeholder-product.jpg'
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-sm font-light text-gray-900 hover:text-gray-600 line-clamp-2 transition-colors"
                            onClick={() => onOpenChange(false)}
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 text-xs text-gray-400 font-light uppercase tracking-wider">
                            {typeof item.product.category === 'string' 
                              ? item.product.category 
                              : item.product.category?.name || 'Jewelry'}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="h-6 w-6 border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span className="text-sm font-light min-w-[2rem] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              item.quantity >= (item.product.stock || 0)
                            }
                            className="h-6 w-6 border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-light text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                          {item.product.discount > 0 && (
                            <p className="text-xs text-gray-400 line-through font-light">
                              ₹
                              {(
                                item.product.price * item.quantity
                              ).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer with Subtotal and Actions */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-gray-100 pt-6">
            <div className="w-full space-y-6">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-light text-gray-600 uppercase tracking-wider">Subtotal</span>
                <span className="text-xl font-light text-gray-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-xs text-gray-400 text-center font-light">
                Shipping and taxes calculated at checkout
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full h-12 text-white text-xs tracking-wider uppercase font-light"
                  style={{ backgroundColor: '#7e1219' }}
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/cart">View Cart</Link>
                </Button>

                <Button
                  asChild
                  className="w-full h-12 border-gray-200 text-xs tracking-wider uppercase font-light"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
