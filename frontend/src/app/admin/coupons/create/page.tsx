'use client';

import { useState } from 'react';
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

export default function CreateCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minimumOrderValue
          ? parseFloat(formData.minimumOrderValue)
          : 0,
        maxDiscountAmount: formData.maximumDiscount
          ? parseFloat(formData.maximumDiscount)
          : null,
        validFrom: formData.validFrom || new Date().toISOString(),
        validUntil: formData.validUntil,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        isActive: formData.isActive,
      };

      await axiosInstance.post('/coupons', payload);
      router.push('/admin/coupons');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating coupon:', error.message);
        alert('Failed to create coupon: ' + error.message);
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

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Coupon</h1>
        <p className="text-muted-foreground mt-1">
          Add a new promotional coupon code
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
                    placeholder="e.g., SAVE20"
                    required
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Will be converted to uppercase automatically
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this coupon offers"
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
                    placeholder={
                      formData.discountType === 'percentage' ? '20' : '500'
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.discountType === 'percentage'
                      ? 'Enter percentage (e.g., 20 for 20% off)'
                      : 'Enter amount in rupees'}
                  </p>
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
                      placeholder="0"
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
                        placeholder="Optional"
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to start immediately
                    </p>
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
                    placeholder="Unlimited"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty for unlimited uses
                  </p>
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
                {loading ? 'Creating...' : 'Create Coupon'}
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
