'use client';

// Product Edit Page
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Loader2, ArrowLeft, Plus, X, Save } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Image {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string | { _id: string; name: string };
  material: string;
  purity?: string;
  weight?: number;
  stock: number;
  sku: string;
  images: Image[];
  tags: string[];
  isActive: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    images: [{ url: '', alt: '', isPrimary: true }],
    tags: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setFetching(true);
      const response = await axiosInstance.get(`/products/${productId}`);
      const product: Product = response.data.data.product;
      
      // Extract category ID if it's populated
      const categoryId = typeof product.category === 'string' 
        ? product.category 
        : product.category._id;

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        discountPrice: product.discountPrice?.toString() || '',
        category: categoryId,
        material: product.material || 'Gold',
        purity: product.purity || '',
        weight: product.weight?.toString() || '',
        stockQuantity: product.stock?.toString() || '0',
        sku: product.sku,
        images: product.images.length > 0 ? product.images : [{ url: '', alt: '', isPrimary: true }],
        tags: product.tags.join(', '),
        isActive: product.isActive,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        category: formData.category,
        material: formData.material,
        purity: formData.purity || undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        stock: Number(formData.stockQuantity),
        sku: formData.sku,
        images: formData.images.filter((img) => img.url),
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        isActive: formData.isActive,
      };

      await axiosInstance.put(`/products/${productId}`, productData);
      setSuccess('Product updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (error: unknown) {
      console.error('Error updating product:', error);
      if (error instanceof Error) {
        setError(error.message || 'Failed to update product');
      }
    } finally {
      setLoading(false);
    }
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', alt: '', isPrimary: false }],
    });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const updateImageField = (index: number, field: string, value: string | boolean) => {
    const newImages = formData.images.map((img, i) => {
      if (i === index) {
        if (field === 'isPrimary' && value === true) {
          return { ...img, [field]: value };
        }
        return { ...img, [field]: value };
      }
      if (field === 'isPrimary' && value === true) {
        return { ...img, isPrimary: false };
      }
      return img;
    });
    setFormData({ ...formData, images: newImages });
  };

  if (fetching) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">Update product information</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="isActive">Product is active and visible to customers</Label>
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
            <div className="flex items-center justify-between">
              <CardTitle>Product Images</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.images.map((image, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Image {index + 1}</Label>
                  {formData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImageField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <Input
                    placeholder="Image URL *"
                    value={image.url}
                    onChange={(e) => updateImageField(index, 'url', e.target.value)}
                    required={index === 0}
                  />
                  <Input
                    placeholder="Alt text"
                    value={image.alt}
                    onChange={(e) => updateImageField(index, 'alt', e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`primary-${index}`}
                      checked={image.isPrimary}
                      onChange={(e) => updateImageField(index, 'isPrimary', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`primary-${index}`}>Set as primary image</Label>
                  </div>
                </div>
              </div>
            ))}
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
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Product
              </>
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
