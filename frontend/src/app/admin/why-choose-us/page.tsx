'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { Plus, Trash2, Edit, Save, X, Sparkles, GripVertical } from 'lucide-react';

interface Feature {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

const ICONS = [
  { value: 'shield', label: '🛡️ Shield', desc: 'Security, Protection' },
  { value: 'truck', label: '🚚 Truck', desc: 'Delivery, Shipping' },
  { value: 'award', label: '🏆 Award', desc: 'Excellence, Achievement' },
  { value: 'refresh', label: '🔄 Refresh', desc: 'Returns, Exchange' },
  { value: 'heart', label: '❤️ Heart', desc: 'Love, Care' },
  { value: 'sparkles', label: '✨ Sparkles', desc: 'Luxury, Premium' },
  { value: 'certificate', label: '📜 Certificate', desc: 'Certification, Authentic' },
  { value: 'hammer', label: '🔨 Hammer', desc: 'Craftsmanship, Handmade' },
  { value: 'star', label: '⭐ Star', desc: 'Rating, Quality' },
  { value: 'check', label: '✓ Check', desc: 'Verified, Approved' },
  { value: 'gift', label: '🎁 Gift', desc: 'Present, Packaging' },
  { value: 'diamond', label: '💎 Diamond', desc: 'Value, Premium' },
];

const TEMPLATES = [
  {
    key: 'trust',
    name: '🛡️ Trust & Quality',
    description: 'Focus on certification and quality assurance',
  },
  {
    key: 'service',
    name: '⭐ Superior Service',
    description: 'Highlight customer service and support',
  },
  {
    key: 'value',
    name: '💎 Best Value',
    description: 'Emphasize pricing and unique offerings',
  },
];

export default function WhyChooseUsManagement() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Feature>({
    title: '',
    description: '',
    icon: 'award',
    order: 0,
    isActive: true,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/why-choose-us/admin');
      setFeatures(response.data.data);
    } catch (error: any) {
      console.error('Error fetching features:', error);
      toast.error('Failed to fetch features');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = async (templateKey: string) => {
    if (!confirm('This will replace all existing features. Continue?')) return;

    try {
      await axiosInstance.post('/why-choose-us/apply-template', { template: templateKey });
      toast.success('Template applied successfully!');
      fetchFeatures();
    } catch (error: any) {
      console.error('Error applying template:', error);
      toast.error('Failed to apply template');
    }
  };

  const handleAdd = async () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    try {
      await axiosInstance.post('/why-choose-us', {
        ...editForm,
        order: features.length + 1,
      });
      toast.success('Feature added successfully!');
      setShowAddForm(false);
      setEditForm({ title: '', description: '', icon: 'award', order: 0, isActive: true });
      fetchFeatures();
    } catch (error: any) {
      console.error('Error adding feature:', error);
      toast.error('Failed to add feature');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await axiosInstance.put(`/why-choose-us/${id}`, editForm);
      toast.success('Feature updated successfully!');
      setEditingId(null);
      fetchFeatures();
    } catch (error: any) {
      console.error('Error updating feature:', error);
      toast.error('Failed to update feature');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      await axiosInstance.delete(`/why-choose-us/${id}`);
      toast.success('Feature deleted successfully!');
      fetchFeatures();
    } catch (error: any) {
      console.error('Error deleting feature:', error);
      toast.error('Failed to delete feature');
    }
  };

  const startEdit = (feature: Feature) => {
    setEditingId(feature._id || null);
    setEditForm(feature);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '', icon: 'award', order: 0, isActive: true });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Why Choose Us Section</h1>
          <p className="text-gray-600">Manage the features displayed on your homepage</p>
        </div>

        {/* Templates */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Quick Start Templates</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.key}
                onClick={() => handleApplyTemplate(template.key)}
                className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all text-left"
              >
                <div className="text-lg font-semibold mb-1">{template.name}</div>
                <div className="text-sm text-gray-600">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Add New Feature
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Feature</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Certified Jewelry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <select
                  value={editForm.icon}
                  onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {ICONS.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label} - {icon.desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., BIS Hallmarked & Certified"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Feature
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditForm({ title: '', description: '', icon: 'award', order: 0, isActive: true });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Features List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Features ({features.length})</h2>
          {features.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <p className="text-gray-500 mb-4">No features added yet. Add your first feature or apply a template!</p>
            </div>
          ) : (
            features.map((feature) => (
              <div key={feature._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                {editingId === feature._id ? (
                  <div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <select
                          value={editForm.icon}
                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          {ICONS.map((icon) => (
                            <option key={icon.value} value={icon.value}>
                              {icon.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdate(feature._id!)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Save size={18} />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-2xl">{ICONS.find((i) => i.value === feature.icon)?.label.split(' ')[0]}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">Order: {feature.order}</span>
                          <span className={`text-xs px-2 py-1 rounded ${feature.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {feature.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(feature)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(feature._id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
