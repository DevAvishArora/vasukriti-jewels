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
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

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
              {/* Category */}
              {product.category && typeof product.category === 'object' && product.category.name && (
                <div className="text-xs tracking-widest text-gray-500 uppercase">
                  {product.category.name}
                </div>
              )}

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

              {/* Stock Status */}
              {product.stock !== undefined && (
                <div className="text-sm">
                  {product.stock > 0 ? (
                    <span className="text-black">In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-gray-400">Out of Stock</span>
                  )}
                </div>
              )}

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
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                  className="flex-1 h-11 bg-[#7e1219] hover:bg-[#6a0f15] text-white text-sm tracking-wider transition-colors disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  ADD TO CART
                </Button>
                <button
                  onClick={handleToggleWishlist}
                  className={`w-11 h-11 flex items-center justify-center border transition-colors ${
                    isInWishlist(product._id)
                      ? 'bg-neutral-900 border-neutral-900 text-white'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </button>
              </div>

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
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center py-2.5 border-b border-gray-100"
                      >
                        <span className="w-1/3 text-xs text-gray-500 uppercase tracking-wider">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-black">{String(value)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-xs">No specifications available.</p>
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
