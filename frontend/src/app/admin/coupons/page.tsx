'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  expired: number;
  totalUsage: number;
}

export default function CouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [searchQuery, statusFilter, typeFilter, currentPage]);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/coupons/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching coupon stats:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: 20,
      };

      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;

      const response = await axiosInstance.get('/coupons', { params });
      setCoupons(response.data.data.coupons);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCouponStatus = async (couponId: string) => {
    try {
      await axiosInstance.patch(`/coupons/${couponId}/toggle`);
      fetchCoupons();
      fetchStats();
    } catch (error) {
      console.error('Error toggling coupon status:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCoupon) return;

    try {
      await axiosInstance.delete(`/coupons/${selectedCoupon._id}`);
      setDeleteDialogOpen(false);
      setSelectedCoupon(null);
      fetchCoupons();
      fetchStats();
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const openDeleteDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const getCouponStatus = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) return 'inactive';
    if (validFrom > now) return 'upcoming';
    if (validUntil < now) return 'expired';
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return 'exhausted';
    return 'active';
  };

  const getStatusBadge = (coupon: Coupon) => {
    const status = getCouponStatus(coupon);
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      upcoming: 'secondary',
      expired: 'destructive',
      exhausted: 'destructive',
      inactive: 'secondary',
    };

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">Coupons & Discounts</h1>
            <p className="text-muted-foreground mt-1">
              Manage promotional codes and discounts
            </p>
          </div>
          <Button onClick={() => router.push('/admin/coupons/create')} className="flex-shrink-0 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Coupons
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Coupons
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expired</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.expired}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Usage
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsage}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader className="px-4 sm:px-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by code or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No coupons found
              </div>
            ) : (
              <>
                <ResponsiveTable
                  data={coupons}
                  columns={[
                    {
                      key: 'code',
                      label: 'Code',
                      mobileLabel: 'Coupon',
                      render: (coupon) => (
                        <div>
                          <p className="font-mono font-semibold">{coupon.code}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">{coupon.description}</p>
                        </div>
                      ),
                    },
                    {
                      key: 'description',
                      label: 'Description',
                      mobileLabel: 'Description',
                      hideOnMobile: true,
                      render: (coupon) => (
                        <span className="truncate max-w-[200px] block">{coupon.description}</span>
                      ),
                    },
                    {
                      key: 'discount',
                      label: 'Discount',
                      mobileLabel: 'Discount',
                      render: (coupon) => (
                        <div>
                          <div>
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountValue}%`
                              : `₹${coupon.discountValue}`}
                          </div>
                          {coupon.maximumDiscount && (
                            <span className="text-xs text-muted-foreground">
                              (max ₹{coupon.maximumDiscount})
                            </span>
                          )}
                        </div>
                      ),
                    },
                    {
                      key: 'validPeriod',
                      label: 'Valid Period',
                      mobileLabel: 'Valid Period',
                      hideOnMobile: true,
                      render: (coupon) => (
                        <div className="text-sm">
                          <div>{formatDate(coupon.validFrom)}</div>
                          <div className="text-muted-foreground">
                            to {formatDate(coupon.validUntil)}
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: 'usage',
                      label: 'Usage',
                      mobileLabel: 'Usage',
                      render: (coupon) => (
                        <span>
                          {coupon.usedCount}
                          {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                        </span>
                      ),
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      mobileLabel: 'Status',
                      render: (coupon) => getStatusBadge(coupon),
                    },
                    {
                      key: 'active',
                      label: 'Active',
                      mobileLabel: 'Active',
                      hideOnMobile: true,
                      render: (coupon) => (
                        <Switch
                          checked={coupon.isActive}
                          onCheckedChange={() => toggleCouponStatus(coupon._id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ),
                    },
                    {
                      key: 'actions',
                      label: 'Actions',
                      mobileLabel: 'Actions',
                      className: 'text-right',
                      render: (coupon) => (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/coupons/${coupon._id}/edit`);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(coupon);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  keyExtractor={(coupon) => coupon._id}
                  loading={loading}
                  loadingMessage="Loading coupons..."
                  emptyMessage="No coupons found"
                  mobileCardView={true}
                  onRowClick={(coupon) => router.push(`/admin/coupons/${coupon._id}/edit`)}
                />

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the coupon &quot;
              {selectedCoupon?.code}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
