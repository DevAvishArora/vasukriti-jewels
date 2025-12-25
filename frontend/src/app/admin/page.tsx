'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios-instance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';

interface DashboardStats {
  revenue: {
    total: number;
    growth: number;
    orders: number;
    avgOrderValue: number;
  };
  orders: {
    total: number;
    growth: number;
    byStatus: Array<{ _id: string; count: number }>;
  };
  customers: {
    total: number;
    new: number;
  };
  topProducts: Array<{
    productId: string;
    name: string;
    image?: { url: string; alt: string };
    totalQuantity: number;
    totalRevenue: number;
  }>;
  lowStockProducts: Array<{
    _id: string;
    name: string;
    stockQuantity: number;
    images: Array<{ url: string; alt: string }>;
  }>;
}

interface RevenueDataPoint {
  _id: {
    day?: number;
    month: number;
    year: number;
  };
  revenue: number;
  orders: number;
}

interface CategorySales {
  _id: string;
  name: string;
  totalRevenue: number;
  totalQuantity: number;
  orderCount: number;
  [key: string]: string | number;
}

const COLORS = ['#991b1b', '#be123c', '#9f1239', '#881337', '#7f1d1d', '#b91c1c'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<CategorySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [period, setPeriod] = useState('30');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch sequentially with small delays to avoid rate limits
      const dashboardRes = await axiosInstance.get(`/analytics/dashboard?period=${period}`);
      setStats(dashboardRes.data.data);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const revenueRes = await axiosInstance.get(`/analytics/revenue?period=${period}&groupBy=day`);
      setRevenueData(revenueRes.data.data.revenueData);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const categoryRes = await axiosInstance.get(`/analytics/sales-by-category?period=${period}`);
      setSalesByCategory(categoryRes.data.data.salesByCategory);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError('Failed to load analytics data. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce API calls
    const timer = setTimeout(() => {
      fetchAnalytics();
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRevenueData = (data: RevenueDataPoint[]) => {
    return data.map((item) => ({
      date: `${item._id.day || ''}/${item._id.month}`,
      revenue: item.revenue,
      orders: item.orders,
    }));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-red-700" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-red-600 text-lg">{error}</div>
          <button 
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Track your business performance</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue.total)}</div>
            <div className="flex items-center text-xs mt-1">
              {stats.revenue.growth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={stats.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(stats.revenue.growth).toFixed(1)}%
              </span>
              <span className="text-gray-500 ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.total}</div>
            <div className="flex items-center text-xs mt-1">
              {stats.orders.growth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={stats.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(stats.orders.growth).toFixed(1)}%
              </span>
              <span className="text-gray-500 ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue.avgOrderValue)}</div>
            <p className="text-xs text-gray-500 mt-1">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers.new}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.customers.total} total customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatRevenueData(revenueData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#991b1b"
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalRevenue"
                >
                  {salesByCategory.map((entry) => (
                    <Cell key={entry._id} fill={COLORS[salesByCategory.indexOf(entry) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Order Status & Category Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.orders.byStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#991b1b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Category Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesByCategory.slice(0, 5).map((category, index) => (
                <div key={category._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(category.totalRevenue)}</div>
                    <div className="text-xs text-gray-500">{category.totalQuantity} units</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.slice(0, 5).map((product) => (
                <div key={product.productId} className="flex items-center gap-3 pb-3 border-b last:border-0">
                  {product.image && (
                    <Image
                      src={product.image.url}
                      alt={product.image.alt || product.name}
                      width={48}
                      height={48}
                      className="rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.totalQuantity} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(product.totalRevenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-3 pb-3 border-b last:border-0">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        width={48}
                        height={48}
                        className="rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-red-600">
                        Only {product.stockQuantity} left in stock
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>All products have adequate stock</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
