'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  FileText,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Clock,
  Truck,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ClientLayout } from '@/components/client/client-layout';
import axiosInstance from '@/lib/axios-instance';
import type { Order } from '@/types';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/orders/${params.id}`);
        const orderData = response.data.data?.order || response.data.data;
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadOrder();
    }
  }, [params.id, router]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      confirmed: 'text-blue-700 bg-blue-50 border-blue-200',
      processing: 'text-purple-700 bg-purple-50 border-purple-200',
      shipped: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      delivered: 'text-green-700 bg-green-50 border-green-200',
      cancelled: 'text-red-700 bg-red-50 border-red-200',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return <Icon className="h-5 w-5" strokeWidth={1.5} />;
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 text-[#7e1219] animate-spin mb-4" strokeWidth={1.5} />
            <p className="text-gray-600 font-light">Loading order details...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!order) {
    return null;
  }

  const estimatedDays = 5;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/account/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-light transition-colors"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to Orders
        </button>

        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-2 border-green-600 p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <CheckCircle className="h-12 w-12 text-green-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-light tracking-wide text-gray-900 mb-1">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-600 font-light">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border-2 border-gray-900 p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xs font-light uppercase tracking-wider text-gray-600 mb-2">
                    Order Number
                  </h2>
                  <p className="text-xl font-light text-gray-900">
                    #{order.orderNumber}
                  </p>
                </div>

                <div>
                  <h2 className="text-xs font-light uppercase tracking-wider text-gray-600 mb-2">
                    Order Date
                  </h2>
                  <p className="text-lg font-light text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <h2 className="text-xs font-light uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1">
                    <Calendar className="h-4 w-4" strokeWidth={1.5} />
                    Estimated Delivery
                  </h2>
                  <p className="text-lg font-light text-[#7e1219]">
                    {order.estimatedDelivery
                      ? new Date(order.estimatedDelivery).toLocaleDateString(
                          'en-IN',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )
                      : estimatedDate.toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                  </p>
                </div>

                <div>
                  <h2 className="text-xs font-light uppercase tracking-wider text-gray-600 mb-2">
                    Total Amount
                  </h2>
                  <p className="text-2xl font-light text-gray-900">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Order Status */}
              <div className="mt-6">
                <h2 className="text-xs font-light uppercase tracking-wider text-gray-600 mb-3">
                  Order Status
                </h2>
                <div className={`flex items-center gap-3 p-4 border ${getStatusColor(order.orderStatus)}`}>
                  {getStatusIcon(order.orderStatus)}
                  <div>
                    <p className="font-light text-gray-900 capitalize uppercase tracking-wider text-sm">
                      {order.orderStatus.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-gray-600 font-light">
                      Your order is being processed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 p-6"
            >
              <h2 className="text-lg font-light uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-[#7e1219]" strokeWidth={1.5} />
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={typeof item.product === 'string' ? item.product : item.product._id}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50">
                      <Image
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-light text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 font-light">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-light text-gray-900">
                        ₹{item.subtotal.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-600 font-light">
                        ₹{item.price.toLocaleString('en-IN')} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-gray-200 p-6"
            >
              <h2 className="text-lg font-light uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#7e1219]" strokeWidth={1.5} />
                Delivery Address
              </h2>
              <div className="text-gray-700 space-y-1 font-light">
                <p className="font-normal text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-gray-200 p-6"
            >
              <h2 className="text-lg font-light uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#7e1219]" strokeWidth={1.5} />
                Payment Method
              </h2>
              <div className="flex items-center justify-between">
                <div className="font-light">
                  <p className="text-gray-900">
                    {order.paymentMethod === 'cod'
                      ? 'Cash on Delivery'
                      : 'Online Payment'}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    Status: {order.paymentStatus}
                  </p>
                </div>
                {order.paymentMethod === 'cod' && (
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-light border border-blue-200 uppercase tracking-wider">
                    Pay on delivery
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white border-2 border-gray-900 p-6 sticky top-24"
            >
              <h2 className="text-lg font-light uppercase tracking-wider text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Price Summary */}
              <div className="space-y-3 mb-6 font-light">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>
                    {order.shippingCharge === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${order.shippingCharge.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Tax (GST)</span>
                  <span>₹{order.tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-gray-900 border-t border-gray-200 pt-3">
                  <span className="font-normal">Total</span>
                  <span className="font-normal text-lg">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => router.push(`/account/orders`)}
                  className="w-full border border-gray-900 text-gray-900 py-2.5 font-light uppercase tracking-wider text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" strokeWidth={1.5} />
                  View All Orders
                </button>

                <Link
                  href="/shop"
                  className="w-full bg-[#7e1219] text-white py-2.5 font-light uppercase tracking-wider text-sm hover:bg-[#6a0f15] transition-colors flex items-center justify-center gap-2"
                >
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-sm text-gray-600 font-light"
        >
          <p>
            Need help with your order?{' '}
            <Link
              href="/contact"
              className="text-[#7e1219] hover:text-[#6a0f15] font-normal"
            >
              Contact Support
            </Link>
          </p>
        </motion.div>
      </div>
    </ClientLayout>
  );
}
