'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ContentBlock {
  type: 'text' | 'heading' | 'paragraph' | 'image' | 'list' | 'stats' | 'quote';
  content: any;
  order: number;
}

interface PageContent {
  _id: string;
  page: string;
  title: string;
  subtitle?: string;
  sections: ContentBlock[];
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
  isActive: boolean;
  updatedAt: string;
  lastUpdatedBy?: {
    name: string;
    email: string;
  };
}

const PAGE_OPTIONS = [
  { value: 'about', label: 'About Us' },
  { value: 'brand-story', label: 'Brand Story' },
  { value: 'why-choose-us', label: 'Why Choose Us' },
  // Hero section has its own dedicated tab in CMS
  // { value: 'hero', label: 'Hero Section' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'newsletter', label: 'Newsletter' },
];

export default function ContentManagement() {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [editingContent, setEditingContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/page-content');
      setContents(response.data.data);
    } catch (error: any) {
      console.error('Error fetching contents:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch page contents');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: PageContent) => {
    setEditingContent(structuredClone(content));
    setSelectedPage(content.page);
  };

  const handleSave = async () => {
    if (!editingContent) return;

    try {
      setSaving(true);
      await axiosInstance.put(`/page-content/${editingContent.page}`, {
        title: editingContent.title,
        subtitle: editingContent.subtitle,
        sections: editingContent.sections,
        metadata: editingContent.metadata,
        isActive: editingContent.isActive,
      });

      toast.success('Content updated successfully!');
      await fetchContents();
      setEditingContent(null);
      setSelectedPage('');
    } catch (error: any) {
      console.error('Error saving content:', error);
      toast.error(error.response?.data?.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (page: string) => {
    try {
      await axiosInstance.patch(`/page-content/${page}/toggle`);
      toast.success('Status updated successfully!');
      await fetchContents();
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const addSection = () => {
    if (!editingContent) return;

    const newSection: ContentBlock = {
      type: 'paragraph',
      content: 'New content...',
      order: editingContent.sections.length + 1,
    };

    setEditingContent({
      ...editingContent,
      sections: [...editingContent.sections, newSection],
    });
  };

  const removeSection = (index: number) => {
    if (!editingContent) return;

    const updatedSections = editingContent.sections.filter((_, i) => i !== index);
    setEditingContent({
      ...editingContent,
      sections: updatedSections.map((section, i) => ({ ...section, order: i + 1 })),
    });
  };

  const updateSection = (index: number, field: string, value: any) => {
    if (!editingContent) return;

    const updatedSections = [...editingContent.sections];
    if (field === 'content') {
      updatedSections[index].content = value;
    } else if (field === 'type') {
      updatedSections[index].type = value;
      // Reset content based on type
      if (value === 'list' || value === 'stats') {
        updatedSections[index].content = { items: [] };
      } else if (value === 'quote') {
        updatedSections[index].content = { text: '', author: '' };
      } else {
        updatedSections[index].content = '';
      }
    }

    setEditingContent({
      ...editingContent,
      sections: updatedSections,
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!editingContent) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editingContent.sections.length) return;

    const updatedSections = [...editingContent.sections];
    [updatedSections[index], updatedSections[newIndex]] = [
      updatedSections[newIndex],
      updatedSections[index],
    ];

    setEditingContent({
      ...editingContent,
      sections: updatedSections.map((section, i) => ({ ...section, order: i + 1 })),
    });
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!editingContent) return;

    try {
      setUploadingImage(index);
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      updateSection(index, 'content', {
        url: response.data.url,
        alt: file.name.split('.')[0],
      });

      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageUrl = (index: number, url: string, alt: string = '') => {
    if (!editingContent) return;
    updateSection(index, 'content', { url, alt });
  };

  const renderContentEditor = (section: ContentBlock, index: number) => {
    const isExpanded = expandedSections[index] !== false;

    return (
      <div key={index} className="border rounded-lg p-4 mb-3 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSection(index)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <select
              value={section.type}
              onChange={(e) => updateSection(index, 'type', e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="heading">Heading</option>
              <option value="paragraph">Paragraph</option>
              <option value="text">Text</option>
              <option value="list">List</option>
              <option value="stats">Stats</option>
              <option value="quote">Quote</option>
              <option value="image">Image</option>
            </select>
            <span className="text-sm text-gray-500">Section {index + 1}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveSection(index, 'up')}
              disabled={index === 0}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
            >
              ↑
            </button>
            <button
              onClick={() => moveSection(index, 'down')}
              disabled={index === editingContent!.sections.length - 1}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
            >
              ↓
            </button>
            <button
              onClick={() => removeSection(index)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <>
            {(section.type === 'heading' || section.type === 'paragraph' || section.type === 'text') && (
              <textarea
                value={typeof section.content === 'string' ? section.content : ''}
                onChange={(e) => updateSection(index, 'content', e.target.value)}
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                placeholder={`Enter ${section.type} content...`}
              />
            )}

            {section.type === 'list' && (
              <div>
                <textarea
                  value={
                    Array.isArray(section.content?.items)
                      ? section.content.items.join('\n')
                      : ''
                  }
                  onChange={(e) =>
                    updateSection(index, 'content', {
                      items: e.target.value.split('\n').filter((item) => item.trim()),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                  placeholder="Enter list items (one per line)..."
                />
                <p className="text-xs text-gray-500 mt-1">Enter one item per line</p>
              </div>
            )}

            {section.type === 'quote' && (
              <div className="space-y-2">
                <textarea
                  value={section.content?.text || ''}
                  onChange={(e) =>
                    updateSection(index, 'content', {
                      ...section.content,
                      text: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                  placeholder="Enter quote text..."
                />
                <input
                  type="text"
                  value={section.content?.author || ''}
                  onChange={(e) =>
                    updateSection(index, 'content', {
                      ...section.content,
                      author: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Quote author..."
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
        <p className="text-gray-600">Manage static page content for your website</p>
      </div>

      {!editingContent ? (
        <div className="grid gap-4">
          {contents.map((content) => (
            <motion.div
              key={content._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="text-blue-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900">{content.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        content.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {content.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {content.subtitle && (
                    <p className="text-gray-600 mb-3">{content.subtitle}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{content.sections.length} sections</span>
                    <span>•</span>
                    <span>Updated: {new Date(content.updatedAt).toLocaleDateString()}</span>
                    {content.lastUpdatedBy && (
                      <>
                        <span>•</span>
                        <span>By: {content.lastUpdatedBy.name}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(content.page)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    title={content.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {content.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  <button
                    onClick={() => handleEdit(content)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Editing: {PAGE_OPTIONS.find((p) => p.value === editingContent.page)?.label}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingContent(null);
                  setSelectedPage('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editingContent.title}
                onChange={(e) =>
                  setEditingContent({ ...editingContent, title: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle (Optional)
              </label>
              <input
                type="text"
                value={editingContent.subtitle || ''}
                onChange={(e) =>
                  setEditingContent({ ...editingContent, subtitle: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Sections */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Content Sections
                </label>
                <button
                  onClick={addSection}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Add Section
                </button>
              </div>
              {editingContent.sections.map((section, index) =>
                renderContentEditor(section, index)
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={editingContent.isActive}
                onChange={(e) =>
                  setEditingContent({ ...editingContent, isActive: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (visible on website)
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
