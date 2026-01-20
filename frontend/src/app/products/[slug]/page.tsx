'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ClientLayout } from '@/components/client/client-layout';
import { ProductImageGallery } from '@/components/client/product/product-image-gallery';
import { ProductCard } from '@/components/client/product/product-card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  RefreshCw,
  Award,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { ProductReviews } from '@/components/product/product-reviews';
import axiosInstance from '@/lib/axios-instance';
import type { Product } from '@/types';
import { toast } from 'sonner';

// Lazy load 3D viewer for better performance
const Product3DViewer = lazy(() => import('@/components/product/Product3DViewer'));

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<'images' | '3d'>('images');
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'care' | 'reviews'>('description');
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async (slug: string) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/products/${slug}`);
        const productData = response.data.data?.product || response.data.data;
        setProduct(productData);

        // Fetch related products
        if (productData.category) {
          const relatedResponse = await axiosInstance.get(
            `/products?category=${productData.category._id || productData.category}&limit=4`
          );
          const data = relatedResponse.data.data;
          const productList = Array.isArray(data) ? data : (data?.products || []);
          const filtered = productList.filter((p: Product) => p._id !== productData._id);
          setRelatedProducts(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        router.push('/shop');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      loadProduct(params.slug as string);
    }
  }, [params.slug, router]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success('Added to cart', {
      description: `${quantity} x ${product.name}`,
    });
    setQuantity(1);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist', {
        description: product.name,
      });
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist', {
        description: product.name,
      });
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 aspect-[4/5] animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 bg-gray-50 animate-pulse w-3/4" />
              <div className="h-6 bg-gray-50 animate-pulse w-1/2" />
              <div className="h-24 bg-gray-50 animate-pulse" />
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!product) {
    return null;
  }

  // Extract image URLs
  const imageUrls = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images.map((img: any) => typeof img === 'string' ? img : img.url)
    : ['/placeholder-product.jpg'];

  // Calculate prices
  const finalPrice = product.finalPrice || product.price || 0;
  const comparePrice = product.comparePrice || 0;
  const discountPercentage = product.discount || 0;

  return (
    <ClientLayout>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <button onClick={() => router.push('/')} className="hover:text-black transition-colors">
                Home
              </button>
              <ChevronRight className="w-3 h-3" />
              <button onClick={() => router.push('/shop')} className="hover:text-black transition-colors">
                Shop
              </button>
              {product.category && typeof product.category === 'object' && product.category.name && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">{product.category.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Gallery */}
            <div className="space-y-3">
              {viewMode === 'images' ? (
                <ProductImageGallery images={imageUrls} productName={product.name} />
              ) : (
                <Suspense fallback={<div className="aspect-[4/5] bg-gray-50 animate-pulse" />}>
                  {product.model3D?.url && (
                    <Product3DViewer modelUrl={product.model3D.url} />
                  )}
                </Suspense>
              )}

              {/* View toggle */}
              {product.model3D?.url && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('images')}
                    className={`px-5 py-2 text-xs tracking-wider transition-colors ${
                      viewMode === 'images'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    IMAGES
                  </button>
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`px-5 py-2 text-xs tracking-wider transition-colors ${
                      viewMode === '3d'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    3D VIEW
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              {/* Category & Actions Bar */}
              <div className="flex items-center justify-between">
                {/* Category */}
                {product.category && typeof product.category === 'object' && product.category.name && (
                  <div className="text-xs tracking-widest text-gray-500 uppercase">
                    {product.category.name}
                  </div>
                )}
                
                {/* Wishlist & Share Buttons */}
                <div className="flex items-center gap-2">
                  {/* Wishlist Button */}
                  <button
                    onClick={handleToggleWishlist}
                    className={`w-9 h-9 flex items-center justify-center border rounded transition-colors ${
                      isInWishlist(product._id)
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    title={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                      className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:bg-gray-50 rounded transition-colors"
                      title="Share Product"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Share Dropdown Menu */}
                    {isShareMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsShareMenuOpen(false)}
                        />
                        
                        {/* Menu */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-0 z-20 w-64 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                        >
                          {/* WhatsApp */}
                          <button
                            onClick={() => {
                              const url = encodeURIComponent(window.location.href);
                              const text = encodeURIComponent(`Check out ${product.name} - ₹${finalPrice.toLocaleString('en-IN')}`);
                              window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
                              setIsShareMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-green-50 transition-colors text-left"
                          >
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">WhatsApp</div>
                              <div className="text-xs text-gray-500">Share via WhatsApp</div>
                            </div>
                          </button>

                          {/* Facebook */}
                          <button
                            onClick={() => {
                              const url = encodeURIComponent(window.location.href);
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                              setIsShareMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left border-t border-gray-100"
                          >
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Facebook</div>
                              <div className="text-xs text-gray-500">Share on Facebook</div>
                            </div>
                          </button>

                          {/* Twitter/X */}
                          <button
                            onClick={() => {
                              const url = encodeURIComponent(window.location.href);
                              const text = encodeURIComponent(`Check out ${product.name}`);
                              window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                              setIsShareMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
                          >
                            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Twitter</div>
                              <div className="text-xs text-gray-500">Share on Twitter</div>
                            </div>
                          </button>

                          {/* Copy Link */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              toast.success('Link copied to clipboard!');
                              setIsShareMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Copy Link</div>
                              <div className="text-xs text-gray-500">Copy link to clipboard</div>
                            </div>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-light text-black leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-light text-black">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                {comparePrice > finalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{comparePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="px-2 py-1 text-xs bg-neutral-900 text-white">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description.length > 200
                    ? `${product.description.substring(0, 200)}...`
                    : product.description}
                </p>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock || 99)}
                    className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <Button
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock === 0}
                className="w-full h-11 bg-[#7e1219] hover:bg-[#6a0f15] text-white text-sm tracking-wider transition-colors disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                ADD TO CART
              </Button>

              {/* Trust Badges */}
              <div className="pt-5 border-t border-gray-100 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <Truck className="w-4 h-4 text-black" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <Award className="w-4 h-4 text-black" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <RefreshCw className="w-4 h-4 text-black" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-16 max-w-5xl">
            {/* Tab Headers */}
            <div className="flex gap-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 text-xs tracking-wider transition-colors ${
                  activeTab === 'description'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                DESCRIPTION
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`pb-3 text-xs tracking-wider transition-colors ${
                  activeTab === 'specifications'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                SPECIFICATIONS
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-3 text-xs tracking-wider transition-colors ${
                  activeTab === 'care'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                CARE & PRECAUTIONS
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-xs tracking-wider transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                REVIEWS
              </button>
            </div>

            {/* Tab Content */}
            <div className="py-6">
              {activeTab === 'description' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-gray max-w-none"
                >
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description || 'No description available.'}
                  </p>
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                    product.specifications.map((spec) => (
                      <div
                        key={`${spec.label}-${spec.value}`}
                        className="flex items-center py-2.5 border-b border-gray-100"
                      >
                        <span className="w-1/3 text-xs text-gray-500 uppercase tracking-wider">
                          {spec.label}
                        </span>
                        <span className="text-sm text-black">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-xs">No specifications available.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'care' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {product.precautions ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {product.precautions}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs">No care instructions available.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ProductReviews productId={product._id} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-xl font-light text-black mb-6 tracking-wider">YOU MAY ALSO LIKE</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
