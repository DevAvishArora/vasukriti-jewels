'use client';

import { useEffect, useState } from 'react';
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
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Layers, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
}

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all categories
      const response = await axiosInstance.get('/categories');
      const allCategories = response.data.data.categories;
      
      // Separate parent categories (no parent) and subcategories (have parent)
      const parents = allCategories.filter((cat: Category) => !cat.parentCategory);
      const subs = allCategories.filter((cat: Category) => cat.parentCategory);
      
      setParentCategories(parents);
      setSubcategories(subs);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.parentCategory) {
      setError('Please select a parent category');
      return;
    }
    
    setFormLoading(true);
    setError('');

    try {
      if (editingSubcategoryId) {
        await axiosInstance.put(`/categories/${editingSubcategoryId}`, formData);
      } else {
        await axiosInstance.post('/categories', formData);
      }
      setFormData({ name: '', description: '', parentCategory: '' });
      setShowForm(false);
      setEditingSubcategoryId(null);
      fetchData();
    } catch (error: unknown) {
      console.error('Error saving subcategory:', error);
      if (error instanceof Error) {
        setError(error.message || 'Failed to save subcategory');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (subcategory: Category) => {
    setEditingSubcategoryId(subcategory._id);
    setFormData({ 
      name: subcategory.name, 
      description: subcategory.description || '',
      parentCategory: subcategory.parentCategory?._id || ''
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;

    try {
      await axiosInstance.delete(`/categories/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      alert('Failed to delete subcategory. It may have associated products.');
    }
  };

  const filteredSubcategories = subcategories.filter((subcategory) =>
    subcategory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subcategory.parentCategory?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/admin/categories">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 truncate">
              <Layers className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              Subcategories
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage subcategories within parent categories</p>
          </div>
          <Button
            onClick={() => {
              if (!showForm) {
                setEditingSubcategoryId(null);
                setFormData({ name: '', description: '', parentCategory: '' });
                setError('');
              }
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 flex-shrink-0 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancel' : 'Add Subcategory'}
          </Button>
        </div>
      </div>

      {/* New Subcategory Form */}
      {showForm && (
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle>{editingSubcategoryId ? 'Edit Subcategory' : 'Create New Subcategory'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="parentCategory">Parent Category *</Label>
                <Select
                  value={formData.parentCategory}
                  onValueChange={(value) => setFormData({ ...formData, parentCategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentCategories.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose the parent category for this subcategory
                </p>
              </div>
              
              <div>
                <Label htmlFor="name">Subcategory Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Gold Chains, Diamond Studs"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the subcategory"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingSubcategoryId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{editingSubcategoryId ? 'Update Subcategory' : 'Create Subcategory'}</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', description: '', parentCategory: '' });
                    setEditingSubcategoryId(null);
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

      {/* Subcategories List */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <CardTitle>All Subcategories ({filteredSubcategories.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subcategories..."
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
              <Layers className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
              <p className="mt-4 text-gray-500">Loading subcategories...</p>
            </div>
          ) : (
            <>
              {filteredSubcategories.length === 0 ? (
                <div className="text-center py-12">
                  <Layers className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-4 text-gray-500">
                    {searchQuery ? 'No subcategories found' : 'No subcategories yet'}
                  </p>
                  {!searchQuery && (
                    <Button
                      className="mt-4 bg-red-700 hover:bg-red-800"
                      onClick={() => setShowForm(true)}
                    >
                      Add Your First Subcategory
                    </Button>
                  )}
                </div>
              ) : (
                <ResponsiveTable
                  data={filteredSubcategories}
                  columns={[
                    {
                      key: 'name',
                      label: 'Subcategory Name',
                      mobileLabel: 'Subcategory',
                      render: (subcategory) => (
                        <div>
                          <p className="font-medium">{subcategory.name}</p>
                          <p className="text-sm text-gray-500">{subcategory.slug}</p>
                        </div>
                      ),
                    },
                    {
                      key: 'parent',
                      label: 'Parent Category',
                      mobileLabel: 'Parent',
                      render: (subcategory) => (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {subcategory.parentCategory?.name}
                        </Badge>
                      ),
                    },
                    {
                      key: 'slug',
                      label: 'Slug',
                      mobileLabel: 'Slug',
                      hideOnMobile: true,
                      render: (subcategory) => (
                        <span className="text-gray-500">{subcategory.slug}</span>
                      ),
                    },
                    {
                      key: 'description',
                      label: 'Description',
                      mobileLabel: 'Description',
                      hideOnMobile: true,
                      render: (subcategory) => (
                        <p className="text-sm text-gray-600 truncate max-w-md">
                          {subcategory.description || 'No description'}
                        </p>
                      ),
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      mobileLabel: 'Status',
                      render: (subcategory) => (
                        <Badge variant={subcategory.isActive ? 'default' : 'secondary'}>
                          {subcategory.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      ),
                    },
                    {
                      key: 'actions',
                      label: 'Actions',
                      mobileLabel: 'Actions',
                      className: 'text-right',
                      render: (subcategory) => (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(subcategory);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(subcategory._id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  keyExtractor={(subcategory) => subcategory._id}
                  loading={false}
                  loadingMessage="Loading subcategories..."
                  emptyMessage="No subcategories found"
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
