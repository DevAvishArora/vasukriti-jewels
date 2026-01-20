'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios-instance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, FolderTree, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  image?: {
    url: string;
    publicId: string;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: [] as { url: string; publicId?: string }[],
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        image: formData.image[0] ? { 
          url: formData.image[0].url,
          publicId: formData.image[0].publicId
        } : undefined,
      };

      if (editingCategoryId) {
        await axiosInstance.put(`/categories/${editingCategoryId}`, submitData);
      } else {
        await axiosInstance.post('/categories', submitData);
      }
      setFormData({ name: '', description: '', image: [] });
      setShowForm(false);
      setEditingCategoryId(null);
      fetchCategories();
    } catch (error: unknown) {
      console.error('Error saving category:', error);
      if (error instanceof Error) {
        setError(error.message || 'Failed to save category');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category._id);
    setFormData({ 
      name: category.name, 
      description: category.description || '', 
      image: category.image ? [{ url: category.image.url, publicId: category.image.publicId }] : [],
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await axiosInstance.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. It may have associated products.');
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Categories</h1>
            <p className="text-sm text-gray-500 mt-1">Organize your product categories</p>
          </div>
          <Button
            onClick={() => {
              if (!showForm) {
                setEditingCategoryId(null);
                setFormData({ name: '', description: '', image: [] });
                setError('');
              }
              setShowForm(!showForm);
            }}
            style={{ backgroundColor: '#7e1219' }}
            className="hover:opacity-90 flex-shrink-0 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancel' : 'Add Category'}
          </Button>
        </div>
      </div>

      {/* New Category Form */}
      {showForm && (
        <Card className="mb-6 border-gray-200">
          <CardHeader>
            <CardTitle>{editingCategoryId ? 'Edit Category' : 'Create New Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Necklaces, Rings, Earrings"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the category"
                  rows={3}
                />
              </div>

              {/* Category Image Upload */}
              <div>
                <ImageUpload
                  label="Category Image"
                  value={formData.image}
                  onChange={(images) => setFormData({ ...formData, image: images })}
                  maxImages={1}
                  required={false}
                  folder="categories"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={formLoading}
                  style={{ backgroundColor: '#7e1219' }}
                  className="hover:opacity-90"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingCategoryId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingCategoryId ? 'Update Category' : 'Create Category'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', description: '', image: [] });
                    setEditingCategoryId(null);
                    setError('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {loading ? (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
              <p className="mt-4 text-gray-500">Loading categories...</p>
            </div>
          ) : (
            <>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <FolderTree className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-4 text-gray-500">No categories found</p>
                  <Button
                    className="mt-4"
                    onClick={() => setShowForm(true)}
                  >
                    Add Your First Category
                  </Button>
                </div>
              ) : (
                <ResponsiveTable
                  data={filteredCategories}
                  columns={[
                    {
                      key: 'image',
                      label: 'Image',
                      mobileLabel: 'Category',
                      render: (category) => (
                        <div className="flex items-center gap-3">
                          {category.image?.url ? (
                            <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={category.image.url}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <FolderTree className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium truncate">{category.name}</p>
                            <p className="text-sm text-gray-500 truncate">{category.slug}</p>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: 'name',
                      label: 'Name',
                      mobileLabel: 'Name',
                      hideOnMobile: true,
                      render: (category) => category.name,
                    },
                    {
                      key: 'slug',
                      label: 'Slug',
                      mobileLabel: 'Slug',
                      hideOnMobile: true,
                      render: (category) => category.slug,
                    },
                    {
                      key: 'description',
                      label: 'Description',
                      mobileLabel: 'Description',
                      hideOnMobile: true,
                      render: (category) => (
                        <p className="text-sm text-gray-600 truncate max-w-md">
                          {category.description || 'No description'}
                        </p>
                      ),
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      mobileLabel: 'Status',
                      render: (category) => (
                        <Badge variant={category.isActive ? 'default' : 'secondary'}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      ),
                    },
                    {
                      key: 'actions',
                      label: 'Actions',
                      mobileLabel: 'Actions',
                      className: 'text-right',
                      render: (category) => (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(category);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(category._id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  keyExtractor={(category) => category._id}
                  loading={false}
                  loadingMessage="Loading categories..."
                  emptyMessage="No categories found"
                  mobileCardView={true}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
