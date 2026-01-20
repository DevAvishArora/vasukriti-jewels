'use client';
// Orders Management Page
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios-instance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { ResponsiveTable, type Column } from '@/components/ui/responsive-table';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    fullName: string;
    email: string;
  };
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (paymentFilter !== 'all') params.append('paymentStatus', paymentFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await axiosInstance.get(`/orders?${params.toString()}`);
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearch = () => {
    fetchOrders();
  };

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      label: 'Order #',
      mobileLabel: 'Order',
      render: (order) => (
        <span className="font-medium">{order.orderNumber}</span>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      mobileLabel: 'Customer',
      render: (order) => (
        <div>
          <p className="font-medium truncate">{order.user?.fullName}</p>
          <p className="text-sm text-gray-500 truncate">{order.user?.email}</p>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      mobileLabel: 'Items',
      hideOnMobile: true,
      render: (order) => (
        <span className="text-sm text-gray-600">
          {order.items?.length} item(s)
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      mobileLabel: 'Total',
      render: (order) => (
        <span className="font-semibold">₹{order.totalAmount?.toLocaleString()}</span>
      ),
    },
    {
      key: 'orderStatus',
      label: 'Order Status',
      mobileLabel: 'Status',
      render: (order) => (
        <Badge className={getStatusColor(order.orderStatus)}>
          <span className="flex items-center gap-1">
            {getStatusIcon(order.orderStatus)}
            {order.orderStatus}
          </span>
        </Badge>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      mobileLabel: 'Payment',
      hideOnMobile: true,
      render: (order) => (
        <Badge className={getPaymentColor(order.paymentStatus)}>
          {order.paymentStatus}
        </Badge>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      mobileLabel: 'Date',
      hideOnMobile: true,
      render: (order) => (
        new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      mobileLabel: 'Actions',
      className: 'text-right',
      render: (order) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/orders/${order._id}`);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Filter Orders</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order # or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>

            {/* Order Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Payment Status Filter */}
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <ResponsiveTable
            data={orders}
            columns={columns}
            keyExtractor={(order) => order._id}
            loading={loading}
            loadingMessage="Loading orders..."
            emptyMessage="No orders found"
            mobileCardView={true}
            onRowClick={(order) => router.push(`/admin/orders/${order._id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
