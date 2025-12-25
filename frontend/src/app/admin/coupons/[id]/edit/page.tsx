'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingCoupon, setFetchingCoupon] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderValue: '',
    maximumDiscount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCoupon();
  }, [couponId]);

  const fetchCoupon = async () => {
    try {
      setFetchingCoupon(true);
      const response = await axiosInstance.get(`/coupons/${couponId}`);
      const coupon = response.data.data;

      // Format dates for datetime-local input
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        code: coupon.code,
        description: coupon.description || '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minimumOrderValue: coupon.minimumOrderValue?.toString() || '',
        maximumDiscount: coupon.maximumDiscount?.toString() || '',
        validFrom: formatDateForInput(coupon.validFrom),
        validUntil: formatDateForInput(coupon.validUntil),
        usageLimit: coupon.usageLimit?.toString() || '',
        isActive: coupon.isActive,
      });
    } catch (error) {
      console.error('Error fetching coupon:', error);
      alert('Failed to load coupon');
      router.back();
    } finally {
      setFetchingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: Number.parseFloat(formData.discountValue),
        minOrderAmount: formData.minimumOrderValue
          ? Number.parseFloat(formData.minimumOrderValue)
          : 0,
        maxDiscountAmount: formData.maximumDiscount
          ? Number.parseFloat(formData.maximumDiscount)
          : null,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        usageLimit: formData.usageLimit
          ? Number.parseInt(formData.usageLimit)
          : null,
        isActive: formData.isActive,
      };

      await axiosInstance.put(`/coupons/${couponId}`, payload);
      router.push('/admin/coupons');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating coupon:', error.message);
        alert('Failed to update coupon: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (fetchingCoupon) {
    return (
      <div className="p-8">
        <div className="text-center">Loading coupon details...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Coupon</h1>
        <p className="text-muted-foreground mt-1">
          Update coupon code: {formData.code}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coupon Details</CardTitle>
                <CardDescription>
                  Basic information about the coupon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="code">Coupon Code *</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    className="uppercase"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discount Configuration</CardTitle>
                <CardDescription>
                  Set the discount type and value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, discountType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discountValue">Discount Value *</Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minimumOrderValue">
                      Minimum Order Value
                    </Label>
                    <Input
                      id="minimumOrderValue"
                      name="minimumOrderValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.minimumOrderValue}
                      onChange={handleChange}
                    />
                  </div>

                  {formData.discountType === 'percentage' && (
                    <div>
                      <Label htmlFor="maximumDiscount">Maximum Discount</Label>
                      <Input
                        id="maximumDiscount"
                        name="maximumDiscount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.maximumDiscount}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Validity Period</CardTitle>
                <CardDescription>
                  Set when the coupon is valid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="validFrom">Valid From</Label>
                    <Input
                      id="validFrom"
                      name="validFrom"
                      type="datetime-local"
                      value={formData.validFrom}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="validUntil">Valid Until *</Label>
                    <Input
                      id="validUntil"
                      name="validUntil"
                      type="datetime-local"
                      value={formData.validUntil}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
                <CardDescription>
                  Control how many times the coupon can be used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="usageLimit">Total Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive">Active</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable or disable this coupon
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Coupon'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
