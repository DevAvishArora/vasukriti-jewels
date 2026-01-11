'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios-instance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    material: 'Gold',
    purity: '',
    weight: '',
    stockQuantity: '',
    sku: '',
    images: [] as { url: string; alt?: string; isPrimary?: boolean; publicId?: string }[],
    tags: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        category: formData.category,
        material: formData.material,
        purity: formData.purity,
        weight: formData.weight ? Number(formData.weight) : undefined,
        stockQuantity: Number(formData.stockQuantity),
        sku: formData.sku,
        images: formData.images.filter((img) => img.url),
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      await axiosInstance.post('/products', productData);
      router.push('/admin/products');
    } catch (error: unknown) {
      console.error('Error creating product:', error);
      if (error instanceof Error) {
        setError(error.message || 'Failed to create product');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/products')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new product in your catalog</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Traditional Gold Necklace"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed product description"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g., GN-001"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Stock */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pricing & Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 45000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  placeholder="e.g., 42000"
                />
              </div>

              <div>
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  placeholder="e.g., 10"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="material">Material *</Label>
                <Select
                  value={formData.material}
                  onValueChange={(value) => setFormData({ ...formData, material: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Diamond">Diamond</SelectItem>
                    <SelectItem value="Gemstone">Gemstone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="purity">Purity</Label>
                <Input
                  id="purity"
                  value={formData.purity}
                  onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                  placeholder="e.g., 22K, 18K"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (grams)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g., 25.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., wedding, traditional, bridal"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              label="Product Images"
              value={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              maxImages={10}
              required={true}
              folder="products"
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
