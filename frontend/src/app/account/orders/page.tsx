'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Package,
  Search,
  ChevronRight,
  Calendar,
  MapPin,
  CreditCard,
  Eye,
  Loader2,
  Filter,
} from 'lucide-react';
import Image from 'next/image';
import { AccountLayout } from '@/components/client/account/account-layout';
import axiosInstance from '@/lib/axios-instance';
import type { Order } from '@/types';

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
  processing: 'bg-purple-50 text-purple-800 border-purple-200',
  shipped: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-50 text-green-800 border-green-200',
  cancelled: 'bg-red-50 text-red-800 border-red-200',
};

const statusFilters = [
  { label: 'All Orders', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/orders/my-orders');
        const orderData = response.data.data?.orders || response.data.data || [];
        setOrders(orderData);
        setFilteredOrders(orderData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  const getStatusBadgeClass = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-50 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#7e1219' }} />
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border-2 border-gray-900 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light tracking-wide text-gray-900">My Orders</h2>
              <p className="text-xs font-light uppercase tracking-wider text-gray-400 mt-1">
                Track and manage your orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6" strokeWidth={1} style={{ color: '#7e1219' }} />
              <span className="text-3xl font-light text-gray-900">
                {orders.length}
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1} />
              <input
                type="search"
                placeholder="Search by order number or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 text-sm font-light text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" strokeWidth={1} />
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-2 text-xs font-light uppercase tracking-wider whitespace-nowrap transition-colors ${
                    statusFilter === filter.value
                      ? 'border-2 border-gray-900 text-gray-900'
                      : 'border border-gray-200 text-gray-600 hover:border-gray-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-900 p-12 text-center"
          >
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-xl font-light tracking-wide text-gray-900 mb-2">
              {searchQuery || statusFilter ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-sm font-light text-gray-600 mb-6">
              {searchQuery || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Start shopping to see your orders here'}
            </p>
            {!searchQuery && !statusFilter && (
              <button
                onClick={() => router.push('/shop')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-light uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#7e1219' }}
              >
                Start Shopping
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-100 hover:border-gray-900 transition-colors"
              >
                {/* Order Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs font-light uppercase tracking-wider text-gray-400">Order Number</p>
                        <p className="font-light text-gray-900 tracking-wide">
                          {order.orderNumber}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-gray-300" />
                      <div>
                        <p className="text-xs font-light uppercase tracking-wider text-gray-400">Order Date</p>
                        <p className="font-light text-gray-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" strokeWidth={1} />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`${getStatusBadgeClass(
                        order.orderStatus
                      )} border px-3 py-1 text-xs font-light uppercase tracking-wider`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.slice(0, 2).map((item) => (
                      <div
                        key={typeof item.product === 'string' ? item.product : item.product._id}
                        className="flex gap-4"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 border border-gray-100">
                          <Image
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-light text-gray-900 truncate tracking-wide">
                            {item.name}
                          </h4>
                          <p className="text-xs font-light text-gray-600 uppercase tracking-wider">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-light text-gray-900">
                            ₹{item.subtotal.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 2 && (
                      <p className="text-xs font-light uppercase tracking-wider text-gray-400 pl-20">
                        + {order.items.length - 2} more item
                        {order.items.length - 2 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Total Amount */}
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 border border-gray-200 flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-gray-900" strokeWidth={1} />
                        </div>
                        <div>
                          <p className="text-xs font-light uppercase tracking-wider text-gray-400">Total Amount</p>
                          <p className="font-light text-gray-900">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 border border-gray-200 flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-gray-900" strokeWidth={1} />
                        </div>
                        <div>
                          <p className="text-xs font-light uppercase tracking-wider text-gray-400">Payment</p>
                          <p className="font-light text-gray-900">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                          </p>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 border border-gray-200 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-gray-900" strokeWidth={1} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-light uppercase tracking-wider text-gray-400">Delivery to</p>
                          <p className="font-light text-gray-900 truncate">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => router.push(`/orders/${order._id}`)}
                      className="w-full sm:w-auto px-6 py-3 border border-gray-200 hover:border-gray-900 text-sm font-light uppercase tracking-wider text-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" strokeWidth={1} />
                      View Order Details
                      <ChevronRight className="h-4 w-4" strokeWidth={1} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
