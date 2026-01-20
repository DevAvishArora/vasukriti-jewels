'use client';
// Customer Management Page
import { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Users, TrendingUp, UserCheck, UserX } from 'lucide-react';

interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  verifiedCustomers: number;
  newCustomersThisMonth: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');

  useEffect(() => {
    fetchStats();
    fetchCustomers();
  }, [statusFilter, verifiedFilter]);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/customers/analytics/stats');
      setStats(response.data.data.overview);
    } catch (error) {
      console.error('Error fetching customer stats:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'all') params.append('isActive', statusFilter);
      if (verifiedFilter !== 'all') params.append('isVerified', verifiedFilter);

      const response = await axiosInstance.get(`/customers?${params.toString()}`);
      setCustomers(response.data.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer base</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCustomers}</div>
              <p className="text-xs text-gray-500 mt-1">
                {((stats.activeCustomers / stats.totalCustomers) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verifiedCustomers}</div>
              <p className="text-xs text-gray-500 mt-1">
                {((stats.verifiedCustomers / stats.totalCustomers) * 100).toFixed(1)}% verified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newCustomersThisMonth}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="px-0 sm:px-6 pt-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500">No customers found</p>
            </div>
          ) : (
            <ResponsiveTable
              data={customers}
              columns={[
                {
                  key: 'customer',
                  label: 'Customer',
                  mobileLabel: 'Customer',
                  render: (customer) => (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                        {customer.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{customer.fullName}</p>
                        {customer.isVerified && (
                          <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'email',
                  label: 'Email',
                  mobileLabel: 'Email',
                  hideOnMobile: true,
                  render: (customer) => customer.email,
                },
                {
                  key: 'phone',
                  label: 'Phone',
                  mobileLabel: 'Phone',
                  hideOnMobile: true,
                  render: (customer) => customer.phone || 'N/A',
                },
                {
                  key: 'orders',
                  label: 'Orders',
                  mobileLabel: 'Orders',
                  render: (customer) => (
                    <Badge variant="secondary">{customer.orderCount}</Badge>
                  ),
                },
                {
                  key: 'totalSpent',
                  label: 'Total Spent',
                  mobileLabel: 'Spent',
                  render: (customer) => (
                    <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  mobileLabel: 'Status',
                  render: (customer) => (
                    <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  ),
                },
                {
                  key: 'joined',
                  label: 'Joined',
                  mobileLabel: 'Joined',
                  hideOnMobile: true,
                  render: (customer) => formatDate(customer.createdAt),
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  mobileLabel: 'Actions',
                  className: 'text-right',
                  render: (customer) => (
                    <Link href={`/admin/customers/${customer._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  ),
                },
              ]}
              keyExtractor={(customer) => customer._id}
              loading={loading}
              loadingMessage="Loading customers..."
              emptyMessage="No customers found"
              mobileCardView={true}
              onRowClick={(customer) => {
                globalThis.location.href = `/admin/customers/${customer._id}`;
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
