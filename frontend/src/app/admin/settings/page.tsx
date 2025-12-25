'use client';

import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Store,
  DollarSign,
  Truck,
  CreditCard,
  Mail,
  Settings as SettingsIcon,
  Globe,
  AlertTriangle,
} from 'lucide-react';

interface Settings {
  _id?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  currency: string;
  currencySymbol: string;
  timezone: string;
  tax: {
    enabled: boolean;
    gstRate: number;
    includedInPrice: boolean;
  };
  shipping: {
    enabled: boolean;
    freeShippingThreshold: number;
    defaultShippingCharge: number;
    estimatedDeliveryDays: {
      min: number;
      max: number;
    };
  };
  paymentGateways: {
    cod: {
      enabled: boolean;
      minOrderAmount: number;
      maxOrderAmount: number;
    };
    razorpay: {
      enabled: boolean;
      keyId?: string;
      keySecret?: string;
    };
    stripe: {
      enabled: boolean;
      publishableKey?: string;
      secretKey?: string;
    };
  };
  email: {
    enabled: boolean;
    provider: string;
    smtp?: {
      host: string;
      port: number;
      secure: boolean;
      user: string;
      password: string;
    };
    fromEmail: string;
    fromName: string;
  };
  order: {
    orderPrefix: string;
    minOrderAmount: number;
    autoConfirmOrders: boolean;
    allowCancellation: boolean;
    cancellationPeriodHours: number;
  };
  inventory: {
    lowStockThreshold: number;
    allowBackorders: boolean;
    autoReduceStock: boolean;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    pinterest?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Debounce to avoid rate limits on mount
    const timer = setTimeout(() => {
      fetchSettings();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('/settings');
      const data = response.data.data;
      
      // Ensure all nested objects are initialized
      setSettings({
        ...data,
        address: data.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
        },
        tax: data.tax || {
          enabled: true,
          gstRate: 3,
          includedInPrice: false,
        },
        shipping: data.shipping || {
          enabled: true,
          freeShippingThreshold: 5000,
          defaultShippingCharge: 100,
          estimatedDeliveryDays: { min: 3, max: 7 },
        },
        paymentGateways: data.paymentGateways || {
          cod: { enabled: true, minOrderAmount: 0, maxOrderAmount: 50000 },
          razorpay: { enabled: false, keyId: '', keySecret: '' },
          stripe: { enabled: false, publishableKey: '', secretKey: '' },
        },
        email: data.email || {
          enabled: false,
          provider: 'smtp',
          smtp: { host: '', port: 587, secure: false, user: '', password: '' },
          fromEmail: '',
          fromName: '',
        },
        order: data.order || {
          orderPrefix: 'VKJ',
          minOrderAmount: 500,
          autoConfirmOrders: false,
          allowCancellation: true,
          cancellationPeriodHours: 24,
        },
        inventory: data.inventory || {
          lowStockThreshold: 10,
          allowBackorders: false,
          autoReduceStock: true,
        },
        socialMedia: data.socialMedia || {
          facebook: '',
          instagram: '',
          twitter: '',
          youtube: '',
          pinterest: '',
        },
        seo: data.seo || {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: [],
          googleAnalyticsId: '',
          facebookPixelId: '',
        },
        maintenance: data.maintenance || {
          enabled: false,
          message: 'We are currently under maintenance. Please check back soon.',
        },
      });
    } catch (err) {
      console.error('Error fetching settings:', err);
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error?.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(error?.response?.data?.message || 'Failed to load settings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axiosInstance.put('/settings', settings);
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path: string, value: unknown) => {
    if (!settings) return;

    const newSettings = { ...settings };
    const keys = path.split('.');
    let current: Record<string, unknown> = newSettings as Record<string, unknown>;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }

    const lastKey = keys.at(-1);
    if (lastKey) {
      current[lastKey] = value;
    }
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center space-y-4">
          <div className="text-red-600">{error}</div>
          <Button onClick={fetchSettings} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">
          Failed to load settings
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your store configuration
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="general">
            <Store className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="tax">
            <DollarSign className="h-4 w-4 mr-2" />
            Tax
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="h-4 w-4 mr-2" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="order">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Order
          </TabsTrigger>
          <TabsTrigger value="social">
            <Globe className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Site Name</Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => updateField('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Site Description</Label>
                <Textarea
                  value={settings.siteDescription}
                  onChange={(e) => updateField('siteDescription', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    value={settings.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Input
                    value={settings.timezone}
                    onChange={(e) => updateField('timezone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Street Address</Label>
                <Input
                  value={settings.address.street || ''}
                  onChange={(e) => updateField('address.street', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City</Label>
                  <Input
                    value={settings.address.city || ''}
                    onChange={(e) => updateField('address.city', e.target.value)}
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={settings.address.state || ''}
                    onChange={(e) => updateField('address.state', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Zip Code</Label>
                  <Input
                    value={settings.address.zipCode || ''}
                    onChange={(e) => updateField('address.zipCode', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={settings.address.country}
                    onChange={(e) => updateField('address.country', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Currency Code</Label>
                  <Input
                    value={settings.currency}
                    onChange={(e) => updateField('currency', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Currency Symbol</Label>
                  <Input
                    value={settings.currencySymbol}
                    onChange={(e) => updateField('currencySymbol', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>Configure GST and tax settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Tax</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply tax to all orders
                  </p>
                </div>
                <Switch
                  checked={settings.tax.enabled}
                  onCheckedChange={(checked) =>
                    updateField('tax.enabled', checked)
                  }
                />
              </div>
              <div>
                <Label>GST Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.tax.gstRate}
                  onChange={(e) =>
                    updateField('tax.gstRate', Number.parseFloat(e.target.value))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Tax Included in Price</Label>
                  <p className="text-sm text-muted-foreground">
                    Product prices include tax
                  </p>
                </div>
                <Switch
                  checked={settings.tax.includedInPrice}
                  onCheckedChange={(checked) =>
                    updateField('tax.includedInPrice', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Configuration</CardTitle>
              <CardDescription>Configure shipping options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Shipping</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow shipping for orders
                  </p>
                </div>
                <Switch
                  checked={settings.shipping.enabled}
                  onCheckedChange={(checked) =>
                    updateField('shipping.enabled', checked)
                  }
                />
              </div>
              <div>
                <Label>Free Shipping Threshold (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={settings.shipping.freeShippingThreshold}
                  onChange={(e) =>
                    updateField(
                      'shipping.freeShippingThreshold',
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Orders above this amount get free shipping
                </p>
              </div>
              <div>
                <Label>Default Shipping Charge (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={settings.shipping.defaultShippingCharge}
                  onChange={(e) =>
                    updateField(
                      'shipping.defaultShippingCharge',
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min Delivery Days</Label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.shipping.estimatedDeliveryDays.min}
                    onChange={(e) =>
                      updateField(
                        'shipping.estimatedDeliveryDays.min',
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Max Delivery Days</Label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.shipping.estimatedDeliveryDays.max}
                    onChange={(e) =>
                      updateField(
                        'shipping.estimatedDeliveryDays.max',
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash on Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable COD</Label>
                <Switch
                  checked={settings.paymentGateways.cod.enabled}
                  onCheckedChange={(checked) =>
                    updateField('paymentGateways.cod.enabled', checked)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min Order Amount (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.paymentGateways.cod.minOrderAmount}
                    onChange={(e) =>
                      updateField(
                        'paymentGateways.cod.minOrderAmount',
                        Number.parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Max Order Amount (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.paymentGateways.cod.maxOrderAmount}
                    onChange={(e) =>
                      updateField(
                        'paymentGateways.cod.maxOrderAmount',
                        Number.parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Razorpay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Razorpay</Label>
                <Switch
                  checked={settings.paymentGateways.razorpay.enabled}
                  onCheckedChange={(checked) =>
                    updateField('paymentGateways.razorpay.enabled', checked)
                  }
                />
              </div>
              <div>
                <Label>Key ID</Label>
                <Input
                  value={settings.paymentGateways.razorpay.keyId || ''}
                  onChange={(e) =>
                    updateField('paymentGateways.razorpay.keyId', e.target.value)
                  }
                  placeholder="rzp_live_xxxxx"
                />
              </div>
              <div>
                <Label>Key Secret</Label>
                <Input
                  type="password"
                  value={settings.paymentGateways.razorpay.keySecret || ''}
                  onChange={(e) =>
                    updateField(
                      'paymentGateways.razorpay.keySecret',
                      e.target.value
                    )
                  }
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stripe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Stripe</Label>
                <Switch
                  checked={settings.paymentGateways.stripe.enabled}
                  onCheckedChange={(checked) =>
                    updateField('paymentGateways.stripe.enabled', checked)
                  }
                />
              </div>
              <div>
                <Label>Publishable Key</Label>
                <Input
                  value={settings.paymentGateways.stripe.publishableKey || ''}
                  onChange={(e) =>
                    updateField(
                      'paymentGateways.stripe.publishableKey',
                      e.target.value
                    )
                  }
                  placeholder="pk_live_xxxxx"
                />
              </div>
              <div>
                <Label>Secret Key</Label>
                <Input
                  type="password"
                  value={settings.paymentGateways.stripe.secretKey || ''}
                  onChange={(e) =>
                    updateField(
                      'paymentGateways.stripe.secretKey',
                      e.target.value
                    )
                  }
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure email settings for notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Email</Label>
                <Switch
                  checked={settings.email.enabled}
                  onCheckedChange={(checked) =>
                    updateField('email.enabled', checked)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Email</Label>
                  <Input
                    type="email"
                    value={settings.email.fromEmail || ''}
                    onChange={(e) =>
                      updateField('email.fromEmail', e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>From Name</Label>
                  <Input
                    value={settings.email.fromName || ''}
                    onChange={(e) =>
                      updateField('email.fromName', e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order Settings */}
        <TabsContent value="order" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Configuration</CardTitle>
              <CardDescription>Configure order-related settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Prefix</Label>
                  <Input
                    value={settings.order.orderPrefix}
                    onChange={(e) =>
                      updateField('order.orderPrefix', e.target.value)
                    }
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Used in order numbers (e.g., VKJ-123)
                  </p>
                </div>
                <div>
                  <Label>Minimum Order Amount (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.order.minOrderAmount}
                    onChange={(e) =>
                      updateField(
                        'order.minOrderAmount',
                        Number.parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Confirm Orders</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically confirm new orders
                  </p>
                </div>
                <Switch
                  checked={settings.order.autoConfirmOrders}
                  onCheckedChange={(checked) =>
                    updateField('order.autoConfirmOrders', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Cancellation</Label>
                  <p className="text-sm text-muted-foreground">
                    Let customers cancel orders
                  </p>
                </div>
                <Switch
                  checked={settings.order.allowCancellation}
                  onCheckedChange={(checked) =>
                    updateField('order.allowCancellation', checked)
                  }
                />
              </div>
              <div>
                <Label>Cancellation Period (Hours)</Label>
                <Input
                  type="number"
                  min="1"
                  value={settings.order.cancellationPeriodHours}
                  onChange={(e) =>
                    updateField(
                      'order.cancellationPeriodHours',
                      Number.parseInt(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Time allowed for order cancellation
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Low Stock Threshold</Label>
                <Input
                  type="number"
                  min="0"
                  value={settings.inventory.lowStockThreshold}
                  onChange={(e) =>
                    updateField(
                      'inventory.lowStockThreshold',
                      Number.parseInt(e.target.value)
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Backorders</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow orders when out of stock
                  </p>
                </div>
                <Switch
                  checked={settings.inventory.allowBackorders}
                  onCheckedChange={(checked) =>
                    updateField('inventory.allowBackorders', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Reduce Stock</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce stock on order placement
                  </p>
                </div>
                <Switch
                  checked={settings.inventory.autoReduceStock}
                  onCheckedChange={(checked) =>
                    updateField('inventory.autoReduceStock', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Add your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Facebook</Label>
                <Input
                  value={settings.socialMedia.facebook || ''}
                  onChange={(e) =>
                    updateField('socialMedia.facebook', e.target.value)
                  }
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input
                  value={settings.socialMedia.instagram || ''}
                  onChange={(e) =>
                    updateField('socialMedia.instagram', e.target.value)
                  }
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
              <div>
                <Label>Twitter</Label>
                <Input
                  value={settings.socialMedia.twitter || ''}
                  onChange={(e) =>
                    updateField('socialMedia.twitter', e.target.value)
                  }
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div>
                <Label>YouTube</Label>
                <Input
                  value={settings.socialMedia.youtube || ''}
                  onChange={(e) =>
                    updateField('socialMedia.youtube', e.target.value)
                  }
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
              <div>
                <Label>Pinterest</Label>
                <Input
                  value={settings.socialMedia.pinterest || ''}
                  onChange={(e) =>
                    updateField('socialMedia.pinterest', e.target.value)
                  }
                  placeholder="https://pinterest.com/yourprofile"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize your site for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Meta Title</Label>
                <Input
                  value={settings.seo.metaTitle || ''}
                  onChange={(e) => updateField('seo.metaTitle', e.target.value)}
                />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea
                  value={settings.seo.metaDescription || ''}
                  onChange={(e) =>
                    updateField('seo.metaDescription', e.target.value)
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Google Analytics ID</Label>
                <Input
                  value={settings.seo.googleAnalyticsId || ''}
                  onChange={(e) =>
                    updateField('seo.googleAnalyticsId', e.target.value)
                  }
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div>
                <Label>Facebook Pixel ID</Label>
                <Input
                  value={settings.seo.facebookPixelId || ''}
                  onChange={(e) =>
                    updateField('seo.facebookPixelId', e.target.value)
                  }
                  placeholder="123456789012345"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>
                Enable maintenance mode to show a message to visitors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <div>
                  <Label className="text-amber-900 dark:text-amber-100">
                    Enable Maintenance Mode
                  </Label>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Your site will show a maintenance message
                  </p>
                </div>
                <Switch
                  checked={settings.maintenance.enabled}
                  onCheckedChange={(checked) =>
                    updateField('maintenance.enabled', checked)
                  }
                />
              </div>
              <div>
                <Label>Maintenance Message</Label>
                <Textarea
                  value={settings.maintenance.message}
                  onChange={(e) =>
                    updateField('maintenance.message', e.target.value)
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'Saving Changes...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}
