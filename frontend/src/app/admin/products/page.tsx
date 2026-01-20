'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios-instance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Package, Upload } from 'lucide-react';
import { ResponsiveTable, type Column } from '@/components/ui/responsive-table';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: {
    name: string;
  };
  images: Array<{ url: string; alt: string }>;
  isActive: boolean;
}

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define columns for the responsive table
  const columns: Column<Product>[] = [
    {
      key: 'product',
      label: 'Product',
      mobileLabel: 'Product',
      render: (product) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              width={48}
              height={48}
              className="object-cover rounded flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium truncate">{product.name}</p>
            <p className="text-sm text-gray-500 truncate">{product.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      mobileLabel: 'Category',
      hideOnMobile: true,
      render: (product) => product.category?.name || 'N/A',
    },
    {
      key: 'price',
      label: 'Price',
      mobileLabel: 'Price',
      render: (product) => `₹${product.price?.toLocaleString() || 0}`,
    },
    {
      key: 'stock',
      label: 'Stock',
      mobileLabel: 'Stock',
      render: (product) => (
        <Badge variant={product.stock > 10 ? 'default' : 'destructive'}>
          {product.stock || 0}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      mobileLabel: 'Status',
      render: (product) => (
        <Badge variant={product.isActive ? 'default' : 'secondary'}>
          {product.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      mobileLabel: 'Actions',
      className: 'text-right',
      render: (product) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/products/${product._id}`);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(product._id);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
          </div>
          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            <Link href="/admin/products/bulk-upload" className="flex-1 sm:flex-initial">
              <Button variant="outline" className="w-full sm:w-auto border-red-700 text-red-700 hover:bg-red-50 text-xs sm:text-sm">
                <Upload className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Bulk Upload</span>
              </Button>
            </Link>
            <Link href="/admin/products/new" className="flex-1 sm:flex-initial">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-xs sm:text-sm">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Product</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Products ({filteredProducts.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <ResponsiveTable
            data={filteredProducts}
            columns={columns}
            keyExtractor={(product) => product._id}
            loading={loading}
            loadingMessage="Loading products..."
            emptyMessage="No products found"
            mobileCardView={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
