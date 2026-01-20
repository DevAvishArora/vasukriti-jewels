'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  Quote,
  Type,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import DynamicAboutContent from '@/components/client/about/dynamic-about-content';

interface ContentBlock {
  type: 'text' | 'heading' | 'paragraph' | 'image' | 'list' | 'stats' | 'quote' | 'image-text';
  content: any;
  order: number;
  design?: {
    style?: 'default' | 'gradient' | 'bordered' | 'minimal' | 'bold';
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large';
    color?: 'blue' | 'purple' | 'gold' | 'rose' | 'emerald';
  };
  layout?: {
    imagePosition?: 'left' | 'right' | 'top' | 'bottom';
  };
  isVisible?: boolean;
  isDefault?: boolean;
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
  { value: 'testimonials', label: 'Testimonials', icon: Quote },
  { value: 'newsletter', label: 'Newsletter', icon: FileText },
];

const SECTION_TYPES = [
  { value: 'heading', label: 'Heading', icon: '📝' },
  { value: 'paragraph', label: 'Paragraph', icon: '📄' },
  { value: 'text', label: 'Text', icon: '✍️' },
  { value: 'image-text', label: 'Image + Text', icon: '🖼️📝' },
  { value: 'list', label: 'List', icon: '📋' },
  { value: 'stats', label: 'Stats', icon: '📊' },
  { value: 'quote', label: 'Quote', icon: '💬' },
  { value: 'image', label: 'Image', icon: '🖼️' },
];

const DESIGN_STYLES = [
  { value: 'default', label: 'Default', preview: 'Simple & clean' },
  { value: 'gradient', label: 'Gradient', preview: 'Colorful gradient background' },
  { value: 'bordered', label: 'Bordered', preview: 'With elegant border' },
  { value: 'minimal', label: 'Minimal', preview: 'Ultra minimalist' },
  { value: 'bold', label: 'Bold', preview: 'Strong & impactful' },
];

const COLOR_THEMES = [
  { value: 'blue', label: 'Blue', color: 'from-blue-500 to-blue-600' },
  { value: 'purple', label: 'Purple', color: 'from-purple-500 to-purple-600' },
  { value: 'gold', label: 'Gold', color: 'from-amber-500 to-yellow-500' },
  { value: 'rose', label: 'Rose', color: 'from-rose-500 to-pink-500' },
  { value: 'emerald', label: 'Emerald', color: 'from-emerald-500 to-teal-500' },
];

export default function StaticContentManagement() {
  const searchParams = useSearchParams();
  const pageFilter = searchParams.get('page'); // Get page from URL query
  
  const [contents, setContents] = useState<PageContent[]>([]);
  const [editingContent, setEditingContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<{ [key: number]: boolean }>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Template Designs for About Page
  const ABOUT_TEMPLATES = {
    luxury: {
      name: '✨ Luxury & Elegance',
      description: 'Sophisticated gold theme with premium feel',
      color: 'gold',
      sections: [
        {
          type: 'heading',
          content: 'Crafting Timeless Treasures',
          order: 1,
          isDefault: true,
          isVisible: true,
          design: { style: 'gradient', alignment: 'center', size: 'large', color: 'gold' },
        },
        {
          type: 'paragraph',
          content: 'Since 2003, Vasukriti has been synonymous with exquisite craftsmanship and unparalleled elegance. Each piece tells a story of dedication, artistry, and timeless beauty.',
          order: 2,
          isDefault: true,
          isVisible: true,
          design: { style: 'bordered', alignment: 'center', size: 'large', color: 'gold' },
        },
        {
          type: 'image-text',
          content: {
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070',
            imageAlt: 'Master artisan at work',
            title: 'Heritage Meets Innovation',
            text: 'Our master artisans bring decades of experience, combining traditional goldsmithing techniques with contemporary design sensibilities. Every piece is meticulously crafted to perfection.',
          },
          order: 3,
          isDefault: true,
          isVisible: true,
          layout: { imagePosition: 'left' },
          design: { style: 'default', alignment: 'left', size: 'medium', color: 'gold' },
        },
        {
          type: 'stats',
          content: {
            items: [
              { label: 'Years of Legacy', value: '20+' },
              { label: 'Happy Clients', value: '15K+' },
              { label: 'Unique Collections', value: '750+' },
              { label: 'Master Craftsmen', value: '60+' },
            ],
          },
          order: 4,
          isDefault: true,
          isVisible: true,
          design: { style: 'gradient', alignment: 'center', size: 'large', color: 'gold' },
        },
        {
          type: 'quote',
          content: { text: 'Jewelry is not just an accessory, it\'s an expression of your soul, a celebration of life\'s precious moments.', author: 'Vasukriti Philosophy' },
          order: 5,
          isDefault: true,
          isVisible: true,
          design: { style: 'bordered', alignment: 'center', size: 'large', color: 'gold' },
        },
      ] as ContentBlock[],
    },
    modern: {
      name: '🎨 Modern & Bold',
      description: 'Dynamic purple & rose theme with contemporary flair',
      color: 'purple',
      sections: [
        {
          type: 'heading',
          content: 'Redefining Jewelry Design',
          order: 1,
          isDefault: true,
          isVisible: true,
          design: { style: 'bold', alignment: 'center', size: 'large', color: 'purple' },
        },
        {
          type: 'image-text',
          content: {
            image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=2070',
            imageAlt: 'Contemporary jewelry design',
            title: 'Bold. Beautiful. Yours.',
            text: 'We believe jewelry should be as unique as you are. Our contemporary designs push boundaries while honoring the timeless art of fine jewelry making.',
          },
          order: 2,
          isDefault: true,
          isVisible: true,
          layout: { imagePosition: 'right' },
          design: { style: 'gradient', alignment: 'left', size: 'medium', color: 'purple' },
        },
        {
          type: 'list',
          content: {
            items: [
              'Innovative Design Process',
              'Sustainable & Ethical Sourcing',
              'Customization at Heart',
              'Lifetime Quality Guarantee',
              'Expert Consultation Services',
            ],
          },
          order: 3,
          isDefault: true,
          isVisible: true,
          design: { style: 'bordered', alignment: 'left', size: 'medium', color: 'rose' },
        },
        {
          type: 'image-text',
          content: {
            image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070',
            imageAlt: 'Designer workspace',
            title: 'From Sketch to Sparkle',
            text: 'Every design begins with a vision. Our creative process involves you at every step, ensuring your jewelry piece is exactly what you dreamed of.',
          },
          order: 4,
          isDefault: true,
          isVisible: true,
          layout: { imagePosition: 'left' },
          design: { style: 'minimal', alignment: 'left', size: 'medium', color: 'purple' },
        },
        {
          type: 'stats',
          content: {
            items: [
              { label: 'Design Awards', value: '25+' },
              { label: 'Custom Creations', value: '5K+' },
              { label: 'Client Satisfaction', value: '99%' },
              { label: 'Countries Served', value: '15+' },
            ],
          },
          order: 5,
          isDefault: true,
          isVisible: true,
          design: { style: 'gradient', alignment: 'center', size: 'large', color: 'rose' },
        },
      ] as ContentBlock[],
    },
    heritage: {
      name: '🏛️ Heritage & Craft',
      description: 'Traditional emerald & blue theme celebrating legacy',
      color: 'emerald',
      sections: [
        {
          type: 'heading',
          content: 'A Legacy of Fine Craftsmanship',
          order: 1,
          isDefault: true,
          isVisible: true,
          design: { style: 'gradient', alignment: 'center', size: 'large', color: 'emerald' },
        },
        {
          type: 'paragraph',
          content: 'For over two decades, Vasukriti has been preserving the ancient art of jewelry making while adapting to modern aesthetics. Our heritage is built on trust, quality, and unparalleled craftsmanship.',
          order: 2,
          isDefault: true,
          isVisible: true,
          design: { style: 'default', alignment: 'center', size: 'large', color: 'blue' },
        },
        {
          type: 'image-text',
          content: {
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070',
            imageAlt: 'Traditional jewelry crafting',
            title: 'Time-Honored Techniques',
            text: 'Our artisans are trained in centuries-old techniques passed down through generations. Each piece carries the soul of traditional craftsmanship combined with contemporary elegance.',
          },
          order: 3,
          isDefault: true,
          isVisible: true,
          layout: { imagePosition: 'left' },
          design: { style: 'bordered', alignment: 'left', size: 'medium', color: 'emerald' },
        },
        {
          type: 'quote',
          content: { text: 'In every piece we create, there lives a story of heritage, a promise of quality, and a celebration of life\'s most precious moments.', author: 'Founder\'s Vision' },
          order: 4,
          isDefault: true,
          isVisible: true,
          design: { style: 'bordered', alignment: 'center', size: 'medium', color: 'blue' },
        },
        {
          type: 'image-text',
          content: {
            image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2070',
            imageAlt: 'Jewelry collection display',
            title: 'Trusted by Generations',
            text: 'Families trust us for their most important celebrations - engagements, weddings, anniversaries, and heirlooms. We\'re honored to be part of your precious moments.',
          },
          order: 5,
          isDefault: true,
          isVisible: true,
          layout: { imagePosition: 'right' },
          design: { style: 'default', alignment: 'left', size: 'medium', color: 'emerald' },
        },
        {
          type: 'stats',
          content: {
            items: [
              { label: 'Years of Trust', value: '20+' },
              { label: 'Family Customers', value: '8K+' },
              { label: 'Artisan Partners', value: '45+' },
              { label: 'Heritage Designs', value: '300+' },
            ],
          },
          order: 6,
          isDefault: true,
          isVisible: true,
          design: { style: 'gradient', alignment: 'center', size: 'large', color: 'blue' },
        },
      ] as ContentBlock[],
    },
  };

  // Simple Template Designs for Brand Story Section
  const BRAND_STORY_TEMPLATES = {
    classic: {
      name: '🏛️ Classic Heritage',
      description: 'Traditional dark theme - matches current design',
      color: 'slate',
      sections: [
        {
          type: 'heading',
          content: 'Crafting Timeless Elegance',
          order: 1,
          isDefault: true,
          isVisible: true,
        },
        {
          type: 'paragraph',
          content: 'For over three decades, Vasukriti has been synonymous with exceptional craftsmanship and timeless design. Each piece tells a story of heritage, artistry, and unwavering commitment to quality.',
          order: 2,
          isDefault: true,
          isVisible: true,
        },
        {
          type: 'paragraph',
          content: 'Our master artisans blend traditional Indian jewelry-making techniques with contemporary aesthetics, creating pieces that transcend generations.',
          order: 3,
          isDefault: true,
          isVisible: true,
        },
      ] as ContentBlock[],
    },
    elegant: {
      name: '✨ Elegant Legacy',
      description: 'Refined and sophisticated tone',
      color: 'gold',
      sections: [
        {
          type: 'heading',
          content: 'The Vasukriti Legacy',
          order: 1,
          isDefault: true,
          isVisible: true,
        },
        {
          type: 'paragraph',
          content: 'Since 1985, we have been dedicated to preserving the art of fine jewelry making. Every creation from our atelier represents a perfect harmony of traditional craftsmanship and modern elegance.',
          order: 2,
          isDefault: true,
          isVisible: true,
        },
        {
          type: 'paragraph',
          content: 'With an unwavering commitment to quality and authenticity, we continue to craft jewelry pieces that become treasured heirlooms, passed down through generations.',
          order: 3,
          isDefault: true,
          isVisible: true,
        },
      ] as ContentBlock[],
    },
    modern: {
      name: '🎯 Modern Story',
      description: 'Contemporary and dynamic approach',
      color: 'blue',
      sections: [
        {
          type: 'heading',
          content: 'Where Heritage Meets Innovation',
          order: 1,
          isDefault: true,
          isVisible: true,
        },
        {
          type: 'paragraph',
          content: 'Vasukriti represents more than just jewelry - we embody a philosophy of excellence. Our journey began with a vision to create pieces that capture life\'s most precious moments.',
          order: 2,
          isDefault: true,
          isVisible: true,
        },
        {
          type: 'paragraph',
          content: 'Today, we stand as pioneers in blending age-old techniques with cutting-edge design, ensuring every piece tells your unique story with unparalleled brilliance.',
          order: 3,
          isDefault: true,
          isVisible: true,
        },
      ] as ContentBlock[],
    },
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/page-content');
      // Filter out hero section
      const filteredContents = response.data.data.filter((content: PageContent) => content.page !== 'hero');
      setContents(filteredContents);
    } catch (error: any) {
      console.error('Error fetching contents:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch page contents');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: PageContent) => {
    const editedContent = structuredClone(content);
    
    // Show template selector for About or Brand Story page if it has no sections or no default sections
    if ((content.page === 'about' || content.page === 'brand-story') && 
        (!content.sections || content.sections.length === 0 || content.sections.filter(s => s.isDefault).length === 0)) {
      setEditingContent(editedContent);
      setShowTemplateSelector(true);
      return;
    }
    
    setEditingContent(editedContent);
    // Expand all sections by default
    const expanded: { [key: string]: boolean } = {};
    editedContent.sections.forEach((_, index) => {
      expanded[index] = true;
    });
    setExpandedSections(expanded);
  };

  const applyTemplate = (templateKey: string) => {
    if (!editingContent) return;
    
    // Get appropriate template based on page
    let template;
    if (editingContent.page === 'about') {
      template = ABOUT_TEMPLATES[templateKey as keyof typeof ABOUT_TEMPLATES];
    } else if (editingContent.page === 'brand-story') {
      template = BRAND_STORY_TEMPLATES[templateKey as keyof typeof BRAND_STORY_TEMPLATES];
    }
    
    if (!template) return;
    
    const existingNonDefaultSections = editingContent.sections?.filter(s => !s.isDefault) || [];
    
    setEditingContent({
      ...editingContent,
      sections: [
        ...template.sections,
        ...existingNonDefaultSections.map((s, i) => ({ ...s, order: template.sections.length + i + 1 })),
      ],
    });
    
    setShowTemplateSelector(false);
    
    // Expand all sections
    const expanded: { [key: string]: boolean } = {};
    template.sections.forEach((_, index) => {
      expanded[index] = true;
    });
    setExpandedSections(expanded);
    
    toast.success(`✨ ${template.name} template applied!`);
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

      toast.success('✅ Content updated successfully!');
      await fetchContents();
      setEditingContent(null);
      setExpandedSections({});
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
      content: '',
      order: editingContent.sections.length + 1,
      design: {
        style: 'default',
        alignment: 'left',
        size: 'medium',
        color: 'blue',
      },
    };

    setEditingContent({
      ...editingContent,
      sections: [...editingContent.sections, newSection],
    });

    // Auto-expand new section
    setExpandedSections({
      ...expandedSections,
      [editingContent.sections.length]: true,
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
    } else if (field === 'design') {
      updatedSections[index].design = value;
    } else if (field === 'layout') {
      updatedSections[index].layout = value;
    } else if (field === 'type') {
      updatedSections[index].type = value;
      // Reset content based on type
      if (value === 'list' || value === 'stats') {
        updatedSections[index].content = { items: [] };
      } else if (value === 'quote') {
        updatedSections[index].content = { text: '', author: '' };
      } else if (value === 'image') {
        updatedSections[index].content = { url: '', alt: '' };
      } else if (value === 'image-text') {
        updatedSections[index].content = { image: '', imageAlt: '', title: '', text: '' };
        updatedSections[index].layout = { imagePosition: 'left' };
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

  const handleImageUpload = async (index: number, file: File, fieldName: string = 'url') => {
    if (!editingContent) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    try {
      setUploadingImage(index);
      const formData = new FormData();
      formData.append('image', file);

      console.log('Uploading image:', file.name);
      
      const response = await axiosInstance.post('/upload/image', formData, {
        headers: {
          'Content-Type': undefined, // Let browser set it with boundary
        },
      });

      console.log('Upload response:', response.data);

      const section = editingContent.sections[index];
      
      if (section.type === 'image-text' && fieldName === 'image') {
        updateSection(index, 'content', {
          ...section.content,
          image: response.data.data.url,
          imageAlt: section.content?.imageAlt || file.name.split('.')[0],
        });
      } else {
        updateSection(index, 'content', {
          ...section.content,
          url: response.data.data.url,
          alt: section.content?.alt || file.name.split('.')[0],
        });
      }

      toast.success('✅ Image uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to upload image. Try entering URL directly.');
    } finally {
      setUploadingImage(null);
    }
  };

  const renderContentEditor = (section: ContentBlock, index: number) => {
    const isExpanded = expandedSections[index] ?? true;
    const sectionType = SECTION_TYPES.find(t => t.value === section.type);

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-gray-200 rounded-xl p-6 mb-4 bg-white hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => toggleSection(index)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
            >
              {isExpanded ? 
                <ChevronUp size={20} className="text-gray-600" /> : 
                <ChevronDown size={20} className="text-gray-600" />
              }
            </button>
            
            <select
              value={section.type}
              onChange={(e) => updateSection(index, 'type', e.target.value)}
              disabled={section.isDefault}
              className="px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {SECTION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            
            {section.isDefault && (
              <span className="px-2 py-1 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 rounded text-xs font-semibold">
                🔒 Default
              </span>
            )}
            
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs font-semibold">
              Section {index + 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateSection(index, 'isVisible', !section.isVisible)}
              className={`p-2.5 rounded-lg transition-all ${
                section.isVisible !== false
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
              title={section.isVisible !== false ? 'Hide section' : 'Show section'}
            >
              {section.isVisible !== false ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button
              onClick={() => moveSection(index, 'up')}
              disabled={index === 0}
              className="p-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold"
              title="Move up"
            >
              ↑
            </button>
            <button
              onClick={() => moveSection(index, 'down')}
              disabled={index === editingContent!.sections.length - 1}
              className="p-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold"
              title="Move down"
            >
              ↓
            </button>
            {!section.isDefault && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => removeSection(index)}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete section"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Section Content Editor */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pt-2"
            >
              {/* Text-based content types */}
              {(section.type === 'heading' || section.type === 'paragraph' || section.type === 'text') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {sectionType?.icon} {sectionType?.label} Content
                  </label>
                  <textarea
                    value={typeof section.content === 'string' ? section.content : ''}
                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl min-h-[140px] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-y"
                    placeholder={`Enter your ${section.type} content here...`}
                  />
                </div>
              )}

              {/* List content */}
              {section.type === 'list' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📋 List Items
                  </label>
                  <textarea
                    value={
                      Array.isArray(section.content?.items)
                        ? section.content.items.map((item: any) => 
                            typeof item === 'object' 
                              ? JSON.stringify(item)
                              : item
                          ).join('\n')
                        : ''
                    }
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').filter((item) => item.trim());
                      const items = lines.map((line) => {
                        try {
                          // Try to parse as JSON object
                          const parsed = JSON.parse(line);
                          if (parsed && typeof parsed === 'object') {
                            return parsed;
                          }
                          return line;
                        } catch {
                          // If not valid JSON, keep as string
                          return line;
                        }
                      });
                      updateSection(index, 'content', { items });
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl min-h-[200px] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-mono text-sm resize-y"
                    placeholder='Enter list items (one per line)&#10;&#10;Simple format:&#10;✓ First item&#10;✓ Second item&#10;&#10;Object format:&#10;{"title":"Premium Quality","description":"Finest materials","icon":"shield"}&#10;{"title":"Free Shipping","description":"All orders","icon":"truck"}'
                  />
                  <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg space-y-2">
                    <p className="text-xs text-blue-700 flex items-center gap-2">
                      <span className="font-semibold">💡 Format Options:</span>
                    </p>
                    <div className="text-xs text-gray-700 space-y-1 pl-4">
                      <p><strong>Simple:</strong> ✓ Text on each line</p>
                      <p><strong>Object:</strong> {`{"title":"...", "description":"...", "icon":"shield"}`}</p>
                      <p><strong>Icons:</strong> shield, award, heart, sparkles, truck, refresh, certificate, hammer</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats content */}
              {section.type === 'stats' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📊 Stats Items
                  </label>
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl min-h-[200px] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-mono text-sm resize-y"
                    placeholder="Enter stats (one per line)&#10;Example:&#10;10000+ | Happy Customers&#10;5 Stars | Average Rating&#10;500+ | Products"
                  />
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 flex items-center gap-2">
                      <span className="font-semibold">💡 Tip:</span> 
                      <span>Format: Number | Label (e.g., "1000+ | Customers")</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Quote content */}
              {section.type === 'quote' && (
                <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-5 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💬 Quote Text
                    </label>
                    <textarea
                      value={section.content?.text || ''}
                      onChange={(e) =>
                        updateSection(index, 'content', {
                          ...section.content,
                          text: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl min-h-[120px] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white resize-y"
                      placeholder="Enter the quote text..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      👤 Quote Author
                    </label>
                    <input
                      type="text"
                      value={section.content?.author || ''}
                      onChange={(e) =>
                        updateSection(index, 'content', {
                          ...section.content,
                          author: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                      placeholder="Author name..."
                    />
                  </div>
                </div>
              )}

              {/* Image content */}
              {section.type === 'image' && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Upload Image */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        🖼️ Upload Image
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(index, file);
                          }}
                          className="hidden"
                          id={`image-upload-${index}`}
                          disabled={uploadingImage === index}
                        />
                        <label
                          htmlFor={`image-upload-${index}`}
                          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                            uploadingImage === index
                              ? 'border-blue-400 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          {uploadingImage === index ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-blue-600"></div>
                              <span className="text-sm text-blue-600 font-medium">Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-10 h-10 text-gray-400 mb-3" />
                              <span className="text-sm text-gray-700 font-semibold">
                                Click to upload
                              </span>
                              <span className="text-xs text-gray-500 mt-1.5">
                                PNG, JPG, WEBP up to 10MB
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Or Image URL */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        🔗 Or Enter Image URL
                      </label>
                      <div className="space-y-3">
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="url"
                            value={section.content?.url || ''}
                            onChange={(e) =>
                              updateSection(index, 'content', {
                                ...section.content,
                                url: e.target.value,
                              })
                            }
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Paste a direct link to an image</p>
                      </div>
                    </div>
                  </div>

                  {/* Alt Text */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ♿ Alt Text (for SEO & accessibility)
                    </label>
                    <input
                      type="text"
                      value={section.content?.alt || ''}
                      onChange={(e) =>
                        updateSection(index, 'content', {
                          ...section.content,
                          alt: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Describe the image for screen readers and SEO..."
                    />
                  </div>

                  {/* Image Preview */}
                  {section.content?.url && (
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-5 rounded-xl border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Eye size={16} />
                        Preview:
                      </p>
                      <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={section.content.url}
                          alt={section.content.alt || 'Preview'}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Image-Text Layout content */}
              {section.type === 'image-text' && (
                <div className="space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                  {/* Image Upload/URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🖼️ Image
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Upload */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(index, file, 'image');
                          }}
                          className="hidden"
                          id={`imagetext-upload-${index}`}
                          disabled={uploadingImage === index}
                        />
                        <label
                          htmlFor={`imagetext-upload-${index}`}
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                            uploadingImage === index
                              ? 'border-purple-400 bg-purple-100'
                              : 'border-purple-300 hover:border-purple-400 hover:bg-purple-50'
                          }`}
                        >
                          {uploadingImage === index ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                              <span className="text-xs text-purple-600 font-medium">Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-purple-400 mb-2" />
                              <span className="text-sm text-gray-700">Upload Image</span>
                              <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                            </>
                          )}
                        </label>
                      </div>
                      {/* URL */}
                      <div>
                        <input
                          type="url"
                          value={section.content?.image || ''}
                          onChange={(e) =>
                            updateSection(index, 'content', {
                              ...section.content,
                              image: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500"
                          placeholder="Or paste image URL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Layout Position */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      📐 Image Position
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['left', 'right', 'top', 'bottom'].map(pos => (
                        <button
                          key={pos}
                          onClick={() => updateSection(index, 'layout', {
                            ...section.layout,
                            imagePosition: pos
                          })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            (section.layout?.imagePosition || 'left') === pos
                              ? 'bg-purple-600 text-white'
                              : 'bg-white border-2 border-gray-300 hover:border-purple-400'
                          }`}
                        >
                          {pos.charAt(0).toUpperCase() + pos.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📝 Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={section.content?.title || ''}
                      onChange={(e) =>
                        updateSection(index, 'content', {
                          ...section.content,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500"
                      placeholder="Section title..."
                    />
                  </div>

                  {/* Text Content */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ✍️ Text Content
                    </label>
                    <textarea
                      value={section.content?.text || ''}
                      onChange={(e) =>
                        updateSection(index, 'content', {
                          ...section.content,
                          text: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl min-h-[150px] focus:border-purple-500 resize-y"
                      placeholder="Enter your text content..."
                    />
                  </div>

                  {/* Image Alt Text */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ♿ Image Alt Text
                    </label>
                    <input
                      type="text"
                      value={section.content?.imageAlt || ''}
                      onChange={(e) =>
                        updateSection(index, 'content', {
                          ...section.content,
                          imageAlt: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500"
                      placeholder="Describe the image..."
                    />
                  </div>

                  {/* Image Preview */}
                  {section.content?.image && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Eye size={16} />
                        Image Preview:
                      </p>
                      <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={section.content.image}
                          alt={section.content.imageAlt || 'Preview'}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Design Options - Available for About page only, not for brand-story (keep it simple) */}
              {editingContent && editingContent.page === 'about' && (
              <div className="border-t-2 border-gray-200 pt-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    🎨 Design Options
                  </h4>
                  <button
                    onClick={() => setPreviewMode({...previewMode, [index]: !previewMode[index]})}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-sm font-semibold flex items-center gap-2"
                  >
                    <Eye size={16} />
                    {previewMode[index] ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Style Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Style
                    </label>
                    <select
                      value={section.design?.style || 'default'}
                      onChange={(e) => updateSection(index, 'design', {
                        ...section.design,
                        style: e.target.value
                      })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      {DESIGN_STYLES.map(style => (
                        <option key={style.value} value={style.value}>
                          {style.label} - {style.preview}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Alignment */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Alignment
                    </label>
                    <div className="flex gap-2">
                      {['left', 'center', 'right'].map(align => (
                        <button
                          key={align}
                          onClick={() => updateSection(index, 'design', {
                            ...section.design,
                            alignment: align
                          })}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            (section.design?.alignment || 'left') === align
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {align.charAt(0).toUpperCase() + align.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Size
                    </label>
                    <div className="flex gap-2">
                      {['small', 'medium', 'large'].map(size => (
                        <button
                          key={size}
                          onClick={() => updateSection(index, 'design', {
                            ...section.design,
                            size: size
                          })}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            (section.design?.size || 'medium') === size
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Theme */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Color Theme
                    </label>
                    <div className="flex gap-2">
                      {COLOR_THEMES.map(theme => (
                        <button
                          key={theme.value}
                          onClick={() => updateSection(index, 'design', {
                            ...section.design,
                            color: theme.value
                          })}
                          className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                            (section.design?.color || 'blue') === theme.value
                              ? 'ring-2 ring-blue-600'
                              : 'hover:ring-2 hover:ring-gray-300'
                          }`}
                          title={theme.label}
                        >
                          <div className={`h-6 rounded bg-gradient-to-r ${theme.color}`}></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Live Preview */}
              {previewMode[index] && (
                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    👁️ Live Preview
                  </h4>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-300">
                    {renderPreview(section, index)}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ℹ️ This is how the section will appear on your website
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderPreview = (section: ContentBlock, index: number) => {
    const design = section.design || { style: 'default', alignment: 'left', size: 'medium', color: 'blue' };
    const colorClass = COLOR_THEMES.find(c => c.value === design.color)?.color || 'from-blue-500 to-blue-600';
    
    const sizeClasses = {
      small: 'text-sm py-2',
      medium: 'text-base py-4',
      large: 'text-lg py-6'
    };

    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };

    const styleClasses = {
      default: 'bg-white',
      gradient: `bg-gradient-to-r ${colorClass} text-white`,
      bordered: 'bg-white border-4 border-gray-300',
      minimal: 'bg-transparent',
      bold: `bg-gradient-to-br ${colorClass} text-white font-bold shadow-xl`
    };

    const baseClass = `${styleClasses[design.style || 'default']} ${alignmentClasses[design.alignment || 'left']} ${sizeClasses[design.size || 'medium']} p-6 rounded-lg`;

    if (section.type === 'heading') {
      return <h2 className={`${baseClass} text-3xl font-bold`}>{section.content || 'Heading Preview'}</h2>;
    }

    if (section.type === 'paragraph' || section.type === 'text') {
      return <p className={`${baseClass}`}>{section.content || 'Paragraph preview text goes here...'}</p>;
    }

    if (section.type === 'list' && Array.isArray(section.content?.items)) {
      return (
        <ul className={`${baseClass} list-disc list-inside space-y-2`}>
          {section.content.items.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    if (section.type === 'quote') {
      return (
        <blockquote className={`${baseClass} border-l-4 italic`}>
          <p className="mb-2">&ldquo;{section.content?.text || 'Quote text here...'}&rdquo;</p>
          <footer className="text-sm opacity-80">— {section.content?.author || 'Author'}</footer>
        </blockquote>
      );
    }

    if (section.type === 'image' && section.content?.url) {
      return (
        <div className={`${baseClass}`}>
          <div className="relative w-full h-48">
            <Image
              src={section.content.url}
              alt={section.content.alt || 'Preview'}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          {section.content.alt && (
            <p className="text-sm text-gray-600 mt-2">{section.content.alt}</p>
          )}
        </div>
      );
    }

    if (section.type === 'stats' && Array.isArray(section.content?.items)) {
      return (
        <div className={`${baseClass} grid grid-cols-3 gap-4`}>
          {section.content.items.map((stat: string, i: number) => {
            const [number, label] = stat.split('|').map(s => s.trim());
            return (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold">{number}</div>
                <div className="text-sm opacity-80">{label}</div>
              </div>
            );
          })}
        </div>
      );
    }

    return <div className={baseClass}>Preview not available</div>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading content...</p>
      </div>
    );
  }

  // Filter contents based on page parameter
  const filteredContents = pageFilter 
    ? contents.filter(c => c.page === pageFilter)
    : contents;

  // Get page title
  const getPageTitle = () => {
    if (pageFilter === 'about') return 'About Us';
    if (pageFilter === 'brand-story') return 'The Vasukriti Legacy';
    return 'Static Content Management';
  };

  const getPageDescription = () => {
    if (pageFilter === 'about') return 'Manage your About Us page content and design';
    if (pageFilter === 'brand-story') return 'Edit your brand story and heritage content';
    return 'Manage static page content for your website';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="text-blue-600" size={36} />
          {getPageTitle()}
        </h1>
        <p className="text-gray-600 text-lg">{getPageDescription()}</p>
      </div>

      {editingContent ? (
        /* Edit Mode */
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {/* Edit Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Edit2 className="text-blue-600" size={28} />
                Editing: {editingContent.page === 'about' ? 'About Us' : editingContent.page === 'brand-story' ? 'Brand Story' : PAGE_OPTIONS.find((p) => p.value === editingContent.page)?.label}
              </h2>
              <p className="text-sm text-gray-500 mt-2">Make your changes below and click Save when done</p>
            </div>
            <div className="flex items-center gap-3">
              {(editingContent.page === 'about' || editingContent.page === 'brand-story') && (
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="px-5 py-2.5 border-2 border-purple-500 text-purple-600 rounded-xl hover:bg-purple-50 transition-all flex items-center gap-2 font-medium"
                >
                  <Sparkles size={18} />
                  Change Design
                </button>
              )}
              <button
                onClick={() => setShowPreview(true)}
                className="px-5 py-2.5 border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 font-medium"
              >
                <Eye size={18} />
                Preview
              </button>
              <button
                onClick={() => {
                  setEditingContent(null);
                  setExpandedSections({});
                }}
                className="px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="page-title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  id="page-title"
                  type="text"
                  value={editingContent.title}
                  onChange={(e) =>
                    setEditingContent({ ...editingContent, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
                  placeholder="Enter page title..."
                />
              </div>

              <div>
                <label htmlFor="page-subtitle" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subtitle (Optional)
                </label>
                <input
                  id="page-subtitle"
                  type="text"
                  value={editingContent.subtitle || ''}
                  onChange={(e) =>
                    setEditingContent({ ...editingContent, subtitle: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Enter subtitle..."
                />
              </div>
            </div>

            {/* Sections */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <label className="text-lg font-bold text-gray-800">
                  Content Sections ({editingContent.sections.length})
                </label>
                <button
                  onClick={addSection}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                >
                  <Plus size={18} />
                  Add Section
                </button>
              </div>

              {/* Info box for default sections */}
              {editingContent.sections.some(s => s.isDefault) && (
                <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">Default Sections</h4>
                      <p className="text-sm text-amber-800">
                        Sections marked with 🔒 are default sections that showcase your brand beautifully. 
                        You can hide/show them but cannot delete them. You can add your own sections below!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {editingContent.sections.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600 font-medium">No sections yet</p>
                  <p className="text-sm text-gray-500 mt-1">Click "Add Section" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {editingContent.sections.map((section, index) =>
                    renderContentEditor(section, index)
                  )}
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="isActive"
                checked={editingContent.isActive}
                onChange={(e) =>
                  setEditingContent({ ...editingContent, isActive: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
                {editingContent.isActive ? '✅ Active (visible on website)' : '❌ Inactive (hidden from website)'}
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* List Mode */
        <div className="grid gap-5">
          {filteredContents.map((content) => {
            const pageOption = PAGE_OPTIONS.find(p => p.value === content.page);
            const pageLabel = content.page === 'about' ? 'About Us' : content.page === 'brand-story' ? 'Brand Story' : pageOption?.label;
            const Icon = pageOption?.icon || FileText;
            
            return (
              <motion.div
                key={content._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Icon className="text-blue-600" size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{content.title}</h3>
                        {content.subtitle && (
                          <p className="text-gray-600 mt-1">{content.subtitle}</p>
                        )}
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                          content.isActive
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                      >
                        {content.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                      <span className="flex items-center gap-1.5 font-medium">
                        <List size={16} />
                        {content.sections.length} sections
                      </span>
                      <span>•</span>
                      <span>Updated: {new Date(content.updatedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                      {content.lastUpdatedBy && (
                        <>
                          <span>•</span>
                          <span>By: {content.lastUpdatedBy.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleActive(content.page)}
                      className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                      title={content.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {content.isActive ? <Eye size={22} /> : <EyeOff size={22} />}
                    </button>
                    <button
                      onClick={() => handleEdit(content)}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                    >
                      <Edit2 size={18} />
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Template Selector Modal */}
      <AnimatePresence>
        {showTemplateSelector && editingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplateSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white p-8">
                <h3 className="text-3xl font-bold mb-2">✨ Choose Your Design</h3>
                <p className="text-purple-100">
                  {editingContent.page === 'brand-story' 
                    ? 'Select a professionally crafted template for your Brand Story section'
                    : 'Select a professionally crafted template for your About page'}
                </p>
              </div>
              
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid md:grid-cols-3 gap-6">
                  {(editingContent.page === 'brand-story' 
                    ? (Object.keys(BRAND_STORY_TEMPLATES) as string[]).map((key) => {
                        const template = BRAND_STORY_TEMPLATES[key as keyof typeof BRAND_STORY_TEMPLATES];
                        const colorClasses = {
                          slate: 'from-slate-700 to-gray-800',
                          gold: 'from-amber-500 to-yellow-500',
                          blue: 'from-blue-500 to-indigo-600',
                        };
                        
                        return (
                          <motion.div
                            key={key}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-purple-400 hover:shadow-2xl transition-all cursor-pointer"
                            onClick={() => applyTemplate(key)}
                          >
                            <div className={`h-32 bg-gradient-to-br ${colorClasses[template.color as keyof typeof colorClasses] || 'from-gray-500 to-gray-600'} relative`}>
                              <div className="absolute inset-0 bg-black/20"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="text-white" size={48} />
                              </div>
                            </div>
                            
                            <div className="p-6">
                              <h4 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h4>
                              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  {template.sections.length} Paragraphs
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  Simple & Clean
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  Fully Editable
                                </div>
                              </div>
                              
                              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold group-hover:from-purple-700 group-hover:to-pink-700 transition-all shadow-md group-hover:shadow-lg">
                                Apply This Design
                              </button>
                            </div>
                            
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                              Simple
                            </div>
                          </motion.div>
                        );
                      })
                    : (Object.keys(ABOUT_TEMPLATES) as string[]).map((key) => {
                        const template = ABOUT_TEMPLATES[key as keyof typeof ABOUT_TEMPLATES];
                        const colorClasses = {
                          gold: 'from-amber-500 to-yellow-500',
                          purple: 'from-purple-500 to-pink-500',
                          emerald: 'from-emerald-500 to-teal-500',
                        };
                        
                        return (
                          <motion.div
                            key={key}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-purple-400 hover:shadow-2xl transition-all cursor-pointer"
                            onClick={() => applyTemplate(key)}
                          >
                            <div className={`h-32 bg-gradient-to-br ${colorClasses[template.color as keyof typeof colorClasses] || 'from-gray-500 to-gray-600'} relative`}>
                              <div className="absolute inset-0 bg-black/20"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="text-white" size={48} />
                              </div>
                            </div>
                            
                            <div className="p-6">
                              <h4 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h4>
                              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  {template.sections.length} Sections
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  Professional Design
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  Fully Customizable
                                </div>
                              </div>
                              
                              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold group-hover:from-purple-700 group-hover:to-pink-700 transition-all shadow-md group-hover:shadow-lg">
                                Apply This Design
                              </button>
                            </div>
                            
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                              New
                            </div>
                          </motion.div>
                        );
                      })
                  )}
                </div>
              </div>
              
              <div className="border-t p-6 bg-gray-50 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  💡 <strong>Tip:</strong> You can customize any template after applying it
                </p>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && editingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Preview: {editingContent.title}</h3>
                  <p className="text-blue-100 text-sm mt-1">This is how your page will look to visitors</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                <DynamicAboutContent content={editingContent} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
