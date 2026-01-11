'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  GripVertical,
  Check,
  Clock,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axiosInstance from '@/lib/axios-instance';
import { toast } from 'sonner';

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  isDraft: boolean;
  tags: string[];
}

const categories = [
  { value: 'general', label: 'General' },
  { value: 'shipping', label: 'Shipping & Delivery' },
  { value: 'returns', label: 'Returns & Exchanges' },
  { value: 'payment', label: 'Payment' },
  { value: 'products', label: 'Products' },
  { value: 'orders', label: 'Orders' },
  { value: 'account', label: 'Account' },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultFaq: FAQ = {
    question: '',
    answer: '',
    category: 'general',
    order: 0,
    isActive: true,
    isDraft: false,
    tags: [],
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, selectedCategory, searchQuery]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/cms/faq');
      setFaqs(response.data.data.faqs || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const filterFaqs = () => {
    let filtered = [...faqs];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFaqs(filtered);
  };

  const handleSave = async () => {
    if (!editingFaq) return;

    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) {
      toast.error('Question and answer are required');
      return;
    }

    try {
      setLoading(true);
      if (editingFaq._id) {
        await axiosInstance.put(`/cms/faq/${editingFaq._id}`, editingFaq);
        toast.success('FAQ updated successfully');
      } else {
        await axiosInstance.post('/cms/faq', editingFaq);
        toast.success('FAQ created successfully');
      }
      setEditingFaq(null);
      setIsCreating(false);
      fetchFaqs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/cms/faq/${id}/publish`);
      toast.success('FAQ published successfully');
      fetchFaqs();
    } catch (error) {
      console.error('Error publishing FAQ:', error);
      toast.error('Failed to publish FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/cms/faq/${id}`);
      toast.success('FAQ deleted successfully');
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    } finally {
      setLoading(false);
    }
  };

  if (isCreating || editingFaq) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingFaq(null);
                  setIsCreating(false);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingFaq?._id ? 'Edit' : 'Create'} FAQ
                </h1>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#7e1219] hover:bg-[#6a0f15]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label>Question *</Label>
                <Input
                  value={editingFaq?.question || ''}
                  onChange={(e) =>
                    setEditingFaq(editingFaq ? { ...editingFaq, question: e.target.value } : null)
                  }
                  placeholder="What is your question?"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Answer *</Label>
                <Textarea
                  value={editingFaq?.answer || ''}
                  onChange={(e) =>
                    setEditingFaq(editingFaq ? { ...editingFaq, answer: e.target.value } : null)
                  }
                  placeholder="Provide a detailed answer..."
                  rows={6}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={editingFaq?.category}
                    onValueChange={(value) =>
                      setEditingFaq(editingFaq ? { ...editingFaq, category: value } : null)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={editingFaq?.order || 0}
                    onChange={(e) =>
                      setEditingFaq(
                        editingFaq ? { ...editingFaq, order: parseInt(e.target.value) || 0 } : null
                      )
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={editingFaq?.tags?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingFaq(
                      editingFaq
                        ? {
                            ...editingFaq,
                            tags: e.target.value
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean),
                          }
                        : null
                    )
                  }
                  placeholder="e.g., shipping, international, tracking"
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label>Active</Label>
                  <p className="text-sm text-gray-600">Show on website</p>
                </div>
                <Switch
                  checked={editingFaq?.isActive}
                  onCheckedChange={(checked) =>
                    setEditingFaq(editingFaq ? { ...editingFaq, isActive: checked } : null)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Save as Draft</Label>
                  <p className="text-sm text-gray-600">Keep unpublished</p>
                </div>
                <Switch
                  checked={editingFaq?.isDraft}
                  onCheckedChange={(checked) =>
                    setEditingFaq(editingFaq ? { ...editingFaq, isDraft: checked } : null)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/cms">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to CMS
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
            <p className="text-gray-600">Manage frequently asked questions</p>
          </div>
          <Button
            onClick={() => {
              setEditingFaq(defaultFaq);
              setIsCreating(true);
            }}
            className="bg-[#7e1219] hover:bg-[#6a0f15]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New FAQ
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{faqs.length}</p>
              <p className="text-sm text-gray-600">Total FAQs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {faqs.filter((f) => f.isActive && !f.isDraft).length}
              </p>
              <p className="text-sm text-gray-600">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {faqs.filter((f) => f.isDraft).length}
              </p>
              <p className="text-sm text-gray-600">Drafts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {new Set(faqs.map((f) => f.category)).size}
              </p>
              <p className="text-sm text-gray-600">Categories</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All FAQs</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600">Loading...</p>
                </CardContent>
              </Card>
            ) : filteredFaqs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600 mb-4">No FAQs found</p>
                  <Button
                    onClick={() => {
                      setEditingFaq(defaultFaq);
                      setIsCreating(true);
                    }}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First FAQ
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredFaqs.map((faq) => (
                <motion.div
                  key={faq._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{faq.question}</h3>
                            {faq.isActive && !faq.isDraft && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Active
                              </span>
                            )}
                            {faq.isDraft && (
                              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Draft
                              </span>
                            )}
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {categories.find((c) => c.value === faq.category)?.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{faq.answer}</p>
                          {faq.tags && faq.tags.length > 0 && (
                            <div className="flex gap-2">
                              {faq.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingFaq(faq)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {faq.isDraft && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => faq._id && handlePublish(faq._id)}
                            >
                              Publish
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => faq._id && handleDelete(faq._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          {categories.map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="space-y-4">
              {faqs
                .filter((faq) => faq.category === cat.value)
                .map((faq) => (
                  <motion.div
                    key={faq._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{faq.question}</h3>
                              {faq.isActive && !faq.isDraft && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                                  Active
                                </span>
                              )}
                              {faq.isDraft && (
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded">
                                  Draft
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{faq.answer}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingFaq(faq)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => faq._id && handleDelete(faq._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
